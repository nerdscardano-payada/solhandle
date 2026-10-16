import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import { contactMessage, contactRequest, readContactAccess, storeContactAccess, unlockContacts } from '@/components/solhandle/contacts/contactClient';
export default function useContactsAccess() {
  const { publicKey, signMessage } = useWallet(), client = useQueryClient();
  const wallet = publicKey?.toBase58() || '';
  const [session, setSession] = useState(() => readContactAccess(wallet));
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    const sync = () => setSession(readContactAccess(wallet));
    sync(); setError('');
    window.addEventListener('storage', sync); window.addEventListener('solhandle-contacts-access', sync);
    const interval = setInterval(sync, 30000);
    return () => { clearInterval(interval); window.removeEventListener('storage', sync); window.removeEventListener('solhandle-contacts-access', sync); };
  }, [wallet]);
  const unlocked = session?.wallet === wallet && Date.parse(session?.expires_at) > Date.now();
  const unlock = async (rememberDevice = false) => {
    setBusy(true); setError('');
    try { await unlockContacts(publicKey, signMessage, rememberDevice); } catch (e) { setError(contactMessage(e)); } finally { setBusy(false); }
  };
  const lock = async () => {
    setBusy(true); setError('');
    try { await contactRequest('lock', wallet); storeContactAccess(wallet, null); client.removeQueries({ queryKey: ['wallet-contacts', wallet] }); }
    catch (e) { setError(contactMessage(e)); } finally { setBusy(false); }
  };
  return { wallet, session: unlocked ? session : null, unlocked, busy, error, unlock, lock };
}