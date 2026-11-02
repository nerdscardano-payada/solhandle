import { useSearchParams } from 'react-router-dom';
import PostMintOnboarding from '@/components/solhandle/onboarding/PostMintOnboarding';
export default function Onboarding() {
  const [params] = useSearchParams();
  const handle = (params.get('handle') || '').replace(/^@/, '');
  return <main><header className="ep-page-heading"><span className="ep-eyebrow">YOUR SOLHANDLE</span><h1>Set up your identity</h1><p>Resume your setup. Progress is checked against your current wallet, not a saved completion flag.</p></header><PostMintOnboarding key={handle} handle={handle}/></main>;
}