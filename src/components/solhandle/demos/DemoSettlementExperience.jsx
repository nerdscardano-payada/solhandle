import DemoTraderProfile from '@/components/solhandle/demos/DemoTraderProfile';
import DemoOtcReview from '@/components/solhandle/demos/DemoOtcReview';
import DemoEscrowReview from '@/components/solhandle/demos/DemoEscrowReview';
import settlementDemoScenarios from '@/components/solhandle/demos/settlementDemoScenarios';
const screens = { 'trader-profile': DemoTraderProfile, 'p2p-otc': DemoOtcReview, 'escrow-review': DemoEscrowReview };
export default function DemoSettlementExperience({ slug, identity, enhanced, presentation }) {
  const Screen = screens[slug], scenario = settlementDemoScenarios[slug];
  return <div className="space-y-5"><Screen identity={identity} enhanced={enhanced} presentation={presentation}/><footer className="space-y-3 border-t border-border pt-4"><p className="text-xs leading-6 text-muted-foreground">{scenario.limitation}</p>{identity && !presentation && <a href={`https://explorer.solana.com/address/${identity.address}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-names-accent">Inspect the actual source wallet ↗</a>}</footer></div>;
}