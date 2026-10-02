use anchor_lang::{prelude::*, solana_program::hash::hash, system_program};
use mpl_core::{accounts::BaseCollectionV1, ID as MPL_CORE_ID};
use crate::*;

pub fn mint_partner_sol(ctx: Context<MintHandlePartnerSol>, args: PartnerSolMintArgs) -> Result<()> {
    validate_handle(&args.handle)?;
    validate_partner_id(&args.partner_id)?;
    let a = ctx.accounts;
    require!(!a.config.paused, SolHandleError::ProtocolPaused);
    require!(a.config.protocol_version == 2, SolHandleError::ProtocolVersionMismatch);
    require!(a.partner_mint_settings.enabled, PartnerSolMintError::Disabled);
    require!(a.partner.status == PartnerStatus::Approved, PartnerSolMintError::NotApproved);
    require!(a.partner.revision == args.partner_revision && a.partner_mint_settings.revision == args.settings_revision, PartnerSolMintError::StaleQuote);
    require!(a.partner.allow_self_mint || a.payer.key() != a.revenue_wallet.key(), PartnerSolMintError::SelfMint);
    require!(a.payer.key() != a.treasury.key(), PartnerSolMintError::InvalidRecipient);
    require!(args.uri.len() <= MAX_URI_LENGTH, SolHandleError::UriTooLong);
    require!(!is_active_restriction(&a.restriction)?, SolHandleError::HandleRestricted);
    let base = base_price_for_handle(&a.config, &a.price_override, &args.handle)?;
    let premium = is_active_premium(&a.premium_handle)?;
    let fee = final_price_for_handle(base, args.handle.len(), premium, &a.rush_config)?;
    require!(fee == args.price_lamports, PartnerSolMintError::StaleQuote);
    let now = Clock::get()?.unix_timestamp;
    require!(args.expires_at >= now && args.expires_at <= now.checked_add(60).ok_or(SolHandleError::MathOverflow)?, PartnerSolMintError::ExpiredQuote);
    let digest = partner_quote_digest(&args, a.partner_mint_settings.key(), a.payer.key(), a.partner.key(), a.revenue_wallet.key(), a.treasury.key(), a.collection.key());
    verify_token_quote(&a.instructions_sysvar, &a.partner_mint_settings.quote_signer, &digest)
        .map_err(|_| error!(PartnerSolMintError::InvalidQuote))?;
    let (partner_share, treasury_share) = partner_sol_split(fee)?;
    for (destination, amount) in [(a.revenue_wallet.to_account_info(), partner_share), (a.treasury.to_account_info(), treasury_share)] {
        if amount > 0 {
            system_program::transfer(CpiContext::new(a.system_program.to_account_info(), system_program::Transfer { from: a.payer.to_account_info(), to: destination }), amount)?;
        }
    }
    create_handle_asset(&a.mpl_core_program, &a.asset, &a.collection, &a.config, &a.payer, &a.payer.to_account_info(), &a.system_program, &args.handle, args.uri.clone(), ctx.bumps.asset)?;
    a.handle_record.set_inner(HandleRecord { handle: args.handle.clone(), asset: a.asset.key(), original_minter: a.payer.key(), minted_at: now, official_claim: false, bump: ctx.bumps.handle_record });
    a.config.total_minted = a.config.total_minted.checked_add(1).ok_or(SolHandleError::MathOverflow)?;
    a.receipt.set_inner(PartnerMintReceipt {
        partner: a.partner.key(), asset: a.asset.key(), owner: a.payer.key(), revenue_wallet: a.revenue_wallet.key(), treasury: a.treasury.key(),
        price_lamports: fee, partner_share_lamports: partner_share, treasury_share_lamports: treasury_share,
        partner_revision: args.partner_revision, settings_revision: args.settings_revision, minted_at: now, quote_digest: digest, bump: ctx.bumps.receipt,
    });
    emit!(PartnerHandleMinted { handle: args.handle, receipt: a.receipt.key(), partner: a.partner.key(), asset: a.asset.key(), owner: a.payer.key(), revenue_wallet: a.revenue_wallet.key(), treasury: a.treasury.key(), price_lamports: fee, partner_share_lamports: partner_share, treasury_share_lamports: treasury_share });
    // Do not emit the legacy mint event: downstream accounting must explicitly handle this receipt.
    Ok(())
}

