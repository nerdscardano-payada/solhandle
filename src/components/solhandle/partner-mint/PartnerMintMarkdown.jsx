import ReactMarkdown from 'react-markdown';

const components = {
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-2 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-3 pl-5">{children}</ol>,
  pre: ({ children }) => <pre className="mb-4 overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs text-names-accent sm:text-sm">{children}</pre>,
};

export default function PartnerMintMarkdown({ body }) {
  const parts = body.split(/(^\|.*\|$(?:\n^\|.*\|$)*)/gm);
  return <div className="min-w-0 text-sm text-muted-foreground sm:text-base">{parts.map((part, index) => {
    if (!part.trim()) return null;
    if (!part.startsWith('|')) return <ReactMarkdown key={index} components={components}>{part}</ReactMarkdown>;
    const rows = part.trim().split('\n').map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
    const cell = text => <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>{text}</ReactMarkdown>;
    return <div key={index} className="mb-5 overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-muted"><tr>{rows[0].map((text, column) => <th key={column} className="px-4 py-3 font-semibold text-foreground">{cell(text)}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.slice(2).map((row, rowIndex) => <tr key={rowIndex}>{row.map((text, column) => <td key={column} className="px-4 py-3 align-top">{cell(text)}</td>)}</tr>)}</tbody></table></div>;
  })}</div>;
}