const tabs = ['posts', 'replies', 'media', 'about', 'identity'];

export default function NetworkProfileTabs({ value, onChange }) {
  return <nav aria-label="Profile sections" className="network-content-tabs network-profile-tabs flex border-b border-identity-border">
    {tabs.map(tab => <button key={tab} type="button" onClick={() => onChange(tab)} aria-pressed={value === tab} className={`flex-1 py-4 text-sm capitalize ${value === tab ? 'border-b-2 border-names-accent text-names-accent' : 'border-b-2 border-transparent text-identity-muted'}`}>{tab}</button>)}
  </nav>;
}