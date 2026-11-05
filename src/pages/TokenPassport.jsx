import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import MemberPassportWorkspace from '@/components/solhandle/token-identity/MemberPassportWorkspace';
import '@/components/solhandle/token-identity/passport-test.css';
export default function TokenPassport() {
  const session=useWallet(),wallet=session.publicKey?.toBase58()||'';
  return <main className="ep-page passport-test-workspace"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE · TOKEN IDENTITY</span><h1>My Project Passports</h1><p>Connect your wallet → choose your token and @handle → provide project evidence and sign → appear in Discover after verification.</p></header>
    <aside className="passport-test-notice"><strong>For token creators and project representatives, not token holders.</strong><p>We manually review evidence that you represent the project. Your application signature includes permission to publish after approval, so there is no second publication step. Wallet access uses a separate security signature. Your evidence link, note and review history stay private; publication can be withdrawn. This is not a new NFT or a token safety endorsement.</p><Link className="ep-link" to="/discover?tab=passports">Explore project passports</Link></aside>
    <MemberPassportWorkspace key={wallet||'disconnected'} session={session}/>
  </main>;
}