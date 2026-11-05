import '@/components/solhandle/token-identity/project-passport.css';
export default function ProjectEvidenceFields({value,onChange,disabled}) {
  return <fieldset className="grid gap-4" disabled={disabled}><legend className="mb-3 font-heading font-semibold">Project verification</legend>
    <label>Official project website<input type="url" value={value.project_website} onChange={event=>onChange({...value,project_website:event.target.value})} maxLength={400} placeholder="https://…" required/></label>
    <label>Public evidence of your project role<input type="url" value={value.project_evidence_url} onChange={event=>onChange({...value,project_evidence_url:event.target.value})} maxLength={400} placeholder="Official announcement or project page" required/></label>
    <p className="passport-test-muted">Provide an official project page or announcement linking your role or wallet to this exact token. An administrator checks the source before approval. Holding tokens or controlling a mint authority alone does not prove project ownership. Never share a seed phrase or private key.</p>
    <label className="passport-project-consent"><input type="checkbox" checked={value.publish_after_review} onChange={event=>onChange({...value,publish_after_review:event.target.checked})} className="mt-1 h-5 w-5 shrink-0" required/><span>I represent this project and consent to publish its token, my @handle, wallet, handle asset, project website and review/publication dates in Discover after approval. My evidence link and note stay private.</span></label>
  </fieldset>;
}