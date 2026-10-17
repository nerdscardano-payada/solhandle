import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { validateHandle } from '@/lib/solhandle';

export default function useMobileSearchSubmit(handle, result, onCheck) {
  const isMobile = useIsMobile();
  const resultsRef = useRef(null);
  const [submitted, setSubmitted] = useState('');
  const submit = event => {
    event.preventDefault();
    if (validateHandle(handle)) return;
    if (isMobile) {
      event.currentTarget.querySelector('input')?.blur();
      setSubmitted(handle);
    }
    onCheck();
  };
  useEffect(() => {
    if (!submitted) return;
    if (!isMobile || submitted !== handle) { setSubmitted(''); return; }
    if (result?.handle !== submitted || result?.state === 'checking') return;
    let timer;
    const viewport = window.visualViewport;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        setSubmitted('');
      }, 250);
    };
    viewport?.addEventListener('resize', schedule);
    schedule();
    return () => { clearTimeout(timer); viewport?.removeEventListener('resize', schedule); };
  }, [submitted, isMobile, handle, result]);
  return { submit, resultsRef };
}