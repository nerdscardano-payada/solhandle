import { FlaskConical } from "lucide-react";

export default function DemoNotice({ children }) {
  return <div className="flex items-start gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
    <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
    <p><strong>Interactive demo.</strong> {children}</p>
  </div>;
}