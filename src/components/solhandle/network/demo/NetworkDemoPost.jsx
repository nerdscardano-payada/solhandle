import { useState } from 'react';
import { MessageCircle, Heart, Repeat2, Bookmark } from 'lucide-react';
import NetworkDemoProfile from '@/components/solhandle/network/demo/NetworkDemoProfile';
import NetworkDemoReplies from '@/components/solhandle/network/demo/NetworkDemoReplies';
import { demoProfileById } from '@/components/solhandle/network/demo/networkDemoData';
import '@/components/solhandle/network/network-feed.css';
export default function NetworkDemoPost({ post, expanded = false }) {
  const [repliesOpen, setRepliesOpen] = useState(expanded);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const actions = [[Heart, 'Like uitproberen', liked, () => setLiked(value => !value), post.likes + Number(liked), 'like'], [Repeat2, 'Repost uitproberen', reposted, () => setReposted(value => !value), post.reposts + Number(reposted), 'repost'], [Bookmark, 'Bewaren uitproberen', saved, () => setSaved(value => !value), null, 'bookmark']];
  return <article className="network-post-card network-feed-post"><header className="flex items-start justify-between gap-2"><div className="min-w-0"><NetworkDemoProfile compact profile={demoProfileById(post.author)}/></div><span className="shrink-0 text-right text-xs text-identity-muted"><span className="block text-names-accent">Demo</span>{post.time}</span></header><p className="network-feed-copy whitespace-pre-wrap break-words">{post.body}</p><footer className="network-feed-footer" aria-label="Voorbeeldacties, alleen lokaal"><button type="button" onClick={() => setRepliesOpen(value => !value)} aria-label={`${post.replies.length} voorbeeldreacties bekijken`} aria-expanded={repliesOpen} aria-controls={`demo-replies-${post.id}`} className="network-feed-action"><MessageCircle className="h-4 w-4"/><span>{post.replies.length}</span></button>{actions.map(([Icon, label, active, onClick, count, tone]) => <button key={tone} type="button" onClick={onClick} aria-label={label} title={`${label} · alleen demo`} aria-pressed={active} data-active={active} data-tone={tone} className="network-feed-action"><Icon className="h-4 w-4" fill={active && tone !== 'repost' ? 'currentColor' : 'none'}/>{count !== null && <span>{count}</span>}</button>)}</footer>{repliesOpen && <NetworkDemoReplies id={`demo-replies-${post.id}`} replies={post.replies}/>}</article>;
}