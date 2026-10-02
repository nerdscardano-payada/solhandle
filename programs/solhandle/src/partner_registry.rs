use anchor_lang::{prelude::*, solana_program::hash::hash, system_program};
use crate::{Config, TokenPaymentConfig};

// Additive foundation only. No existing account layout or mint instruction changes.
pub const PARTNER_SHARE_BPS: u16 = 5_000;
pub fn partner_id_hash(id: &str) -> [u8; 32] { hash(id.as_bytes()).to_bytes() }
pub fn validate_partner_id(id: &str) -> Result<()> {
    require!(!id.is_empty() && id.len() <= 32 && id.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-'), PartnerRegistryError::InvalidId);
    Ok(())
}
pub fn next_partner_revision(revision: u64) -> Result<u64> {
    revision.checked_add(1).ok_or_else(|| error!(PartnerRegistryError::RevisionOverflow))
}
pub fn partner_sol_split(fee: u64) -> Result<(u64, u64)> {
    require!(fee > 0, PartnerRegistryError::InvalidFee);
    let partner = fee / 2;
    Ok((partner, fee.checked_sub(partner).ok_or(PartnerRegistryError::InvalidFee)?))
}

pub fn configure_settings(ctx: Context<ConfigurePartnerMint>, enabled: bool, quote_signer: Pubkey) -> Result<()> {
    require!(ctx.accounts.config.protocol_version == 2, PartnerRegistryError::InvalidConfig);
    require!(quote_signer != Pubkey::default() && quote_signer != ctx.accounts.authority.key() && quote_signer != ctx.accounts.config.treasury, PartnerRegistryError::InvalidQuoteSigner);
    let token = &ctx.accounts.token_payment_config;
    if token.owner == &crate::ID && !token.data_is_empty() {
        let bytes = token.try_borrow_data()?;
        let mut data: &[u8] = &bytes;
        let payment = TokenPaymentConfig::try_deserialize(&mut data)?;
        require!(quote_signer != payment.quote_signer, PartnerRegistryError::InvalidQuoteSigner);
    }
    let settings = &mut ctx.accounts.partner_mint_settings;
    let revision = next_partner_revision(settings.revision)?;
    settings.set_inner(PartnerMintSettings {
        config: ctx.accounts.config.key(), enabled, quote_signer,
        revision, bump: ctx.bumps.partner_mint_settings,
    });
    emit!(PartnerMintConfigured { config: settings.config, enabled, quote_signer, revision: settings.revision });
    Ok(())
}

pub fn create_partner(ctx: Context<CreateMintPartner>, partner_id: String) -> Result<()> {
    validate_partner_id(&partner_id)?;
    require!(ctx.accounts.config.protocol_version == 2, PartnerRegistryError::InvalidConfig);
    let partner = &mut ctx.accounts.partner;
    partner.set_inner(MintPartner {
        config: ctx.accounts.config.key(), partner_id,
        revenue_wallet: ctx.accounts.revenue_wallet.key(), status: PartnerStatus::Approved,
        revision: 1, allow_self_mint: false, bump: ctx.bumps.partner,
    });
    emit_partner_change(partner, partner.key());
    Ok(())
}

pub fn change_status(ctx: Context<ManageMintPartner>, partner_id: String, expected_revision: u64, status: PartnerStatus) -> Result<()> {
    validate_partner_id(&partner_id)?;
    let partner = &mut ctx.accounts.partner;
    require!(partner.revision == expected_revision, PartnerRegistryError::StaleRevision);
    partner.revision = next_partner_revision(partner.revision)?;
    partner.status = status;
    emit_partner_change(partner, partner.key());
    Ok(())
}

pub fn change_wallet(ctx: Context<ChangePartnerWallet>, partner_id: String, expected_revision: u64) -> Result<()> {
    validate_partner_id(&partner_id)?;
    let partner = &mut ctx.accounts.partner;
    require!(partner.revision == expected_revision, PartnerRegistryError::StaleRevision);
    require_keys_neq!(partner.revenue_wallet, ctx.accounts.revenue_wallet.key(), PartnerRegistryError::WalletUnchanged);
    partner.revision = next_partner_revision(partner.revision)?;
    partner.revenue_wallet = ctx.accounts.revenue_wallet.key();
    emit_partner_change(partner, partner.key());
    Ok(())
}

fn emit_partner_change(partner: &MintPartner, address: Pubkey) {
    emit!(MintPartnerChanged {
        partner: address, config: partner.config, partner_id: partner.partner_id.clone(),
        revenue_wallet: partner.revenue_wallet, status: partner.status, revision: partner.revision,
    });
}

#[derive(Accounts)]
pub struct ConfigurePartnerMint<'info> {
    #[account(mut)] pub authority: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
    #[account(init_if_needed, payer = authority, space = 8 + PartnerMintSettings::INIT_SPACE, seeds = [b"partner_mint"], bump)]
    pub partner_mint_settings: Account<'info, PartnerMintSettings>,
    /// CHECK: Optional official token-payment PDA; deserialize only when program-owned.
    #[account(seeds = [b"token_payment"], bump)] pub token_payment_config: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(partner_id: String)]
pub struct CreateMintPartner<'info> {
    #[account(mut)] pub authority: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
    #[account(seeds = [b"partner_mint"], bump = partner_mint_settings.bump, has_one = config)]
    pub partner_mint_settings: Account<'info, PartnerMintSettings>,
    #[account(init, payer = authority, space = 8 + MintPartner::INIT_SPACE, seeds = [b"partner", partner_id_hash(&partner_id).as_ref()], bump)]
    pub partner: Account<'info, MintPartner>,
    // Joint transaction signature proves control of this System Program wallet.
    #[account(owner = system_program::ID)] pub revenue_wallet: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(partner_id: String)]
pub struct ManageMintPartner<'info> {
    pub authority: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"partner", partner_id_hash(&partner_id).as_ref()], bump = partner.bump, has_one = config, constraint = partner.partner_id == partner_id @ PartnerRegistryError::InvalidId)]
    pub partner: Account<'info, MintPartner>,
}

