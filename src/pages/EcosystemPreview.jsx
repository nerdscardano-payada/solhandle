import EcosystemProvider from '@/components/solhandle/ecosystem/EcosystemContext';
import EcosystemPreviewCanvas from '@/components/solhandle/ecosystem/EcosystemPreviewCanvas';
import '@/components/solhandle/ecosystem/ecosystem-preview.css';
export default function EcosystemPreview() {
  return <EcosystemProvider><EcosystemPreviewCanvas/></EcosystemProvider>;
}