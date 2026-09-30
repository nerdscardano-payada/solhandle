import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import AdminHandlePaymentTest from '@/components/solhandle/AdminHandlePaymentTest';
import AdminTokenLookupSetup from '@/components/solhandle/AdminTokenLookupSetup';
import { useAuth } from '@/lib/AuthContext';

export default function AdminMainnetTests() {
  const { user } = useAuth();
  return <main className="dark min-h-screen bg-background text-foreground">
    <div className="mx-auto min-h-screen max-w-7xl border-x border-border">
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-12 md:px-9">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">← Back to Admin</Link>
        <h1 className="mt-6 text-4xl font-semibold">Mainnet Tests</h1>
        {user?.role === 'admin' ? <><AdminTokenLookupSetup /><AdminHandlePaymentTest /></> : <p className="mt-6 text-muted-foreground">Access restricted. Mainnet tests are available to protocol administrators only.</p>}
      </section>
    </div>
  </main>;
}