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
    number: "06", status: "current", title: "Partners, SDK & developer ecosystem",
    summary: "The SDK, resolver and Mainnet integration guides are available; third-party onboarding and verification remain in progress.",
    completed: ["Public solhandle-sdk package under the MIT License", "Developer Center, integration guides and resolver examples", "Forward and reverse resolution infrastructure"],
    upcoming: ["Onboard wallets, explorers, payment tools and ecosystem partners", "Verify integrations against the Mainnet security test suite", "Grow the Integration Rewards program and partner distribution model"]
  },
  {
    number: "07", status: "completed", title: "Native marketplace live",
    summary: "The non-custodial native marketplace is live, with active handle listings and recorded bidding activity.",
    completed: ["Native listing, bidding and Buy Now interfaces", "Wallet-confirmed non-custodial transaction architecture", "Marketplace discovery and bid/sale notification interfaces"],
    next: "Continue monitoring ownership synchronization, transaction reliability, sales and royalties actually received, with ongoing marketplace improvements."
  },
  {
    number: "08", status: "completed", title: "SolHandle Pay — native SOL transfers",
    summary: "A verified @handle can now be used to send native SOL directly to its current owner on Mainnet, without custody or a SolHandle payment fee.",
    completed: ["On-chain recipient resolution and safe native-SOL destination checks", "Wallet-signed transfers with sender, amount and recipient validation", "Confirmed payment receipts and wallet-linked payment history"],
    next: "Monitor wallet compatibility and transaction reliability while keeping the recipient address visible before approval."
  },
  {
    number: "09", status: "current", title: "$HANDLE community launch",
    summary: "The $HANDLE mint address is configured and trading routes are enabled in the app. The protocol allocation lock and public proof remain open; token ownership is not required to use SolHandle.",
    completed: ["Launch plan: one billion $HANDLE, 99% community and 1% protocol allocation", "Six-month lock commitment defined for the ten million protocol tokens", "Official $HANDLE mint address configured in launch settings", "DexScreener dashboard and Jupiter/pump.fun trading routes enabled"],
    upcoming: ["Independently verify and publish the official mint address and trading routes", "Execute the six-month protocol allocation lock and publish proof"]
  },
  {
    number: "10", status: "current", title: "Earn Network tiers & activation",
    summary: "The official token address is configured and Earn Network Live mode is enabled. Payouts are still paused, and end-to-end revenue and payout validation remains outstanding.",
    completed: ["Permanent origin-referral attribution infrastructure", "Mint-share tiers configured: 25,000 $HANDLE → 20%; 100,000 → 30%; 250,000 → 40%; 1,000,000 → 50%", "24-hour tier-upgrade qualification and actual-received revenue accounting implemented", "Official token mint configured in Earn settings", "Earn Network Live mode enabled"],
    upcoming: ["Verify live token balance checks and tier qualification with real activity", "Validate confirmed revenue allocation and payout safeguards end to end", "Unpause eligible payouts only after verification"]
  },
  {
    number: "11", status: "upcoming", title: "Additional mint payment options",
    summary: "Keep SOL as the default while exploring optional $HANDLE and USDC payments for new handle mints, subject to token availability and protocol security review.",
    completed: ["Native SOL payment and NFT mint in one on-chain transaction"],
    upcoming: ["Explore $HANDLE mint payments with a proposed 5% discount and 50% verifiable token burn", "Add optional USDC mint payments with a reliable, time-limited SOL-to-USDC quote", "Validate atomic payment and minting, treasury accounting and referral economics before launch"]
  }
];