import HomeEcosystemPillars from '@/components/solhandle/ecosystem/live/HomeEcosystemPillars';
import HomeHowItWorks from '@/components/solhandle/ecosystem/live/HomeHowItWorks';
import HomeDeveloperResources from '@/components/solhandle/ecosystem/live/HomeDeveloperResources';
import EcosystemLiveProjects from '@/components/solhandle/ecosystem/live/EcosystemLiveProjects';
export default function EcosystemPublicContent() {
  return <div className="ep-public-content"><HomeEcosystemPillars/><EcosystemLiveProjects compact/><HomeHowItWorks/><HomeDeveloperResources/></div>;
}