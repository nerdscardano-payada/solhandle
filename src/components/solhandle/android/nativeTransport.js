export const isAndroidHost = () => typeof window !== 'undefined' && Boolean(window.SolHandleNative?.postMessage) && /SolHandleAndroid\//.test(navigator.userAgent);
export const toBase64 = bytes => btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
export const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
const pending = new Map();
let attached = false;
export default function nativeTransport(method, params = {}) {
  if (!isAndroidHost()) return Promise.reject(new Error('The Android wallet bridge is unavailable.'));
  if (!attached) {
    window.SolHandleNative.onmessage = event => {
      const message = JSON.parse(event.data);
      const request = pending.get(message.id);
      if (!request) return;
      clearTimeout(request.timer); pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error)); else request.resolve(message.result);
    };
    attached = true;
  }
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('The wallet did not respond. Return to SolHandle and review before retrying.')); }, 180000);
    pending.set(id, { resolve, reject, timer });
    window.SolHandleNative.postMessage(JSON.stringify({ id, method, ...params }));
  });
}