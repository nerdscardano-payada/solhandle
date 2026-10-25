export default function ProfileSocialLinks({ links = [] }) {
  return links.length ? <div className="profile-social-links">{links.map((url, index) => <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer nofollow ugc">{new URL(url).hostname.replace(/^www\./, '')} ↗</a>)}</div> : null;
}