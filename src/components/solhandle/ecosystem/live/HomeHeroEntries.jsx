import { AtSign } from 'lucide-react';
import HomeHeroMint from '@/components/solhandle/ecosystem/live/HomeHeroMint';
import HomeHeroIntegration from '@/components/solhandle/ecosystem/live/HomeHeroIntegration';

export default function HomeHeroEntries() {
  return <div className="el-hero-entries" aria-label="Choose your SolHandle journey">
    <section className="el-hero-entry" aria-labelledby="hero-handle-heading">
      <div className="el-hero-entry-audience"><AtSign size={18}/><span>FOR USERS</span></div>
      <h2 id="hero-handle-heading">Find your @handle</h2>
      <p>Claim your name. Connect and pay on Solana.</p>
      <div className="el-hero-entry-context">One name. Your Solana identity.</div>
      <HomeHeroMint/>
      <small>Find your name → Claim with your wallet → Use your identity</small>
    </section>
    <HomeHeroIntegration/>
  </div>;
}