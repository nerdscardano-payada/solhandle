import { useParams, Link } from 'react-router-dom';
import HandlePublicProfile from '@/components/solhandle/profile/HandlePublicProfile';
export default function PublicProfile() {
  const handle = String(useParams().handle || '').replace(/^@/, '').toLowerCase();
  return <main className="handle-profile-page"><header className="ep-page-heading"><span className="ep-eyebrow">SOLHANDLE PUBLIC PROFILE</span><h1>@{handle}</h1></header>{/^[a-z0-9]{1,20}$/.test(handle) ? <HandlePublicProfile key={handle} handle={handle} standalone/> : <p>Invalid handle.</p>}<Link className="ep-link" to="/profiles">All profiles</Link></main>;
}