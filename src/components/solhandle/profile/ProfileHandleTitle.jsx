import { useLayoutEffect, useRef, useState } from 'react';

export default function ProfileHandleTitle({ handle }) {
  const container = useRef(null);
  const title = useRef(null);
  const [fontSize, setFontSize] = useState(44);
  useLayoutEffect(() => {
    const fit = () => {
      if (!container.current || !title.current) return;
      const baseSize = window.matchMedia('(max-width: 767px)').matches ? 28 : 44;
      title.current.style.fontSize = `${baseSize}px`;
      const width = title.current.getBoundingClientRect().width;
      const available = container.current.clientWidth;
      const size = width > 0 ? Math.min(baseSize, Math.floor(baseSize * available / width)) : baseSize;
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