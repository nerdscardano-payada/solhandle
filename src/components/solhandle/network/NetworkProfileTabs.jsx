import ProfileSectionTabs from '@/components/solhandle/profile/ProfileSectionTabs';

export default function NetworkProfileTabs({ value, onChange }) {
  return <ProfileSectionTabs value={value} onChange={onChange} extraTabs={[['replies', 'Replies'], ['media', 'Media']]}/>;
}