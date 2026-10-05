export default function WidgetExtrasOptions({ showClaimed, showMarket, onClaimedChange, onMarketChange }) {
  return <fieldset className="mt-5 rounded-xl border border-border p-4">
    <legend className="px-1 text-sm font-semibold">Optional sections</legend>
    <label className="flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={showClaimed} onChange={event => onClaimedChange(event.target.checked)} className="mt-1 h-4 w-4"/><span>Last claimed<span className="mt-1 block text-xs leading-5 text-muted-foreground">Show the three most recently claimed @handles.</span></span></label>
    <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={showMarket} onChange={event => onMarketChange(event.target.checked)} className="mt-1 h-4 w-4"/><span>Market<span className="mt-1 block text-xs leading-5 text-muted-foreground">Show three recent listings with prices and marketplace links.</span></span></label>
  </fieldset>;
}