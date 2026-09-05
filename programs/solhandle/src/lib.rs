use anchor_lang::{prelude::*, system_program};
use mpl_core::{
    accounts::{BaseAssetV1, BaseCollectionV1},
    instructions::{CreateCollectionV2CpiBuilder, CreateV2CpiBuilder},
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
    ID as MPL_CORE_ID,
};

const REWARDS_BPS: u64 = 500;
const BPS_DENOMINATOR: u64 = 10_000;
const NORMAL_PREMIUM_SURCHARGE_LAMPORTS: u64 = 1_000_000_000;
const DEFAULT_PRICES_LAMPORTS: [u64; 5] = [3_000_000_000, 2_000_000_000, 1_000_000_000, 500_000_000, 100_000_000];
const MAX_HANDLE_LENGTH: usize = 20;
const MAX_URI_LENGTH: usize = 200;
const MAX_RESERVED_FOR_LENGTH: usize = 80;

declare_id!("B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf");

#[program]
pub mod solhandle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()> {
        require!(args.treasury != Pubkey::default() && args.rewards_vault != Pubkey::default(), SolHandleError::InvalidDestination);
        require!(args.collection_uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);
        let collection_seeds: &[&[u8]] = &[b"collection", &[ctx.bumps.collection]];
        CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .collection(&ctx.accounts.collection.to_account_info()).update_authority(Some(&ctx.accounts.config.to_account_info()))
            .payer(&ctx.accounts.authority.to_account_info()).system_program(&ctx.accounts.system_program.to_account_info())
            .name("SolHandle".to_string()).uri(args.collection_uri)
            .plugins(vec![PluginAuthorityPair { plugin: Plugin::Royalties(Royalties { basis_points: REWARDS_BPS as u16, creators: vec![Creator { address: args.rewards_vault, percentage: 100 }], rule_set: RuleSet::None }), authority: Some(PluginAuthority::UpdateAuthority) }])
            .invoke_signed(&[collection_seeds])?;
        ctx.accounts.config.set_inner(Config { authority: ctx.accounts.authority.key(), collection: ctx.accounts.collection.key(), treasury: args.treasury, rewards_vault: args.rewards_vault, prices_lamports: DEFAULT_PRICES_LAMPORTS, total_minted: 0, paused: true, bump: ctx.bumps.config, protocol_version: 2 });
        Ok(())
    }

    pub fn set_paused(ctx: Context<UpdateConfig>, paused: bool) -> Result<()> { ctx.accounts.config.paused = paused; Ok(()) }

    pub fn set_rush_config(ctx: Context<SetRushConfig>, args: RushConfigArgs) -> Result<()> {
        require!(args.end_at > args.start_at, SolHandleError::InvalidRushWindow);
        require!(args.standard_price_lamports > 0 && args.short_discount_bps > 0 && args.short_discount_bps <= BPS_DENOMINATOR, SolHandleError::InvalidRushPricing);
        ctx.accounts.rush_config.set_inner(RushConfig { enabled: args.enabled, start_at: args.start_at, end_at: args.end_at, standard_price_lamports: args.standard_price_lamports, short_discount_bps: args.short_discount_bps, premium_surcharge_lamports: args.premium_surcharge_lamports, bump: ctx.bumps.rush_config });
        Ok(())
    }

    pub fn set_premium_status(ctx: Context<SetPremiumStatus>, handle: String, active: bool) -> Result<()> {
        validate_handle(&handle)?;
        ctx.accounts.premium_handle.set_inner(PremiumHandle { active, bump: ctx.bumps.premium_handle });
        Ok(())
    }

    pub fn set_name_restriction(ctx: Context<SetNameRestriction>, handle: String, restriction_type: RestrictionType, reserved_for: String, active: bool) -> Result<()> {
        validate_handle(&handle)?;
        require!(reserved_for.len() <= MAX_RESERVED_FOR_LENGTH, SolHandleError::ReservedForTooLong);
        ctx.accounts.restriction.set_inner(NameRestriction { restriction_type, active, reserved_for, created_at: Clock::get()?.unix_timestamp, bump: ctx.bumps.restriction });
        Ok(())
    }

    pub fn set_price_override(ctx: Context<SetPriceOverride>, handle: String, price_lamports: u64, active: bool) -> Result<()> {
        validate_handle(&handle)?; require!(price_lamports > 0, SolHandleError::InvalidPrice);
        ctx.accounts.price_override.set_inner(PriceOverride { price_lamports, active, bump: ctx.bumps.price_override }); Ok(())
    }

    pub fn set_primary_handle(ctx: Context<SetPrimaryHandle>, handle: String) -> Result<()> {
        validate_handle(&handle)?; require_keys_eq!(ctx.accounts.asset.owner, ctx.accounts.owner.key(), SolHandleError::AssetNotOwnedBySigner);
        ctx.accounts.primary_handle.set_inner(PrimaryHandle { handle, asset: ctx.accounts.asset.key(), updated_at: Clock::get()?.unix_timestamp, bump: ctx.bumps.primary_handle }); Ok(())
    }

    pub fn mint_handle(ctx: Context<MintHandle>, args: MintHandleArgs) -> Result<()> {
        validate_handle(&args.handle)?; require!(!ctx.accounts.config.paused, SolHandleError::ProtocolPaused);
        require!(ctx.accounts.config.protocol_version == 2, SolHandleError::ProtocolVersionMismatch); require!(args.uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);
        require!(!is_active_restriction(&ctx.accounts.restriction)?, SolHandleError::HandleRestricted);
        let normal_base_price = base_price_for_handle(&ctx.accounts.config, &ctx.accounts.price_override, &args.handle)?;
        let premium = is_active_premium(&ctx.accounts.premium_handle)?;
        let price = final_price_for_handle(normal_base_price, args.handle.len(), premium, &ctx.accounts.rush_config)?;
        require!(price <= args.max_price_lamports, SolHandleError::PriceLimitExceeded);
        system_program::transfer(CpiContext::new(ctx.accounts.system_program.to_account_info(), system_program::Transfer { from: ctx.accounts.payer.to_account_info(), to: ctx.accounts.treasury.to_account_info() }), price)?;
        create_handle_asset(&ctx.accounts.mpl_core_program, &ctx.accounts.asset, &ctx.accounts.collection, &ctx.accounts.config, &ctx.accounts.payer, &ctx.accounts.payer.to_account_info(), &ctx.accounts.system_program, &args.handle, args.uri, ctx.bumps.asset)?;
        ctx.accounts.handle_record.set_inner(HandleRecord { handle: args.handle.clone(), asset: ctx.accounts.asset.key(), original_minter: ctx.accounts.payer.key(), minted_at: Clock::get()?.unix_timestamp, official_claim: false, bump: ctx.bumps.handle_record });
        ctx.accounts.config.total_minted = ctx.accounts.config.total_minted.checked_add(1).ok_or(SolHandleError::MathOverflow)?;
        emit!(HandleMinted { handle: args.handle, asset: ctx.accounts.asset.key(), owner: ctx.accounts.payer.key(), price_lamports: price, official_claim: false }); Ok(())
    }

    pub fn claim_restricted_handle(ctx: Context<ClaimRestrictedHandle>, args: ClaimRestrictedHandleArgs) -> Result<()> {
        validate_handle(&args.handle)?; require!(!ctx.accounts.config.paused, SolHandleError::ProtocolPaused);
        require!(ctx.accounts.config.protocol_version == 2, SolHandleError::ProtocolVersionMismatch); require!(args.uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);
        require!(ctx.accounts.restriction.active, SolHandleError::RestrictionInactive);
        require!(ctx.accounts.restriction.restriction_type == RestrictionType::Reserved, SolHandleError::ProtectedHandleCannotBeClaimed);
        create_handle_asset(&ctx.accounts.mpl_core_program, &ctx.accounts.asset, &ctx.accounts.collection, &ctx.accounts.config, &ctx.accounts.authority, &ctx.accounts.recipient.to_account_info(), &ctx.accounts.system_program, &args.handle, args.uri, ctx.bumps.asset)?;
        ctx.accounts.handle_record.set_inner(HandleRecord { handle: args.handle.clone(), asset: ctx.accounts.asset.key(), original_minter: ctx.accounts.recipient.key(), minted_at: Clock::get()?.unix_timestamp, official_claim: true, bump: ctx.bumps.handle_record });
        ctx.accounts.restriction.active = false;
        ctx.accounts.config.total_minted = ctx.accounts.config.total_minted.checked_add(1).ok_or(SolHandleError::MathOverflow)?;
        emit!(HandleMinted { handle: args.handle, asset: ctx.accounts.asset.key(), owner: ctx.accounts.recipient.key(), price_lamports: 0, official_claim: true }); Ok(())
    }
}