#[derive(Accounts)]
#[instruction(partner_id: String)]
pub struct ChangePartnerWallet<'info> {
    pub authority: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump, has_one = authority)] pub config: Account<'info, Config>,
    #[account(mut, seeds = [b"partner", partner_id_hash(&partner_id).as_ref()], bump = partner.bump, has_one = config, constraint = partner.partner_id == partner_id @ PartnerRegistryError::InvalidId)]
    pub partner: Account<'info, MintPartner>,
    #[account(owner = system_program::ID)] pub revenue_wallet: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct PartnerMintSettings {
    pub config: Pubkey, pub enabled: bool, pub quote_signer: Pubkey, pub revision: u64, pub bump: u8,
}
#[account]
#[derive(InitSpace)]
pub struct MintPartner {
    pub config: Pubkey,
    #[max_len(32)] pub partner_id: String,
    pub revenue_wallet: Pubkey, pub status: PartnerStatus,
    pub revision: u64, pub allow_self_mint: bool, pub bump: u8,
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum PartnerStatus { Approved, Suspended, Disabled }
#[event]
pub struct PartnerMintConfigured { pub config: Pubkey, pub enabled: bool, pub quote_signer: Pubkey, pub revision: u64 }
#[event]
pub struct MintPartnerChanged {
    pub partner: Pubkey, pub config: Pubkey, pub partner_id: String,
    pub revenue_wallet: Pubkey, pub status: PartnerStatus, pub revision: u64,
}

// Separate error range preserves all legacy 6000-series codes.
#[error_code(offset = 7000)]
pub enum PartnerRegistryError {
    #[msg("Partner ID must be 1-32 lowercase ASCII letters, digits or hyphens.")] InvalidId,
    #[msg("Partner Mint requires the supported protocol config.")] InvalidConfig,
    #[msg("Use a dedicated nonzero Partner Mint quote signer.")] InvalidQuoteSigner,
    #[msg("Partner revision overflow.")] RevisionOverflow,
    #[msg("Partner approval is stale; reload the current revision.")] StaleRevision,
    #[msg("The revenue wallet has not changed.")] WalletUnchanged,
    #[msg("A paid Partner Mint requires a positive SOL mint fee.")] InvalidFee,
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn canonical_partner_ids() {
        for id in ["a", "example-partner", "wallet123", &"a".repeat(32)] { assert!(validate_partner_id(id).is_ok()); }
        for id in ["", "UPPER", "a_b", "a b", "é", &"a".repeat(33)] { assert!(validate_partner_id(id).is_err()); }
        assert_ne!(partner_id_hash("a"), partner_id_hash("b"));
    }
    #[test]
    fn exact_lamport_settlement() {
        assert_eq!(PARTNER_SHARE_BPS, 5000);
        assert_eq!(partner_sol_split(100_000_000).unwrap(), (50_000_000, 50_000_000));
        assert_eq!(partner_sol_split(100_000_001).unwrap(), (50_000_000, 50_000_001));
        assert_eq!(partner_sol_split(1).unwrap(), (0, 1));
        assert_eq!(partner_sol_split(u64::MAX).unwrap(), (u64::MAX / 2, u64::MAX / 2 + 1));
        assert!(partner_sol_split(0).is_err());
    }
    #[test]
    fn revisions_never_wrap() {
        assert_eq!(next_partner_revision(0).unwrap(), 1);
        assert!(next_partner_revision(u64::MAX).is_err());
    }
    #[test]
    fn legacy_account_sizes_unchanged() {
        assert_eq!(Config::INIT_SPACE, 179);
        assert_eq!(crate::HandleRecord::INIT_SPACE, 98);
        assert_eq!(TokenPaymentConfig::INIT_SPACE, 98);
    }
}