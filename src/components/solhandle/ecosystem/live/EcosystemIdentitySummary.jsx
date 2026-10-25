import { ShieldCheck, Info, RefreshCw } from 'lucide-react';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export default function EcosystemIdentitySummary({ identity, address, refreshing, refresh }) {
  return <div className="el-identity-summary">
    <div className="el-identity-verified" role="status">
      <ShieldCheck size={16}/><span>Ownership verified on-chain</span>
      <Popover><PopoverTrigger asChild><button className="el-identity-info" aria-label="About ownership verification"><Info size={14}/></button></PopoverTrigger>
        <PopoverContent className="text-xs leading-relaxed" align="end">Handle ownership is not personal identity or Official Project verification.</PopoverContent>
      </Popover>
    </div>
    <dl>
      <div><dt>Primary Handle</dt><dd>{identity.primaryHandle}</dd></div>
      <div><dt>Wallet</dt><dd>{address.slice(0, 6)}…{address.slice(-4)}<IdentityCopy value={address} label="Copy wallet address"/></dd></div>
      <div><dt>Last checked</dt><dd><span>{new Date(identity.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><button className="el-identity-refresh" disabled={refreshing} onClick={refresh} aria-label={refreshing ? 'Checking identity…' : 'Refresh identity'} title="Refresh identity"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''}/></button></dd></div>
    </dl>
  </div>;
}