export const ecosystemAssets = {
  logo: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png',
  city: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png',
  reference: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/5092e766e_image.png'
};
export const demoWallet = 'DEMO-7xQ9e3-ANSEM-L0aE-NOT-A-REAL-WALLET';
export const demoPeople = [
  { handle: '@friend', name: 'Your friend', initials: 'F', bio: 'Making things on Solana.', wallet: 'DEMO-FRIEND-SAVED-WALLET' },
  { handle: '@builder', name: 'A Solana builder', initials: 'B', bio: 'Ideas into useful products.', wallet: 'DEMO-BUILDER-SAVED-WALLET' },
  { handle: '@studio', name: 'Creative studio', initials: 'S', bio: 'Designing a more open ecosystem.', wallet: 'DEMO-STUDIO-SAVED-WALLET' }
];
export const demoProjects = [
  { id: 'solana', name: 'Solana', mark: 'S', category: 'Infrastructure', description: 'Explore the network behind a growing ecosystem of applications.', website: 'solana.com', detail: 'An illustrative directory entry for the Solana blockchain. This prototype does not assert a partnership, an associated SolHandle or official verification.' },
  { id: 'jupiter', name: 'Jupiter', mark: 'J', category: 'DeFi', description: 'Discover trading tools and onchain possibilities on Solana.', website: 'jup.ag', detail: 'An illustrative directory entry showing how a DeFi project will appear. Any live listing needs administrator review. No project identity or handle has been verified here.' },
  { id: 'tensor', name: 'Tensor', mark: 'T', category: 'NFTs', description: 'A place to explore the Solana NFT ecosystem.', website: 'tensor.trade', detail: 'A demo entry for the visual review of the NFT category. This is not a live project profile, a recommendation or an Official Project badge.' },
  { id: 'drift', name: 'Drift', mark: 'D', category: 'DeFi', description: 'Explore a project building decentralized trading on Solana.', website: 'drift.trade', detail: 'A demo entry for a project detail layout. No financial service is connected to this prototype. Independently research any project before using it.' }
];
export const scenarioLabels = { ready: 'Signed-in example', nowallet: 'No wallet', unsigned: 'Wallet connected, not signed in', nohandle: 'No handles', noprimary: 'No Primary Handle', uncertain: 'Ownership uncertain', transferred: 'Handle transferred', empty: 'Empty projects & contacts', loading: 'Loading example', error: 'Error example' };
export const readiness = [
  ['Existing module', 'Mint & manage handles', 'Existing claim, owned-handle and Primary Handle routes remain unchanged: /search and /my-handles. Not connected inside this prototype.'],
  ['Partial', 'Identity & account', 'NFT identity lookup exists. Normal-member wallet login, lifecycle and transfer authorization still require security evidence.'],
  ['Existing module', 'Private contacts', 'Existing wallet-signed address book at /contacts. Saved recipient wallets stay pinned; no automatic public following.'],
  ['Existing module', 'SolHandle Pay', 'Existing /pay and /receive flows use review and wallet signing. The prototype never invokes these flows.'],
  ['Partial', 'Project directory', 'Admin publication and withdrawal exist at /admin/projects. Project logos, public reporting and independent official verification are not yet integrated.'],
  ['Security work', 'Sensitive actions', 'Account authorization, ownership freshness, transfer races and cross-wallet tests remain release gates. UI scenario selection is not security validation.'],
  ['Demo', 'This entire preview', 'All identities, counts, contacts, balances, search matches and mutations are in-memory examples. Nothing is persisted or sent.'],
  ['Later', 'Full social network', 'Public feeds, likes, reposts, follower counts, DMs, groups and social notifications are deliberately absent. Existing development code is preserved.']
];