import { Link } from 'react-router-dom';
import HandleCard from '@/components/solhandle/HandleCard';
import SimilarHandles from '@/components/solhandle/SimilarHandles';
import HandleMarketplacePanel from '@/components/solhandle/HandleMarketplacePanel';
import NameInterest from '@/components/solhandle/names/NameInterest';
import HandlePublicProfile from '@/components/solhandle/profile/HandlePublicProfile';
import HandleDetailHeading from '@/components/solhandle/handles/HandleDetailHeading';
import HandleDetailRecord from '@/components/solhandle/handles/HandleDetailRecord';
import useHandleDetail from '@/components/solhandle/handles/useHandleDetail';
import { validateHandle } from '@/lib/solhandle';
import '@/components/solhandle/handles/handle-detail.css';
export default function HandlePage() {
  const state = useHandleDetail();
  const { handle, data, available, owner } = state;
  return <main className="el-handle-detail">
    <HandleDetailHeading {...state}/>
    <div className="el-handle-grid"><section className="ep-card el-handle-artwork" aria-label="SolHandle NFT"><span className="ep-eyebrow">SOLHANDLE NFT</span><HandleCard handle={handle} display={`@${handle || '—'}`}/></section><HandleDetailRecord {...state}/></div>
    <div className="el-handle-actions">{available && <Link to={`/?claim=${handle}`} className="ep-button ep-primary">Mint @{handle}</Link>}<nav aria-label="Handle navigation"><Link to="/names" className="ep-link">Explore Names</Link><Link to="/" className="ep-link">Search another handle</Link></nav></div>
    {handle && !validateHandle(handle) && <HandlePublicProfile key={handle} handle={handle}/>}
    <div className="el-handle-support">{data && !validateHandle(handle) && <NameInterest key={handle} handle={handle}/>} {data?.assetAddress && owner && <HandleMarketplacePanel handle={handle} asset={data.assetAddress} owner={owner}/>}<SimilarHandles handle={handle}/></div>
  </main>;
}