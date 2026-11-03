import Header from '@/components/solhandle/Header';
import { Link } from 'react-router-dom';
import IntegrationIntake from '@/components/solhandle/onboarding/IntegrationIntake';
export default function Integrate() {
  return <main className="dark min-h-screen bg-background pb-24 text-foreground"><Header/><div data-localize-slots className="mx-auto max-w-4xl px-4 py-8 width-min-[600px]:px-6"><Link to="/integrate/ai" className="mb-6 block rounded-xl border border-names-accent/25 bg-card p-4"><strong className="text-names-accent">AI Integration Advisor →</strong><span className="mt-2 block text-sm text-muted-foreground">Discover how @handles fit your project with a source-linked, personalized analysis.</span></Link><IntegrationIntake/></div></main>;
}