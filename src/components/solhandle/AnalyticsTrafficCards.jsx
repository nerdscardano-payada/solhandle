export default function AnalyticsTrafficCards({ ga, protocol }) {
  const cards = [
    ["GA active users", ga.activeUsers, ga.connected ? ga.property : "Connector unavailable"],
    ["GA sessions", ga.sessions, "Last 30 days"],
    ["GA pageviews", ga.pageViews, "Last 30 days"],
    ["Protocol sessions", protocol.sessions, `${protocol.walletSessions} with wallet`]
  ];
  return <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, note]) => <div key={label} className="card-glow"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><strong className="mt-2 block text-3xl text-white">{Number(value || 0).toLocaleString()}</strong><p className="mt-2 text-xs text-cyan-200">{note}</p></div>)}</div>;
}