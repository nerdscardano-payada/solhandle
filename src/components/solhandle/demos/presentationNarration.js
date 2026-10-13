const benefits = {
  'wallet-identity': 'Same wallet. Same ownership. A verified name makes your identity recognizable.',
  resolver: 'A memorable name resolves to its current, verified wallet owner.',
  'reverse-resolver': 'This wallet has a verified primary name, not a guessed nickname.',
  'wallet-send': 'Enter a name instead of pasting an address. The destination stays the same.',
  'wallet-receive': 'Share a memorable name. The QR still points to the same wallet.',
  payments: 'Review a payment to a verified identity. No funds move in this preview.',
  explorer: 'Recognize the identity behind an address. This activity is illustrative.',
  trading: 'Recognize the trader behind the address. These trades are only examples.',
  'partner-mint': 'Real availability inside a partner concept. This preview does not mint anything.',
  developer: 'A real API or SDK response powers a human readable application identity.'
};
export default function presentationNarration(slug, mode, result, rpcUrl) {
  const mint = mode === 'availability';
  return [
    mint ? 'An app nickname stays inside one app. Compare it with an on chain identity.' : 'A long wallet address is hard to recognize. Watch the identity become readable.',
    mint ? 'Live availability was checked on the blockchain before playback. This is the actual result.' : `${rpcUrl ? 'The SDK' : 'The API'} verified ${mode === 'reverse' ? 'the primary name and its owner' : 'the current owner'} before playback. This is real lookup data.`,
    mint && !result?.available ? 'This name is not available to claim. No successful mint is simulated.' : benefits[slug],
    mint ? 'This evidence proves availability, not a completed mint. No transaction was signed.' : 'The identity is verified. Example balances and activity are illustrative. No transaction was signed.'
  ].map(text => text.replace(/\bAPI\b/g, 'A P I').replace(/\bSDK\b/g, 'S D K'));
}