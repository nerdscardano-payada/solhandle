import { Link } from 'react-router-dom';
import { useState } from 'react';
import DiscoverSubmissionReview from '@/components/solhandle/discover/DiscoverSubmissionReview';
import '@/components/solhandle/discover/discover.css';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, ListChecks, Inbox } from 'lucide-react';
import '@/components/solhandle/admin/ecosystem-admin.css';
import ProjectAdminWorkspace from '@/components/solhandle/network/projects/ProjectAdminWorkspace';

export default function AdminProjects() {
  const { user } = useAuth();
  const [tab,setTab] = useState('LISTINGS'), [initialListing,setInitialListing] = useState(null);
  return <main className="ep-page el-admin">{user?.role === 'admin' ? <><Link className="ep-link" to="/admin"><ArrowLeft size={16}/>Back to administration</Link><header className="ep-page-heading"><span className="ep-eyebrow">ECOSYSTEM ADMINISTRATION</span><h1>Discover management</h1><p>Curate Projects, Builders and People. Review submissions privately and publish only when ready.</p></header><div className="ep-notice"><ListChecks size={19}/><span>Approve a submission to create a draft or link an existing listing. Publish separately, then review integration and handle ranking benefits when applicable.</span></div><div className="discover-tabs" aria-label="Discover management sections"><button aria-pressed={tab === 'LISTINGS'} onClick={() => { setInitialListing(null); setTab('LISTINGS'); }}><ListChecks size={17}/>Directory listings</button><button aria-pressed={tab === 'SUBMISSIONS'} onClick={() => setTab('SUBMISSIONS')}><Inbox size={17}/>Submissions</button></div>{tab === 'LISTINGS' ? <ProjectAdminWorkspace key={initialListing?.id || 'directory'} initialListing={initialListing}/> : <DiscoverSubmissionReview onEditListing={listing => { setInitialListing(listing); setTab('LISTINGS'); }}/>}</> : <p role="alert">Administrators only.</p>}</main>;
}