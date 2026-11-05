import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import MemberPassportWorkspace from '@/components/solhandle/token-identity/MemberPassportWorkspace';
import '@/components/solhandle/token-identity/passport-test.css';
export default function TokenPassport() {
  const session=useWallet(),wallet=session.publicKey?.toBase58()||'';
  return <main className="ep-page passport-test-workspace"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · TOKEN IDENTITY</span><h1>My Token Passports</h1><p>Associate a token address with a handle you own. Sign, submit for administrator review, then choose whether to publish with a separate signature.</p></header>
    <aside className="passport-test-notice"><strong>Limited registration pilot · 20 associations across the review workspace</strong><p>Registrations and notes remain private until you explicitly publish the association. This is a wallet-signed record, not a new NFT or proof of token creation, safety or investment value.</p><Link className="ep-link" to="/token-check">Check a public token association</Link></aside>
    <MemberPassportWorkspace key={wallet||'disconnected'} session={session}/>
  </main>;
}