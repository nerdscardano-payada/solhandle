import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import MemberPassportWorkspace from '@/components/solhandle/token-identity/MemberPassportWorkspace';
import '@/components/solhandle/token-identity/passport-test.css';
export default function TokenPassport() {
  const session=useWallet(),wallet=session.publicKey?.toBase58()||'';
  return <main className="ep-page passport-test-workspace"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · TOKEN IDENTITY</span><h1>My Token Passports</h1><p>Associate a token address with a handle you own. Sign, submit for administrator review, then choose whether to publish with a separate signature.</p></header>
    <aside className="passport-test-notice"><strong>Your wallet. Your association. Your publication choice.</strong><p>There is no pilot registration limit. Your note and review history remain private. Publishing the association requires approval and a separate wallet signature. This is a wallet-signed record, not a new NFT or proof of token creation, safety or investment value.</p><Link className="ep-link" to="/token-check">Check a public token association</Link></aside>
    <MemberPassportWorkspace key={wallet||'disconnected'} session={session}/>
  </main>;
}