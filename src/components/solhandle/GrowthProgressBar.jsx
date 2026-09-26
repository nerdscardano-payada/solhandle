const milestones = [20, 40, 60, 80, 100];

export default function GrowthProgressBar({ progress, officialProgress }) {
  return <div className="mt-6">
    <div role="progressbar" aria-label="Indicative overall growth" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="relative h-4 rounded-full bg-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.13)]">
      <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 shadow-[0_0_20px_rgba(34,211,238,0.55)] transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      {milestones.map(at => <span key={at} title={`${at}% milestone: ${officialProgress >= at ? 'officially reached' : 'not yet reached'}`} className={officialProgress >= at ? 'absolute top-0 z-10 h-4 w-0.5 bg-emerald-300' : 'absolute top-0 z-10 h-4 w-0.5 bg-slate-400'} style={{ left: `calc(${at}% - 1px)` }} />)}
    </div>
    <div className="relative mt-2 h-5" aria-label="Official milestone status">
      {milestones.map(at => <span key={at} title={`${at}% milestone: ${officialProgress >= at ? 'officially reached' : 'not yet reached'}`} className={officialProgress >= at ? 'absolute text-xs font-semibold text-emerald-300' : 'absolute text-xs text-slate-400'} style={{ left: `${at}%`, transform: at === 100 ? 'translateX(-100%)' : 'translateX(-50%)' }}>{at}%{officialProgress >= at ? ' ✓' : ''}</span>)}
    </div>
  </div>;
}