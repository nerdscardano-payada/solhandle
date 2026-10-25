import HandleCard from '@/components/solhandle/HandleCard';
export default function ProfileMintImage({ handle }) {
  return <div className="profile-mint-image"><HandleCard handle={handle}/><span className="ep-small">Your Primary Handle mint artwork</span></div>;
}