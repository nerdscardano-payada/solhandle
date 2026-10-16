import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { blockedTouch, PULL_THRESHOLD, scrollOwner } from '@/hooks/pullGesture';

export default function usePullToRefresh(onRefresh, enabled = true) {
  const mobile = useIsMobile(), ref = useRef(null), callback = useRef(onRefresh), locked = useRef(false);
  callback.current = onRefresh;
  const [refreshing, setRefreshing] = useState(false), [distance, setDistance] = useState(0);
  useEffect(() => {
    const panel = ref.current;
    if (!mobile || !enabled || !panel) { setDistance(0); return; }
    let origin = null, pulled = 0, alive = true;
    const cancel = () => { origin = null; pulled = 0; if (alive) setDistance(0); };
    const start = event => {
      cancel();
      if (locked.current || event.touches.length !== 1 || blockedTouch(event.target)) return;
      const owner = scrollOwner(event.target, panel), touch = event.touches[0];
      if (owner && owner.scrollTop <= 0) origin = { x: touch.clientX, y: touch.clientY, owner };
    };
    const move = event => {
      if (!origin) return;
      if (event.touches.length !== 1 || origin.owner.scrollTop > 0) return cancel();
      const dy = event.touches[0].clientY - origin.y, dx = Math.abs(event.touches[0].clientX - origin.x);
      if (dx > 12 && dx > Math.abs(dy)) return cancel();
      if (dy <= 0) return cancel();
      if (dy < 8 || dy < dx * 1.5) return;
      if (event.cancelable) event.preventDefault();
      pulled = Math.min(110, dy * 0.55); setDistance(pulled);
    };
    const end = async event => {
      const ready = origin && pulled >= PULL_THRESHOLD && !event.touches.length && !locked.current;
      cancel(); if (!ready) return;
      locked.current = true; setRefreshing(true);
      try { await callback.current(); }
      finally { locked.current = false; if (alive) setRefreshing(false); }
    };
    panel.addEventListener('touchstart', start, { passive: true });
    panel.addEventListener('touchmove', move, { passive: false });
    panel.addEventListener('touchend', end); panel.addEventListener('touchcancel', cancel);
    return () => { alive = false; panel.removeEventListener('touchstart', start); panel.removeEventListener('touchmove', move); panel.removeEventListener('touchend', end); panel.removeEventListener('touchcancel', cancel); };
  }, [mobile, enabled]);
  return { ref, refreshing, distance, ready: distance >= PULL_THRESHOLD };
}