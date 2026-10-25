import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
import EcosystemHandlesDemo from '@/components/solhandle/ecosystem/EcosystemHandlesDemo';
import EcosystemProjectDetail from '@/components/solhandle/ecosystem/EcosystemProjectDetail';
import EcosystemContactDetail from '@/components/solhandle/ecosystem/EcosystemContactDetail';
import EcosystemStatus from '@/components/solhandle/ecosystem/EcosystemStatus';
const titles = { handles: 'Your Handles', claim: 'Claim your @handle', project: 'Project details', contact: 'Private contact', person: 'Example profile', addContact: 'Add a contact', removeContact: 'Remove contact', account: 'Wallet & account', status: 'Prototype & release status', handle: 'NFT handle identity' };
export default function EcosystemDialog() {
  const d = useEcosystem(), modal = d.modal;
  return <Dialog open={Boolean(modal)} onOpenChange={open => { if (!open) d.setModal(null); }}><DialogContent className="eco-preview ep-dialog" lang="en" translate="no" data-no-translate><DialogHeader><DialogTitle>{titles[modal?.type] || 'Design preview'}</DialogTitle><DialogDescription>Interactive example only. No live account, data or funds are changed.</DialogDescription></DialogHeader>{modal && (['handles', 'claim'].includes(modal.type) ? <EcosystemHandlesDemo key={modal.type} claim={modal.type === 'claim'}/> : modal.type === 'project' ? <EcosystemProjectDetail key={modal.project.id} project={modal.project}/> : ['contact', 'person', 'addContact', 'removeContact'].includes(modal.type) ? <EcosystemContactDetail modal={modal}/> : <EcosystemStatus type={modal.type} handle={modal.handle}/>)}</DialogContent></Dialog>;
}