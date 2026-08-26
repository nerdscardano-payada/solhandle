import { useParams } from "react-router-dom";
import Header from "@/components/solhandle/Header";
import IntegrationGuideHeader from "@/components/solhandle/IntegrationGuideHeader";
import IntegrationWizard from "@/components/solhandle/IntegrationWizard";
import IntegrationVerification from "@/components/solhandle/IntegrationVerification";
import { integrations, typeById } from "@/lib/integrationCatalog";

export default function IntegrationGuide() {
  const { slug } = useParams();
  const integration = integrations.find((item) => item.slug === slug);
  if (!integration) return <main className="grid min-h-screen place-items-center bg-[#050811] px-5 text-white"><div className="text-center"><h1 className="text-3xl font-semibold">Integration guide not found</h1><a href="/integrations" className="mt-4 inline-block text-cyan-200">Return to Integration Center</a></div></main>;
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><IntegrationGuideHeader integration={integration} type={typeById[integration.type]}/><IntegrationWizard integration={integration}/><IntegrationVerification/></section></div></main>;
}