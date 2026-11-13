import { useLayoutEffect } from 'react';

export default function useMintViewport(open, contentRef) {
  useLayoutEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = contentRef.current;
        if (!node) return;
        node.style.setProperty('--mint-viewport-height', `${viewport?.height || window.innerHeight}px`);
        node.style.setProperty('--mint-viewport-top', `${viewport?.offsetTop || 0}px`);
      });
    };
    update();
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    window.addEventListener('focus', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('focus', update);
    };
  }, [open, contentRef]);
}