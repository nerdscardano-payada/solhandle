import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function NetworkPostIdentity({ name, handle, date, href, onProfile, preview = 'Development' }) {
  const { formatRelativeTime } = useLanguage();
  const Action = href ? Link : 'button';
  const actionProps = href ? { to: href } : { type: 'button', onClick: onProfile };
  const initials = (name || handle || '?').replace(/^@/, '').split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return <header className="network-feed-identity"><Action {...actionProps} className="network-feed-author" aria-label={`Profiel van ${handle || name} openen`}><span aria-hidden="true" className="network-feed-avatar">{initials}</span><span className="network-feed-author-text"><strong data-no-translate>{name || handle}</strong>{handle && <span data-no-translate>{handle}</span>}</span></Action><time dateTime={date} title={new Date(date).toLocaleString()} className="network-feed-time">{formatRelativeTime(date)}</time></header>;
}