import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import presentationVoiceLocales from '@/components/solhandle/demos/presentationVoiceLocales';
export default function useCalmBrowserVoice() {
  const { language, t } = useLanguage();
  const locale = presentationVoiceLocales[language] || presentationVoiceLocales.en;
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const speech = window.speechSynthesis;
    const load = () => setVoices(speech.getVoices());
    load(); speech.addEventListener('voiceschanged', load);
    return () => speech.removeEventListener('voiceschanged', load);
  }, []);
  const matching = voices.filter(voice => voice.lang.toLowerCase().split(/[-_]/)[0] === language);
  const male = matching.filter(voice => /\b(David|Mark|Guy|Ryan|Christopher|Eric|Roger|Thomas|James|George|Daniel|Alex|Fred|Oliver|Arthur|Brian|Andrew|Steffan|Justin|Joey|Matthew|Frank|Bram|Maarten|Ruben|Bart|Alvaro|Jorge|Pablo|Andres|Antonio|Duarte|Keita|Ichiro|Takumi|Conrad|Stefan|Hans|Henri|Paul|Ahmet|Diego|Cosimo|Luca|NamMinh|InJoon|Hyunsu)\b/i.test(voice.name));
  const score = voice => (/Natural|Enhanced|Premium/i.test(voice.name) ? 100 : 0) + (voice.lang.toLowerCase() === locale.toLowerCase() ? 10 : 0) + (voice.localService ? 5 : 0);
  const voice = [...(male.length ? male : matching)].sort((a, b) => score(b) - score(a))[0];
  return { voice, locale, available: Boolean(voice), description: voice ? `${t(male.length ? 'Calm male voice' : 'Calm voice')} · ${voice.name}` : t('No matching voice is installed for this language. The presentation continues without narration.') };
}