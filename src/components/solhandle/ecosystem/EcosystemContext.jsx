import { createContext, useContext, useState } from 'react';
import { demoPeople } from '@/components/solhandle/ecosystem/previewData';
const Context = createContext(null);
export const useEcosystem = () => useContext(Context);
export default function EcosystemProvider({ children }) {
  const [screen, setScreen] = useState('home'), [scenario, setScenario] = useState('ready');
  const [modal, setModal] = useState(null), [search, setSearch] = useState(''), [category, setCategory] = useState('All');
  const [saved, setSaved] = useState(demoPeople.slice(0, 2)), [handles, setHandles] = useState(['@ansem', '@solbuilder', '@myidentity']);
  const [primary, setPrimary] = useState('@ansem'), [payTo, setPayTo] = useState('@friend'), [payContact, setPayContact] = useState(false);
  const [notice, setNotice] = useState('');
  const wallet = scenario !== 'nowallet';
  const hasHandles = wallet && scenario !== 'nohandle';
  const handle = hasHandles && !['noprimary', 'transferred'].includes(scenario) ? primary : null;
  const sensitiveBlocked = ['nowallet', 'unsigned', 'uncertain', 'transferred'].includes(scenario);
  const contacts = scenario === 'empty' ? [] : saved;
  const go = next => { setScreen(next); setModal(null); setNotice(''); };
  const openPay = (recipient = '@friend', fromContact = false) => { setPayTo(recipient); setPayContact(fromContact); go('pay'); };
  const saveContact = person => {
    if (scenario === 'empty') setScenario('ready');
    setSaved(current => current.some(item => item.handle === person.handle) ? current : [...current, person]);
    setNotice('Contact saved in this demo only. No public follow was created.');
  };
  const choosePrimary = value => { setPrimary(value); if (scenario === 'noprimary') setScenario('ready'); setNotice('Primary Handle changed in this demo only.'); };
  return <Context.Provider value={{ screen, go, scenario, setScenario, modal, setModal, search, setSearch, category, setCategory, contacts, setSaved, handles, setHandles, primary, handle, wallet, hasHandles, sensitiveBlocked, payTo, payContact, openPay, saveContact, choosePrimary, notice, setNotice }}>{children}</Context.Provider>;
}