import { z } from 'npm:zod@3.24.2';
export async function advisorHash(value) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join(''); }
export function publicWebsite(value) {
  if (typeof value !== 'string' || value.length > 500) throw new Error('Enter a public HTTPS project website.');
  const u = new URL(value), host = u.hostname.toLowerCase();
  if (u.protocol !== 'https:' || u.username || u.password || u.port || !host.includes('.') || !/^[a-z0-9.-]+$/.test(host) || /^[\d.]+$/.test(host) || /(^|\.)(localhost|local|internal|test|invalid|example|onion)$/.test(host) || host.endsWith('.arpa')) throw new Error('Enter a public HTTPS project website, not a local address.');
  u.hash='';u.search='';return u.toString();
}
const text=z.string().min(1).max(1500), lines=z.array(text).max(12);
const score=z.number().min(0).max(100);
export const advisorReportSchema=z.object({
  project_name:z.string().min(1).max(100), summary:text, audience:text,
  categories:z.array(z.string().max(80)).max(5), technology_stack:lines,
  findings:z.array(z.object({claim:text,certainty:z.enum(['source-supported','inference']),source_indexes:z.array(z.number().int().min(0).max(7)).max(8)})).max(10),
  unknowns:lines, limitations:lines, no_fit_reason:z.string().max(1500),
  sources:z.array(z.object({url:z.string().max(500),title:z.string().max(200),evidence:text})).max(8),
  opportunities:z.array(z.object({
    title:z.string().min(1).max(150),capability:z.enum(['forward','reverse','payments']),existing_feature:text,benefit:text,architecture:text,
    complexity:z.enum(['Low','Medium','High']),confidence:z.enum(['Low','Medium','High']),
    relevance:score,ux:score,feasibility:score,security:score,evidence:score,
    score_explanation:text,source_indexes:z.array(z.number().int().min(0).max(7)).min(1).max(8),
    requirements:lines,steps:lines,security_notes:lines,tests:lines,
    guide:z.enum(['wallet','explorer','marketplace','payments','application','infrastructure'])
  })).max(5),next_actions:lines
}).strict();
export const advisorJsonSchema={type:'object',properties:{
  project_name:{type:'string'},summary:{type:'string'},audience:{type:'string'},categories:{type:'array',items:{type:'string'}},technology_stack:{type:'array',items:{type:'string'}},
  findings:{type:'array',items:{type:'object',properties:{claim:{type:'string'},certainty:{type:'string',enum:['source-supported','inference']},source_indexes:{type:'array',items:{type:'integer'}}},required:['claim','certainty','source_indexes']}},
  unknowns:{type:'array',items:{type:'string'}},limitations:{type:'array',items:{type:'string'}},no_fit_reason:{type:'string'},sources:{type:'array',items:{type:'object',properties:{url:{type:'string'},title:{type:'string'},evidence:{type:'string'}},required:['url','title','evidence']}},
  opportunities:{type:'array',items:{type:'object',properties:{title:{type:'string'},capability:{type:'string',enum:['forward','reverse','payments']},existing_feature:{type:'string'},benefit:{type:'string'},architecture:{type:'string'},complexity:{type:'string',enum:['Low','Medium','High']},confidence:{type:'string',enum:['Low','Medium','High']},relevance:{type:'number'},ux:{type:'number'},feasibility:{type:'number'},security:{type:'number'},evidence:{type:'number'},score_explanation:{type:'string'},source_indexes:{type:'array',items:{type:'integer'}},requirements:{type:'array',items:{type:'string'}},steps:{type:'array',items:{type:'string'}},security_notes:{type:'array',items:{type:'string'}},tests:{type:'array',items:{type:'string'}},guide:{type:'string',enum:['wallet','explorer','marketplace','payments','application','infrastructure']}},required:['title','capability','existing_feature','benefit','architecture','complexity','confidence','relevance','ux','feasibility','security','evidence','score_explanation','source_indexes','requirements','steps','security_notes','tests','guide']}},next_actions:{type:'array',items:{type:'string'}}},required:['project_name','summary','audience','categories','technology_stack','findings','unknowns','limitations','no_fit_reason','sources','opportunities','next_actions']};
export function normalizeAdvisorReport(raw) {
  const report=advisorReportSchema.parse(raw);
  report.sources=report.sources.map(s=>({...s,url:publicWebsite(s.url)}));
  const valid=ids=>ids.filter(i=>i<report.sources.length);
  report.findings=report.findings.map(f=>({...f,source_indexes:valid(f.source_indexes),certainty:valid(f.source_indexes).length?f.certainty:'inference'}));
  report.opportunities=report.opportunities.filter(o=>valid(o.source_indexes).length).map(o=>({...o,source_indexes:valid(o.source_indexes),priority_score:Math.round(o.relevance*.30+o.ux*.25+o.feasibility*.20+o.security*.15+o.evidence*.10),confidence:o.evidence<70&&o.confidence==='High'?'Medium':o.confidence})).sort((a,b)=>b.priority_score-a.priority_score);
  if(!report.sources.length) {report.opportunities=[];report.no_fit_reason=report.no_fit_reason||'Public research did not provide enough evidence to recommend an integration.';}
  return report;
}