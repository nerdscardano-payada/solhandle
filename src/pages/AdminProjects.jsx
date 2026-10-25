import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Header from '@/components/solhandle/Header';
import ProjectAdminWorkspace from '@/components/solhandle/network/projects/ProjectAdminWorkspace';

export default function AdminProjects() {
  const { user } = useAuth();
  return <main className="dark min-h-screen bg-hero-canvas text-foreground"><Header/>{user?.role === 'admin' ? <><div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6"><Link to="/admin" className="text-sm text-names-accent underline">Back to administration</Link></div><ProjectAdminWorkspace/></> : <p role="alert" className="p-8">Administrators only.</p>}</main>;
}