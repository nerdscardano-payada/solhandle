import { useAuth } from '@/lib/AuthContext';
import HandlePaymentTestPanel from '@/components/solhandle/HandlePaymentTestPanel';
export default function AdminHandlePaymentTest() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || user?.role !== 'admin') return null;
  return <HandlePaymentTestPanel/>;
}