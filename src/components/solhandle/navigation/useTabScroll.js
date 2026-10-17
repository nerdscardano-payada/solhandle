import { useEffect, useLayoutEffect, useRef } from 'react';

export default function useTabScroll(ticket, enabled, active) {
  const restoring = useRef(false);
  const surface = () => document.querySelector('[data-mobile-tab-active="true"]') || document;
  const save = () => {
    if (!enabled || restoring.current || !active.current) return;
    active.current.scroll = { x: window.scrollX, y: window.scrollY, panels: [...surface().querySelectorAll('[data-mobile-scroll-panel]')].map(node => [node.scrollLeft, node.scrollTop]) };
  };
  useEffect(() => {
    if (!enabled) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.addEventListener('scroll', save, true);
    return () => { document.removeEventListener('scroll', save, true); window.history.scrollRestoration = previous; };
  }, [enabled]);
  useLayoutEffect(() => {
    if (!enabled || !ticket) return;
    restoring.current = true;
    const position = ticket.entry.scroll || { x: 0, y: 0, panels: [] };
    let frame, timer, count = 0, stopped = false;
    const observer = new ResizeObserver(() => { if (!stopped) { cancelAnimationFrame(frame); frame = requestAnimationFrame(restore); } });
    const stop = () => { stopped = true; cancelAnimationFrame(frame); clearTimeout(timer); observer.disconnect(); restoring.current = false; };
    const restore = () => {
      const hash = ticket.entry.url.split('#')[1];
      let id = hash;
      try { if (hash) id = decodeURIComponent(hash); } catch { /* Preserve malformed fragments as literal IDs. */ }
      const anchor = id && surface().querySelector(`#${CSS.escape(id)}`);
      if (anchor && !ticket.entry.scroll) anchor.scrollIntoView();
      else window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
      surface().querySelectorAll('[data-mobile-scroll-panel]').forEach((node, index) => { const point = position.panels[index]; if (point) node.scrollTo({ left: point[0], top: point[1], behavior: 'instant' }); });
      if (++count < 36 && !stopped) frame = requestAnimationFrame(restore);
    };
    observer.observe(document.body);
    timer = setTimeout(stop, 8000);
    frame = requestAnimationFrame(restore);
    window.addEventListener('touchstart', stop, { passive: true, once: true });
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('keydown', stop, { once: true });
    return () => { stop(); window.removeEventListener('touchstart', stop); window.removeEventListener('wheel', stop); window.removeEventListener('keydown', stop); };
  }, [ticket, enabled]);
  return save;
}