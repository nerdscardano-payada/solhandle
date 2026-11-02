import { Link } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';

export default function DashboardGettingStarted({ state, ownership, profileQuery, contacts }) {
  if (!state.address || state.loading || state.error || ownership.isPending || ownership.isError) return null;
  const primary = state.identity?.primaryHandle;
  const profileKnown = !primary || (!profileQuery.isPending && !profileQuery.isError);
  const published = !!primary && profileKnown && !!profileQuery.data?.profile;
  const hasContact = contacts.unlocked && contacts.query.isSuccess && contacts.contacts.length > 0;
  const essential = !!primary && published;
  const steps = [
    { label: 'Claim a SolHandle', done: !!primary || ownership.data?.handles.length > 0, to: '/search' },
    { label: 'Set your Primary Handle', done: !!primary, to: '/my-handles' },
    { label: 'Publish your public profile', done: published, to: '/profile', note: !profileKnown ? 'Status could not be confirmed' : '' },
    { label: 'Save your first contact', done: hasContact, to: '/contacts', note: !contacts.unlocked ? 'Unlock Contacts to check your progress' : contacts.query.isError ? 'Contact status unavailable' : '' }
  ];
  return <details className="ep-card dashboard-checklist" open={essential ? undefined : true}><summary>Get more from your identity{essential && <span className="ep-small">Essential setup complete · expand for next steps</span>}</summary><ul>{steps.map(step => <li key={step.label}>{step.done ? <><Check size={18} aria-hidden="true"/><span>{step.label}<small>Complete</small></span></> : <Link to={step.to}><span>{step.label}{step.note && <small>{step.note}</small>}</span><ArrowUpRight size={16}/></Link>}</li>)}</ul><Link className="ep-link" to="/pay">Explore SolHandle Pay <ArrowUpRight size={16}/></Link><p className="ep-small">No payment is required. Publishing a profile is always your choice.</p></details>;
}