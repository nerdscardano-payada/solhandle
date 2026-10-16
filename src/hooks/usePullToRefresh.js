import { useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const atTop = target => {
  for (let node = target; node && node !== document.documentElement; node = node.parentElement) {
    if (node.scrollTop > 0) return false;
  }
  return (document.scrollingElement?.scrollTop || 0) <= 0;
};
export default function usePullToRefresh(onRefresh) {
  const mobile = useIsMobile();
  const start = useRef(null), locked = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const onTouchStart = event => {
    start.current = null;
    if (!mobile || locked.current || event.touches.length !== 1 || event.target.closest('input, textarea, select, button, a, [role="dialog"], [data-vaul-drawer], [contenteditable="true"]') || !atTop(event.target)) return;
    const touch = event.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };
  const onTouchEnd = async event => {
    const origin = start.current;
    start.current = null;
    if (!mobile || !origin || locked.current || event.touches.length || !atTop(event.target)) return;
    const touch = event.changedTouches[0];
    if (!touch || touch.clientY - origin.y < 85 || touch.clientY - origin.y < Math.abs(touch.clientX - origin.x) * 2 || Date.now() - origin.time > 1500) return;
    locked.current = true; setRefreshing(true);
    try { await onRefresh(); }
    finally { locked.current = false; setRefreshing(false); }
  };
  return { refreshing, handlers: { onTouchStart, onTouchEnd, onTouchCancel: () => { start.current = null; } } };
}