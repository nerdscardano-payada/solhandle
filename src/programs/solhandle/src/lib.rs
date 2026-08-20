use anchor_lang::{prelude::*, system_program};
use mpl_core::{
    accounts::BaseCollectionV1,
    instructions::{CreateCollectionV2CpiBuilder, CreateV2CpiBuilder},
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
    ID as MPL_CORE_ID,
};

const BPS_DENOMINATOR: u64 = 10_000;
// Single source of truth: primary mint split and secondary marketplace royalty.
const REWARDS_BPS: u64 = 500;
const MAX_HANDLE_LENGTH: usize = 20;
const MAX_URI_LENGTH: usize = 200;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solhandle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()> {
        require!(args.prices_lamports.iter().all(|price| *price > 0), SolHandleError::InvalidPrice);
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
            prices_lamports: args.prices_lamports, paused: false, bump: ctx.bumps.config,
        });
        Ok(())
    }

    pub fn set_paused(ctx: Context<UpdateConfig>, paused: bool) -> Result<()> {
        ctx.accounts.config.paused = paused;
        Ok(())
    }

    pub fn mint_handle(ctx: Context<MintHandle>, args: MintHandleArgs) -> Result<()> {
        validate_handle(&args.handle)?;
        require!(!ctx.accounts.config.paused, SolHandleError::ProtocolPaused);
        require!(args.uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);
        let price = ctx.accounts.config.price_for(args.handle.len());
        let rewards = price.checked_mul(REWARDS_BPS).ok_or(SolHandleError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR).ok_or(SolHandleError::MathOverflow)?;
        let treasury = price.checked_sub(rewards).ok_or(SolHandleError::MathOverflow)?;

        system_program::transfer(CpiContext::new(ctx.accounts.system_program.to_account_info(), system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(), to: ctx.accounts.treasury.to_account_info(),
        }), treasury)?;
        system_program::transfer(CpiContext::new(ctx.accounts.system_program.to_account_info(), system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(), to: ctx.accounts.rewards_vault.to_account_info(),
        }), rewards)?;

        CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info()).collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info()).owner(Some(&ctx.accounts.payer.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info()).name(format!("@{}", args.handle)).uri(args.uri).invoke()?;
        ctx.accounts.handle_record.set_inner(HandleRecord {
            handle: args.handle.clone(), asset: ctx.accounts.asset.key(), original_minter: ctx.accounts.payer.key(),
            minted_at: Clock::get()?.unix_timestamp, bump: ctx.bumps.handle_record,
        });
        emit!(HandleMinted { handle: args.handle, asset: ctx.accounts.asset.key(), owner: ctx.accounts.payer.key(), price_lamports: price });
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeArgs { pub collection_uri: String, pub treasury: Pubkey, pub rewards_vault: Pubkey, pub prices_lamports: [u64; 5] }
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintHandleArgs { pub handle: String, pub uri: String }

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)] pub authority: Signer<'info>,
    #[account(init, payer = authority, space = 8 + Config::INIT_SPACE, seeds = [b"config"], bump)] pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"collection"], bump)] /// CHECK: Metaplex Core creates this signed PDA.
    pub collection: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)] /// CHECK: canonical Metaplex Core program.
    pub mpl_core_program: UncheckedAccount<'info>,
}
#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
}
#[derive(Accounts)]
#[instruction(args: MintHandleArgs)]
pub struct MintHandle<'info> {
    #[account(mut)] pub payer: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump)] pub config: Account<'info, Config>,
    #[account(init, payer = payer, space = 8 + HandleRecord::INIT_SPACE, seeds = [b"handle", args.handle.as_bytes()], bump)] pub handle_record: Account<'info, HandleRecord>,
    #[account(mut)] pub asset: Signer<'info>,
    #[account(mut, address = config.collection @ SolHandleError::WrongCollection)] pub collection: Account<'info, BaseCollectionV1>,
    #[account(mut, address = config.treasury @ SolHandleError::WrongTreasury)] pub treasury: SystemAccount<'info>,
    #[account(mut, address = config.rewards_vault @ SolHandleError::WrongRewardsVault)] pub rewards_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)] /// CHECK: canonical Metaplex Core program.
    pub mpl_core_program: UncheckedAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Config { pub authority: Pubkey, pub collection: Pubkey, pub treasury: Pubkey, pub rewards_vault: Pubkey, pub prices_lamports: [u64; 5], pub paused: bool, pub bump: u8 }
impl Config { fn price_for(&self, length: usize) -> u64 { self.prices_lamports[length.saturating_sub(1).min(4)] } }
#[account]
#[derive(InitSpace)]
pub struct HandleRecord { #[max_len(20)] pub handle: String, pub asset: Pubkey, pub original_minter: Pubkey, pub minted_at: i64, pub bump: u8 }
#[event]
pub struct HandleMinted { pub handle: String, pub asset: Pubkey, pub owner: Pubkey, pub price_lamports: u64 }
fn validate_handle(handle: &str) -> Result<()> {
    require!(!handle.is_empty() && handle.len() <= MAX_HANDLE_LENGTH, SolHandleError::InvalidHandle);
    require!(handle.bytes().all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_'), SolHandleError::InvalidHandle);
    Ok(())
}
#[error_code]
pub enum SolHandleError {
    #[msg("Handle must use 1-20 lowercase letters, digits, or underscores.")] InvalidHandle,
    #[msg("The protocol is paused.")] ProtocolPaused,
    #[msg("The provided collection is not the SolHandle collection.")] WrongCollection,
    #[msg("The treasury account does not match the protocol configuration.")] WrongTreasury,
    #[msg("The rewards vault does not match the protocol configuration.")] WrongRewardsVault,
    #[msg("A price must be set for every handle tier.")] InvalidPrice,
    #[msg("Treasury and rewards-vault addresses must be set.")] InvalidDestination,
    #[msg("Metadata URI exceeds the supported size.")] UriTooLong,
    #[msg("Arithmetic overflow.")] MathOverflow,
}