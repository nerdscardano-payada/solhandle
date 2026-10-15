import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

export default function AccountDeletion() {
  const { user } = useAuth();
  const { disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!user) return null;
  async function removeAccount(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await base44.functions.invoke('deleteMyAccount', { confirmation: 'DELETE' });
      if (!data.deleted) throw new Error(data.error || 'Account deletion failed.');
    } catch (failure) {
      setError(failure.response?.data?.error || failure.message); setBusy(false); return;
    }
    localStorage.removeItem('solhandle_wallet');
    try { await disconnect(); } finally { base44.auth.logout('/'); }
  }
  return <section className="mt-10 border-t border-border pt-6">
    <h2 className="font-heading text-lg font-semibold">Account settings</h2>
    <p className="mt-2 text-sm text-muted-foreground">Manage your SolHandle sign-in account.</p>
    <AlertDialog open={open} onOpenChange={value => { if (!busy) { setOpen(value); setError(''); } }}>
      <AlertDialogTrigger asChild><Button variant="destructive" className="mt-4">Delete account</Button></AlertDialogTrigger>
      <AlertDialogContent className="dark max-w-[calc(100%-2rem)] rounded-lg bg-card text-foreground sm:max-w-lg">
        <AlertDialogHeader><AlertDialogTitle>Delete your account permanently?</AlertDialogTitle>
          <AlertDialogDescription>This permanently removes your SolHandle sign-in account and signs you out. This cannot be undone. Your wallet, on-chain handles and NFTs remain yours. Public blockchain history and wallet-based protocol records are not erased.</AlertDialogDescription></AlertDialogHeader>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={removeAccount} className="bg-destructive text-destructive-foreground">{busy ? 'Deleting…' : 'Permanently delete account'}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>;
}