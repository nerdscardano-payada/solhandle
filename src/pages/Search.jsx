import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import HandleSearch from '@/components/solhandle/HandleSearch';
import SearchAtto from '@/components/solhandle/SearchAtto';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
export default function Search() {
  const [wallet, setWallet] = useState(() => localStorage.getItem('solhandle_wallet') || '');
  return <main className="dark min-h-screen bg-background text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border">
    <Header onConnected={setWallet}/><PublicHandleMintRecovery/>
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-9 sm:py-12">
      <Link to="/" className="text-sm text-names-accent">← Back to home</Link>
      <h1 className="mt-5 text-3xl font-semibold sm:text-5xl">Find your SolHandle</h1>
      <p className="mt-3 text-sm text-muted-foreground">Search, claim, and own your unique NFT-backed identity on Solana.</p>
      <div className="mt-7 grid items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0"><HandleSearch wallet={wallet}/></div>
        <SearchAtto/>
      </div>
    </div>
  </div></main>;
}