fn create_handle_asset<'info>(mpl_core_program: &UncheckedAccount<'info>, asset: &UncheckedAccount<'info>, collection: &Account<'info, BaseCollectionV1>, config: &Account<'info, Config>, payer: &Signer<'info>, owner: &AccountInfo<'info>, system_program: &Program<'info, System>, handle: &String, uri: String, bump: u8) -> Result<()> {
    let asset_bump = [bump];
    let config_bump = [config.bump];
    let asset_seeds: &[&[u8]] = &[b"asset", handle.as_bytes(), &asset_bump];
    let config_seeds: &[&[u8]] = &[b"config", &config_bump];
    CreateV2CpiBuilder::new(&mpl_core_program.to_account_info())
        .asset(&asset.to_account_info())
        .collection(Some(&collection.to_account_info()))
        .authority(Some(&config.to_account_info()))
        .payer(&payer.to_account_info())
        .owner(Some(owner))
        .system_program(&system_program.to_account_info())
        .name(format!("@{}", handle))
        .uri(uri)
        .invoke_signed(&[asset_seeds, config_seeds])?;
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)] pub struct InitializeArgs { pub collection_uri: String, pub treasury: Pubkey, pub rewards_vault: Pubkey }
#[derive(AnchorSerialize, AnchorDeserialize)] pub struct RushConfigArgs { pub enabled: bool, pub start_at: i64, pub end_at: i64, pub standard_price_lamports: u64, pub short_discount_bps: u64, pub premium_surcharge_lamports: u64 }
#[derive(AnchorSerialize, AnchorDeserialize)] pub struct MintHandleArgs { pub handle: String, pub uri: String, pub max_price_lamports: u64 }
#[derive(AnchorSerialize, AnchorDeserialize)] pub struct ClaimRestrictedHandleArgs { pub handle: String, pub uri: String }

