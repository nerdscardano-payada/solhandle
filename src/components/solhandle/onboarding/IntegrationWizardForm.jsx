import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import IntakeField from '@/components/solhandle/onboarding/IntakeField';
import IntakeChoices from '@/components/solhandle/onboarding/IntakeChoices';
import IntakeConsent from '@/components/solhandle/onboarding/IntakeConsent';
import IntakeTurnstile from '@/components/solhandle/onboarding/IntakeTurnstile';
import { projectFields,nominationFields,contextFields,extraFields } from '@/components/solhandle/onboarding/intakeFields';
const titles = ['Your project','What type of product are you building?','How could you imagine using SolHandle?','A little technical context','Anything else?'];
export default function IntegrationWizardForm({flow}) {
  const {type,step,setStep,values,change,config,token,setToken,busy,error,setError,resetKey} = flow;
  const heading = useRef(null), nomination = type === 'nomination', last = nomination || step === 4;
  useEffect(() => { heading.current?.focus(); },[step]);
  function next(event) {
    event.preventDefault();
    const requiredMulti = step === 1 ? ['product_types'] : step === 2 ? ['use_cases'] : step === 3 ? ['tech_stack','integration_preference'] : [];
    if (!nomination && requiredMulti.some(key => !values[key]?.length)) {setError('Please select at least one option for each question.');return;}
    if (last) flow.submit(); else {setError('');setStep(step+1);}
  }
  const fields = nomination ? nominationFields : step === 0 ? projectFields : step === 3 ? contextFields : step === 4 ? extraFields : [];
  return <section className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 width-min-[600px]:p-7">
    <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{nomination ? 'Community suggestion' : `Step ${step+1} of 5`}</span><button type="button" className="min-h-11 text-names-accent" disabled={busy} onClick={() => flow.start(nomination ? 'project' : 'nomination')}>Switch flow</button></div>
    {!nomination && <progress className="mb-5 h-1 w-full accent-current" max={5} value={step+1} aria-label="Form progress"/>}
    <h1 ref={heading} tabIndex={-1} className="font-heading text-2xl font-semibold outline-none">{nomination ? 'Know a project that could benefit from SolHandle?' : titles[step]}</h1>
    <p className="mt-3 text-sm text-muted-foreground">{nomination ? 'A suggestion is not a partnership or an expression of interest from the project.' : step === 3 ? '“Not sure” is a normal answer. We’ll help you find a starting point.' : 'Choose what fits. You don’t need to know the implementation yet.'}</p>
    <form onSubmit={next} className="mt-6 space-y-6">
      {fields.map(field => <IntakeField key={field.name} field={field} values={values} onChange={change} options={config.options}/>)}
      {!nomination && [1,2].includes(step) && <IntakeChoices name={step === 1 ? 'product_types' : 'use_cases'} label="Select all that apply" options={config.options[step === 1 ? 'product_types' : 'use_cases']} value={values[step === 1 ? 'product_types' : 'use_cases']} onChange={change}/>}
      {last && <><IntakeConsent type={type} values={values} onChange={change}/><div hidden aria-hidden="true"><label>Company fax<input name="company_fax" tabIndex={-1} autoComplete="off" value={values.company_fax || ''} onChange={e => change('company_fax',e.target.value)}/></label></div><IntakeTurnstile siteKey={config.site_key} onToken={setToken} resetKey={resetKey}/></>}
      {error && <p role="alert" className="rounded-lg border border-destructive/50 p-3 text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">{!nomination && step > 0 && <Button type="button" variant="outline" className="min-h-12" disabled={busy} onClick={() => {setError('');setStep(step-1);}}>Back</Button>}<Button type="submit" className="min-h-12 flex-1 whitespace-normal" disabled={busy || (last && !token)}>{busy ? 'Saving your submission…' : last ? nomination ? 'Submit suggestion' : 'Find my integration' : 'Continue →'}</Button></div>
      {last && <p className="text-xs leading-relaxed text-muted-foreground">Your submission is saved privately. Email confirmation is available only when signed in with an app account matching the contact email; otherwise keep the submission reference shown next.</p>}
    </form>
  </section>;
}