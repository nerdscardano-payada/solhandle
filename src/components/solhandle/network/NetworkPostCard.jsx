import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Repeat2, Bookmark } from 'lucide-react';
import NetworkPostIdentity from '@/components/solhandle/network/NetworkPostIdentity';
import NetworkPostAction from '@/components/solhandle/network/NetworkPostAction';
import '@/components/solhandle/network/network-feed.css';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import NetworkShare from '@/components/solhandle/network/NetworkShare';
import { profilePath } from '@/components/solhandle/network/networkClient';
export default function NetworkPostCard({ post, detail = false }) {
  return <article className="network-post-card network-feed-post"><NetworkPostIdentity name={post.author.name} handle={post.author.handle} date={post.publishedAt} href={profilePath(post.author)} preview="Public preview"/>{post.parentId && <Link to={`/network/post/${post.parentId}`} className="network-parent-link">View parent post</Link>}{detail ? <p className="network-feed-copy whitespace-pre-wrap break-words">{post.body}</p> : <Link to={`/network/post/${post.id}`} className="network-feed-copy block whitespace-pre-wrap break-words">{post.body}</Link>}<footer className="network-feed-footer" aria-label="Post actions"><Link aria-label="Read replies" title="Read replies" to={`/network/post/${post.id}`} className="network-feed-reply-link"><MessageCircle className="h-4 w-4"/><span className="network-action-label">Reply</span></Link>{[[Heart, 'Like', 'like'], [Repeat2, 'Repost', 'repost'], [Bookmark, 'Save', 'bookmark']].map(([Icon, label, tone]) => <NetworkGate key={label} action={label}><NetworkPostAction icon={Icon} label={label} tone={tone}/></NetworkGate>)}<NetworkShare compact path={`/network/post/${post.id}`} title={`${post.author.name} on SolHandle Network`}/></footer></article>;
}