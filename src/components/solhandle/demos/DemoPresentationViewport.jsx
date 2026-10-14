import { useLayoutEffect, useRef, useState } from 'react';

export default function DemoPresentationViewport({ children }) {
  const viewport = useRef(null), content = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const measure = () => {
      if (!viewport.current || !content.current) return;
      const height = content.current.offsetHeight;
      setScale(window.innerWidth < 768 && height > 0 ? Math.min(1, viewport.current.clientHeight / height) : 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    observer.observe(content.current);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return <div ref={viewport} data-demo-viewport className="min-h-0 overflow-y-auto">
    <div ref={content} data-demo-fit-content style={{ '--demo-scene-scale': scale }}>{children}</div>
  </div>;
}