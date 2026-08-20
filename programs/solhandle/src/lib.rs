use anchor_lang::{prelude::*, system_program};
use mpl_core::{accounts::BaseCollectionV1, instructions::CreateV2CpiBuilder, ID as MPL_CORE_ID};

const MAX_HANDLE_LENGTH: usize = 20;
const MAX_URI_LENGTH: usize = 200;

// Run `anchor keys sync` before the first deployment to replace this development ID.
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solhandle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()> {
        require!(args.prices_lamports.iter().all(|price| *price > 0), SolHandleError::InvalidPrice);
        require!(args.treasury != Pubkey::default(), SolHandleError::InvalidDestination);
        require!(args.rewards_vault != Pubkey::default(), SolHandleError::InvalidDestination);

        ctx.accounts.config.set_inner(Config {
            authority: ctx.accounts.authority.key(),
            collection: args.collection,
            treasury: args.treasury,
            rewards_vault: args.rewards_vault,
            prices_lamports: args.prices_lamports,
            paused: false,
            total_minted: 0,
            bump: ctx.bumps.config,
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
        require_keys_eq!(ctx.accounts.collection.key(), ctx.accounts.config.collection, SolHandleError::WrongCollection);

        let price = ctx.accounts.config.price_for(args.handle.len());
        require!(price <= args.max_price, SolHandleError::PriceExceeded);

        // Primary mint revenue belongs entirely to the SolHandle treasury.
        // The integration-rewards vault is used exclusively by collection royalties on secondary sales.
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer { from: ctx.accounts.payer.to_account_info(), to: ctx.accounts.treasury.to_account_info() },
            ),
            price,
        )?;

        CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .owner(Some(&ctx.accounts.payer.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .name(format!("@{}", args.handle))
            .uri(args.uri)
            .invoke()?;

        ctx.accounts.handle_record.set_inner(HandleRecord {
            handle: args.handle.clone(),
            asset: ctx.accounts.asset.key(),
            original_minter: ctx.accounts.payer.key(),
            minted_at: Clock::get()?.unix_timestamp,
            bump: ctx.bumps.handle_record,
        });
        ctx.accounts.config.total_minted = ctx.accounts.config.total_minted.checked_add(1).ok_or(SolHandleError::MathOverflow)?;
        emit!(HandleMinted { handle: args.handle, asset: ctx.accounts.asset.key(), owner: ctx.accounts.payer.key(), price_lamports: price });
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeArgs {
    pub collection: Pubkey,
    pub treasury: Pubkey,
    pub rewards_vault: Pubkey,
    // Prices for 1, 2, 3, 4 and 5+ character handles.
    pub prices_lamports: [u64; 5],
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintHandleArgs {
    pub handle: String,
    pub uri: String,
    pub max_price: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(init, payer = authority, space = 8 + Config::INIT_SPACE, seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = authority)]
    pub config: Account<'info, Config>,
}

#[derive(Accounts)]
#[instruction(args: MintHandleArgs)]
pub struct MintHandle<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(init, payer = payer, space = 8 + HandleRecord::INIT_SPACE, seeds = [b"handle", args.handle.as_bytes()], bump)]
    pub handle_record: Account<'info, HandleRecord>,
    #[account(mut)]
    pub asset: Signer<'info>,
    #[account(mut)]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(mut, address = config.treasury @ SolHandleError::WrongTreasury)]
    pub treasury: SystemAccount<'info>,
    #[account(mut, address = config.rewards_vault @ SolHandleError::WrongRewardsVault)]
    pub rewards_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: constrained to the canonical Metaplex Core program ID.
    pub mpl_core_program: UncheckedAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    pub collection: Pubkey,
    pub treasury: Pubkey,
    pub rewards_vault: Pubkey,
    pub prices_lamports: [u64; 5],
    pub paused: bool,
    pub total_minted: u64,
    pub bump: u8,
}

impl Config {
    fn price_for(&self, length: usize) -> u64 {
        self.prices_lamports[length.saturating_sub(1).min(4)]
    }
}

#[account]
#[derive(InitSpace)]
pub struct HandleRecord {
    #[max_len(20)]
    pub handle: String,
    pub asset: Pubkey,
    pub original_minter: Pubkey,
    pub minted_at: i64,
    pub bump: u8,
}

#[event]
pub struct HandleMinted {
    pub handle: String,
    pub asset: Pubkey,
    pub owner: Pubkey,
    pub price_lamports: u64,
}

fn validate_handle(handle: &str) -> Result<()> {
    require!(!handle.is_empty() && handle.len() <= MAX_HANDLE_LENGTH, SolHandleError::InvalidHandle);
    require!(handle.bytes().all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_'), SolHandleError::InvalidHandle);
    Ok(())
}

#[error_code]
pub enum SolHandleError {
    #[msg("Handle must use 1-20 lowercase letters, digits, or underscores.")]
    InvalidHandle,
    #[msg("The protocol is paused.")]
    ProtocolPaused,
    #[msg("The provided collection is not the SolHandle collection.")]
    WrongCollection,
    #[msg("The treasury account does not match the protocol configuration.")]
    WrongTreasury,
    #[msg("The rewards vault does not match the protocol configuration.")]
    WrongRewardsVault,
    #[msg("A price must be set for every handle tier.")]
    InvalidPrice,
    #[msg("Treasury and rewards-vault addresses must be set.")]
    InvalidDestination,
    #[msg("Metadata URI exceeds the supported size.")]
    UriTooLong,
    #[msg("Arithmetic overflow.")]
    MathOverflow,
    #[msg("The current price exceeds the maximum price approved by the signer.")]
    PriceExceeded,
}