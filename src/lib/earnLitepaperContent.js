export const earnLitepaper = {
  version: "1.0", updated: "September 2026",
  summary: "The SolHandle Earn Network turns a verified @handle into an origin identity for referrals. Refer a real first mint once, keep the origin connection, and share in supported revenue after the network launches.",
  streams: [
    { title: "Mint commissions", rate: "20–50%", text: "You receive a percentage of each eligible mint made by a wallet in your network. Your active $HANDLE tier at the moment of mint decides the percentage." },
    { title: "Secondary royalties", rate: "50%", text: "When a referred SolHandle is sold and SolHandle actually receives its 5% royalty, half of that received royalty is allocated to the origin referrer." },
    { title: "$HANDLE creator fees", rate: "50%", text: "When an attributed wallet creates eligible $HANDLE trading activity, half of the creator fee actually received by SolHandle is allocated to the origin referrer." }
  ],
  tiers: [
    { name: "Starter", balance: "25,000", rate: "20%" }, { name: "Builder", balance: "100,000", rate: "30%" },
    { name: "Growth", balance: "250,000", rate: "40%" }, { name: "Network", balance: "1,000,000", rate: "50%" }
  ],
  examples: [
    { title: "Example 1 — Referred mint", facts: ["Eligible mint amount: 0.10 SOL", "Active tier: Builder (30%)", "Calculation: 0.10 × 30%"], result: "You receive 0.03 SOL" },
    { title: "Example 2 — Secondary sale", facts: ["Sale price: 10 SOL", "Royalty actually received: 5% = 0.50 SOL", "Your share: 50% of 0.50 SOL"], result: "You receive 0.25 SOL" },
    { title: "Example 3 — Creator fees", facts: ["Creator fees actually received: 0.20 SOL", "Your share: 50%", "Calculation: 0.20 × 50%"], result: "You receive 0.10 SOL" },
    { title: "Example 4 — A network month", facts: ["8 mints of 0.10 SOL at a 30% tier = 0.24 SOL", "Received royalties of 0.40 SOL × 50% = 0.20 SOL", "Received creator fees of 0.30 SOL × 50% = 0.15 SOL"], result: "Illustrative total: 0.59 SOL" }
  ],
  rules: [
    { title: "How origin attribution works", items: ["A visitor opens your personal SolHandle referral link.", "Their attribution remains available during the configured referral window.", "Their first eligible confirmed mint permanently links the wallet and minted asset to your origin handle.", "Future supported activity can then be credited to the same origin referrer.", "A wallet can have only one locked origin referrer; self-referrals do not qualify."] },
    { title: "How tiers work", items: ["Tiers are based on the $HANDLE balance in your verified wallet.", "A higher tier must be held continuously for 24 hours before it activates.", "If your balance falls below your active tier, the lower tier applies immediately.", "The tier active when an eligible mint occurs determines that mint commission."] },
    { title: "Verification and payouts", items: ["Only confirmed, eligible on-chain activity can produce rewards.", "Duplicate events are ignored and suspicious or self-referred activity can be blocked.", "Revenue shares use amounts SolHandle actually receives, not advertised or theoretical fees.", "Available rewards can be claimed after the minimum payout threshold is reached."] }
  ],
  prelaunch: "The Earn Network is currently in pre-launch mode. Origin links and network activity can be recorded, but no claimable earnings accrue until the official $HANDLE token mint is configured and the network is switched to Live. Pre-launch activity is not promised to earn retroactive rewards.",
  faqs: [
    ["Do buyers pay extra?", "No. Referral rewards do not add a separate charge to the buyer's normal eligible transaction price."],
    ["Is income guaranteed?", "No. Earnings depend on eligible confirmed activity, actual revenue received, your active tier and the current program rules."],
    ["Can I refer myself?", "No. Self-referrals are rejected and do not earn rewards."],
    ["What happens if an NFT changes owner?", "The original referral origin remains connected to the attributed asset; ownership itself remains non-custodial in the holder's wallet."],
    ["Why use actual received revenue?", "External fees can vary. Using the amount actually received prevents the system from promising money the protocol did not collect."],
    ["When can I claim?", "Claims open only in Live mode and after available rewards meet the configured minimum payout threshold."]
  ],
  disclaimer: "This litepaper explains the intended Earn Network model in simple language. It is not financial, investment, tax or legal advice, does not promise profit, and does not guarantee the future value or launch of $HANDLE. Parameters can change before launch for security, legal, economic or technical reasons. On-chain records and the current published program terms govern where they differ from examples in this document."
};