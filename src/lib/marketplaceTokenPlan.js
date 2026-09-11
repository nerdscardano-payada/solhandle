export const marketplaceTokenPlan = {
  status: "strategy_locked",
  order: [
    "Launch and validate Marketplace V1",
    "Measure marketplace usage and protocol royalty revenue",
    "Build useful $HANDLE utility before token launch",
    "Launch $HANDLE through a direct Meteora DBC configuration"
  ],
  marketplaceV1: {
    features: ["Fixed-price Buy Now", "Escrow-backed offers"],
    settlement: "All listings, offers and purchases settle through signed on-chain transactions",
    fees: "0% marketplace fee, 5% SolHandle protocol royalty on secondary sales",
    priorities: ["Ownership synchronization", "Sales volume", "Active traders", "Royalty revenue"]
  },
  tokenLaunch: {
    selectedRoute: "Direct Meteora Dynamic Bonding Curve (DBC)",
    primaryExperience: "A branded launch and trading page on the SolHandle website",
    liquidity: "No large creator-funded SOL deposit; buyers build quote liquidity on the bonding curve",
    graduation: "Collected quote liquidity and reserved $HANDLE supply migrate into a Meteora DAMM pool",
    externalDiscovery: ["Meteora", "Jupiter routing", "DexScreener", "Birdeye", "Solscan"],
    requirements: ["Final tokenomics", "Security review", "Legal and MiCA review", "Transparent vesting and allocations"]
  },
  utility: {
    principles: [
      "Burn $HANDLE for marketplace visibility, boosts or consumable upgrades",
      "Lock $HANDLE for durable access, referral benefits and reduced protocol royalties for eligible holders",
      "Keep handle resolution completely independent from $HANDLE",
      "Avoid APY-led speculative staking",
      "Do not hardcode token-based fee or royalty tiers before marketplace liquidity supports them"
    ]
  },
  nonCustodialRule: "Users sign transactions with their own wallets; SolHandle does not custody user funds or assets"
};