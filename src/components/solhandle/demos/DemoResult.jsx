import DemoIdentity from '@/components/solhandle/demos/DemoIdentity';
import DemoSend from '@/components/solhandle/demos/DemoSend';
import DemoReceive from '@/components/solhandle/demos/DemoReceive';
import DemoWallet from '@/components/solhandle/demos/DemoWallet';
import DemoExplorer from '@/components/solhandle/demos/DemoExplorer';
import DemoTrading from '@/components/solhandle/demos/DemoTrading';
import DemoPartnerMint from '@/components/solhandle/demos/DemoPartnerMint';
export default function DemoResult({ slug, result }) {
  if (slug === 'partner-mint') return <DemoPartnerMint availability={result}/>;
  if (slug === 'wallet-send' || slug === 'payments') return <DemoSend identity={result} payment={slug === 'payments'}/>;
  if (slug === 'wallet-receive') return <DemoReceive identity={result}/>;
  if (slug === 'wallet-identity') return <DemoWallet identity={result}/>;
  if (slug === 'explorer') return <DemoExplorer identity={result}/>;
  if (slug === 'trading') return <DemoTrading identity={result}/>;
  return <DemoIdentity identity={result} details/>;
}