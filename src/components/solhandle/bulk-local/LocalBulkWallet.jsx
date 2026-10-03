import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { localRpc, localGenesis, sol, LOCAL_RPC } from '@/components/solhandle/bulk-local/localRpc';
import { shortenAddress } from '@/lib/solhandle';
export default function LocalBulkWallet({ locked }) {
  const { publicKey, disconnect, connecting } = useWallet(), { setVisible } = useWalletModal();
  const [balance, setBalance] = useState(null), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const address = publicKey?.toBase58();
  const update = async fund => {
    if (!address || busy) return; setBusy(true); setMessage('');
    try {
      await localGenesis();
      if (fund) {
        const signature = await localRpc('requestAirdrop', [address, 2000000000]); let done = false;
        for (let i = 0; i < 40; i++) { const state = (await localRpc('getSignatureStatuses', [[signature]])).value[0]; if (state?.err) throw new Error('Local faucet transaction failed.'); if (['confirmed', 'finalized'].includes(state?.confirmationStatus)) { done = true; break; } await new Promise(resolve => setTimeout(resolve, 500)); }
        if (!done) throw new Error('Local faucet confirmation is pending. Refresh the balance shortly.');
      }
      setBalance({ address, value: (await localRpc('getBalance', [address, { commitment: 'confirmed' }])).value });
    } catch (caught) { setMessage(caught.message); } finally { setBusy(false); }
  };
  return <div className="mt-4 rounded-xl border border-names-warning/30 p-4">
    <p className="text-xs font-semibold text-names-warning">LOCALNET ONLY · disposable test wallet · SOL payments</p>
    <p className="mt-2 break-all text-xs text-muted-foreground">RPC: {LOCAL_RPC}. No production index or mainnet payments.</p>
    <div className="mt-3 flex flex-wrap items-center gap-2">{address ? <><span className="text-sm text-names-accent">{shortenAddress(address)}{balance?.address === address && ` · ${sol(balance.value)} test SOL`}</span><Button variant="outline" disabled={busy || locked} onClick={() => update(true)}>Get 2 test SOL</Button><Button variant="outline" disabled={busy} onClick={() => update(false)}>{busy ? 'Checking…' : 'Refresh balance'}</Button><Button variant="ghost" disabled={busy || locked} onClick={disconnect}>Disconnect</Button></> : <Button disabled={connecting || locked} onClick={() => setVisible(true)} className="bg-names-accent text-background hover:bg-names-accent/90">{connecting ? 'Connecting…' : 'Connect local test wallet'}</Button>}</div>
    {message && <p role="alert" className="mt-2 break-words text-sm text-names-warning">{message}</p>}
  </div>;
}