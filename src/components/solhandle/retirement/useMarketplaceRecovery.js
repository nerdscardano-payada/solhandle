import { useCallback, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { listRecovery, checkRecovery, relayRecovery, startRecovery } from '@/components/solhandle/retirement/recoveryClient';
import { readAttempts, saveAttempt } from '@/components/solhandle/retirement/recoveryStorage';
const message = e => e.response?.data?.error || e.message;
export default function useMarketplaceRecovery() {
  const { publicKey, signTransaction } = useWallet(), wallet = publicKey?.toBase58() || '';
  const current = useRef(wallet), operationLock = useRef(false); current.current = wallet;
  const [view, setView] = useState({ wallet: '', items: [], attempts: [], loading: false, error: '', busy: '' });
  const load = useCallback(async (cursor = null, append = false) => {
    if (!wallet) return;
    try {
      setView(v => ({ ...v, wallet, loading: true, error: '' }));
      const attempts = readAttempts(wallet), report = await listRecovery({ wallet, cursor });
      if (current.current === wallet) setView(v => ({ ...v, ...report, wallet, attempts, items: append ? [...v.items, ...report.items] : report.items, loading: false }));
    } catch (e) { if (current.current === wallet) setView(v => ({ ...v, wallet, loading: false, error: message(e) })); }
  }, [wallet]);
  useEffect(() => { setView({ wallet, items: [], attempts: [], loading: Boolean(wallet), error: '', busy: '' }); if (wallet) load(); }, [wallet, load]);
  const act = async operation => {
    if (!wallet || current.current !== wallet || operationLock.current) return;
    operationLock.current = true;
    setView(v => ({ ...v, busy: 'working', error: '' }));
    try { await operation(); if (current.current === wallet) await load(); }
    catch (e) { if (current.current === wallet) { let attempts; try { attempts = readAttempts(wallet); } catch { /* Preserve the history error; never sign around corrupted storage. */ } setView(v => ({ ...v, ...(attempts ? { attempts } : {}), error: message(e) })); } }
    finally { operationLock.current = false; if (current.current === wallet) setView(v => ({ ...v, busy: '' })); }
  };
  const check = async attempt => { const result = await checkRecovery(attempt); saveAttempt(wallet, { ...attempt, ...result }); return result; };
  useEffect(() => {
    if (!wallet || view.wallet !== wallet || !view.attempts.some(a => a.state === 'pending')) return;
    let active = true, running = false;
    const poll = async () => {
      if (running) return; running = true;
      try { for (const attempt of readAttempts(wallet).filter(a => a.state === 'pending')) { if (!active || current.current !== wallet) return; await check(attempt); } if (active && current.current === wallet) await load(); }
      catch (e) { if (active && current.current === wallet) setView(v => ({ ...v, error: message(e) })); }
      finally { running = false; }
    };
    const timer = setInterval(poll, 7000); poll(); return () => { active = false; clearInterval(timer); };
  }, [wallet, view.attempts.some(a => a.state === 'pending'), load]);
  return { ...(view.wallet === wallet ? view : { items: [], attempts: [], loading: Boolean(wallet) }), wallet, publicKey,
    refresh: () => load(), more: () => load(view.next_cursor, true),
    cancel: position => act(() => startRecovery(position, publicKey, signTransaction, () => current.current === wallet)),
    check: attempt => act(() => check(attempt)),
    retry: attempt => act(async () => { const status = await check(attempt); if (status.canRebroadcast && current.current === wallet) await relayRecovery(attempt); }) };
}