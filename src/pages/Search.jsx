import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import HandleSearch from '@/components/solhandle/HandleSearch';
import BulkMintPreview from '@/components/solhandle/bulk-preview/BulkMintPreview';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
export default function Search() {
  const [wallet, setWallet] = useState(() => localStorage.getItem('solhandle_wallet') || '');
  return <main className="dark min-h-screen bg-background text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border">
    <Header onConnected={setWallet}/><PublicHandleMintRecovery/>
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-9 sm:py-12">
      <Link to="/" className="text-sm text-names-accent">← Back to home</Link>
      <h1 className="mt-5 text-3xl font-semibold sm:text-5xl">Find your SolHandle</h1>
      <p className="mt-3 text-sm text-muted-foreground">Search and claim one name with the existing mint flow.</p>
      <div className="mt-7"><HandleSearch wallet={wallet}/></div>
      {import.meta.env.DEV && <BulkMintPreview/>}
    </div>
  </div></main>;
}