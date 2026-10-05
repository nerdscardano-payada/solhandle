import { useEffect, useRef } from 'react';

export default function useWidgetAutoHeight() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.parent === window) return;
    let lastHeight = 0;
    const report = () => {
      const height = Math.ceil(element.getBoundingClientRect().height);
      if (height > 0 && height !== lastHeight) {
        lastHeight = height;
        window.parent.postMessage({ type: 'solhandle:resize', height }, '*');
      }
    };
    const observer = new ResizeObserver(report);
    observer.observe(element);
    const receive = event => {
      if (event.source === window.parent && event.data?.type === 'solhandle:measure') {
        lastHeight = 0;
        report();
      }
    };
    window.addEventListener('message', receive);
    report();
    return () => {
      observer.disconnect();
      window.removeEventListener('message', receive);
    };
  }, []);
  return ref;
}