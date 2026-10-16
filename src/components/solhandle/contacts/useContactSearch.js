import { useEffect, useState } from 'react';
export default function useContactSearch() {
  const [search, setSearch] = useState(''), [term, setTerm] = useState('');
  useEffect(() => { const timer = setTimeout(() => setTerm(search.trim()), 300); return () => clearTimeout(timer); }, [search]);
  return { search, setSearch, term };
}