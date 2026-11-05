import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { Image } from '@/components/ui/image';
import ProjectPassportShare from '@/components/solhandle/token-identity/ProjectPassportShare';
import ProjectPassportFacts from '@/components/solhandle/token-identity/ProjectPassportFacts';
const states={ACTIVE:['Ownership confirmed','The signing wallet owns the official handle at the time shown below.'],OWNERSHIP_CHANGED:['Ownership changed','The published association no longer matches current handle ownership.'],WITHDRAWN:['Passport withdrawn','This passport is no longer an active project association.'],UNAVAILABLE:['Ownership not confirmed','The blockchain check is temporarily unavailable. A previous confirmation is not a current confirmation.'],NOT_TOKEN:['Token not confirmed','The address is not currently confirmed as a supported Solana token.']};
export default function PublicProjectPassportCard({passport,result}) {
  const [failed,setFailed]=useState(false);
  const [status,description]=states[result.status]||states.UNAVAILABLE;
  const website=passport.project_website?.startsWith('https://')?passport.project_website:null;
  return <article className="project-passport-document">
    <header className="project-passport-band"><span><Fingerprint size={22}/>SOLHANDLE</span><span>PROJECT PASSPORT · SOLANA MAINNET</span></header>
    <div className="project-passport-body">
      <div className="project-passport-hero"><div className="project-passport-heading"><div className="project-passport-logo">{passport.token_logo&&!failed?<Image src={passport.token_logo} alt={`${passport.token_name||'Token'} logo`} fittingType="fit" className="h-full w-full" onError={()=>setFailed(true)}/>:<span>{(passport.token_symbol||passport.token_name||'T').slice(0,2).toUpperCase()}</span>}</div><div className="min-w-0"><p className="ep-eyebrow">PROJECT IDENTITY</p><h1>{passport.token_name||'Project passport'}</h1><p className="text-ecosystem-muted">{passport.token_symbol?'$'+passport.token_symbol.replace(/^\$/,''):'Solana token'}</p><Link className="ep-link" to={`/profile/${passport.handle}`}>@{passport.handle}</Link></div></div><a className="project-passport-artwork" href={`https://core.metaplex.com/explorer/${passport.assetAddress}`} target="_blank" rel="noopener noreferrer">{passport.mintImage?<Image src={passport.mintImage} alt={`Official minted NFT for @${passport.handle}`} fittingType="fit" className="aspect-square w-full"/>:<span className="aspect-square flex items-center justify-center text-sm text-ecosystem-muted">NFT image unavailable</span>}<span>Official @{passport.handle} NFT</span></a></div>
      <section className="project-passport-status" data-status={result.status}><strong>{status}</strong><p>{description}</p></section>
      <section className="project-passport-review"><h2><ShieldCheck size={20}/>{result.status==='WITHDRAWN'?'Project review on record':'Project representation reviewed'}</h2><p>SolHandle manually reviewed evidence that the submitting representative was associated with this project. This review does not certify token safety or investment value.</p>{website&&<a className="ep-link break-all" href={website} target="_blank" rel="noopener noreferrer">{website}</a>}</section>
      <div className="project-passport-actions"><ProjectPassportShare name={passport.token_name||'Project'}/><Link className="ep-button" to={`/profile/${passport.handle}`}>View @{passport.handle}</Link></div>
      <ProjectPassportFacts passport={passport} result={result}/>
      <footer className="text-sm text-ecosystem-muted">This passport records a wallet-signed project identity association, not proof of token creation, a security audit or an endorsement. Ownership checks are snapshots in time{result.cached?' and may be cached for up to 30 seconds':''}. Always verify the full token address independently.</footer>
    </div>
  </article>;
}