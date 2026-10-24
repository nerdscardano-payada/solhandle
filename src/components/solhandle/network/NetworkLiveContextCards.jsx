import { Link } from 'react-router-dom';
import { Fingerprint, ArrowUpRight } from 'lucide-react';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import HandleCard from '@/components/solhandle/HandleCard';
import LiveHeroPay from '@/components/solhandle/home/LiveHeroPay';

export default function NetworkLiveContextCards() {
  const { identity, loading, error } = useProfileIdentity();
  const handle = !error && identity?.primaryHandle ? `@${identity.primaryHandle.replace(/^@/, '')}` : '';
  return <><div className="sd-ecosystem"><article className="sd-eco-card sd-eco-identity"><div className="sd-card-label"><Fingerprint size={17}/><span>Identity</span>{handle && <span className="sd-tiny-pill">Primary</span>}</div>{handle && <div className="live-context-handle-art"><HandleCard handle={handle.replace(/^@/, '')}/></div>}<div className="sd-handle-orbit"><Fingerprint size={38}/></div><strong className="sd-handle" data-no-translate>{loading ? 'Checking…' : handle || 'Your @handle'}</strong><small>{error ? 'Identity could not be verified.' : 'One name. All yours.'}</small><Link to="/my-handles" className="sd-text-button">My handles <ArrowUpRight size={14}/></Link></article><LiveHeroPay network/></div><div className="sd-discovery"><span className="sd-eyebrow">MAKE CONNECTIONS</span><h3>Built to move forward together.</h3><p>Discover people and projects that expand your world.</p><Link to="/network/discover" className="sd-text-button">View your network <ArrowUpRight size={15}/></Link></div></>;
}