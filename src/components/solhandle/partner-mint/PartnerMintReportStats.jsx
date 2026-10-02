import { solAmount } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function PartnerMintReportStats({ totals }) {
  const values = [['Finalized mints', totals.count], ['Mint volume', `${solAmount(totals.mintPriceLamports)} SOL`], ['Partner revenue', `${solAmount(totals.partnerShareLamports)} SOL`], ['Protocol revenue', `${solAmount(totals.protocolShareLamports)} SOL`]];
  return <dl className="mt-5 grid grid-cols-2 gap-3">{values.map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-background p-3"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-heading text-lg text-foreground">{value}</dd></div>)}</dl>;
}