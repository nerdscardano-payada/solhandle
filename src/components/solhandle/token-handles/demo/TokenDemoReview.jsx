import { Button } from '@/components/ui/button';
import TokenDemoReviewer from '@/components/solhandle/token-handles/demo/TokenDemoReviewer';

export default function TokenDemoReview({ state, dispatch }) {
  return <div className="space-y-4">
    <h3 className="text-xl font-semibold">4. Independent dual review</h3>
    <p className="text-sm text-muted-foreground">You are acting out two fictional reviewer roles. This is not genuine independent approval. In production, two distinct authorized reviewers, neither the claimant, must approve the exact mint, symbol and evidence revision.</p>
    <dl className="space-y-2 rounded-xl border border-border p-4 text-sm">{[['Claimant', state.wallet], ['Project', state.evidence.project], ['Project channel', state.evidence.channel], ['Evidence', state.evidence.description], ['Protection / conflicts', 'Fixture checks only; no global search or real protected-symbol check performed']].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="whitespace-pre-wrap break-words">{value}</dd></div>)}</dl>
    <div className="grid gap-4 lg:grid-cols-2"><TokenDemoReviewer id="reviewer-a" label="Demo Reviewer A" review={state.reviews['reviewer-a']} dispatch={dispatch}/><TokenDemoReviewer id="reviewer-b" label="Demo Reviewer B" review={state.reviews['reviewer-b']} dispatch={dispatch}/></div>
    <Button variant="outline" onClick={() => dispatch({ type: 'expire' })}>Simulate application expiry</Button>
    <p className="text-xs text-muted-foreground">A rejection or expiry ends this sample application. The deposit is not refunded; the remaining balance is not charged.</p>
  </div>;
}