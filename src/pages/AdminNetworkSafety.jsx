import { useAuth } from '@/lib/AuthContext';
import SafetyWorkspace from '@/components/solhandle/network/safety/SafetyWorkspace';

export default function AdminNetworkSafety() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <main className="dark min-h-screen bg-hero-canvas text-foreground"><SafetyWorkspace/></main> : <p className="p-8">Administrators only.</p>;
}