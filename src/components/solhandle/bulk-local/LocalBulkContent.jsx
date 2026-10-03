import LocalBulkWallet from '@/components/solhandle/bulk-local/LocalBulkWallet';
import LocalBulkCart from '@/components/solhandle/bulk-local/LocalBulkCart';
import LocalBulkCheckout from '@/components/solhandle/bulk-local/LocalBulkCheckout';
import useLocalBulkOrder from '@/components/solhandle/bulk-local/useLocalBulkOrder';
export default function LocalBulkContent() {
  const checkout = useLocalBulkOrder();
  return <><LocalBulkWallet locked={checkout.busy}/>{checkout.order ? <LocalBulkCheckout checkout={checkout}/> : <LocalBulkCart checkout={checkout}/>}</>;
}