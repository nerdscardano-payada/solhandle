import LocalBulkProvider from '@/components/solhandle/bulk-local/LocalBulkProvider';
import LocalBulkContent from '@/components/solhandle/bulk-local/LocalBulkContent';
import LocalBulkSetup from '@/components/solhandle/bulk-local/LocalBulkSetup';
export default function LocalBulkMint() {
  if (!import.meta.env.DEV) return null;
  return <section className="dark mt-6 rounded-2xl border border-names-secondary/30 bg-card p-5 text-foreground">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Development · local validator</p>
    <h2 className="mt-2 text-2xl font-semibold">Find your SolHandle · bulk minting</h2>
    <p className="mt-2 text-sm text-muted-foreground">Real test NFTs, real local transactions. Choose one name or fill a cart; minting stays completely separate from the existing mainnet flow.</p>
    <LocalBulkSetup/><LocalBulkProvider><LocalBulkContent/></LocalBulkProvider>
  </section>;
}