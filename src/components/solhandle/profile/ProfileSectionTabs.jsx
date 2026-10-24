import { ChevronDown } from 'lucide-react';

const primaryTabs = [['posts', 'Posts'], ['about', 'About'], ['identity', 'Identity']];
export default function ProfileSectionTabs({ value, onChange, extraTabs = [] }) {
  const extra = extraTabs.find(([id]) => id === value);
  return <nav className="sd-feed-tabs sd-profile-tabs" aria-label="Profile sections">
    {primaryTabs.map(([id, label]) => <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}>{label}</button>)}
    {extraTabs.length > 0 && <details className="sd-profile-tab-more" data-active={Boolean(extra)}><summary>{extra?.[1] || 'More'}<ChevronDown size={14}/></summary><div>{extraTabs.map(([id, label]) => <button key={id} type="button" aria-pressed={value === id} onClick={event => { onChange(id); event.currentTarget.closest('details').open = false; }}>{label}</button>)}</div></details>}
  </nav>;
}