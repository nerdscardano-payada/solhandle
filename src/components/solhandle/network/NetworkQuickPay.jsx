import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Send, ArrowUpRight } from 'lucide-react';
import ContactPicker from '@/components/solhandle/contacts/ContactPicker';
export default function NetworkQuickPay() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() || '';
  return <section className="network-panel network-quick-pay"><h2 className="network-panel-title"><span className="flex items-center gap-2"><Send className="h-4 w-4"/>Pay a saved @handle</span></h2><p className="mb-3 text-xs leading-relaxed text-identity-muted">Your existing private Contacts. Review the current recipient before signing with your wallet.</p><ContactPicker key={address} onSelect={contact => { if (address) navigate('/pay', { state: { contact, contactOwnerWallet: address } }); }}/><Link to="/pay" className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-names-accent px-4 py-2.5 text-xs font-semibold">Open SolHandle Pay<ArrowUpRight className="h-3.5 w-3.5"/></Link><p className="mt-3 text-[10px] leading-relaxed text-identity-muted">SOL · USDC · USDT · $HANDLE. No custody, internal balance or automatic transfer.</p></section>;
}