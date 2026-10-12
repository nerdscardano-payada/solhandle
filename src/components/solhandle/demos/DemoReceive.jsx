import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DemoIdentity from '@/components/solhandle/demos/DemoIdentity';
import DemoQR from '@/components/solhandle/demos/DemoQR';
export default function DemoReceive({ identity }) {
  const [notice, setNotice] = useState('');
  async function share() { const url = `${window.location.origin}/${identity.handle.replace(/^@/, '')}`; try { if (navigator.share) await navigator.share({ title: identity.handle, text: `My SolHandle: ${identity.handle}`, url }); else { await navigator.clipboard.writeText(url); setNotice('Profile link copied.'); } } catch (e) { if (e.name !== 'AbortError') setNotice('Sharing unavailable. Use Copy @ or Copy wallet.'); } }
  return <div className="space-y-6"><p className="text-sm font-semibold tracking-widest text-muted-foreground">RECEIVE SOL</p><DemoIdentity identity={identity}/>{identity.safeForNativeSol ? <DemoQR address={identity.address}/> : <p className="text-names-warning">Receive QR disabled: this owner is not a safe native SOL destination.</p>}<p className="text-sm">Share {identity.handle} instead of copying your wallet address.</p><Button variant="outline" onClick={share}>Share</Button><p role="status" className="text-xs text-muted-foreground">{notice}</p></div>;
}