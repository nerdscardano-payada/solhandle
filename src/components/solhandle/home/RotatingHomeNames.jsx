import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import invokeWithRetry from '@/lib/invokeWithRetry';
import RotatingHomeName from '@/components/solhandle/home/RotatingHomeName';

export default function RotatingHomeNames() {
  const [offset, setOffset] = useState(() => Math.floor(Math.random() * 1000));
  const { data: names = [], isPending, isError } = useQuery({
    queryKey: ['home-rotating-names'],
    queryFn: async () => (await invokeWithRetry('getRecentHandles', { namePool: true })).data.names || [],
    staleTime: 60000,
    refetchInterval: 60000
  });
  useEffect(() => {
    if (names.length <= 5) return;
    const timer = window.setInterval(() => setOffset(value => value + 1), 12000);
    return () => window.clearInterval(timer);
  }, [names.length]);
  const select = handle => {
    document.getElementById('search-handles')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.dispatchEvent(new CustomEvent('solhandle:home-select', { detail: { handle } }));
  };
  if (isPending) return <div className="home-live-list" aria-label="Loading names">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-10 animate-pulse rounded-xl bg-names-accent/5"/>)}</div>;
  if (isError) return <p className="mt-4 text-xs text-foreground/70">Live names are temporarily unavailable.</p>;
  if (!names.length) return <p className="mt-4 text-xs text-foreground/70">New names will appear here soon.</p>;
  return <div className="home-live-list">{Array.from({ length: Math.min(5, names.length) }, (_, index) => names[(offset + index) % names.length]).map(handle => <RotatingHomeName key={handle} handle={handle} onSelect={select}/>)}</div>;
}