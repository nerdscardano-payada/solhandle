import { Link, useParams } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import DemoBadge from '@/components/solhandle/demos/DemoBadge';
import DemoShare from '@/components/solhandle/demos/DemoShare';
import DemoWorkspace from '@/components/solhandle/demos/DemoWorkspace';
import DemoDeveloper from '@/components/solhandle/demos/DemoDeveloper';
import DemoWalletShowcase from '@/components/solhandle/demos/DemoWalletShowcase';
import { demoCatalog } from '@/components/solhandle/demos/demoCatalog';
import DemoUseCase from '@/components/solhandle/demos/DemoUseCase';
export default function DemoDetail() {
  const { slug } = useParams(); const demo = demoCatalog.find(item => item.slug === slug);
  return <main data-demo-page data-localize-slots className="dark min-h-screen bg-background text-foreground"><Header/><div className="mx-auto max-w-6xl space-y-8 px-5 py-10 md:py-14"><Link to="/demos" className="text-sm text-names-accent">← Demo Lab</Link>{!demo ? <section><h1 className="text-3xl font-semibold">Demo not found</h1><p className="mt-4 text-muted-foreground">Choose an available demo from the Demo Lab.</p></section> : <><header className="space-y-4"><DemoBadge live={demo.live}/><h1 className="font-heading text-3xl font-semibold md:text-5xl">{demo.title}</h1><p className="text-lg text-muted-foreground">{demo.description}</p></header><DemoUseCase demo={demo}/>{slug === 'developer' ? <DemoDeveloper key={slug}/> : slug === 'wallet-identity' ? <DemoWalletShowcase key={slug}/> : <DemoWorkspace key={slug} slug={slug}/>}<DemoShare title={demo.title} description={demo.description} category={demo.category} slug={slug}/>{!demo.live && <aside className="rounded-xl border border-names-secondary/20 bg-card p-4 text-xs leading-6 text-muted-foreground"><strong className="block text-names-secondary">Integration Demo</strong>This demo shows how SolHandle could be integrated into a Solana application. It does not indicate an official integration with any third-party platform. Identity lookups are real; illustrative balances, trades, activity and checkout outcomes are not blockchain records.</aside>}<p className="text-xs text-muted-foreground">SolHandle provides the experience. SolHandle API / SDK verifies Solana as the source of truth. Resolver membership verification is not a Phantom or marketplace verification badge.</p></>}</div></main>;
}