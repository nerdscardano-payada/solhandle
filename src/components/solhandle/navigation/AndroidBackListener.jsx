import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMobileTabs } from '@/components/solhandle/navigation/MobileTabProvider';

export default function AndroidBackListener() {
  const navigate = useNavigate(), location = useLocation(), tabs = useMobileTabs();
  const latest = useRef({ navigate, location, tabs });
  latest.current = { navigate, location, tabs };
  useEffect(() => {
    let locked = false, timer;
    const previous = window.solhandleAndroidBack;
    const handleBack = event => {
      if (event?.defaultPrevented) return false;
      if (locked) { event?.preventDefault(); return true; }
      const current = latest.current;
      const dialogs = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], [role="menu"]')];
      const dialog = dialogs.reverse().find(node => node.getClientRects().length && node.getAttribute('data-state') !== 'closed');
      if (dialog) dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      else if (!current.tabs?.back()) {
        if (window.history.state?.idx > 0) current.navigate(-1);
        else if (current.location.pathname !== '/') current.navigate('/', { replace: true });
        else return false; // Let the Android host apply its normal root/exit behavior.
      }
      event?.preventDefault();
      locked = true;
      timer = setTimeout(() => { locked = false; }, 300);
      return true;
    };
    window.solhandleAndroidBack = handleBack;
    document.addEventListener('backbutton', handleBack);
    window.addEventListener('solhandle:android-back', handleBack);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('backbutton', handleBack);
      window.removeEventListener('solhandle:android-back', handleBack);
      if (previous === undefined) delete window.solhandleAndroidBack;
      else window.solhandleAndroidBack = previous;
    };
  }, []);
  return null;
}