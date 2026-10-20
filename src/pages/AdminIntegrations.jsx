import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import { useAuth } from '@/lib/AuthContext';
import IntegrationPipeline from '@/components/solhandle/onboarding/IntegrationPipeline';
export default function AdminIntegrations() {
  const {user,isLoadingAuth} = useAuth();
  return <main className="dark min-h-screen bg-background pb-24 text-foreground"><Header/><div className="mx-auto max-w-6xl px-4 py-8"><Link to="/admin" className="mb-6 inline-block text-sm text-names-accent">← Administration</Link>{isLoadingAuth ? <p role="status">Checking access…</p> : user?.role === 'admin' ? <IntegrationPipeline/> : <p role="alert">Administrator access required.</p>}</div></main>;
}