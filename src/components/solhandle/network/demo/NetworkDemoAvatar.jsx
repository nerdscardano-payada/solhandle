export default function NetworkDemoAvatar({ profile }) {
  return <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-identity-border text-sm font-bold ${['nova', 'luna', 'jules'].includes(profile.id) ? 'bg-names-accent/10 text-names-accent' : 'bg-names-secondary/10 text-names-secondary'}`}>{profile.initials}</span>;
}