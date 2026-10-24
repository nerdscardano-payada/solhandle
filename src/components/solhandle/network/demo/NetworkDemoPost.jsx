import { useState } from 'react';
import { MessageCircle, Heart, Repeat2, Bookmark } from 'lucide-react';
import NetworkDemoProfile from '@/components/solhandle/network/demo/NetworkDemoProfile';
import NetworkDemoReplies from '@/components/solhandle/network/demo/NetworkDemoReplies';
import { demoProfileById } from '@/components/solhandle/network/demo/networkDemoData';
import '@/components/solhandle/network/demo/network-demo-post.css';
export default function NetworkDemoPost({ post, expanded = false }) {
  const [repliesOpen, setRepliesOpen] = useState(expanded);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const actions = [[Heart, 'Like uitproberen', liked, () => setLiked(value => !value), post.likes + Number(liked), 'like'], [Repeat2, 'Repost uitproberen', reposted, () => setReposted(value => !value), post.reposts + Number(reposted), 'repost'], [Bookmark, 'Bewaren uitproberen', saved, () => setSaved(value => !value), null, 'bookmark']];
  const profile = demoProfileById(post.author);
  return <article className="sh-demo-post"><div className="sh-demo-top">
    <span aria-hidden="true" className="sh-demo-avatar">{profile.initials}</span>
    <div className="sh-demo-content">
      <div className="sh-demo-identity"><NetworkDemoProfile compact profile={profile}/><span className="sh-demo-meta"><span className="sh-demo-label">Demo</span><span className="sh-demo-time">{post.time}</span></span></div>
      <p className="sh-demo-copy">{post.body}</p>
      <footer className="sh-demo-actions" aria-label="Voorbeeldacties, alleen lokaal">
        <button type="button" onClick={() => setRepliesOpen(value => !value)} aria-label={`${post.replies.length} voorbeeldreacties bekijken`} aria-expanded={repliesOpen} aria-controls={`demo-replies-${post.id}`} className="sh-demo-action"><MessageCircle/><span className="sh-demo-reply-count">{post.replies.length}</span></button>
        {[actions[1], actions[0], actions[2]].map(([Icon, label, active, onClick, count, tone]) => <button key={tone} type="button" onClick={onClick} aria-label={label} title={`${label} · alleen demo`} aria-pressed={active} data-active={active} data-tone={tone} className="sh-demo-action"><Icon fill={active && tone !== 'repost' ? 'currentColor' : 'none'}/>{count !== null && <span>{count}</span>}</button>)}
      </footer>
      {repliesOpen && <NetworkDemoReplies id={`demo-replies-${post.id}`} replies={post.replies}/>}
    </div>
  </div></article>;
}