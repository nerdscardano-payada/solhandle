import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LabComposer from '@/components/solhandle/network/lab/LabComposer';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import LabProfile from '@/components/solhandle/network/lab/LabProfile';
import LabConversation from '@/components/solhandle/network/lab/LabConversation';
import LabNotifications from '@/components/solhandle/network/lab/LabNotifications';
import LabModeration from '@/components/solhandle/network/lab/LabModeration';
import LabEntitlements from '@/components/solhandle/network/lab/LabEntitlements';
export default function LabWorkspace({ actorId }) {
  const [tab, setTab] = useState('latest');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const target = params.get('profile');
  const postId = params.get('post');
  const back = () => setParams({});
  const onProfile = id => setParams({ profile: id });
  const onConversation = id => setParams({ post: id });
  return <><nav aria-label="Development views" className="flex flex-wrap gap-2 border-b border-identity-border p-4">{['latest', 'following', 'discover', 'people', 'bookmarks', 'reposts', 'notifications', 'moderation', 'entitlements'].map(value => <button key={value} onClick={() => { setTab(value); back(); }} aria-pressed={tab === value && !target && !postId} className={`rounded-full px-3 py-2 text-xs capitalize ${tab === value && !target && !postId ? 'bg-names-accent/10 text-names-accent' : 'text-identity-muted'}`}>{value}</button>)}<button onClick={() => onProfile(actorId)} className="rounded-full px-3 py-2 text-xs text-names-secondary">My test profile</button></nav>{postId ? <LabConversation key={postId} actorId={actorId} id={postId} onConversation={onConversation} onProfile={onProfile} onBack={back}/> : target ? <LabProfile key={target} actorId={actorId} target={target} onProfile={onProfile} onConversation={onConversation} onBack={back}/> : tab === 'notifications' ? <LabNotifications actorId={actorId} onProfile={onProfile} onConversation={onConversation}/> : tab === 'moderation' ? <LabModeration actorId={actorId}/> : tab === 'entitlements' ? <LabEntitlements actorId={actorId}/> : <>{['latest', 'following', 'discover'].includes(tab) && <LabComposer actorId={actorId}/>}<form className="flex gap-3 border-b border-identity-border p-5" onSubmit={event => { event.preventDefault(); setSearch(q.trim()); }}><input aria-label="Search test profiles or posts" maxLength={80} value={q} onChange={event => setQ(event.target.value)} placeholder={tab === 'people' ? 'Search test profile names' : 'Search test post text'} className="min-w-0 flex-1 rounded-xl border border-identity-border bg-card p-3 text-sm"/><button className="text-sm text-names-accent">Search</button></form>{tab === 'discover' && <p className="border-b border-identity-border p-5 text-xs text-identity-muted">Transparent test score: likes + 2 × reposts + 3 × published replies. No token weighting.</p>}{tab === 'people' ? <LabPeople actorId={actorId} q={search} onProfile={onProfile}/> : <LabFeed actorId={actorId} mode={tab} q={search} onProfile={onProfile} onConversation={onConversation}/>}</>}</>;
}