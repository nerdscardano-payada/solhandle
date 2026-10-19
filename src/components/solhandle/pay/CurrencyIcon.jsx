import { Image } from '@/components/ui/image';

const logos = {
  SOL: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
  USDC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  USDT: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  HANDLE: 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png',
};

export default function CurrencyIcon({ asset }) {
  return <Image src={logos[asset]} alt="" aria-hidden="true" fittingType="fit" className="h-5 w-5 shrink-0 rounded-full" />;
}