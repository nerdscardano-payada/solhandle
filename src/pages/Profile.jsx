import { Fingerprint, ShieldCheck } from 'lucide-react';
import Header from '@/components/solhandle/Header';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import IdentityCard from '@/components/solhandle/profile/IdentityCard';
import IdentityDetails from '@/components/solhandle/profile/IdentityDetails';
import IdentityEmpty from '@/components/solhandle/profile/IdentityEmpty';
import '@/components/solhandle/profile/profile.css';

export default function Profile() {
  const state = useProfileIdentity();
  const identity = state.error ? null : state.identity;
  return <main className="identity-page"><Header/>
    <div className="identity-layout">
      <section className="identity-hero"><div className="identity-orbit" aria-hidden="true"/><div className="identity-hero-content"><span className="identity-eyebrow"><Fingerprint size={15}/> SOLHANDLE IDENTITY</span><h1>Not just an address.<br/><span>Your identity.</span></h1><p>Your wallet, your @handle, one unmistakable identity on Solana.</p></div><div className="identity-hero-signature" aria-hidden="true">YOUR IDENTITY.<br/>YOUR WALLET.<br/>YOUR WORLD.<span>SOLHANDLE / SOLANA</span></div></section>
      <div className="identity-section-heading"><div><span className="identity-eyebrow">MY PROFILE</span><h2>Your identity, at a glance.</h2></div><span className="identity-self-custody"><ShieldCheck size={16}/> Always self-custodial</span></div>
      <div className="identity-grid">{identity ? <IdentityCard identity={identity}/> : <IdentityEmpty {...state}/>} {state.address ? <IdentityDetails {...state} identity={identity}/> : <aside className="identity-explainer"><span className="identity-eyebrow">BUILT AROUND YOU</span><h2>A name people remember.<br/>A wallet you control.</h2><p>Your primary @handle is read from the official SolHandle protocol, not typed into a profile. When ownership can be verified, your identity card appears here.</p><div><ShieldCheck size={20}/><p>No seed phrase. No new wallet.<br/>Your keys stay with you.</p></div></aside>}</div>
      <p className="identity-footnote">SOLHANDLE IDENTITY <span>•</span> On-chain handle ownership, not personal identity verification.</p>
    </div>
  </main>;
}