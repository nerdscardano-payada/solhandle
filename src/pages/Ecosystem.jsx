import { Link } from 'react-router-dom';
import { ContactRound, ArrowUpRight, LockKeyhole } from 'lucide-react';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import EcosystemLiveIdentity from '@/components/solhandle/ecosystem/live/EcosystemLiveIdentity';
import EcosystemLiveSummary from '@/components/solhandle/ecosystem/live/EcosystemLiveSummary';
import EcosystemLiveProjects from '@/components/solhandle/ecosystem/live/EcosystemLiveProjects';
import EcosystemLiveActions from '@/components/solhandle/ecosystem/live/EcosystemLiveActions';
export default function Ecosystem() {
  const state = useProfileIdentity();
  const primary = !state.error && state.identity?.address === state.address ? state.identity?.primaryHandle : null;
  return <main className="ep-dashboard el-dashboard"><div className="ep-dashboard-main"><header className="ep-welcome"><div><p className="ep-eyebrow">YOUR SOLANA, CONNECTED.</p><h1>{primary ? `Welcome, ${primary}.` : 'Make yourself at home.'}</h1><p>One identity. A world of possibilities.</p></div></header><EcosystemLiveSummary state={state}/><EcosystemLiveIdentity state={state}/><div className="el-mobile-actions"><EcosystemLiveActions/></div><div className="ep-dashboard-lower"><EcosystemLiveProjects compact/><section className="ep-card el-contacts-intro"><div className="ep-card-heading"><h2><ContactRound size={19}/>Your Contacts</h2></div><LockKeyhole size={30}/><h3>Your people. Your private space.</h3><p>Open your wallet-linked address book to view and manage saved contacts. A saved recipient stays tied to the wallet you chose, even if a handle changes owner.</p><Link to="/contacts" className="ep-button">Open private contacts <ArrowUpRight size={15}/></Link><p className="ep-small">No public follows or automatic social connections.</p></section></div></div></main>;
}