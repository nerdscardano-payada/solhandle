import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import { sections, html } from '@/components/solhandle/resolve/resolveExamples';

export default function ResolveDocsContent() {
  function download() {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'solhandle-resolve.html'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="space-y-8">
    {sections.map(section => <section id={section.id} key={section.id} className="scroll-mt-6 rounded-2xl border border-border bg-card p-4 lg:p-6">
      <h2 className="text-xl font-semibold">{section.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{section.text}</p>
      {section.download && <button type="button" onClick={download} className="mt-3 rounded-lg border border-names-accent/40 px-4 py-2 text-sm text-names-accent">Download HTML example</button>}
      <ResolveCodeBlock code={section.code} language={section.language}/>
      {section.id === 'response' && <dl className="mt-5 space-y-3 text-sm">
        <div><dt className="font-semibold">address</dt><dd className="text-muted-foreground">Base58 address of the current Metaplex Core NFT owner on Mainnet. The HTTP API returns a string; the SDK returns a PublicKey plus addressString.</dd></div>
        <div><dt className="font-semibold">verified / collectionVerified</dt><dd className="text-muted-foreground">Confirms the canonical registry and official asset binding, not the identity, trustworthiness or payment safety of a person.</dd></div>
        <div><dt className="font-semibold">safeForNativeSol / destinationType</dt><dd className="text-muted-foreground">Native SOL destination classification: SYSTEM_WALLET or UNFUNDED_WALLET may be eligible. REJECTED_PDA and PROGRAM_OWNED_ACCOUNT are blocked. This is not a general transaction-safety guarantee.</dd></div>
        <div><dt className="font-semibold">handle / handlePda / assetAddress / network / status</dt><dd className="text-muted-foreground">Normalized @handle, registry address, official NFT address, mainnet-beta and claimed status.</dd></div>
      </dl>}
      {section.id === 'api' && <div className="mt-5 space-y-2 text-sm text-muted-foreground"><p><strong className="text-foreground">200:</strong> verified result. <strong className="text-foreground">404:</strong> handle not found. <strong className="text-foreground">400:</strong> invalid input, verification failure or a resolver/RPC error.</p><p>Errors return JSON with an error string. Treat network failures and non-200 responses as unresolved, never as a wallet address. An unresolved request does not prove a name is available to mint.</p><p>The hosted API depends on SolHandle availability and its RPC provider. No unlimited throughput or uptime guarantee is implied. Use the direct SDK with your own RPC when you need independent resolution.</p></div>}
    </section>)}
    <section id="safety" className="scroll-mt-6 rounded-2xl border border-names-warning/30 bg-card p-4 lg:p-6"><h2 className="text-xl font-semibold">6. Integration safety checklist</h2>
      <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
        <li>Solana is the source of truth: canonical registry → official Metaplex Core asset → current owner. The hosted resolver reads Mainnet at confirmed commitment, not from a database-only ownership claim.</li>
        <li>Display the resolved @handle and full wallet address. A handle can change owners after an NFT transfer; do not hardcode or indefinitely cache the destination.</li>
        <li>For payments, resolve again immediately before constructing the transaction. Require safeForNativeSol for native SOL and explicit user confirmation of the final address. Address resolution alone never authorizes a payment.</li>
        <li>Do not silently reuse a previous destination after an error. Stop the flow and let the user retry.</li>
        <li>Do not use a resolved name as authentication. Signing in still requires a separate wallet ownership proof.</li>
        <li>The example only displays an address. Token transfers need their own mint, destination and token-account validation; native SOL checks do not replace those.</li>
      </ul>
    </section>
  </div>;
}