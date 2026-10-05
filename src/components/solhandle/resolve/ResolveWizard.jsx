import { useState } from 'react';
import AttoAvatar from '@/components/solhandle/AttoAvatar';
import ResolverDemo from '@/components/solhandle/ResolverDemo';
import ReverseResolverDemo from '@/components/solhandle/resolve/ReverseResolverDemo';
import ResolveWizardSetup from '@/components/solhandle/resolve/ResolveWizardSetup';

const methods = [
  { id: 'members', title: 'Show names for members', description: 'Recommended for platforms. Display primary @names for wallets already used in member profiles, comments or leaderboards.' },
  { id: 'javascript', title: 'Look up payment recipients', description: 'Let users enter an @name in your existing recipient form. Your platform remains responsible for payments and approval.' },
  { id: 'website', title: 'Try a lookup demo', description: 'A downloadable demo search box. It does not connect to your members or automatically replace their wallet labels.' }
];
const steps = ['Choose your goal', 'Add your integration', 'Try your lookup'];
const lessons = [
  'Hi, I’m Atto! What should SolHandle do for your platform? If you already have members with wallet addresses, choose “Show names for members”. They do not need to type their @name.',
  'Follow only your selected example. Showing a name does not prove wallet ownership or sign a member in. Keep your existing wallet verification and member accounts unchanged.',
  'Try the lookup below to understand its result. This checks SolHandle data, not whether the integration is installed on your platform.'
];
export default function ResolveWizard() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState('members');
  return <section aria-label="Atto integration wizard" className="my-6 rounded-2xl border border-names-accent/30 bg-card p-4 lg:p-6">
    <div className="flex items-start gap-4"><AttoAvatar className="h-16 w-16"/><div><p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Learn with Atto</p><p aria-live="polite" className="mt-2 text-sm leading-7 text-foreground">{lessons[step]}</p></div></div>
    <ol className="my-6 grid grid-cols-3 gap-2" aria-label="Your progress">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} className={`rounded-lg border p-3 text-xs lg:text-sm ${index === step ? 'border-names-accent text-names-accent' : 'border-border text-muted-foreground'}`}><span className="block font-semibold">{index + 1}</span>{label}</li>)}</ol>
    <div aria-live="polite"><h2 className="mb-4 text-xl font-semibold">{steps[step]}</h2>
      {step === 0 && <fieldset><legend className="mb-3 text-sm text-muted-foreground">What do you want your platform to do? Select one goal.</legend><div className="grid gap-3 lg:grid-cols-3">{methods.map(option => <label key={option.id} className={`cursor-pointer rounded-xl border p-4 ${method === option.id ? 'border-names-accent bg-names-accent/5' : 'border-border'}`}><span className="flex items-center gap-2"><input type="radio" name="resolve-method" value={option.id} checked={method === option.id} onChange={() => setMethod(option.id)}/><span className="font-semibold">{option.title}</span></span><span className="mt-3 block text-sm leading-6 text-muted-foreground">{option.description}</span></label>)}</div></fieldset>}
      {step === 1 && <ResolveWizardSetup method={method}/>}
      {step === 2 && <><p className="text-sm text-muted-foreground">{method === 'members' ? 'Paste an existing member wallet to find its verified primary @name. No primary name means the original wallet remains visible.' : 'An existing handle returns its current wallet address. An unknown handle shows an error, not a destination.'}</p>{method === 'members' ? <ReverseResolverDemo/> : <ResolverDemo/>}<div className="mt-5 rounded-xl border border-names-warning/30 p-4 text-sm leading-7 text-muted-foreground"><strong className="text-foreground">Atto’s reminder:</strong> Ownership can change. Look up the address again before use. If lookup fails, stop instead of reusing an old address. Sending money requires additional checks and the user’s approval.</div><p className="mt-4 text-sm text-muted-foreground">Next: use the same lookup on your own site. The technical reference below is optional reading, not more required setup steps.</p></>}
    </div>
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4"><button type="button" onClick={() => step === 0 ? setMethod('members') : setStep(step - 1)} disabled={step === 0} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">Back</button>{step < 2 ? <button type="button" onClick={() => setStep(step + 1)} className="rounded-lg bg-names-accent px-4 py-2 text-sm font-semibold text-background">{step === 0 ? 'Continue with this route' : 'Next: try your lookup'}</button> : <button type="button" onClick={() => { setStep(0); setMethod('members'); }} className="rounded-lg border border-names-accent/40 px-4 py-2 text-sm text-names-accent">Start again</button>}</div>
  </section>;
}