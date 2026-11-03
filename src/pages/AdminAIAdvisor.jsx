import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import AdminOperationsNavigation from '@/components/solhandle/admin/AdminOperationsNavigation';
import useAdvisorAdmin from '@/components/solhandle/ai-advisor/admin/useAdvisorAdmin';
import AdvisorAdminMetrics from '@/components/solhandle/ai-advisor/admin/AdvisorAdminMetrics';
import AdvisorAdminRequests from '@/components/solhandle/ai-advisor/admin/AdvisorAdminRequests';
import AdvisorAdminDetail from '@/components/solhandle/ai-advisor/admin/AdvisorAdminDetail';
import '@/components/solhandle/ai-advisor/ai-advisor.css';
import '@/components/solhandle/ai-advisor/admin/advisor-admin.css';
export default function AdminAIAdvisor(){
 const flow=useAdvisorAdmin();
 useEffect(()=>{if(flow.selected)document.getElementById('advisor-admin-detail')?.scrollIntoView({block:'start'});},[flow.selected]);
 return <main className="advisor-admin"><Link className="ep-small" to="/admin">← Administration</Link><header className="advisor-admin-toolbar"><div><span className="ep-eyebrow">AI ADVISOR · ADMIN</span><h1>Aanvragen, rapporten en AI-toelichting</h1><p className="ep-small">Bekijk het onderzoek, de onderbouwing en geregistreerde fouten. Alleen toegankelijk voor admins.</p></div><button className="ep-button" disabled={flow.requests.isFetching||flow.metrics.isFetching||flow.detail.isFetching} onClick={flow.refresh}><RefreshCw size={17} className={flow.requests.isFetching?'animate-spin':''}/>Vernieuwen</button></header><AdminOperationsNavigation/><AdvisorAdminMetrics query={flow.metrics}/><AdvisorAdminRequests flow={flow}/><AdvisorAdminDetail flow={flow}/></main>;
}