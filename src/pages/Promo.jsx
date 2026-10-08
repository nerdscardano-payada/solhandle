import PromoStage from "@/components/solhandle/PromoStage";
import Header from '@/components/solhandle/Header';

export default function Promo() {
  return (
    <main className="min-h-screen bg-[#02050d] text-white">
      <Header/>
      <div className="px-4 py-8 sm:px-8"><PromoStage /></div>
    </main>
  );
}