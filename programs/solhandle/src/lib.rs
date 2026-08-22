use anchor_lang::{prelude::*, system_program};
use mpl_core::{
    accounts::{BaseAssetV1, BaseCollectionV1},
    instructions::{CreateCollectionV2CpiBuilder, CreateV2CpiBuilder},
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
    ID as MPL_CORE_ID,
};

const REWARDS_BPS: u64 = 500;
const DEFAULT_PRICES_LAMPORTS: [u64; 5] = [2_000_000_000, 1_000_000_000, 500_000_000, 200_000_000, 100_000_000];
const MAX_HANDLE_LENGTH: usize = 20;
const MAX_URI_LENGTH: usize = 200;

declare_id!("FQ5yTNhKMbdTYbAcAD4YjcdwRhsFroYN4UpvXbAFuCK5");

#[program]
pub mod solhandle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()> {
        require!(args.treasury != Pubkey::default() && args.rewards_vault != Pubkey::default(), SolHandleError::InvalidDestination);
        require!(args.collection_uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);

        let collection_seeds: &[&[u8]] = &[b"collection", &[ctx.bumps.collection]];
        CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .collection(&ctx.accounts.collection.to_account_info())
            .update_authority(Some(&ctx.accounts.config.to_account_info()))
            .payer(&ctx.accounts.authority.to_account_info())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .name("SolHandle".to_string())
            .uri(args.collection_uri)
            .plugins(vec![PluginAuthorityPair {
                plugin: Plugin::Royalties(Royalties {
                    basis_points: REWARDS_BPS as u16,
                    creators: vec![Creator { address: args.rewards_vault, percentage: 100 }],
                    rule_set: RuleSet::None,
                }),
                authority: Some(PluginAuthority::UpdateAuthority),
            }])
            .invoke_signed(&[collection_seeds])?;

