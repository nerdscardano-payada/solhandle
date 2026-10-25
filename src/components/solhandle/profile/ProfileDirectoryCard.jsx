import { ArrowUpRight, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function ProfileDirectoryCard({ profile }) {
  return <Link to={`/profile/${profile.handle}`} className="profile-directory-card">
    <div className="profile-directory-heading"><span className="profile-directory-avatar" aria-hidden="true"><UserRound size={24}/></span><h2>@{profile.handle}</h2><ArrowUpRight size={18}/></div>
    <p>{profile.bio || 'View this public SolHandle profile.'}</p><span className="ep-link">View profile</span>
  </Link>;
}