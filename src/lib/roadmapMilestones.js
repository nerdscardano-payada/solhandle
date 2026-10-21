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
    completed: ["Protocol V2, official collection and treasury deployed", "Production deployment and protocol configuration established", "Indexer, resolver API, caching and batched RPC ownership checks live"],
    next: "Keep chain state authoritative while monitoring index and RPC reliability."
  },
  {
    number: "05", status: "completed", title: "Production security & Mainnet launch",
    summary: "SolHandle launched on Solana Mainnet with its public minting and production safeguards active.",
    completed: ["Public minting opened on Solana Mainnet", "Server-side transaction and official-price validation", "Admin, financial and protocol monitoring tools"],
    next: "Continue security monitoring, improve RPC resilience and repair legacy metadata where required."
  },
  {
    number: "06", status: "current", title: "SDK, integrations & Partner Mint pilot",
    summary: "Resolution tools and integration intake are available. Partner Mint has an administrator-only Devnet pilot and reusable SDK/React source; it is not a public or Mainnet release.",
    completed: ["Developer Center, forward/reverse resolution SDK source and integration examples", "Project submissions, nominations and an administrative integration pipeline", "Administrator-only Devnet Partner Mint flow, registry, receipt recovery and reporting", "Devnet mint SDK source preview and reusable React mint component"],
    upcoming: ["Complete remaining Devnet wallet, concurrency, security and legacy-flow acceptance gates", "Review partner-scoped access and domain verification before approving an external Devnet pilot", "Package and release developer tools only after their acceptance gates pass", "Require independent review and separate approval before any Mainnet Partner Mint activation"]
  },
  {
    number: "07", status: "retired", title: "Native marketplace, Share & Earn and Embed retired",
    summary: "SolHandle has stopped operating its native trading service and removed Share & Earn, the Earn Litepaper and public SolHandle Embed. These are retired services, not future launch milestones.",
    completed: ["New managed native listings, bids and purchases blocked", "Share & Earn participation, attribution and new reward accrual disabled", "Public Earn, litepaper and Embed entry points removed", "Existing financial history and owner-authorized marketplace cancellation/recovery preserved"],
    next: "Keep recovery available for existing positions. Service retirement does not disable permissionless on-chain contracts or change NFT ownership; retired services are not scheduled for reactivation."
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
    number: "10", status: "completed", title: "SOL & $HANDLE mint payment flows",
    summary: "Existing mint flows support SOL and $HANDLE. The $HANDLE path uses no-discount quotes, a maximum 5% reference price impact and verified 50/50 burn-treasury accounting; USDC mint payment is not advertised as available.",
    completed: ["Native SOL payment and official NFT mint in one atomic transaction", "Public $HANDLE mint preparation and confirmation connected to Mainnet", "No-discount quotes with a 5% price-impact limit", "Token payment, burn and treasury accounting implemented"],
    next: "Continue wallet compatibility checks and independent security/accounting review. Implemented functionality does not mean every wallet acceptance or security review is complete."
  },
  {
    number: "11", status: "completed", title: "SolHandle Pay — SOL, USDC, USDT & $HANDLE",
    summary: "The payment interface supports SOL and the official USDC, USDT and $HANDLE tokens on Solana. The current flow has no SolHandle payment fee; Solana network and applicable token-account creation costs remain payable.",
    completed: ["Currency selection and wallet-signed payment flows for SOL, USDC, USDT and $HANDLE", "Official token-mint, decimal and token-program configuration", "Recipient review, token-account checks and disclosed SOL costs", "Confirmation checks, pending-payment recovery, receipts and history"],
    next: "Improve wallet compatibility, confirmation reliability and recovery without introducing an unapproved payment fee. Wallet-driven submission remains separate future work."
  },
  {
    number: "12", status: "completed", title: "Contacts & protected payment requests",
    summary: "Wallet-authorized contacts and payment requests are integrated with SolHandle Pay rather than separate payment products.",
    completed: ["Save, search and manage contacts through wallet-authorized access", "Open payments from saved contacts with recipient-change warnings", "Reusable receiving links and fixed-amount one-time payment requests", "SOL, USDC, USDT and $HANDLE request options, quick expiry choices and confirmed-payment tracking"],
    next: "Preserve contact privacy and request recovery, and continue checking ownership changes, expiry and concurrent payment attempts."
  },
  {
    number: "13", status: "upcoming", title: "Wallet-driven payment submission",
    summary: "A migration plan has been outlined, but the existing Pay flow still uses backend preparation, validation and broadcasting after wallet signing. Direct wallet submission has not been activated.",
    completed: ["Migration scope and request-reservation/recovery risks identified"],
    upcoming: ["Establish actual sign-and-send support for each supported desktop, mobile and Android wallet route", "Start with direct SOL transfers while preserving validation, confirmation and uncertain-status recovery", "Extend to supported tokens, contacts and payment requests only after their release gates pass", "Retain historical records and reconciliation; disable new backend broadcasts only after migration acceptance"]
  },
  {
    number: "14", status: "research", title: "Optional SolHandle self-custody wallet",
    summary: "Feasibility research only: an optional integrated wallet is being investigated, not offered as an existing feature. External Phantom, Solflare and Backpack connections remain supported.",
    completed: ["Initial architecture assessment: the current Android bridge connects external wallets; it is not an integrated key-storage or recovery system"],
    upcoming: ["Prepare a threat model for a native Android wallet module, local encrypted secrets, independent recovery and explicit native signing approval", "Evaluate create/import/export compatibility and use Devnet test wallets only if prototype development is approved", "Keep user private keys and recovery phrases off SolHandle servers and outside the web interface", "Require independent security and legal review before any real-funds release; browser and iOS wallets require separate assessment"]
  }
];