        ctx.accounts.config.set_inner(Config {
            authority: ctx.accounts.authority.key(), collection: ctx.accounts.collection.key(),
            treasury: args.treasury, rewards_vault: args.rewards_vault,
            prices_lamports: DEFAULT_PRICES_LAMPORTS, total_minted: 0, paused: false, bump: ctx.bumps.config, protocol_version: 1,
        });
        Ok(())
    }

    pub fn set_paused(ctx: Context<UpdateConfig>, paused: bool) -> Result<()> {
        ctx.accounts.config.paused = paused;
        Ok(())
    }

    pub fn set_reserved_handle(ctx: Context<SetReservedHandle>, handle: String, active: bool) -> Result<()> {
        validate_handle(&handle)?;
        ctx.accounts.reserved_handle.set_inner(ReservedHandle { active, bump: ctx.bumps.reserved_handle });
        Ok(())
    }

    pub fn set_price_override(ctx: Context<SetPriceOverride>, handle: String, price_lamports: u64, active: bool) -> Result<()> {
        validate_handle(&handle)?;
        require!(price_lamports > 0, SolHandleError::InvalidPrice);
        ctx.accounts.price_override.set_inner(PriceOverride { price_lamports, active, bump: ctx.bumps.price_override });
        Ok(())
    }

    pub fn set_primary_handle(ctx: Context<SetPrimaryHandle>, handle: String) -> Result<()> {
        validate_handle(&handle)?;
        require_keys_eq!(ctx.accounts.asset.owner, ctx.accounts.owner.key(), SolHandleError::AssetNotOwnedBySigner);
        ctx.accounts.primary_handle.set_inner(PrimaryHandle {
            handle, asset: ctx.accounts.asset.key(), updated_at: Clock::get()?.unix_timestamp,
            bump: ctx.bumps.primary_handle,
        });
        Ok(())
    }

    pub fn mint_handle(ctx: Context<MintHandle>, args: MintHandleArgs) -> Result<()> {
        validate_handle(&args.handle)?;
        require!(!ctx.accounts.config.paused, SolHandleError::ProtocolPaused);
        require!(ctx.accounts.config.protocol_version == 1, SolHandleError::ProtocolVersionMismatch);
        require!(args.uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);
        require!(!is_active_reserved(&ctx.accounts.reserved_handle)?, SolHandleError::HandleReserved);
        let price = price_for_handle(&ctx.accounts.config, &ctx.accounts.price_override, &args.handle)?;
        require!(price <= args.max_price_lamports, SolHandleError::PriceLimitExceeded);

        system_program::transfer(CpiContext::new(ctx.accounts.system_program.to_account_info(), system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(), to: ctx.accounts.treasury.to_account_info(),
        }), price)?;

        let asset_seeds: &[&[u8]] = &[b"asset", args.handle.as_bytes(), &[ctx.bumps.asset]];
        CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info()).collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info()).owner(Some(&ctx.accounts.payer.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info()).name(format!("@{}", args.handle)).uri(args.uri)
            .invoke_signed(&[asset_seeds])?;
        ctx.accounts.handle_record.set_inner(HandleRecord {
            handle: args.handle.clone(), asset: ctx.accounts.asset.key(), original_minter: ctx.accounts.payer.key(),
            minted_at: Clock::get()?.unix_timestamp, bump: ctx.bumps.handle_record,
        });
        ctx.accounts.config.total_minted = ctx.accounts.config.total_minted
            .checked_add(1)
            .ok_or(SolHandleError::MathOverflow)?;
        emit!(HandleMinted { handle: args.handle, asset: ctx.accounts.asset.key(), owner: ctx.accounts.payer.key(), price_lamports: price });
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeArgs { pub collection_uri: String, pub treasury: Pubkey, pub rewards_vault: Pubkey }
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintHandleArgs { pub handle: String, pub uri: String, pub max_price_lamports: u64 }

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)] pub authority: Signer<'info>,
    #[account(init, payer = authority, space = 8 + Config::INIT_SPACE, seeds = [b"config"], bump)] pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"collection"], bump)]
    pub collection: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
}
#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
}
#[derive(Accounts)]
#[instruction(handle: String)]
pub struct SetReservedHandle<'info> {
    #[account(mut)] pub authority: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
    #[account(init_if_needed, payer = authority, space = 8 + ReservedHandle::INIT_SPACE, seeds = [b"reserved", handle.as_bytes()], bump)] pub reserved_handle: Account<'info, ReservedHandle>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(handle: String)]
pub struct SetPriceOverride<'info> {
    #[account(mut)] pub authority: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
    #[account(init_if_needed, payer = authority, space = 8 + PriceOverride::INIT_SPACE, seeds = [b"price", handle.as_bytes()], bump)] pub price_override: Account<'info, PriceOverride>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(handle: String)]
pub struct SetPrimaryHandle<'info> {
    #[account(mut)] pub owner: Signer<'info>,
    #[account(seeds = [b"handle", handle.as_bytes()], bump = handle_record.bump)] pub handle_record: Account<'info, HandleRecord>,
    #[account(address = handle_record.asset @ SolHandleError::WrongAsset)] pub asset: Account<'info, BaseAssetV1>,
    #[account(init_if_needed, payer = owner, space = 8 + PrimaryHandle::INIT_SPACE, seeds = [b"primary", owner.key().as_ref()], bump)] pub primary_handle: Account<'info, PrimaryHandle>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(args: MintHandleArgs)]
