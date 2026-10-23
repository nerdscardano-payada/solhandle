import ReactMarkdown from 'react-markdown';
export default function NetworkAuditContent({ content }) {
  const lines = content.split('\n');
  const start = lines.findIndex(line => line.startsWith('| Module |'));
  const end = lines.findIndex((line, index) => index > start && !line.startsWith('|'));
  const cells = line => line.split('|').slice(1, -1).map(value => value.trim());
  if (start < 0 || end < 0) return <ReactMarkdown>{content}</ReactMarkdown>;
  return <><ReactMarkdown>{lines.slice(0, start).join('\n')}</ReactMarkdown><div className="network-audit-table"><table><thead><tr>{cells(lines[start]).map(title => <th key={title}>{title}</th>)}</tr></thead><tbody>{lines.slice(start + 2, end).map((line, index) => <tr key={index}>{cells(line).map((value, column) => <td key={column}><ReactMarkdown>{value}</ReactMarkdown></td>)}</tr>)}</tbody></table></div><ReactMarkdown>{lines.slice(end).join('\n')}</ReactMarkdown></>;
}