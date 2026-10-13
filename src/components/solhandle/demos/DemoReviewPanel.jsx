export default function DemoReviewPanel({ title, children }) {
  return <section role="status" className="space-y-3 rounded-xl border border-names-accent/30 bg-names-accent/5 p-4"><h4 className="font-semibold">{title}</h4>{children}<p className="text-xs leading-6 text-muted-foreground">Local integration preview only. No wallet authenticated, no transaction signed or submitted.</p></section>;
}