import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import presentationNarration from '@/components/solhandle/demos/presentationNarration';
import useCalmBrowserVoice from '@/components/solhandle/demos/useCalmBrowserVoice';
import { SCENE_SECONDS, PRESENTATION_SECONDS } from '@/components/solhandle/demos/presentationTiming';
export default function usePresentationVoice({ open, result, elapsed, paused, slug, mode, rpcUrl }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [enabled, setEnabled] = useState(true), [error, setError] = useState('');
  const pausedRef = useRef(paused), busy = useRef(false); pausedRef.current = paused;
  const { language, t } = useLanguage();
  const { voice, locale, available, description } = useCalmBrowserVoice();
  const active = open && Boolean(result) && elapsed >= 0 && elapsed < PRESENTATION_SECONDS;
  const step = Math.min(3, Math.floor(Math.max(0, elapsed) / SCENE_SECONDS));
  const text = presentationNarration(slug, mode, result, rpcUrl, t)[step];
  useEffect(() => {
    if (!supported || !available || !enabled || !active) return;
    const speech = window.speechSynthesis, utterance = new window.SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || locale; utterance.rate = 0.85; utterance.pitch = 1; utterance.volume = 1;
    let current = true; setError('');
    utterance.onstart = () => { if (pausedRef.current) speech.pause(); };
    utterance.onend = () => { if (current) busy.current = false; };
    utterance.onerror = event => { if (current) { busy.current = false; if (!['canceled', 'interrupted'].includes(event.error)) setError('Voice unavailable or blocked. Switch voice off and on to retry; the presentation can continue silently.'); } };
    speech.cancel(); speech.resume(); busy.current = true; speech.speak(utterance);
    return () => { current = false; busy.current = false; utterance.onstart = null; utterance.onend = null; utterance.onerror = null; speech.cancel(); };
  }, [supported, available, enabled, active, step, text, voice, locale, language]);
  useEffect(() => {
    if (!supported || !available || !enabled || !active) return;
    if (paused) window.speechSynthesis.pause(); else window.speechSynthesis.resume();
  }, [supported, available, enabled, active, paused]);
  return { supported: supported && available, busy, enabled: supported && available && enabled, toggle: () => { setError(''); setEnabled(value => !value); }, message: !supported ? t('This browser does not support voice. Presentation remains available without narration.') : !available ? description : error ? t(error) : enabled ? `${description} · ${t('Include system audio when recording; capture varies by browser.')}` : t('Voice off · Presentation plays silently.') };
}