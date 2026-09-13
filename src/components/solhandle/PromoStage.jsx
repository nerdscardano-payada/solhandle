import { useRef, useState } from "react";
import { Expand, RotateCcw } from "lucide-react";
import { Image } from "@/components/ui/image";
import "@/components/solhandle/promo-animation.css";

const logo = "https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/a3ca2bffa_image.png";
const search = "https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/72a14532a_image.png";

export default function PromoStage() {
  const [run, setRun] = useState(0);
  const stageRef = useRef(null);
  const restart = () => setRun((value) => value + 1);
  const fullscreen = () => stageRef.current?.requestFullscreen?.();

  return <div className="mx-auto max-w-7xl">
    <div key={run} ref={stageRef} className="promo-stage">
      <div className="promo-grid" />
      <section className="promo-scene promo-intro"><Image src={logo} alt="SolHandle logo" className="promo-logo" fittingType="fit" /></section>
      <section className="promo-scene promo-search">
        <div className="promo-copy"><span>NFT-NATIVE IDENTITY ON SOLANA</span><h1>Your @<br /><b>on Solana.</b></h1><p>Search. Claim. Own.</p></div>
        <div className="promo-search-card"><Image src={search} alt="SolHandle claim interface for @crypto" className="h-full w-full" fittingType="fit" /></div>
      </section>
      <section className="promo-scene promo-own">
        <div className="promo-orbit"><Image src={logo} alt="SolHandle identity NFT" className="h-full w-full rounded-[2rem]" fittingType="fit" /></div>
        <div><span>OWNED BY YOUR WALLET</span><h2>One name.<br /><b>One identity.</b></h2><p>No renewals. Yours until you transfer it.</p></div>
      </section>
      <section className="promo-scene promo-outro"><Image src={logo} alt="SolHandle — Your identity. Yours." className="promo-logo" fittingType="fit" /><p>Claim your @ on Solana.</p></section>
    </div>
    <div className="mt-4 flex justify-end gap-3"><button onClick={restart} className="promo-control"><RotateCcw className="h-4 w-4" />Replay</button><button onClick={fullscreen} className="promo-control"><Expand className="h-4 w-4" />Fullscreen</button></div>
  </div>;
}