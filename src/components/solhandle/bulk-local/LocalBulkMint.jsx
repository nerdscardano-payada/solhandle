import LocalBulkProvider from '@/components/solhandle/bulk-local/LocalBulkProvider';
import LocalBulkContent from '@/components/solhandle/bulk-local/LocalBulkContent';
import LocalBulkSetup from '@/components/solhandle/bulk-local/LocalBulkSetup';
import BulkPreviewCart from '@/components/solhandle/bulk-preview/BulkPreviewCart';
export default function LocalBulkMint() {
  const localMode = import.meta.env.DEV;
  return <section className="dark mt-6 rounded-2xl border border-names-secondary/30 bg-card p-5 text-foreground">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">{localMode ? 'Development · local validator' : 'Sandbox preview · no real transactions'}</p>
    <h2 className="mt-2 text-2xl font-semibold">Find your SolHandle · bulk minting</h2>
    <p className="mt-2 text-sm text-muted-foreground">{localMode ? 'Real test NFTs, real local transactions. Choose one name or fill a cart; minting stays completely separate from the existing mainnet flow.' : 'Explore the bulk-mint cart and simulated checkout here. Real local test mints require the locally started website and validator; mainnet bulk minting is not enabled.'}</p>
    {localMode ? <><LocalBulkSetup/><LocalBulkProvider><LocalBulkContent/></LocalBulkProvider></> : <><BulkPreviewCart/><LocalBulkSetup/></>}
  </section>;
}