#[derive(Accounts)] pub struct Initialize<'info> { #[account(mut)] pub authority: Signer<'info>, #[account(init, payer = authority, space = 8 + Config::INIT_SPACE, seeds = [b"config"], bump)] pub config: Account<'info, Config>, /// CHECK: Collection PDA created by Metaplex Core.
#[account(mut, seeds = [b"collection"], bump)] pub collection: UncheckedAccount<'info>, pub system_program: Program<'info, System>, /// CHECK: Verified Metaplex Core program.
#[account(address = MPL_CORE_ID)] pub mpl_core_program: UncheckedAccount<'info> }
#[derive(Accounts)] pub struct UpdateConfig<'info> { pub authority: Signer<'info>, #[account(mut, seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config> }
#[derive(Accounts)] pub struct SetRushConfig<'info> { #[account(mut)] pub authority: Signer<'info>, #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>, #[account(init_if_needed, payer = authority, space = 8 + RushConfig::INIT_SPACE, seeds = [b"rush"], bump)] pub rush_config: Account<'info, RushConfig>, pub system_program: Program<'info, System> }
#[derive(Accounts)] #[instruction(handle: String)] pub struct SetPremiumStatus<'info> { #[account(mut)] pub authority: Signer<'info>, #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>, #[account(init_if_needed, payer = authority, space = 8 + PremiumHandle::INIT_SPACE, seeds = [b"premium", handle.as_bytes()], bump)] pub premium_handle: Account<'info, PremiumHandle>, pub system_program: Program<'info, System> }
#[derive(Accounts)] #[instruction(handle: String)] pub struct SetNameRestriction<'info> { #[account(mut)] pub authority: Signer<'info>, #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>, #[account(init_if_needed, payer = authority, space = 8 + NameRestriction::INIT_SPACE, seeds = [b"restriction", handle.as_bytes()], bump)] pub restriction: Account<'info, NameRestriction>, pub system_program: Program<'info, System> }
#[derive(Accounts)] #[instruction(handle: String)] pub struct SetPriceOverride<'info> { #[account(mut)] pub authority: Signer<'info>, #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>, #[account(init_if_needed, payer = authority, space = 8 + PriceOverride::INIT_SPACE, seeds = [b"price", handle.as_bytes()], bump)] pub price_override: Account<'info, PriceOverride>, pub system_program: Program<'info, System> }
#[derive(Accounts)] #[instruction(handle: String)] pub struct SetPrimaryHandle<'info> { #[account(mut)] pub owner: Signer<'info>, #[account(seeds = [b"handle", handle.as_bytes()], bump = handle_record.bump)] pub handle_record: Account<'info, HandleRecord>, #[account(address = handle_record.asset @ SolHandleError::WrongAsset)] pub asset: Account<'info, BaseAssetV1>, #[account(init_if_needed, payer = owner, space = 8 + PrimaryHandle::INIT_SPACE, seeds = [b"primary", owner.key().as_ref()], bump)] pub primary_handle: Account<'info, PrimaryHandle>, pub system_program: Program<'info, System> }
#[derive(Accounts)] #[instruction(args: MintHandleArgs)] pub struct MintHandle<'info> { #[account(mut)] pub payer: Signer<'info>, #[account(mut, seeds = [b"config"], bump = config.bump)] pub config: Account<'info, Config>, #[account(init, payer = payer, space = 8 + HandleRecord::INIT_SPACE, seeds = [b"handle", args.handle.as_bytes()], bump)] pub handle_record: Account<'info, HandleRecord>, /// CHECK: Asset PDA created through Metaplex Core.
#[account(mut, seeds = [b"asset", args.handle.as_bytes()], bump)] pub asset: UncheckedAccount<'info>, /// CHECK: Restriction PDA may be absent; its contents are safely deserialized only if program-owned.
#[account(seeds = [b"restriction", args.handle.as_bytes()], bump)] pub restriction: UncheckedAccount<'info>, /// CHECK: Price override PDA may be absent.
#[account(seeds = [b"price", args.handle.as_bytes()], bump)] pub price_override: UncheckedAccount<'info>, /// CHECK: Global Rush PDA may be absent before campaign configuration.
#[account(seeds = [b"rush"], bump)] pub rush_config: UncheckedAccount<'info>, /// CHECK: Premium PDA may be absent for Standard handles.
#[account(seeds = [b"premium", args.handle.as_bytes()], bump)] pub premium_handle: UncheckedAccount<'info>, #[account(mut, address = config.collection @ SolHandleError::WrongCollection)] pub collection: Account<'info, BaseCollectionV1>, #[account(mut, address = config.treasury @ SolHandleError::WrongTreasury)] pub treasury: SystemAccount<'info>, pub system_program: Program<'info, System>, /// CHECK: Verified Metaplex Core program.
#[account(address = MPL_CORE_ID)] pub mpl_core_program: UncheckedAccount<'info> }
#[derive(Accounts)] #[instruction(args: ClaimRestrictedHandleArgs)] pub struct ClaimRestrictedHandle<'info> { #[account(mut)] pub authority: Signer<'info>, #[account(mut, seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>, #[account(mut, seeds = [b"restriction", args.handle.as_bytes()], bump = restriction.bump)] pub restriction: Account<'info, NameRestriction>, #[account(init, payer = authority, space = 8 + HandleRecord::INIT_SPACE, seeds = [b"handle", args.handle.as_bytes()], bump)] pub handle_record: Account<'info, HandleRecord>, /// CHECK: Asset PDA created through Metaplex Core.
#[account(mut, seeds = [b"asset", args.handle.as_bytes()], bump)] pub asset: UncheckedAccount<'info>, /// CHECK: The verified recipient wallet receives the new NFT directly and never needs to sign.
pub recipient: UncheckedAccount<'info>, #[account(mut, address = config.collection @ SolHandleError::WrongCollection)] pub collection: Account<'info, BaseCollectionV1>, pub system_program: Program<'info, System>, /// CHECK: Verified Metaplex Core program.
#[account(address = MPL_CORE_ID)] pub mpl_core_program: UncheckedAccount<'info> }

