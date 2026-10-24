import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Repeat2, Bookmark } from 'lucide-react';
import NetworkFeedPresentation from '@/components/solhandle/network/NetworkFeedPresentation';
import NetworkPostAction from '@/components/solhandle/network/NetworkPostAction';
import '@/components/solhandle/network/network-feed.css';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import NetworkShare from '@/components/solhandle/network/NetworkShare';
import { profilePath } from '@/components/solhandle/network/networkClient';
export default function NetworkPostCard({ post, detail = false }) {
  return <NetworkFeedPresentation author={post.author.name} handle={post.author.handle} date={post.publishedAt} href={profilePath(post.author)} actions={<><Link aria-label="Open replies" title="Open replies" to={`/network/post/${post.id}`}><MessageCircle size={17}/><span>Reply</span></Link>{[[Repeat2, 'Repost', 'repost'], [Heart, 'Like', 'like'], [Bookmark, 'Save', 'bookmark']].map(([Icon, label, tone]) => <NetworkGate key={label} action={label}><NetworkPostAction icon={Icon} label={label} tone={tone}/></NetworkGate>)}<NetworkShare compact path={`/network/post/${post.id}`} title={`${post.author.name} on SolHandle Network`}/></>}>{post.parentId && <Link to={`/network/post/${post.parentId}`} className="network-parent-link">View original post</Link>}{detail ? <p className="live-post-copy">{post.body}</p> : <p><Link to={`/network/post/${post.id}`} className="live-post-copy">{post.body}</Link></p>}</NetworkFeedPresentation>;
}