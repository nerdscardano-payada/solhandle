import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import useAIAdvisor from '@/components/solhandle/ai-advisor/useAIAdvisor';
import AIAdvisorForm from '@/components/solhandle/ai-advisor/AIAdvisorForm';
import AIAdvisorProgress from '@/components/solhandle/ai-advisor/AIAdvisorProgress';
import AIAdvisorReport from '@/components/solhandle/ai-advisor/AIAdvisorReport';
import '@/components/solhandle/ai-advisor/ai-advisor.css';
export default function AIIntegrationAdvisor() {
 const flow=useAIAdvisor(),analysis=flow.query.data?.analysis;
 return <main className="dark ai-advisor bg-hero-canvas text-foreground"><Header/><div className="advisor-content"><header className="advisor-hero"><span className="ep-eyebrow">SOLHANDLE AI INTEGRATION ADVISOR</span><h1>Discover what SolHandle can do for your project.</h1><p>Let AI research your Solana project, identify relevant @handle integrations and prepare a personalized implementation plan.</p><p className="advisor-muted">Public project analysis · No wallet required · Source-linked recommendations</p><nav className="advisor-links" aria-label="Integration resources"><Link to="/developers">Explore SolHandle SDK</Link><Link to="/integrations">View Integration Guides</Link><Link to="/live-integrations">Browse Existing Integrations</Link></nav></header>
 {analysis?<AIAdvisorReport analysis={analysis} onReset={flow.reset}/>:flow.receipt?<AIAdvisorProgress flow={flow}/>:<><AIAdvisorForm flow={flow}/><section><h2>From your project to a practical integration plan</h2><ol><li>Submit a public project website.</li><li>AI researches publicly accessible product information and documentation.</li><li>Review ranked opportunities, evidence and unknowns.</li><li>Follow a project-specific implementation plan with existing SDK examples and security tests to perform.</li></ol><p className="advisor-muted">This initial implementation provides research and reports. Repository access, AI-generated patches, automated tests and official verification are not performed here. Use the existing integration intake for technical review.</p></section></>}
 </div></main>;
}