import GrowthFocus from '@/components/solhandle/GrowthFocus';
import GrowthHowTo from '@/components/solhandle/GrowthHowTo';

export default function GrowthMobileExplanation({ data, cycle, targetCap, checkedAt, source }) {
  return <details className="mt-5 rounded-2xl border border-names-accent/20 p-4">
    <summary className="cursor-pointer text-sm font-semibold text-names-accent">How does it work?</summary>
    <div className="mt-3 space-y-3 text-xs leading-relaxed text-names-secondary">
      <p>40% new paid mainnet mints + 40% new qualified holders + 20% market cap. All three goals are required to reach 100%.</p>
      <p>This cycle: +{cycle.handles_target} mints, +{cycle.holders_target} wallets holding at least {data.minimum_balance.toLocaleString()} $HANDLE for 24 hours, and a ${targetCap.toLocaleString('en-US')} market cap. Existing handles do not count again.</p>
      <p>Market cap comes from the most liquid official Solana pool on DEX Screener, not the token price. {source === 'live' ? 'Live market checks run about every 30 seconds.' : 'Live market cap is unavailable; showing the last available measurement.'} Cycle data refreshes every minute. Hourly official snapshots determine milestones and may differ from live values.</p>
      <p>Started {new Date(cycle.started_at).toLocaleDateString('en-GB')}. Growth measured {new Date(cycle.last_checked_at).toLocaleString('en-GB')}. Market cap verified {cycle.market_cap_checked_at ? new Date(cycle.market_cap_checked_at).toLocaleString('en-GB') : 'not yet measured'}. Last fetched {checkedAt ? checkedAt.toLocaleTimeString('en-GB') : '—'}.</p>
    </div>
    <GrowthFocus />
    <GrowthHowTo minimumBalance={data.minimum_balance} targetCap={targetCap} />
  </details>;
}