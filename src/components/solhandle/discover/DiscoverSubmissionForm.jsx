import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import IntakeTurnstile from '@/components/solhandle/onboarding/IntakeTurnstile';
import DiscoverSubmissionFields from '@/components/solhandle/discover/DiscoverSubmissionFields';
const empty = {submission_kind:'SELF',listing_type:'PROJECT',name:'',summary:'',description:'',category:'OTHER',expertise:'',website:'',social_links_text:'',handle:'',product_status:'BUILDING',reason:'',contact_email:''};
export default function DiscoverSubmissionForm() {
  const config = useQuery({queryKey:['discover-intake-config'],queryFn:async () => (await base44.functions.invoke('discoverDirectory',{action:'config'})).data});
  const [values,setValues] = useState(empty), [token,setToken] = useState(''), [consent,setConsent] = useState(false), [fax,setFax] = useState(''), [busy,setBusy] = useState(false), [error,setError] = useState(''), [reset,setReset] = useState(0), [reference,setReference] = useState('');
  const [receipt] = useState(() => { let code = sessionStorage.getItem('discover-receipt-token'); if (!code) { code = crypto.randomUUID(); sessionStorage.setItem('discover-receipt-token',code); } return code; });
  const submit = async event => {
    event.preventDefault(); if (busy || !token || !consent) return;
    setBusy(true); setError('');
    try { const social_links = values.social_links_text.split('\n').map(value => value.trim()).filter(Boolean); const response = await base44.functions.invoke('discoverDirectory',{action:'submit',...values,social_links,consent,company_fax:fax,turnstile_token:token,receipt_token:receipt}); setReference(response.data.reference); sessionStorage.removeItem('discover-receipt-token'); }
    catch (failure) { setError(failure.response?.data?.error || failure.message || 'Submission failed. Please try again.'); }
    finally { setBusy(false); setToken(''); setReset(value => value+1); }
  };
  if (reference) return <section className="ep-card discover-detail" role="status"><h2>Submission received</h2><p>Keep your reference: <strong>{reference}</strong></p><p className="discover-muted">SolHandle will review your submission manually. Nothing has been published and no profile management rights have been granted.</p><div className="discover-actions"><Link className="ep-button" to="/discover">Back to Discover</Link><Link className="ep-link" to="/integrate">Want to integrate SolHandle?</Link></div></section>;
  if (config.isPending) return <p role="status">Preparing your submission…</p>;
  if (config.isError || !config.data?.site_key) return <div role="alert"><p>The form could not be prepared.</p><button className="ep-button" onClick={() => config.refetch()}>Try again</button></div>;
  return <form className="ep-card discover-card discover-form" onSubmit={submit}><fieldset disabled={busy}><DiscoverSubmissionFields values={values} onChange={(key,value) => setValues(current => ({...current,[key]:value}))}/><label className="discover-check"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)}/><span>I agree to the <Link className="ep-link" to="/privacy">privacy policy</Link> and to SolHandle reviewing this submission. Public descriptions and links may be published; my contact email remains private.</span></label><div hidden aria-hidden="true"><label>Company fax<input tabIndex={-1} autoComplete="off" value={fax} onChange={event => setFax(event.target.value)}/></label></div><IntakeTurnstile siteKey={config.data.site_key} onToken={setToken} resetKey={reset} action="discover_intake"/>{error && <p role="alert" className="discover-error">{error}</p>}<button className="ep-button ep-primary" type="submit" disabled={busy || !token || !consent}>{busy ? 'Submitting…' : 'Send for review'}</button><p className="ep-small">No automatic publication. Suggestions do not imply affiliation or verification.</p></fieldset></form>;
}