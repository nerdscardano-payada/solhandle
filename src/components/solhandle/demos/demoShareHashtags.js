const categoryTags = {
  Wallets: ['SolanaWallet', 'CryptoPayments', 'Web3Identity'],
  Marketplaces: ['NFTMarketplace', 'SolanaNFT', 'DigitalIdentity'],
  Payments: ['SolanaPay', 'CryptoPayments', 'Web3Payments'],
  Identity: ['Web3Identity', 'DigitalIdentity', 'OnChainIdentity'],
  Dapps: ['SolanaDapps', 'Web3Development', 'OnChainIdentity'],
  Trading: ['SolanaTrading', 'CryptoTrading', 'OnChainIdentity'],
  DeFi: ['SolanaDeFi', 'DeFi', 'OnChainIdentity'],
  Explorers: ['SolanaExplorer', 'BlockchainData', 'OnChainIdentity'],
  Developers: ['SolanaDev', 'Web3Development', 'BlockchainAPI']
};
const scenarioTags = {
  'dao-treasury': ['DAO', 'Treasury', 'CryptoPayments'],
  'contributor-payroll': ['CryptoPayroll', 'DAO', 'CryptoPayments'],
  'creator-tips': ['CreatorEconomy', 'CryptoTips', 'Web3Payments'],
  'multisig-dashboard': ['Multisig', 'SolanaDapps', 'Web3Identity'],
  'dao-governance': ['DAO', 'Governance', 'Web3Identity'],
  'gaming-profile': ['Web3Gaming', 'GameFi', 'DigitalIdentity'],
  'social-chat': ['SocialFi', 'Web3Community', 'DigitalIdentity'],
  'airdrop-claim': ['Airdrop', 'SolanaDeFi', 'Web3Identity'],
  'vesting-dashboard': ['TokenVesting', 'SolanaDeFi', 'Web3Identity'],
  'p2p-otc': ['P2PTrading', 'OTCTrading', 'Web3Identity'],
  'escrow-review': ['Escrow', 'SmartContracts', 'Web3Identity']
};
export default function demoShareHashtags(category, slug) {
  return ['Solana', 'SolHandle', 'Web3', ...(scenarioTags[slug] || categoryTags[category] || categoryTags.Identity)];
}