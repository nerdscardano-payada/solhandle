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
    number: "07", status: "upcoming", title: "Native marketplace rollout",
    summary: "Establish real on-chain demand and secondary-market activity before introducing a token.",
    completed: ["Escrowless fixed-price sale architecture", "Escrow-backed offer design", "On-chain 5% SolHandle protocol royalty model"],
    upcoming: ["Launch Buy Now, listing and offer flows", "Synchronize ownership and market activity from chain state", "Measure listings, sales volume, active traders and protocol royalty revenue"]
  },
  {
    number: "08", status: "upcoming", title: "Token utility & community ownership",
    summary: "After the marketplace proves demand, $HANDLE will launch through a direct Meteora DBC configuration with useful benefits available from day one.",
    completed: ["Marketplace-first launch principle", "Burn-to-boost and lock-to-benefit utility direction", "Direct Meteora DBC selected with a branded SolHandle launch experience"],
    upcoming: ["Design tokenomics from measured marketplace and community activity", "Complete security, vesting and legal/MiCA review", "Launch the bonding curve on SolHandle and graduate liquidity into a Meteora DAMM pool"]
  }
];