import { useState } from 'react';
import AttoAvatar from '@/components/solhandle/AttoAvatar';
import ResolverDemo from '@/components/solhandle/ResolverDemo';
import ResolveWizardSetup from '@/components/solhandle/resolve/ResolveWizardSetup';

const methods = [
  { id: 'website', title: 'A simple website', description: 'Recommended for beginners. Download a complete working HTML example.' },
  { id: 'javascript', title: 'An existing JavaScript app', description: 'Add address lookup to your own form or button. Some coding needed.' },
  { id: 'sdk', title: 'Direct blockchain integration', description: 'Advanced: use the SDK and your own Solana RPC endpoint.' }
];
const steps = ['Choose your route', 'Add your integration', 'Try a handle'];
const lessons = [
  'Hi, I’m Atto, your guide! You do not need to do everything on this page. Choose one route. Not sure? Start with “A simple website”.',
  'Only follow the instructions for your chosen route below. You can skip the other examples. This adds address lookup, not wallet login or payments.',
  'Try @solhandle below to see what a successful lookup looks like. Then try it in your own website or app. This demo does not check whether your integration is installed.'
];
export default function ResolveWizard() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState('website');
  return <section aria-label="Atto integration wizard" className="my-6 rounded-2xl border border-names-accent/30 bg-card p-4 lg:p-6">
    <div className="flex items-start gap-4"><AttoAvatar className="h-16 w-16"/><div><p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Learn with Atto</p><p aria-live="polite" className="mt-2 text-sm leading-7 text-foreground">{lessons[step]}</p></div></div>
    <ol className="my-6 grid grid-cols-3 gap-2" aria-label="Your progress">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} className={`rounded-lg border p-3 text-xs lg:text-sm ${index === step ? 'border-names-accent text-names-accent' : 'border-border text-muted-foreground'}`}><span className="block font-semibold">{index + 1}</span>{label}</li>)}</ol>
    <div aria-live="polite"><h2 className="mb-4 text-xl font-semibold">{steps[step]}</h2>
      {step === 0 && <fieldset><legend className="mb-3 text-sm text-muted-foreground">What are you adding SolHandle to? Select one option.</legend><div className="grid gap-3 lg:grid-cols-3">{methods.map(option => <label key={option.id} className={`cursor-pointer rounded-xl border p-4 ${method === option.id ? 'border-names-accent bg-names-accent/5' : 'border-border'}`}><span className="flex items-center gap-2"><input type="radio" name="resolve-method" value={option.id} checked={method === option.id} onChange={() => setMethod(option.id)}/><span className="font-semibold">{option.title}</span></span><span className="mt-3 block text-sm leading-6 text-muted-foreground">{option.description}</span></label>)}</div></fieldset>}
      {step === 1 && <ResolveWizardSetup method={method}/>}
      {step === 2 && <><p className="text-sm text-muted-foreground">An existing handle returns its current wallet address. An unknown handle shows an error, not a destination.</p><ResolverDemo/><div className="mt-5 rounded-xl border border-names-warning/30 p-4 text-sm leading-7 text-muted-foreground"><strong className="text-foreground">Atto’s reminder:</strong> Ownership can change. Look up the address again before use. If lookup fails, stop instead of reusing an old address. Sending money requires additional checks and the user’s approval.</div><p className="mt-4 text-sm text-muted-foreground">Next: use the same lookup on your own site. The technical reference below is optional reading, not more required setup steps.</p></>}
    </div>
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4"><button type="button" onClick={() => step === 0 ? setMethod('website') : setStep(step - 1)} disabled={step === 0} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">Back</button>{step < 2 ? <button type="button" onClick={() => setStep(step + 1)} className="rounded-lg bg-names-accent px-4 py-2 text-sm font-semibold text-background">{step === 0 ? 'Continue with this route' : 'Next: try a handle'}</button> : <button type="button" onClick={() => { setStep(0); setMethod('website'); }} className="rounded-lg border border-names-accent/40 px-4 py-2 text-sm text-names-accent">Start again</button>}</div>
  </section>;
}