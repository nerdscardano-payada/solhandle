import DesignProvider from '@/components/solhandle/design/DesignContext';
import DesignWorkspace from '@/components/solhandle/design/DesignWorkspace';
import '@/components/solhandle/design/design-preview.css';
export default function DesignPreview() {
  return <DesignProvider><DesignWorkspace/></DesignProvider>;
}