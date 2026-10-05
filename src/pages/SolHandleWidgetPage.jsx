import { useParams } from 'react-router-dom';
import SolHandleWidget from '@/components/solhandle/widgets/SolHandleWidget';
import { widgetOptions } from '@/components/solhandle/widgets/widgetOptions';
export default function SolHandleWidgetPage() {
  const { type } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const wallet = urlParams.get('wallet') || '';
  return <main className="dark min-h-screen bg-background p-3 font-body text-foreground"><div className="mx-auto max-w-md">{widgetOptions.some(item => item.id === type) ? <SolHandleWidget type={type} wallet={type === 'identity' ? wallet : ''}/> : <p role="alert" className="p-5 text-sm text-muted-foreground">Unknown SolHandle widget. Choose Search & Claim, @Name Lookup or Wallet Identity Card.</p>}</div></main>;
}