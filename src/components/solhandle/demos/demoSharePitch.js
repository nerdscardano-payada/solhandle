const pitches = {
  resolver: 'One @handle. The real on-chain owner. See the identity layer behind SolHandle.',
  'reverse-resolver': 'A wallet address becomes a verified primary @handle. See it resolve live.',
  'wallet-send': 'Preview sending to @handles, not copy-pasted addresses. Real lookups. Human UX.',
  'wallet-receive': 'A name to share. A real resolved-wallet QR. Discover a better receive experience.',
  'wallet-identity': 'Watch a wallet address become an identity, with real on-chain proof.',
  explorer: 'Preview blockchain activity with recognizable names, not anonymous addresses.',
  trading: 'Preview a trading terminal where wallets have names. Same chain. Clearer UX.',
  payments: 'Preview paying an @handle, then discover the live SolHandle Pay product.',
  'partner-mint': 'Preview @handle minting inside a partner app, with real availability checks.',
  developer: 'Run real @handle lookups. Explore the API and SDK. Build human-readable Solana.',
  'dao-treasury': 'Preview DAO payouts to recognizable recipients, with real wallet resolution.',
  'contributor-payroll': 'Preview payroll built around named contributors, not endless wallet strings.',
  'creator-tips': 'Preview tipping a recognizable creator. Real @handle lookup. No funds move.',
  'multisig-dashboard': 'Preview a multisig with recognizable signers. Names clarify; contracts authorize.',
  'dao-governance': 'Preview governance with named proposers and voters. Make participation readable.',
  'gaming-profile': 'Preview a player identity built around a wallet-owned name, not a wallet string.',
  'social-chat': 'Preview a social feed where wallet identities become recognizable names.',
  'airdrop-claim': 'Preview an airdrop claim with a recognizable wallet. Identity, not eligibility.',
  'vesting-dashboard': 'Preview vesting with a named beneficiary. Clear identity. Unchanged contract rules.',
  'trader-profile': 'Preview a trader profile with a real resolved identity, not a reputation promise.',
  'p2p-otc': 'Preview P2P and OTC trades with named counterparties and real wallet lookups.',
  'escrow-review': 'Preview escrow with recognizable parties. Names clarify; contracts enforce.'
};
const categoryPitches = {
  Wallets: 'Preview a wallet experience built around names. Real resolution. Human-readable Solana.',
  Marketplaces: 'Preview a marketplace where buyers and sellers have names, not just wallet strings.',
  Payments: 'Preview payments with recognizable recipients and real @handle-to-wallet resolution.',
  Identity: 'Preview wallet-owned identity across apps. One recognizable name, real on-chain lookup.',
  Dapps: 'Preview apps built around recognizable wallet identities. Explore real @handle lookups.',
  Trading: 'Preview trading with named wallets and real lookups. Identity, not investment advice.',
  DeFi: 'Preview DeFi with recognizable wallet identities. Clear names. Unchanged protocols.',
  Explorers: 'Preview blockchain data with recognizable identities, while keeping wallet evidence visible.',
  Developers: 'Explore real @handle resolution. Discover the building blocks for human-readable Solana.'
};
export default function demoSharePitch(slug, category, description) {
  return pitches[slug] || categoryPitches[category] || description;
}