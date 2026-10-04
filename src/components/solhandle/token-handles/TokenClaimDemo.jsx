import { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { demoInitialState, tokenClaimDemoReducer } from '@/components/solhandle/token-handles/demo/tokenClaimDemoState';
import TokenDemoDetection from '@/components/solhandle/token-handles/demo/TokenDemoDetection';
import TokenDemoProof from '@/components/solhandle/token-handles/demo/TokenDemoProof';
import TokenDemoApplication from '@/components/solhandle/token-handles/demo/TokenDemoApplication';
import TokenDemoReview from '@/components/solhandle/token-handles/demo/TokenDemoReview';
import TokenDemoRegistration from '@/components/solhandle/token-handles/demo/TokenDemoRegistration';
import TokenDemoOutcome from '@/components/solhandle/token-handles/demo/TokenDemoOutcome';

const stages = ['Token', 'Wallet proof', 'Application', 'Dual review', 'Registration', 'Result'];
export default function TokenClaimDemo() {
  const [state, dispatch] = useReducer(tokenClaimDemoReducer, demoInitialState);
  const active = state.step === 6 ? 3 : state.step;
  return <section id="claim-demo" className="mt-7 scroll-mt-6 rounded-2xl border border-names-accent/30 bg-card p-5 lg:p-7">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">Interactive demonstration · Fictional data only</p><h2 className="mt-2 text-2xl font-semibold">Try the Token Handle claim flow</h2></div>{state.step > 0 && state.step < 5 && <Button variant="outline" onClick={() => dispatch({ type: 'reset' })}>Reset demo</Button>}</div>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">No wallet connection, real signatures, payments, approval or minting. All actions below are simulated in this browser tab and reset on refresh; they never alter live handles, claims or token records.</p>
    <ol className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-6" aria-label="Demo progress">{stages.map((label, index) => <li key={label} aria-current={active === index ? 'step' : undefined} className={`rounded-lg border p-3 text-xs ${active === index ? 'border-names-accent/50 text-names-accent' : 'border-border text-muted-foreground'}`}>{index + 1}. {label}{index < active && ' · done'}</li>)}</ol>
    {state.token && <div className="mt-5 grid gap-2 rounded-xl border border-border p-4 text-sm lg:grid-cols-3"><span className="font-mono text-names-accent">${state.token.symbol} · {state.token.id}</span><span>Total: {state.token.price} SOL · Deposit credit: 0.25 SOL</span><span>Remaining after approval: {state.token.price - 0.25} SOL</span></div>}
    <div className="mt-6" aria-live="polite">
      {state.step === 0 && <TokenDemoDetection dispatch={dispatch}/>}
      {state.step === 1 && <TokenDemoProof state={state} dispatch={dispatch}/>}
      {state.step === 2 && <TokenDemoApplication state={state} dispatch={dispatch}/>}
      {state.step === 3 && <TokenDemoReview state={state} dispatch={dispatch}/>}
      {state.step === 4 && <TokenDemoRegistration state={state} dispatch={dispatch}/>}
      {[5, 6].includes(state.step) && <TokenDemoOutcome state={state} dispatch={dispatch}/>}
    </div>
    {state.events.length > 0 && <details className="mt-6 border-t border-border pt-4"><summary className="cursor-pointer text-sm text-names-accent">Simulated activity log ({state.events.length})</summary><ol className="mt-3 space-y-3">{state.events.map((event, index) => <li key={index} className="text-sm"><time className="mr-2 text-xs text-muted-foreground" dateTime={event.at}>{new Date(event.at).toLocaleTimeString()}</time>{event.message}</li>)}</ol><p className="mt-3 text-xs text-muted-foreground">Local demo history, not a secure or immutable audit trail.</p></details>}
  </section>;
}