import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
let loading;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) loading = new Promise((resolve,reject) => { const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.onload = () => resolve(window.turnstile); script.onerror = () => { loading = null; reject(new Error('Anti-spam check could not load. Refresh and try again.')); }; document.head.appendChild(script); });
  return loading;
}
export default function IntakeTurnstile({siteKey,onToken,resetKey}) {
  const { language } = useLanguage();
  const box = useRef(null), callback = useRef(onToken), [error,setError] = useState(''); callback.current = onToken;
  useEffect(() => {
    let active = true, widget;
    loadTurnstile().then(api => { if (active && box.current) widget = api.render(box.current,{sitekey:siteKey,language,action:'integration_intake',theme:'dark',size:'flexible',callback:token => {setError('');callback.current(token);},'expired-callback':() => callback.current(''),'error-callback':() => {callback.current('');setError('Verification failed. Refresh this page and try again.');}}); }).catch(e => {if (active) setError(e.message);});
    return () => { active = false; if (widget !== undefined) window.turnstile?.remove(widget); };
  },[siteKey,resetKey,language]);
  return <div className="min-h-16 min-w-0"><div ref={box}/>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}