export default function HandlePaymentTestBlocker({ test }) {
  const reasons = [];
  if (test.result && !(test.result.kind === 'submit_configuration' && test.result.status === 'confirmed')) {
    reasons.push(test.result.status === 'pending' ? 'Check the pending transaction before approving another payment.' : 'Use “Review another test” below to start a new mint test.');
  }
  if (!test.status) reasons.push('Waiting for on-chain payment status.');
  else if (!test.status.enabledOnChain) reasons.push('Mint approval is blocked because the on-chain payment configuration is not active. Connecting a wallet or reviewing a quote does not complete configuration.');
  if (!test.wallet) reasons.push('Connect a wallet.');
  if (!test.acknowledged) reasons.push('Tick the mainnet transaction acknowledgement.');
  if (!test.quote) reasons.push('Review a token quote for your handle.');
  else {
    if (!test.quote.quoteEligible) reasons.push('The quote exceeds the administrator price-impact limit.');
    if (!test.quote.sufficientBalance) reasons.push('Insufficient spendable $HANDLE balance.');
    if (test.quote.solReferenceLamports > 10000000) reasons.push('Choose a handle priced at 0.01 SOL or less.');
  }
  return <div className="mt-4 text-sm" aria-live="polite">
    {test.configurationError && <p role="alert" className="mb-3 break-words text-destructive">Configuration failed: {test.configurationError}</p>}
    {!test.busy && reasons.length > 0 && <div className="rounded-lg border border-border bg-muted p-3"><p className="font-semibold">Why mint approval is disabled</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></div>}
  </div>;
}