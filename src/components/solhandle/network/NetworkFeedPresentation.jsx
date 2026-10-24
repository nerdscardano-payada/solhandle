import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function NetworkFeedPresentation({ author, handle, date, href, onProfile, actions, management, children }) {
  const { formatRelativeTime } = useLanguage();
  const Action = href ? Link : 'button';
  const props = href ? { to: href } : { type: 'button', onClick: onProfile };
  const initials = (author || handle || '?').replace(/^@/, '').split(/\s+/).map(part => part[0]).slice(0, 2).join('').toLowerCase();
  return <article className="sd-post"><Action {...props} className="sd-avatar" aria-label={`Open profile ${author || handle}`}>{initials}</Action><div className="min-w-0"><div className="sd-post-author"><Action {...props} data-no-translate>{author || handle}</Action><span data-no-translate>{handle}</span><time dateTime={date} title={new Date(date).toLocaleString()}>{formatRelativeTime(date)}</time></div>{children}<div className="sd-post-actions" role="group" aria-label="Post actions">{actions}</div>{management}</div></article>;
}