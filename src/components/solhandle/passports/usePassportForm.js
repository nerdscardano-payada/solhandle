import { useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signPassport, passportError } from '@/components/solhandle/passports/passportClient';
export default function usePassportForm(pilot) {
  const session = useWallet(), navigate = useNavigate(), [params] = useSearchParams();
  const [value, setValue] = useState({ handle: params.get('handle') || '', mint: params.get('mint') || '', project_name: '', description: '', launch_tx: '', maker_type: 'existing' });
  const [token,setToken] = useState(''), [reset,setReset] = useState(0), [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState(''), [checked,setChecked] = useState(null);
  const wallet = session.publicKey?.toBase58() || '', latest = useRef(wallet); latest.current = wallet;
  const identityKey = JSON.stringify([wallet, value.handle, value.mint]);
  const run = async operation => {
    const address = wallet; setBusy(true); setError(''); setNotice('');
    try {
      const result = await signPassport(session, { ...value, operation, pilot_id: pilot.id, invite: params.get('invite') || '' }, token);
      if (latest.current !== address) return;
      if (result.completed) navigate(`/token-passports/${result.passport_key}`);
      else if (result.withdrawn) { setChecked(null); setNotice('Je deelname is ingetrokken en je Passport is verborgen.'); }
      else setChecked({ key: identityKey, chain: result.chain });
    } catch (failure) { if (latest.current === address) setError(passportError(failure)); }
    finally { setToken(''); setReset(n => n + 1); setBusy(false); }
  };
  return { value,setValue,token,setToken,reset,busy,error,notice,run,wallet,chain: checked?.key === identityKey ? checked.chain : null };
}