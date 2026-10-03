const rules = 'Mint a SolHandle during this weekend using SOL or $HANDLE. The first 25 different wallets to complete a successful mint each receive 100,000 $HANDLE. Each wallet can earn this reward only once. Minting more handles helps reach the burn milestones, but does not earn extra rewards. Buying or receiving an existing handle does not count, and neither do failed mints or special official claims. We check the mint order on Solana so the selection is fair. Rewards are sent after the weekend, once the results have been checked and approved. You can view the mint records and completed reward payments and burns below, with links to Solana Explorer.';

export default function WeekendRules() {
  return <section className="rounded-2xl border border-border p-4 lg:p-5">
    <details className="lg:hidden"><summary className="cursor-pointer py-2 text-lg font-semibold">How it works</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{rules}</p></details>
    <div className="hidden lg:block"><h2 className="text-xl font-semibold">How it works</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{rules}</p></div>
  </section>;
}