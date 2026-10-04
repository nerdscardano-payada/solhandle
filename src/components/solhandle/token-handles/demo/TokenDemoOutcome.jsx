import { Button } from '@/components/ui/button';

export default function TokenDemoOutcome({ state, dispatch }) {
  const success = state.step === 5;
  return <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">{success ? 'Demo complete · no real registration' : 'Sample application ended'}</p>
    <h3 className="text-2xl font-semibold">{success ? `$${state.token.symbol} · simulated profile` : 'Registration blocked'}</h3>
    <p className="text-sm text-muted-foreground">{success ? 'Your demonstration reached the finalized state. No token handle was issued, no NFT was minted, and no resolver or public profile was created.' : state.rejection}</p>
    <dl className="space-y-3 rounded-xl border border-border p-4 text-sm">{[['Mint fixture', state.token.id], ['Project', state.token.name], ['Wallet', state.wallet], ['Deposit simulated', '0.25 SOL · non-refundable under the planned policy'], ['Balance simulated', state.balancePaid ? `${state.token.price - 0.25} SOL` : '0 SOL'], ['Total simulated', `${state.balancePaid ? state.token.price : 0.25} SOL`], ['Verification badge', 'Not issued; demo only'], ['On-chain signature', 'None'], ['Forward / reverse resolution', success ? `$${state.token.symbol} ↔ ${state.token.id} (fictional binding only)` : 'Not registered']].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="break-all">{value}</dd></div>)}</dl>
    <p className="text-sm text-names-warning">Production requires audited registry deployment, real authority and identity evidence, two independent reviewers, verified payment settlement and finalized on-chain registration. Verification is not a guarantee of token safety.</p>
    <Button onClick={() => dispatch({ type: 'reset' })}>Start a new demonstration</Button>
  </div>;
}