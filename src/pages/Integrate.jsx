import Header from '@/components/solhandle/Header';
import IntegrationIntake from '@/components/solhandle/onboarding/IntegrationIntake';
export default function Integrate() {
  return <main className="dark min-h-screen bg-background pb-24 text-foreground"><Header/><div data-localize-slots className="mx-auto max-w-4xl px-4 py-8 width-min-[600px]:px-6"><IntegrationIntake/></div></main>;
}