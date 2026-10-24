import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LabComposer from '@/components/solhandle/network/lab/LabComposer';
import LabFeed from '@/components/solhandle/network/lab/LabFeed';
import LabPeople from '@/components/solhandle/network/lab/LabPeople';
import LabProfile from '@/components/solhandle/network/lab/LabProfile';
import LabConversation from '@/components/solhandle/network/lab/LabConversation';
import LabNotifications from '@/components/solhandle/network/lab/LabNotifications';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import NetworkPublicTimeline from '@/components/solhandle/network/NetworkPublicTimeline';
const views = [['latest', 'Latest'], ['following', 'Following'], ['discover', 'Discover'], ['people', 'People'], ['bookmarks', 'Bookmarks'], ['reposts', 'Reposts'], ['notifications', 'Notifications'], ['profile', 'My profile']];
export default function NetworkWorkspace({ actorId, initialView = 'latest', initialSearch = '', lockedView = false }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const requested = lockedView ? initialView : params.get('view') || (params.get('feed') === 'following' ? 'following' : initialView);
  const view = views.some(([value]) => value === requested) ? requested : 'latest';
  const q = lockedView ? '' : (params.get('q') || initialSearch).slice(0, 80);
  const target = lockedView ? '' : params.get('profile') || (view === 'profile' ? actorId : '');
  const postId = lockedView ? null : params.get('post');
  const go = (values = {}) => navigate(`/network?${new URLSearchParams({ view: view === 'profile' ? 'latest' : view, ...(q ? { q } : {}), ...values })}`);
  const onProfile = id => go({ profile: id });
  const onConversation = id => go({ post: id });
  useEffect(() => { if (params.get('compose') === '1') document.querySelector('#network-compose textarea')?.focus(); }, [params]);
  const navigation = !postId && !target && ['latest', 'following', 'discover'].includes(view) ? <nav aria-label="Tijdlijn" className="sd-feed-tabs">{[['latest', 'For you'], ['following', 'Following']].map(([value, label]) => <button key={value} type="button" onClick={() => go({ view: value })} aria-pressed={view === value || (value === 'latest' && view === 'discover')} className={`rounded-lg px-4 py-2 text-sm ${view === value || (value === 'latest' && view === 'discover') ? 'bg-names-accent/10 font-semibold text-names-accent' : 'text-identity-muted'}`}>{label}</button>)}</nav> : null;
  if (!actorId) return <>{navigation}{!target && !postId && ['latest', 'discover'].includes(view) && <NetworkPublicTimeline q={q}/>}<p className="p-4 text-sm text-identity-muted">Activeer je handle via Profiel → Accountbeheer.</p></>;
  return <>{navigation}{postId ? <LabConversation key={postId} actorId={actorId} id={postId} onConversation={onConversation} onProfile={onProfile} onBack={() => go()}/> : target ? <LabProfile key={target} actorId={actorId} target={target} onProfile={onProfile} onConversation={onConversation} onBack={() => go()}/> : view === 'notifications' ? <LabNotifications actorId={actorId} onProfile={onProfile} onConversation={onConversation}/> : <>{['latest', 'following', 'discover'].includes(view) && <div id="network-compose"><LabComposer actorId={actorId}/></div>} {(q || view === 'people') && <div className="border-b border-identity-border p-4"><NetworkSearch key={q} placeholder="Zoek mensen, projecten of berichten…"/>{q && <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-identity-muted"><span>Results for “{q}”</span><button type="button" onClick={() => go({ view: 'people' })} className="text-names-accent">People</button><button type="button" onClick={() => go({ view: 'latest' })} className="text-names-accent">Posts</button><button type="button" onClick={() => navigate('/network')} className="text-names-secondary">Clear search</button></div>}</div>}{view === 'people' ? <LabPeople actorId={actorId} q={q} onProfile={onProfile}/> : <LabFeed actorId={actorId} mode={view} q={q} onProfile={onProfile} onConversation={onConversation}/>}</>}</>;
}