#[account] #[derive(InitSpace)] pub struct Config { pub authority: Pubkey, pub collection: Pubkey, pub treasury: Pubkey, pub rewards_vault: Pubkey, pub prices_lamports: [u64; 5], pub total_minted: u64, pub paused: bool, pub bump: u8, pub protocol_version: u8 }
impl Config { fn price_for(&self, length: usize) -> u64 { self.prices_lamports[length.saturating_sub(1).min(4)] } }
#[account] #[derive(InitSpace)] pub struct RushConfig { pub enabled: bool, pub start_at: i64, pub end_at: i64, pub standard_price_lamports: u64, pub short_discount_bps: u64, pub premium_surcharge_lamports: u64, pub bump: u8 }
#[account] #[derive(InitSpace)] pub struct PremiumHandle { pub active: bool, pub bump: u8 }
#[account] #[derive(InitSpace)] pub struct HandleRecord { #[max_len(20)] pub handle: String, pub asset: Pubkey, pub original_minter: Pubkey, pub minted_at: i64, pub official_claim: bool, pub bump: u8 }
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)] pub enum RestrictionType { Reserved, Protected }
#[account] #[derive(InitSpace)] pub struct NameRestriction { pub restriction_type: RestrictionType, pub active: bool, #[max_len(80)] pub reserved_for: String, pub created_at: i64, pub bump: u8 }
#[account] #[derive(InitSpace)] pub struct PriceOverride { pub price_lamports: u64, pub active: bool, pub bump: u8 }
#[account] #[derive(InitSpace)] pub struct PrimaryHandle { #[max_len(20)] pub handle: String, pub asset: Pubkey, pub updated_at: i64, pub bump: u8 }
#[event] pub struct HandleMinted { pub handle: String, pub asset: Pubkey, pub owner: Pubkey, pub price_lamports: u64, pub official_claim: bool }
fn validate_handle(handle: &str) -> Result<()> { require!(!handle.is_empty() && handle.len() <= MAX_HANDLE_LENGTH, SolHandleError::InvalidHandle); require!(handle.bytes().all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit()), SolHandleError::InvalidHandle); Ok(()) }
fn is_active_restriction(account: &UncheckedAccount) -> Result<bool> { if account.owner != &crate::ID || account.data_is_empty() { return Ok(false); } let mut data: &[u8] = &account.try_borrow_data()?; Ok(NameRestriction::try_deserialize(&mut data)?.active) }
fn is_active_premium(account: &UncheckedAccount) -> Result<bool> { if account.owner != &crate::ID || account.data_is_empty() { return Ok(false); } let mut data: &[u8] = &account.try_borrow_data()?; Ok(PremiumHandle::try_deserialize(&mut data)?.active) }
fn base_price_for_handle(config: &Config, account: &UncheckedAccount, handle: &str) -> Result<u64> { if account.owner != &crate::ID || account.data_is_empty() { return Ok(config.price_for(handle.len())); } let mut data: &[u8] = &account.try_borrow_data()?; let override_price = PriceOverride::try_deserialize(&mut data)?; Ok(if override_price.active { override_price.price_lamports } else { config.price_for(handle.len()) }) }
fn final_price_for_handle(normal_base_price: u64, length: usize, premium: bool, account: &UncheckedAccount) -> Result<u64> {
    let now = Clock::get()?.unix_timestamp;
    let mut base_price = normal_base_price;
    let mut premium_surcharge = if premium { NORMAL_PREMIUM_SURCHARGE_LAMPORTS } else { 0 };
    if account.owner == &crate::ID && !account.data_is_empty() {
        let mut data: &[u8] = &account.try_borrow_data()?;
        let rush = RushConfig::try_deserialize(&mut data)?;
        if rush.enabled && now >= rush.start_at && now < rush.end_at {
            base_price = if length >= 3 { rush.standard_price_lamports } else { normal_base_price.checked_mul(rush.short_discount_bps).ok_or(SolHandleError::MathOverflow)?.checked_div(BPS_DENOMINATOR).ok_or(SolHandleError::MathOverflow)? };
            if premium { premium_surcharge = rush.premium_surcharge_lamports; }
        }
    }
    base_price.checked_add(premium_surcharge).ok_or(SolHandleError::MathOverflow.into())
}
#[error_code] pub enum SolHandleError { #[msg("Handle must use 1-20 lowercase letters or digits.")] InvalidHandle, #[msg("Rush end time must be after its start time.")] InvalidRushWindow, #[msg("Rush pricing values are invalid.")] InvalidRushPricing, #[msg("The protocol is paused.")] ProtocolPaused, #[msg("The provided collection is not the SolHandle collection.")] WrongCollection, #[msg("The treasury account does not match the protocol configuration.")] WrongTreasury, #[msg("A price must be set for every handle tier.")] InvalidPrice, #[msg("Treasury and rewards-vault addresses must be set.")] InvalidDestination, #[msg("Metadata URI exceeds the supported size.")] UriTooLong, #[msg("Reservation recipient label exceeds the supported size.")] ReservedForTooLong, #[msg("Arithmetic overflow.")] MathOverflow, #[msg("The quoted mint price exceeds the caller's maximum price.")] PriceLimitExceeded, #[msg("This handle is restricted by the protocol.")] HandleRestricted, #[msg("The restriction is inactive.")] RestrictionInactive, #[msg("Protected handles can never be claimed.")] ProtectedHandleCannotBeClaimed, #[msg("The supplied asset does not match the handle record.")] WrongAsset, #[msg("Only the current NFT owner may set a primary handle.")] AssetNotOwnedBySigner, #[msg("The account does not use the supported SolHandle protocol version.")] ProtocolVersionMismatch }