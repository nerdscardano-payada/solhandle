export const roadmapMilestones = [
  {
    number: "01", status: "completed", title: "Foundation & protocol plan",
    summary: "The product, ownership model and technical authority order were defined before implementation.",
    completed: ["Non-custodial NFT identity model", "Blockchain → indexer → database/cache → interface hierarchy", "Deterministic Handle, Asset and Config addresses for uniqueness"],
    next: "The foundation remains the rule set for every future integration."
  },
  {
    number: "02", status: "completed", title: "Programming & Devnet validation",
    summary: "The Solana program and complete claim flow were built and exercised before production deployment.",
    completed: ["Metaplex Core collection and Handle NFT implementation", "Atomic price validation, payment and mint transaction", "Devnet testing for reservations, ownership, Primary Handle and resolution"],
    next: "Devnet remains the first environment for protocol upgrades."
  },
  {
    number: "03", status: "completed", title: "Brand protection & official claims",
    summary: "Recognizable brands and strategic protocol names receive a dedicated anti-impersonation path.",
    completed: ["Protected and reserved names enforced on-chain", "Domain, wallet and known-channel verification flow", "Verified claims mint directly to the official organization wallet"],
    next: "Expand protected-name coverage and process verified organization requests."
  },
  {
    number: "04", status: "completed", title: "Mainnet ready",
    summary: "The production protocol and its supporting identity infrastructure are deployed on Solana Mainnet Beta.",
    completed: ["Protocol V2, official collection, treasury and rewards vault deployed", "Reproducible production build process established", "Indexer, resolver API, caching and batched RPC ownership checks live"],
    next: "Keep chain state authoritative while monitoring index and RPC reliability."
  },
  {
    number: "05", status: "completed", title: "Production security & Mainnet launch",
    summary: "SolHandle launched on Solana Mainnet with its public minting and production safeguards active.",
    completed: ["Public minting opened on Solana Mainnet", "Server-side transaction and official-price validation", "Admin, financial and protocol monitoring tools"],
    next: "Continue security monitoring, improve RPC resilience and repair legacy metadata where required."
  },
  {
    number: "06", status: "upcoming", title: "Partners, SDK & developer ecosystem",
    summary: "The developer foundation is live; verified native adoption is the next growth phase.",
    completed: ["Public solhandle-sdk package under the MIT License", "Developer Center, integration guides and resolver examples", "Forward and reverse resolution infrastructure"],
    upcoming: ["Onboard wallets, explorers, payment tools and ecosystem partners", "Verify integrations against the Mainnet security test suite", "Grow the Integration Rewards program and partner distribution model"]
  },
  {
    number: "07", status: "current", title: "Native marketplace rollout",
    summary: "The non-custodial marketplace experience is built; final Mainnet program activation and end-to-end validation remain launch requirements.",
    completed: ["Native listing, bidding and Buy Now interfaces", "Wallet-confirmed non-custodial transaction architecture", "Marketplace discovery and bid/sale notification interfaces"],
    upcoming: ["Deploy the updated marketplace program to Mainnet", "Validate listing, purchase, bid acceptance and cancellation end to end", "Monitor ownership synchronization, sales and royalties actually received"]
  },
  {
    number: "08", status: "current", title: "$HANDLE community launch",
    summary: "Preparing a pump.fun community launch with transparent allocation and verified trading routes. Token ownership is not required to use the identity protocol.",
    completed: ["Launch plan: one billion $HANDLE, 99% community and 1% protocol allocation", "Six-month lock commitment defined for the ten million protocol tokens", "Launch dashboard with configurable CA, DexScreener data and Jupiter/pump.fun trading routes"],
    upcoming: ["Create the official token through pump.fun", "Publish and verify the official CA and available trading routes", "Execute the six-month protocol allocation lock and publish proof"]
  },
  {
    number: "09", status: "current", title: "Earn Network tiers & activation",
    summary: "The Earn Network is being prepared for controlled activation. Pre-launch attribution does not create claimable earnings; Live mode requires the official token and completed launch checks.",
    completed: ["Permanent origin-referral attribution infrastructure", "Mint-share tiers configured: 25,000 $HANDLE → 20%; 100,000 → 30%; 250,000 → 40%; 1,000,000 → 50%", "24-hour tier-upgrade qualification and actual-received revenue accounting implemented"],
    upcoming: ["Configure the official $HANDLE mint and verify balance checks for every tier", "Validate 24-hour qualification, revenue allocation and payout safeguards", "Activate Live mode and eligible reward claims after verification"]
  }
];