import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
import { useCityTransition } from '@/components/solhandle/ecosystem/live/EcosystemCityTransition';
export default function EcosystemPublicHero() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { enter, entering } = useCityTransition();
  const submit = event => { event.preventDefault(); navigate(`/search?q=${encodeURIComponent(search.trim().replace(/^@/, '').toLowerCase())}`); };
  return <section className="ep-public-hero"><Image src={ecosystemAssets.city} alt="Futuristic SolHandle city at sunset" className="ep-public-city" loading="eager" focalPointX={0.72}/>
    <div className="ep-public-copy"><span className="ep-eyebrow">SIMPLE NAMES. BIGGER POSSIBILITIES.</span><h1>Your @handle.<br/>Your identity.<br/><span>Your Solana network.</span></h1><p>A name that is yours. People worth knowing.<br/>A simpler way to connect and pay on Solana.</p><Link className="el-city-entrance" to="/ecosystem" onClick={enter} aria-label="Explore Ecosystem" aria-disabled={entering}><span className="el-city-entrance-marker"><ArrowRight size={24}/></span><span className="el-city-entrance-label">Explore Ecosystem <ArrowRight size={16}/></span></Link><form onSubmit={submit} className="ep-claim-search"><span>@</span><input value={search} onChange={event => setSearch(event.target.value.replace(/^@/, ''))} aria-label="Find your SolHandle" placeholder="Find your name" maxLength={20} required pattern="[a-zA-Z0-9]+" title="Use 1–20 letters or numbers"/><button className="ep-button ep-primary" type="submit"><Search size={17}/><span>Search</span></button></form><small>Find your name → Claim with your wallet → Use your identity</small></div>
  </section>;
}