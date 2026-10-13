import { useEffect, useState } from 'react';
export default function useCalmBrowserVoice() {
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const speech = window.speechSynthesis;
    const load = () => setVoices(speech.getVoices().filter(voice => /^en(?:-|$)/i.test(voice.lang)));
    load(); speech.addEventListener('voiceschanged', load);
    return () => speech.removeEventListener('voiceschanged', load);
  }, []);
  const male = voices.filter(voice => /\b(David|Mark|Guy|Ryan|Christopher|Eric|Roger|Thomas|James|George|Daniel|Alex|Fred|Oliver|Arthur|Brian|Andrew|Steffan|Justin|Joey|Matthew)\b/i.test(voice.name));
  const score = voice => (/Natural|Enhanced|Premium/i.test(voice.name) ? 100 : 0) + (/^en-GB/i.test(voice.lang) ? 10 : 0) + (voice.localService ? 5 : 0);
  const voice = male.sort((a, b) => score(b) - score(a))[0] || voices.find(item => item.default) || voices[0];
  return { voice, description: male.length ? `Calm male voice · ${voice.name}` : voices.length ? `Calm voice · ${voice.name} · No recognized male English voice available on this device.` : 'Calm English voice · Device voice availability determines the speaker.' };
}