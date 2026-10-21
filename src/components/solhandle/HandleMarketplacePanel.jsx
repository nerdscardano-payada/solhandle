import MarketplaceRetirementNotice from '@/components/solhandle/retirement/MarketplaceRetirementNotice';
export default function HandleMarketplacePanel({ handle, asset }) {
  return asset ? <div className="mt-8"><MarketplaceRetirementNotice handle={handle}/></div> : null;
}