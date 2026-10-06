import { Image } from '@/components/ui/image';

const logo = 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png';
export default function IntroHandlePhone() {
  return <div className="mx-auto flex h-[440px] w-full items-center min-[768px]:h-[560px]">
    <div className="relative aspect-square w-full">
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/9b757b031_generated_image.png" alt="Smartphone met @ansem en twee munten met het echte SolHandle-logo" className="absolute inset-0 h-full w-full mix-blend-screen" fittingType="fit"/>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{clipPath: 'polygon(0 0, 29.5% 0, 29.5% 100%, 0 100%)'}}>
        <Image src={logo} alt="" className="absolute left-[15.5%] top-[53.7%] h-[16.5%] w-[16.5%] rounded-full" fittingType="fill" style={{transform: 'rotate(34deg) scaleX(.88)'}}/>
      </div>
      <Image src={logo} alt="SolHandle-logo op de munt" className="pointer-events-none absolute left-[63.9%] top-[72.6%] h-[19.8%] w-[21.8%] rounded-full" fittingType="fill" style={{transform: 'rotate(-32deg)'}}/>
    </div>
  </div>;
}