import { useRef, useState } from "react";
import { Expand, RotateCcw } from "lucide-react";
import { Image } from "@/components/ui/image";
import "@/components/solhandle/promo-animation.css";

const homepage = "https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/437abe860_image.png";
const logo = "https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/be384a4b6_image.png";
const gallery = "https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/15b55c426_image.png";

export default function PromoStage() {
  const [run, setRun] = useState(0);
  const stageRef = useRef(null);
  const restart = () => setRun((value) => value + 1);
  const fullscreen = () => stageRef.current?.requestFullscreen?.();

  return <div className="mx-auto max-w-7xl">
    <div key={run} ref={stageRef} className="promo-stage">
      <div className="promo-grid" />
      <section className="promo-scene promo-intro"><Image src={logo} alt="SolHandle — Your identity. Yours." className="promo-logo" fittingType="fit" /></section>
      <section className="promo-scene promo-search">
        <div className="promo-home-card"><Image src={homepage} alt="SolHandle homepage and claim flow" className="h-full w-full" fittingType="fit" /></div>
      </section>
      <section className="promo-scene promo-own">
        <div className="promo-gallery-card"><Image src={gallery} alt="Recently claimed SolHandle NFTs" className="h-full w-full" fittingType="fit" /></div>
        <div><span>LIVE ON-CHAIN IDENTITY</span><h2>Claim it.<br /><b>Own it.</b></h2><p>Every handle is a unique NFT in your wallet.</p></div>
      </section>
      <section className="promo-scene promo-outro"><Image src={logo} alt="SolHandle — Your identity. Yours." className="promo-logo" fittingType="fit" /><p>Claim your @ on Solana.</p></section>
    </div>
    <div className="mt-4 flex justify-end gap-3"><button onClick={restart} className="promo-control"><RotateCcw className="h-4 w-4" />Replay</button><button onClick={fullscreen} className="promo-control"><Expand className="h-4 w-4" />Fullscreen</button></div>
  </div>;
}