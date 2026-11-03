import { Link } from 'react-router-dom';
import AIAdvisorCode from '@/components/solhandle/ai-advisor/AIAdvisorCode';
export default function AIAdvisorOpportunity({ item:o, sources }) {
 return <details className="advisor-opportunity"><summary><span>{o.title}</span><span className="mt-2 block text-sm font-normal text-identity-muted">{o.benefit}</span><small>{o.priority_score}/100 · {o.complexity} complexity · {o.confidence} confidence</small></summary>
 <p><strong>Where this fits:</strong> {o.existing_feature}</p><h4>How it works</h4><p>{o.architecture}</p>
 <h4>Why this ranking?</h4><p>{o.score_explanation}</p><p className="advisor-muted">Relevance {o.relevance} × 30% · UX {o.ux} × 25% · Feasibility {o.feasibility} × 20% · Security {o.security} × 15% · Evidence {o.evidence} × 10%</p>
 <h4>Before you start</h4><ul>{o.requirements.map((v,i)=><li key={i}>{v}</li>)}</ul><h4>What to build, step by step</h4><ol>{o.steps.map((v,i)=><li key={i}>{v}</li>)}</ol>
 <h4>Keep it safe</h4><ul>{o.security_notes.map((v,i)=><li key={i}>{v}</li>)}</ul><h4>Check that it works · tests not yet run</h4><ul>{o.tests.map((v,i)=><li key={i}>{v}</li>)}</ul>
 <p>Supporting references: {o.source_indexes.map(i=><a key={i} href={sources[i].url} target="_blank" rel="noopener noreferrer nofollow">[{i+1}] {sources[i].title} </a>)}</p>
 <AIAdvisorCode capability={o.capability}/><Link className="ep-link" to={`/integrations/${o.guide}`}>Open the existing product integration guide →</Link></details>;
}