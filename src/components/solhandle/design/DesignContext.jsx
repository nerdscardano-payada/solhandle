import { createContext, useContext, useState } from 'react';
const DesignContext = createContext(null);
export const useDesign = () => useContext(DesignContext);
export default function DesignProvider({ children }) {
  const [screen, setScreen] = useState('public');
  const [theme, setTheme] = useState('dark');
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [scenario, setScenario] = useState('ready');
  const [dialog, setDialog] = useState(null);
  const [following, setFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [payTo, setPayTo] = useState('@friend');
  const openPay = (recipient = '@friend') => { setPayTo(recipient); setDialog('pay'); };
  const go = next => { if (next === 'mobile') setMobile(true); setScreen(next); setDialog(null); };
  const value = { screen, go, theme, setTheme, mobile: mobile || screen === 'mobile', setMobile, scenario, setScenario, dialog, setDialog, following, setFollowing, posts, setPosts, messages, setMessages, search, setSearch, payTo, openPay, handle: scenario === 'nohandle' ? null : '@ansem' };
  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}