pub fn partner_quote_digest(args: &PartnerSolMintArgs, settings: Pubkey, payer: Pubkey, partner: Pubkey, wallet: Pubkey, treasury: Pubkey, collection: Pubkey) -> [u8; 32] {
    // SHA256 over fixed-width keys/integers and a Borsh length-prefixed handle.
    // A dedicated, DIFFERENT signer per cluster is required; Solana programs cannot read the genesis hash.
    let mut bytes = b"solhandle:partner-sol:v1\0".to_vec();
    bytes.extend_from_slice(crate::ID.as_ref());
    bytes.extend_from_slice(settings.as_ref());
    bytes.extend_from_slice(&args.settings_revision.to_le_bytes());
    for key in [payer, partner, wallet, treasury, collection] { bytes.extend_from_slice(key.as_ref()); }
    bytes.extend_from_slice(&args.partner_revision.to_le_bytes());
    bytes.extend_from_slice(&(args.handle.len() as u32).to_le_bytes());
    bytes.extend_from_slice(args.handle.as_bytes());
    bytes.extend_from_slice(hash(args.uri.as_bytes()).as_ref());
    bytes.extend_from_slice(&args.price_lamports.to_le_bytes());
    bytes.extend_from_slice(&args.expires_at.to_le_bytes());
    hash(&bytes).to_bytes()
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PartnerSolMintArgs {
    pub handle: String, pub uri: String, pub partner_id: String,
    pub partner_revision: u64, pub settings_revision: u64, pub price_lamports: u64, pub expires_at: i64,
}
#[derive(Accounts)]
#[instruction(args: PartnerSolMintArgs)]
pub struct MintHandlePartnerSol<'info> {
    #[account(mut)] pub payer: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump = config.bump)] pub config: Box<Account<'info, Config>>,
    #[account(seeds = [b"partner_mint"], bump = partner_mint_settings.bump, has_one = config)] pub partner_mint_settings: Account<'info, PartnerMintSettings>,
    #[account(seeds = [b"partner", partner_id_hash(&args.partner_id).as_ref()], bump = partner.bump, has_one = config, constraint = partner.partner_id == args.partner_id @ PartnerRegistryError::InvalidId)] pub partner: Box<Account<'info, MintPartner>>,
    #[account(init, payer = payer, space = 8 + HandleRecord::INIT_SPACE, seeds = [b"handle", args.handle.as_bytes()], bump)] pub handle_record: Box<Account<'info, HandleRecord>>,
    /// CHECK: Deterministic asset created by Core in this instruction.
    #[account(mut, seeds = [b"asset", args.handle.as_bytes()], bump)] pub asset: UncheckedAccount<'info>,
    /// CHECK: Optional official restriction; shared helper checks owner and discriminator.
    #[account(seeds = [b"restriction", args.handle.as_bytes()], bump)] pub restriction: UncheckedAccount<'info>,
    /// CHECK: Optional official price override, checked by the shared helper.
    #[account(seeds = [b"price", args.handle.as_bytes()], bump)] pub price_override: UncheckedAccount<'info>,
    /// CHECK: Optional official Rush config, checked by the shared helper.
    #[account(seeds = [b"rush"], bump)] pub rush_config: UncheckedAccount<'info>,
    /// CHECK: Optional official premium status, checked by the shared helper.
    #[account(seeds = [b"premium", args.handle.as_bytes()], bump)] pub premium_handle: UncheckedAccount<'info>,
    #[account(mut, address = config.collection @ SolHandleError::WrongCollection)] pub collection: Box<Account<'info, BaseCollectionV1>>,
    #[account(mut, address = config.treasury @ SolHandleError::WrongTreasury)] pub treasury: SystemAccount<'info>,
    #[account(mut, address = partner.revenue_wallet @ PartnerSolMintError::InvalidRecipient)] pub revenue_wallet: SystemAccount<'info>,
    #[account(init, payer = payer, space = 8 + PartnerMintReceipt::INIT_SPACE, seeds = [b"partner_receipt", asset.key().as_ref()], bump)] pub receipt: Box<Account<'info, PartnerMintReceipt>>,
    /// CHECK: Exact instructions sysvar; shared verifier checks the immediately preceding Ed25519 instruction.
    #[account(address = anchor_lang::solana_program::sysvar::instructions::ID)] pub instructions_sysvar: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: Official Core executable.
    #[account(address = MPL_CORE_ID)] pub mpl_core_program: UncheckedAccount<'info>,
}
#[account]
#[derive(InitSpace)]
pub struct PartnerMintReceipt {
    pub partner: Pubkey, pub asset: Pubkey, pub owner: Pubkey, pub revenue_wallet: Pubkey, pub treasury: Pubkey,
    pub price_lamports: u64, pub partner_share_lamports: u64, pub treasury_share_lamports: u64,
    pub partner_revision: u64, pub settings_revision: u64, pub minted_at: i64, pub quote_digest: [u8; 32], pub bump: u8,
}
#[event]
pub struct PartnerHandleMinted {
    pub handle: String, pub receipt: Pubkey, pub partner: Pubkey, pub asset: Pubkey, pub owner: Pubkey,
    pub revenue_wallet: Pubkey, pub treasury: Pubkey, pub price_lamports: u64, pub partner_share_lamports: u64, pub treasury_share_lamports: u64,
}
#[error_code(offset = 7100)]
pub enum PartnerSolMintError {
    #[msg("Partner Mint is disabled.")] Disabled,
    #[msg("Partner is not approved.")] NotApproved,
    #[msg("Partner, settings or live price changed; obtain a new quote.")] StaleQuote,
    #[msg("Self-mint is not permitted for this partner.")] SelfMint,
    #[msg("Invalid payment recipient.")] InvalidRecipient,
    #[msg("Quote expired or exceeds the 60-second window.")] ExpiredQuote,
    #[msg("Missing or invalid dedicated partner quote signature.")] InvalidQuote,
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn digest_binds_metadata_price_and_revision() {
        let keys = [Pubkey::new_from_array([1; 32]), Pubkey::new_from_array([2; 32]), Pubkey::new_from_array([3; 32]), Pubkey::new_from_array([4; 32]), Pubkey::new_from_array([5; 32]), Pubkey::new_from_array([6; 32])];
        let args = PartnerSolMintArgs { handle: "ansem".into(), uri: "https://solhandle.io/nft.json".into(), partner_id: "example".into(), partner_revision: 1, settings_revision: 1, price_lamports: 100_000_001, expires_at: 100 };
        let digest = |a: &PartnerSolMintArgs| partner_quote_digest(a, keys[0], keys[1], keys[2], keys[3], keys[4], keys[5]);
        for field in 0..5 { let mut changed = args.clone(); match field { 0 => changed.uri.push('x'), 1 => changed.price_lamports += 1, 2 => changed.partner_revision += 1, 3 => changed.settings_revision += 1, _ => changed.expires_at += 1 }; assert_ne!(digest(&args), digest(&changed)); }
        let hex: String = digest(&args).iter().map(|byte| format!("{:02x}", byte)).collect();
        assert_eq!(hex, "ce1c18a34ca7069a29c2c0326cfb327faaaa486560c87ec7274aaa74403f39e9", "Rust/JS quote encoding must match");
        assert_eq!(PartnerMintReceipt::INIT_SPACE, 241);
    }
}