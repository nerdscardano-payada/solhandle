import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoIdentity from '@/components/solhandle/demos/DemoIdentity';
import { demoPath } from '@/components/solhandle/demos/demoCatalog';
export default function DemoWallet({ identity }) {
  return <div className="space-y-6"><p className="text-xs uppercase tracking-widest text-muted-foreground">Generic wallet · real resolved identity</p><DemoIdentity identity={identity}/><div className="rounded-xl bg-muted p-6"><p className="text-3xl font-semibold">24.82 SOL</p><p className="mt-2 text-xs text-names-secondary">Illustrative balance, not this wallet’s actual funds.</p></div><div className="flex gap-3"><Button asChild variant="outline"><Link to={demoPath('wallet-send', identity.handle)}>Send</Link></Button><Button asChild variant="outline"><Link to={demoPath('wallet-receive', identity.handle)}>Receive</Link></Button></div><p className="text-xs text-muted-foreground">Resolved handle identity. This view does not assert it is the wallet’s primary handle; verify that in Reverse Resolver.</p></div>;
}