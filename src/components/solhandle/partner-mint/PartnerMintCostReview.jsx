import { solAmount } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function PartnerMintCostReview({ prepared }) {
  if (!prepared) return null;
  return <section className="mt-4 rounded-lg border border-names-warning/30 p-4"><h3 className="font-semibold">Separate Devnet costs before signing</h3>
    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm"><dt>Estimated account rent</dt><dd>{solAmount(prepared.estimatedAccountCostsLamports)} SOL</dd><dt>Estimated network fee</dt><dd>{solAmount(prepared.estimatedNetworkFeeLamports)} SOL</dd><dt>Pilot storage charge</dt><dd>0 SOL</dd><dt>Estimated total debit</dt><dd>{solAmount(prepared.estimatedTotalLamports)} SOL</dd></dl>
    <p className="mt-3 text-xs text-muted-foreground">The total includes the mint fee. Rent and network fees are not partner revenue. Wallet-added priority fees may add up to {solAmount(prepared.walletPriorityFeeCapLamports)} SOL; inspect the final wallet total. If this preparation expires, request a new quote. Estimates are not a price guarantee.</p>
  </section>;
}