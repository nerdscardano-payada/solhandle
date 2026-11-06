import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import MintReadinessDialog from '@/components/solhandle/MintReadinessDialog';
import HandleCard from '@/components/solhandle/HandleCard';
import SimilarHandles from '@/components/solhandle/SimilarHandles';
import ExternalHandleListings from '@/components/solhandle/names/ExternalHandleListings';
import SecondaryMarketGuide from '@/components/solhandle/names/SecondaryMarketGuide';
import NameInterest from '@/components/solhandle/names/NameInterest';
import HandlePublicProfile from '@/components/solhandle/profile/HandlePublicProfile';
import HandleDetailHeading from '@/components/solhandle/handles/HandleDetailHeading';
import HandleDetailRecord from '@/components/solhandle/handles/HandleDetailRecord';
import useHandleDetail from '@/components/solhandle/handles/useHandleDetail';
import { validateHandle } from '@/lib/solhandle';
import '@/components/solhandle/handles/handle-detail.css';
export default function HandlePage() {
  const { publicKey } = useWallet();
  const state = useHandleDetail();
  const { handle, data, available, owner } = state;
  return <main className="el-handle-detail">
    <HandleDetailHeading {...state}/>
    <div className="el-handle-grid"><section className="ep-card el-handle-artwork" aria-label="SolHandle NFT"><span className="ep-eyebrow">SOLHANDLE NFT</span><HandleCard handle={handle} display={`@${handle || '—'}`}/></section><HandleDetailRecord {...state}/></div>
    {available && data?.handle === handle && <MintReadinessDialog key={handle} inline reviewCosts open wallet={publicKey?.toBase58() || ''} result={data} onOpenChange={() => {}}/>}
    <div className="el-handle-actions"><nav aria-label="Handle navigation"><Link to="/names" className="ep-link">Explore Names</Link><Link to="/" className="ep-link">Search another handle</Link></nav></div>
    {handle && !validateHandle(handle) && <HandlePublicProfile key={handle} handle={handle}/>}
    {data?.assetAddress && owner && <><SecondaryMarketGuide handle={handle} asset={data.assetAddress}/><ExternalHandleListings handle={handle} asset={data.assetAddress}/></>}
    <div className="el-handle-support">{data && !validateHandle(handle) && <NameInterest key={handle} handle={handle}/>}<SimilarHandles handle={handle}/></div>
  </main>;
}