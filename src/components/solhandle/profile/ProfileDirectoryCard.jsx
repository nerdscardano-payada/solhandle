import { ArrowUpRight } from 'lucide-react';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import '@/components/solhandle/profile/profile-media.css';
import { Link } from 'react-router-dom';
export default function ProfileDirectoryCard({ profile }) {
  return <Link to={`/profile/${profile.handle}`} className="profile-directory-card">
    <div className="profile-directory-heading"><ProfileAvatar avatar={profile.avatar} handle={profile.handle} className="profile-directory-avatar"/><div className="profile-directory-copy"><h2>@{profile.handle}</h2><p>{profile.bio || 'View this public SolHandle profile.'}</p></div><ArrowUpRight size={18}/></div>
    <span className="ep-link">View profile</span>
  </Link>;
}