pub struct MintHandle<'info> {
    #[account(mut)] pub payer: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump = config.bump)] pub config: Account<'info, Config>,
    #[account(init, payer = payer, space = 8 + HandleRecord::INIT_SPACE, seeds = [b"handle", args.handle.as_bytes()], bump)] pub handle_record: Account<'info, HandleRecord>,
    #[account(mut, seeds = [b"asset", args.handle.as_bytes()], bump)] pub asset: UncheckedAccount<'info>,
    #[account(seeds = [b"reserved", args.handle.as_bytes()], bump)] pub reserved_handle: UncheckedAccount<'info>,
    #[account(seeds = [b"price", args.handle.as_bytes()], bump)] pub price_override: UncheckedAccount<'info>,
    #[account(mut, address = config.collection @ SolHandleError::WrongCollection)] pub collection: Account<'info, BaseCollectionV1>,
    #[account(mut, address = config.treasury @ SolHandleError::WrongTreasury)] pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)] pub mpl_core_program: UncheckedAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Config { pub authority: Pubkey, pub collection: Pubkey, pub treasury: Pubkey, pub rewards_vault: Pubkey, pub prices_lamports: [u64; 5], pub total_minted: u64, pub paused: bool, pub bump: u8, pub protocol_version: u8 }
impl Config { fn price_for(&self, length: usize) -> u64 { self.prices_lamports[length.saturating_sub(1).min(4)] } }
#[account]
#[derive(InitSpace)]
pub struct HandleRecord { #[max_len(20)] pub handle: String, pub asset: Pubkey, pub original_minter: Pubkey, pub minted_at: i64, pub bump: u8 }
#[account]
#[derive(InitSpace)]
pub struct ReservedHandle { pub active: bool, pub bump: u8 }
#[account]
#[derive(InitSpace)]
pub struct PriceOverride { pub price_lamports: u64, pub active: bool, pub bump: u8 }
#[account]
#[derive(InitSpace)]
pub struct PrimaryHandle { #[max_len(20)] pub handle: String, pub asset: Pubkey, pub updated_at: i64, pub bump: u8 }
#[event]
pub struct HandleMinted { pub handle: String, pub asset: Pubkey, pub owner: Pubkey, pub price_lamports: u64 }
fn validate_handle(handle: &str) -> Result<()> {
    require!(!handle.is_empty() && handle.len() <= MAX_HANDLE_LENGTH, SolHandleError::InvalidHandle);
    require!(handle.bytes().all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit()), SolHandleError::InvalidHandle);
    Ok(())
}
fn is_active_reserved(account: &UncheckedAccount) -> Result<bool> {
    if account.owner != &crate::ID || account.data_is_empty() { return Ok(false); }
    let mut data: &[u8] = &account.try_borrow_data()?;
    Ok(ReservedHandle::try_deserialize(&mut data)?.active)
}
fn price_for_handle(config: &Config, account: &UncheckedAccount, handle: &str) -> Result<u64> {
    if account.owner != &crate::ID || account.data_is_empty() { return Ok(config.price_for(handle.len())); }
    let mut data: &[u8] = &account.try_borrow_data()?;
    let override_price = PriceOverride::try_deserialize(&mut data)?;
    Ok(if override_price.active { override_price.price_lamports } else { config.price_for(handle.len()) })
}
#[error_code]
pub enum SolHandleError {
    #[msg("Handle must use 1-20 lowercase letters or digits.")] InvalidHandle,
    #[msg("The protocol is paused.")] ProtocolPaused,
    #[msg("The provided collection is not the SolHandle collection.")] WrongCollection,
    #[msg("The treasury account does not match the protocol configuration.")] WrongTreasury,
    #[msg("A price must be set for every handle tier.")] InvalidPrice,
    #[msg("Treasury and rewards-vault addresses must be set.")] InvalidDestination,
    #[msg("Metadata URI exceeds the supported size.")] UriTooLong,
    #[msg("Arithmetic overflow.")] MathOverflow,
    #[msg("The quoted mint price exceeds the caller's maximum price.")] PriceLimitExceeded,
    #[msg("This handle is reserved by the protocol.")] HandleReserved,
    #[msg("The supplied asset does not match the handle record.")] WrongAsset,
    #[msg("Only the current NFT owner may set a primary handle.")] AssetNotOwnedBySigner,
    #[msg("The account does not use the supported SolHandle protocol version.")] ProtocolVersionMismatch,
}