import integrationDemoScenarios from '@/components/solhandle/demos/integrationDemoScenarios';
export const demoCatalog = [
  { slug: 'resolver', title: '@handle Resolver', category: 'Developers', description: 'A name in. Its current on-chain owner out.', live: true },
  { slug: 'reverse-resolver', title: 'Reverse Resolver', category: 'Identity', description: 'Find the verified primary handle for a wallet.', live: true },
  { slug: 'wallet-send', title: 'Wallet Send to @', category: 'Wallets', description: 'Send to a name, not 44 characters.' },
  { slug: 'wallet-receive', title: 'Wallet Receive', category: 'Wallets', description: 'Share a name with a real resolved-address QR.' },
  { slug: 'wallet-identity', title: 'Wallet Transformation', category: 'Wallets', description: 'Before and after: a real wallet address becomes a human-readable identity, with on-chain proof and integration code.' },
  { slug: 'explorer', title: 'Explorer Identity', category: 'Explorers', description: 'See a human identity inside a generic explorer.' },
  { slug: 'trading', title: 'Trading Terminal', category: 'DeFi', description: 'Same blockchain. Better readability.' },
  { slug: 'payments', title: 'SolHandle Pay', category: 'Payments', description: 'Preview sending SOL, then open the live product.' },
  { slug: 'partner-mint', title: 'Partner Mint', category: 'Dapps', description: 'Real availability inside a simulated partner app.' },
  { slug: 'developer', title: 'API / SDK Playground', category: 'Developers', description: 'Run real lookups and copy integration code.', live: true },
  ...Object.entries(integrationDemoScenarios).map(([slug, scenario]) => ({ slug, title: scenario.title, category: scenario.category, description: scenario.benefit }))
];
export const demoPath = (slug, handle = '@demo') => `/demos/${slug}?handle=${encodeURIComponent(handle)}`;