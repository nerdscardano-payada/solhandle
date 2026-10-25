import { Link } from 'react-router-dom';
import { useState } from 'react';
import DiscoverSubmissionReview from '@/components/solhandle/discover/DiscoverSubmissionReview';
import '@/components/solhandle/discover/discover.css';
import { useAuth } from '@/lib/AuthContext';
import Header from '@/components/solhandle/Header';
import ProjectAdminWorkspace from '@/components/solhandle/network/projects/ProjectAdminWorkspace';

export default function AdminProjects() {
  const { user } = useAuth();
  const [tab,setTab] = useState('LISTINGS'), [initialListing,setInitialListing] = useState(null);
  return <main className="ep-page"><Header/>{user?.role === 'admin' ? <><Link className="ep-link" to="/admin">Back to administration</Link><header className="ep-page-heading"><h1>Discover management</h1><p>Curate Projects, Builders and People. Review submissions privately and publish only when ready.</p></header><div className="discover-tabs"><button aria-pressed={tab === 'LISTINGS'} onClick={() => { setInitialListing(null); setTab('LISTINGS'); }}>Directory listings</button><button aria-pressed={tab === 'SUBMISSIONS'} onClick={() => setTab('SUBMISSIONS')}>Submissions</button></div>{tab === 'LISTINGS' ? <ProjectAdminWorkspace key={initialListing?.id || 'directory'} initialListing={initialListing}/> : <DiscoverSubmissionReview onEditListing={listing => { setInitialListing(listing); setTab('LISTINGS'); }}/>}</> : <p role="alert">Administrators only.</p>}</main>;
}