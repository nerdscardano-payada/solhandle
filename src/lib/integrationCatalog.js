export const integrationTypes = [
  { id: "wallet", title: "Wallet", promise: "Send to @", description: "Forward resolution, Primary Handle identity and safe recipient confirmation." },
  { id: "explorer", title: "Explorer", promise: "Search @", description: "Handle search, wallet labels and verified reverse resolution." },
  { id: "marketplace", title: "Marketplace", promise: "Display @", description: "Owner and seller identity without changing marketplace custody or settlement." },
  { id: "payments", title: "Payments", promise: "Pay to @", description: "Resolve the destination before creating a Solana Pay or direct payment request." },
  { id: "application", title: "DeFi & Apps", promise: "Identity @", description: "Human-readable profiles, recipients and transaction history." },
  { id: "infrastructure", title: "Infrastructure", promise: "Resolver API", description: "On-chain resolution, reverse lookup and indexed enrichment at scale." },
];

export const integrations = [
  { slug: "phantom", name: "Phantom", type: "wallet", priority: 1, capabilities: ["Send to @", "Primary Handle", "Recipient confirmation"] },
  { slug: "solflare", name: "Solflare", type: "wallet", priority: 2, capabilities: ["Send to @", "Wallet identity", "Reverse resolution"] },
  { slug: "backpack", name: "Backpack", type: "wallet", priority: 3, capabilities: ["Send to @", "Profile identity", "Transaction labels"] },
  { slug: "solscan", name: "Solscan", type: "explorer", priority: 4, capabilities: ["Search @", "Address labels", "Wallet deep links"] },
  { slug: "jupiter", name: "Jupiter", type: "application", priority: 5, capabilities: ["Wallet identity", "Recipient fields", "Address resolution"] },
  { slug: "squads", name: "Squads", type: "application", priority: 6, capabilities: ["Recipient identity", "Signer labels", "Treasury sends"] },
  { slug: "magic-eden", name: "Magic Eden", type: "marketplace", priority: 7, capabilities: ["Owner identity", "Seller identity", "Handle discovery"] },
  { slug: "tensor", name: "Tensor", type: "marketplace", priority: 8, capabilities: ["Owner identity", "Seller identity", "Asset recognition"] },
  { slug: "tiplink", name: "TipLink", type: "payments", priority: 9, capabilities: ["Pay to @", "Recipient validation", "Payment links"] },
  { slug: "decaf", name: "Decaf", type: "payments", priority: 10, capabilities: ["Pay to @", "Merchant identity", "Recipient safety"] },
  { slug: "helius", name: "Helius", type: "infrastructure", priority: 11, capabilities: ["Resolver access", "Reverse lookup", "Data enrichment"] },
  { slug: "quicknode", name: "QuickNode", type: "infrastructure", priority: 12, capabilities: ["Resolver access", "RPC workflows", "Data enrichment"] },
];

export const typeById = Object.fromEntries(integrationTypes.map((item) => [item.id, item]));