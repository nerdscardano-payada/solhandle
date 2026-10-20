const modules = {
  display: { title: 'Primary Handle Display', complexity: 'Low', description: 'Show a wallet’s current verified Primary SolHandle next to its address.', demo_url: '/demos/reverse-resolver', docs_url: '/developers/resolve', availability: 'Mainnet resolution available' },
  resolver: { title: '@ Handle Resolution', complexity: 'Low', description: 'Allow users to enter @ansem instead of a wallet; resolve the current owner again before constructing a transaction.', demo_url: '/demos/resolver', docs_url: '/developers/resolve', availability: 'Mainnet resolution available' },
  payments: { title: 'SolHandle Pay', complexity: 'Medium', description: 'Use a human-readable payment recipient while keeping wallet signing and recipient verification explicit.', demo_url: '/demos/payments', docs_url: '/integrations/payments', availability: 'Live payment product; integration review required' },
  creator: { title: 'Creator / Project Identity', complexity: 'Low', description: 'Associate a wallet with an official handle. This does not establish real-world identity, reputation or social-account ownership.', demo_url: '/demos/identity-profile', docs_url: '/integrations/application', availability: 'Built on live identity resolution' },
  activity: { title: 'Marketplace / App Identity', complexity: 'Low', description: 'Add current handle labels to wallet-based profiles and activity without changing custody or settlement.', demo_url: '/demos/trading', docs_url: '/integrations/application', availability: 'Live resolver; app UI integration required' },
  mint: { title: 'Partner Mint', complexity: 'High', description: 'Let users claim an official @handle directly to their wallet in a partner interface. The React/SDK source preview and atomic SOL revenue split are administrator-only on Devnet; public partner access, packaged widgets and Mainnet Partner Mint are not available.', demo_url: '/demos/partner-mint', docs_url: '/developers/partner-mint', availability: 'Devnet preview only · approval required' },
};
const productRules = {
  Wallet: ['display','resolver','payments'], Payments: ['resolver','payments','display'], Trading: ['activity','display','resolver'], DeFi: ['activity','resolver','display'], Marketplace: ['activity','display','creator'], Explorer: ['display','activity','creator'], 'Creator platform': ['creator','display','mint'], Gaming: ['creator','activity','display'], 'DAO / Governance': ['display','activity','resolver'], 'Social / Community': ['creator','display','activity'], 'Merchant / Commerce': ['payments','resolver','creator'], 'Developer infrastructure': ['resolver','display','activity'], Other: ['resolver','display'],
};
const useRules = {'Display @ identities':'display','Resolve @ → wallet':'resolver','Payments to @':'payments','Reverse resolution':'display','Creator / project identity':'creator','Partner Mint':'mint','Merchant payments':'payments'};
export function matchIntegration(input) {
  const scores = {}, reasons = {};
  function add(id, points, reason) { scores[id] = (scores[id] || 0) + points; (reasons[id] ||= []).push(reason); }
  for (const type of input.product_types) (productRules[type] || []).forEach((id, i) => add(id, 24-i*4, `Fits your ${type.toLowerCase()} product`));
  for (const use of input.use_cases) if (useRules[use]) add(useRules[use], 100, `You selected “${use}”`);
  if (input.integration_preference.includes('Partner Mint')) add('mint',100,'You prefer Partner Mint');
  const order = Object.keys(scores).sort((a,b) => scores[b]-scores[a] || a.localeCompare(b));
  return order.slice(0,3).map(id => ({ integration_type:id, ...modules[id], score:scores[id], reason:[...new Set(reasons[id])].join('. '), rule_version:'1.0' }));
}