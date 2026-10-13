import DemoPayoutExperience from '@/components/solhandle/demos/DemoPayoutExperience';
import DemoCreatorTips from '@/components/solhandle/demos/DemoCreatorTips';
import DemoMultisigDashboard from '@/components/solhandle/demos/DemoMultisigDashboard';
import DemoDaoGovernance from '@/components/solhandle/demos/DemoDaoGovernance';
import DemoGamingProfile from '@/components/solhandle/demos/DemoGamingProfile';
import DemoSocialChat from '@/components/solhandle/demos/DemoSocialChat';
import DemoAirdropClaim from '@/components/solhandle/demos/DemoAirdropClaim';
import DemoVestingDashboard from '@/components/solhandle/demos/DemoVestingDashboard';
import communityDemoScenarios from '@/components/solhandle/demos/communityDemoScenarios';
const screens = { 'dao-treasury': DemoPayoutExperience, 'contributor-payroll': DemoPayoutExperience, 'creator-tips': DemoCreatorTips, 'multisig-dashboard': DemoMultisigDashboard, 'dao-governance': DemoDaoGovernance, 'gaming-profile': DemoGamingProfile, 'social-chat': DemoSocialChat, 'airdrop-claim': DemoAirdropClaim, 'vesting-dashboard': DemoVestingDashboard };
export default function DemoCommunityExperience({ slug, identity, enhanced, presentation }) {
  const Screen = screens[slug];
  return <div className="min-w-0 space-y-5"><Screen slug={slug} identity={identity} enhanced={enhanced} presentation={presentation}/><footer className="space-y-3 border-t border-border pt-4"><p className="text-xs leading-6 text-muted-foreground">{communityDemoScenarios[slug].limitation}</p>{identity && !presentation && <a className="inline-flex min-h-11 items-center text-sm text-names-accent" href={`https://explorer.solana.com/address/${identity.address}`} target="_blank" rel="noopener noreferrer">Inspect the actual source wallet ↗</a>}</footer></div>;
}