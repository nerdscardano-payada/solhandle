export default function LocalBulkSetup() {
  return <details className="mt-4 rounded-xl border border-border p-4"><summary className="cursor-pointer text-sm font-semibold text-names-secondary">Local validator setup (Linux / WSL)</summary>
    <div className="mt-3 space-y-3 text-sm text-muted-foreground">
      <p>Run from your existing Linux project folder with the updated app source, native Linux Node, Solana CLI and your compiled SolHandle program at <code>target/deploy/solhandle.so</code>. This starts a fresh, isolated ledger and never changes your CLI network or stops another validator.</p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground">bash src/components/solhandle/bulk-local/start-local-bulk.sh</pre>
      <p>Keep that terminal open. In a second terminal start the local website:</p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground">npm run dev -- --host 127.0.0.1</pre>
      <p>Open the address printed by Vite, then go to <code>/search</code>. Browser preview permissions can block access to your computer; use the locally served site for minting.</p>
      <p>Use a disposable test wallet. Set its custom RPC to <code>http://127.0.0.1:18899</code>, connect it in this panel and request test SOL. The header wallet and single-mint panel remain the existing mainnet flow.</p>
      <p>Metadata runs at <code>http://127.0.0.1:18902</code> and only exists while the launcher is running. These local NFTs have no mainnet value and do not appear in the production index. Restarting the launcher creates a new ledger.</p>
      <p>Metaplex Core is fetched read-only from the public RPC during setup. If that download is rate-limited, startup stops; no mainnet transaction is sent.</p>
    </div>
  </details>;
}