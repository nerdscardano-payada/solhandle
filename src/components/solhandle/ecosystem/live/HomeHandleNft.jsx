import { useState } from 'react';
import { Image } from '@/components/ui/image';

export default function HomeHandleNft({ profile }) {
  const [failed, setFailed] = useState(false);
  const image = profile.mintImage && !failed;
  const artwork = <>
    <span className="home-handle-nft-image">
      {image ? <Image src={profile.mintImage} alt={`Official minted NFT for @${profile.handle}`} className="h-full w-full" fittingType="fit" onError={() => setFailed(true)}/> : <span className="home-handle-nft-unavailable">NFT image unavailable</span>}
    </span>
    <span className="home-handle-nft-label">Handle NFT</span>
  </>;
  return profile.assetAddress
    ? <a className="home-handle-nft" href={`https://core.metaplex.com/explorer/${profile.assetAddress}`} target="_blank" rel="noopener noreferrer" aria-label={`View on-chain NFT details for @${profile.handle}`}>{artwork}</a>
    : <div className="home-handle-nft">{artwork}</div>;
}