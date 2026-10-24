import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
export default function NetworkSearch({ placeholder = 'Zoek mensen, projecten of berichten…' }) {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [text, setText] = useState(query);
  useEffect(() => { setText(query); }, [query]);
  const navigate = useNavigate();
  return <form onSubmit={event => { event.preventDefault(); navigate(`/network/discover?q=${encodeURIComponent(text.trim())}`); }} className="flex items-center gap-3 rounded-full border border-identity-border bg-card px-4 py-3"><Search className="h-4 w-4 shrink-0 text-identity-muted"/><input aria-label="Search Network profiles and posts" placeholder={placeholder} maxLength={80} value={text} onChange={event => setText(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-identity-muted"/><button type="submit" className="text-xs font-semibold text-names-accent">Zoeken</button></form>;
}