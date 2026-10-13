import { useEffect, useRef, useState } from 'react';
import presentationNarration from '@/components/solhandle/demos/presentationNarration';
export default function usePresentationVoice({ open, result, elapsed, paused, slug, mode, rpcUrl }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [enabled, setEnabled] = useState(true), [error, setError] = useState('');
  const pausedRef = useRef(paused); pausedRef.current = paused;
  const active = open && Boolean(result) && elapsed >= 0 && elapsed < 24;
  const step = Math.min(3, Math.floor(Math.max(0, elapsed) / 6));
  const text = presentationNarration(slug, mode, result, rpcUrl)[step];
  useEffect(() => {
    if (!supported || !enabled || !active) return;
    const speech = window.speechSynthesis, utterance = new window.SpeechSynthesisUtterance(text);
    const voices = speech.getVoices().filter(voice => /^en(?:-|$)/i.test(voice.lang));
    const voice = voices.find(item => item.localService && item.default) || voices.find(item => item.localService) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-US'; utterance.rate = 1.12; utterance.volume = 1;
    let current = true; setError('');
    utterance.onstart = () => { if (pausedRef.current) speech.pause(); };
    utterance.onerror = event => { if (current && !['canceled', 'interrupted'].includes(event.error)) setError('Voice unavailable or blocked. Switch voice off and on to retry; the presentation can continue silently.'); };
    speech.cancel(); speech.resume(); speech.speak(utterance);
    return () => { current = false; utterance.onstart = null; utterance.onerror = null; speech.cancel(); };
  }, [supported, enabled, active, step, text]);
  useEffect(() => {
    if (!supported || !enabled || !active) return;
    if (paused) window.speechSynthesis.pause(); else window.speechSynthesis.resume();
  }, [supported, enabled, active, paused]);
  return { supported, enabled: supported && enabled, toggle: () => { setError(''); setEnabled(value => !value); }, message: !supported ? 'This browser does not support voice. Presentation remains available without narration.' : error || (enabled ? 'English browser voice · Include system audio when recording; capture varies by browser.' : 'Voice off · Presentation plays silently.') };
}