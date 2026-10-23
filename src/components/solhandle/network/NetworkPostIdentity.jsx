import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function NetworkPostIdentity({ name, handle, date, href, onProfile, preview = 'Development' }) {
  const { formatRelativeTime } = useLanguage();
  const Action = href ? Link : 'button';
  const actionProps = href ? { to: href } : { type: 'button', onClick: onProfile };
  return <header className="network-feed-identity"><Action {...actionProps} className="network-feed-author" aria-label={`Open ${handle || name} profile`}><span className="network-feed-avatar"><UserRound className="h-5 w-5"/></span><span className="network-feed-author-text"><strong data-no-translate>{handle || name}</strong><span>{handle ? name : 'SolHandle Network'}<span className="network-post-preview">{preview}</span></span></span></Action><time dateTime={date} title={new Date(date).toLocaleString()} className="network-feed-time">{formatRelativeTime(date)}</time></header>;
}