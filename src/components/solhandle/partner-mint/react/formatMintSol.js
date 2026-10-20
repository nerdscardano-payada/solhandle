export default function formatMintSol(value) {
  const n = BigInt(value), fraction = (n % 1000000000n).toString().padStart(9, '0').replace(/0+$/, '');
  return `${n / 1000000000n}${fraction ? '.' + fraction : ''}`;
}