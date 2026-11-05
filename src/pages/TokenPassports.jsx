import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import PassportPolicy from '@/components/solhandle/passports/PassportPolicy';
import PassportForm from '@/components/solhandle/passports/PassportForm';
import { passportRequest, passportError } from '@/components/solhandle/passports/passportClient';
import '@/components/solhandle/passports/passports.css';
export default function TokenPassports() {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['token-passport-config'], queryFn: () => passportRequest({ action: 'config' }), retry: false });
  return <main className="tp-page" lang="nl"><header className="tp-panel"><span className="text-sm font-semibold tracking-widest text-names-accent">SOLHANDLE · GRATIS PILOT</span><h1 className="text-4xl font-semibold tracking-tight">Een identiteit voor je token.<br/>Geen veiligheidskeurmerk.</h1><p>Koppel één Solana-token aan je @handle met een wallet-handtekening en controleerbare on-chain gegevens.</p><div className="flex flex-wrap gap-4"><a href="#passport-start" className="ep-button">Start je Token Passport</a><Link to="/discover" className="ep-button">Discover</Link>{user?.role === 'admin' && <Link to="/admin/token-passports" className="ep-button">Pilot beheren</Link>}</div></header><PassportPolicy/>{query.isPending ? <p role="status">Pilot laden…</p> : query.isError ? <section className="tp-panel" role="alert"><p>{passportError(query.error)}</p><button className="ep-button" onClick={() => query.refetch()}>Opnieuw laden</button></section> : <PassportForm config={query.data}/>}<p>Vier weken · Eerste 20 geschikte starters · Doel: 12 voltooide Passports. Een wallet is geen bewijs van een echte persoon. Registratie is geen veiligheidskeurmerk, beleggingsadvies of goedkeuring.</p></main>;
}