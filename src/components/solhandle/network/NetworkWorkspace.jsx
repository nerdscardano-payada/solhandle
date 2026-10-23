import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LabComposer from '@/components/solhandle/network/lab/LabComposer';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import LabProfile from '@/components/solhandle/network/lab/LabProfile';
import LabConversation from '@/components/solhandle/network/lab/LabConversation';
import LabNotifications from '@/components/solhandle/network/lab/LabNotifications';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
const views = [['latest', 'Latest'], ['following', 'Following'], ['discover', 'Discover'], ['people', 'People'], ['bookmarks', 'Bookmarks'], ['reposts', 'Reposts'], ['notifications', 'Notifications'], ['profile', 'My profile']];
export default function NetworkWorkspace({ actorId, initialView = 'latest', initialSearch = '' }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const requested = params.get('view') || (params.get('feed') === 'following' ? 'following' : initialView);
  const view = views.some(([value]) => value === requested) ? requested : 'latest';
  const q = (params.get('q') || initialSearch).slice(0, 80);
  const target = params.get('profile') || (view === 'profile' ? actorId : '');
  const postId = params.get('post');
  const go = (values = {}) => navigate(`/network?${new URLSearchParams({ view: view === 'profile' ? 'latest' : view, ...(q ? { q } : {}), ...values })}`);
  const onProfile = id => go({ profile: id });
  const onConversation = id => go({ post: id });
  useEffect(() => { if (params.get('compose') === '1') document.querySelector('#network-compose textarea')?.focus(); }, [params]);
  return <><nav aria-label="Network views" className="network-workspace-tabs flex flex-wrap gap-2 border-b border-identity-border p-4">{views.map(([value, label]) => <button key={value} type="button" onClick={() => go({ view: value })} aria-pressed={view === value && !postId && (!target || value === 'profile')} className={`rounded-full px-3 py-2.5 text-xs ${view === value && !postId && (!target || value === 'profile') ? 'bg-names-accent/10 font-semibold text-names-accent' : 'text-identity-muted'}`}>{label}</button>)}</nav>{postId ? <LabConversation key={postId} actorId={actorId} id={postId} onConversation={onConversation} onProfile={onProfile} onBack={() => go()}/> : target ? <LabProfile key={target} actorId={actorId} target={target} onProfile={onProfile} onConversation={onConversation} onBack={() => go()}/> : view === 'notifications' ? <LabNotifications actorId={actorId} onProfile={onProfile} onConversation={onConversation}/> : <>{['latest', 'following', 'discover'].includes(view) && <div id="network-compose"><LabComposer actorId={actorId}/></div>}<div className="border-b border-identity-border p-4"><NetworkSearch key={q} placeholder={view === 'people' ? 'Search people and profiles…' : 'Search Network…'}/>{q && <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-identity-muted"><span>Results for “{q}”</span><button type="button" onClick={() => go({ view: 'people' })} className="text-names-accent">People</button><button type="button" onClick={() => go({ view: 'latest' })} className="text-names-accent">Posts</button><button type="button" onClick={() => navigate('/network')} className="text-names-secondary">Clear search</button></div>}</div>{view === 'people' ? <LabPeople actorId={actorId} q={q} onProfile={onProfile}/> : <LabFeed actorId={actorId} mode={view} q={q} onProfile={onProfile} onConversation={onConversation}/>}</>}</>;
}