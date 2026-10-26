import { useLayoutEffect, useRef, useState } from 'react';

export default function ProfileHandleTitle({ handle }) {
  const container = useRef(null);
  const title = useRef(null);
  const [fontSize, setFontSize] = useState(44);
  useLayoutEffect(() => {
    const fit = () => {
      if (!container.current || !title.current) return;
      title.current.style.fontSize = '44px';
      const width = title.current.getBoundingClientRect().width;
      const available = container.current.clientWidth;
      const size = width > 0 ? Math.min(44, Math.floor(44 * available / width)) : 44;
      title.current.style.fontSize = `${size}px`;
      setFontSize(size);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(container.current);
    fit();
    document.fonts.ready.then(() => { if (container.current) fit(); });
    return () => observer.disconnect();
  }, [handle]);
  return <div ref={container} className="public-profile-handle-title"><h1 ref={title} style={{ fontSize }}>@{handle}</h1></div>;
}