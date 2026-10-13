import DemoTraderFeed from '@/components/solhandle/demos/DemoTraderFeed';
import DemoTraderWatchlist from '@/components/solhandle/demos/DemoTraderWatchlist';
import DemoCopyTradingReview from '@/components/solhandle/demos/DemoCopyTradingReview';
import tradingDemoScenarios from '@/components/solhandle/demos/tradingDemoScenarios';
const screens = { 'trading-feed': DemoTraderFeed, 'trading-watchlist': DemoTraderWatchlist, 'copy-trading-review': DemoCopyTradingReview };
export default function DemoTradingExperience({ slug, identity, enhanced, presentation }) {
  const Screen = screens[slug], story = tradingDemoScenarios[slug];
  return <div className="space-y-5"><Screen identity={identity} enhanced={enhanced} presentation={presentation}/><footer className="space-y-3 border-t border-border pt-4">{enhanced && identity && <p className="text-xs text-names-success">Current SolHandle name-to-wallet relationship verified at lookup time.</p>}<p className="text-xs leading-6 text-muted-foreground">{story.limitation}</p>{identity && !presentation && <a href={`https://explorer.solana.com/address/${identity.address}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-names-accent">Inspect the actual wallet ↗</a>}</footer></div>;
}