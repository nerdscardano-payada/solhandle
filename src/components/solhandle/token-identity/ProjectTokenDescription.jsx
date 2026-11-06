export default function ProjectTokenDescription({metadata}) {
  const description=metadata?.description;
  return <section className="mt-5 space-y-2" aria-label="About this project">
    <h2 className="font-heading font-semibold text-ecosystem-text">About this project</h2>
    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ecosystem-muted">{description || (metadata?.status==='missing' ? 'No project description was found in this token’s metadata.' : 'The token metadata description is temporarily unavailable.')}</p>
    {description&&<p className="text-xs text-ecosystem-muted">Source: token metadata for this exact mint. Project-provided text, not independently verified by SolHandle.</p>}
  </section>;
}