import { useDesign } from '@/components/solhandle/design/DesignContext';
import PreviewToolbar from '@/components/solhandle/design/PreviewToolbar';
import PreviewShell from '@/components/solhandle/design/PreviewShell';
import PreviewDialog from '@/components/solhandle/design/PreviewDialog';
import '@/components/solhandle/design/network-light-contrast.css';
import '@/components/solhandle/design/network-panel-consistency.css';
export default function DesignWorkspace() {
  const d = useDesign();
  return <div className="sol-design" lang="en" data-no-translate translate="no" data-mode={d.screen === 'public' ? 'dark' : d.theme}><PreviewToolbar/><div className="sd-stage"><PreviewShell/></div><PreviewDialog/></div>;
}