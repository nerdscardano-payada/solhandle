import { isAndroidHost } from '@/components/solhandle/android/nativeTransport';
import createNativeWallet from '@/components/solhandle/android/nativeWallet';
if (isAndroidHost()) {
  const wallet = createNativeWallet();
  const register = api => api.register(wallet);
  window.addEventListener('wallet-standard:app-ready', event => register(event.detail));
  window.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', { detail: register }));
}