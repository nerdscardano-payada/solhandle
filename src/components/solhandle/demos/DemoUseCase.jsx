import { MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import demoCategories from '@/components/solhandle/demos/demoCategories';
import integrationDemoScenarios from '@/components/solhandle/demos/integrationDemoScenarios';
export default function DemoUseCase({ demo }) {
  const category = demoCategories.find(item => item.name === demo.category), scenario = integrationDemoScenarios[demo.slug];
  return <section className="grid gap-5 rounded-2xl border border-border bg-card p-5 md:grid-cols-3 md:p-6">{[[MapPin, 'Where it belongs', scenario?.purpose || category.where], [Sparkles, 'What it adds', demo.description], [ShieldCheck, 'What stays separate', scenario?.limitation || category.boundary]].map(([Icon, title, text]) => <div key={title} className="space-y-3"><Icon className="h-5 w-5 text-names-accent"/><h2 className="font-semibold">{title}</h2><p className="text-sm leading-6 text-muted-foreground">{text}</p></div>)}</section>;
}