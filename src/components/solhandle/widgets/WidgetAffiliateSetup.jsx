import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
export default function WidgetAffiliateSetup({ onVerified, verifiedCode = '' }) {
  const [input, setInput] = useState(verifiedCode);
  const [state, setState] = useState({ loading: false, message: verifiedCode ? `Linked to @${verifiedCode}. Copy the updated embed below.` : '', valid: Boolean(verifiedCode) });
  const revision = useRef(0);
  async function verify() {
    const current = revision.current;
    let code = input.trim();
    if (/^https:\/\//i.test(code)) { try { code = new URL(code).searchParams.get('ref') || ''; } catch { code = ''; } }
    code = code.replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9-]{1,40}$/.test(code)) { setState({ loading: false, valid: false, message: 'Enter your Share & Earn code or referral link.' }); return; }
    setState({ loading: true, message: '', valid: false });
    try {
      const { data } = await base44.functions.invoke('referralAttribution', { action: 'validate', code });
      if (current !== revision.current) return;
      onVerified(data.valid ? data.referralCode : '');
      setState({ loading: false, valid: data.valid, message: data.valid ? `Linked to @${data.referralCode}. Copy the updated embed below.` : data.enabled === false ? 'Share & Earn is currently disabled.' : 'No active Share & Earn profile found. Activate your link in Share & Earn first.' });
    } catch { if (current === revision.current) setState({ loading: false, valid: false, message: 'Could not verify your referral code. Please retry.' }); }
  }
  return <section className="mt-5 min-w-0 rounded-xl border border-names-secondary/30 bg-names-secondary/5 p-3 lg:p-4">
    <h4 className="font-semibold text-names-secondary">Earn from your website</h4>
    <p className="mt-2 text-xs leading-6 text-muted-foreground">Connect your existing Share & Earn link. Eligible confirmed SOL-paid mints are credited to that account, not to a separate affiliate balance.</p>
    <label className="mt-3 block text-sm">Your referral code or link<input value={input} onChange={event => { revision.current += 1; setInput(event.target.value); onVerified(''); setState({ loading: false, message: '', valid: false }); }} placeholder="Paste your Share & Earn link" className="mt-2 min-w-0 w-full rounded-lg border border-border bg-background px-3 py-3 text-base lg:text-sm"/></label>
    <button type="button" onClick={verify} disabled={state.loading || !input.trim()} className="mt-3 min-h-11 w-full rounded-lg border border-names-secondary/40 px-4 py-2 text-sm font-semibold text-names-secondary disabled:opacity-50 lg:min-h-0 lg:w-auto">{state.loading ? 'Checking…' : 'Connect referral'}</button>
    {state.message && <p role="status" className={`mt-3 text-xs leading-6 ${state.valid ? 'text-names-success' : 'text-names-warning'}`}>{state.message}</p>}
    <p className="mt-3 text-xs leading-6 text-muted-foreground">Existing Earn Network tiers, attribution and payout rules apply. No rewards for searches alone, self-referrals or $HANDLE-paid mints. <Link to="/earn" className="text-names-accent underline">Activate your link and view earnings →</Link></p>
  </section>;
}