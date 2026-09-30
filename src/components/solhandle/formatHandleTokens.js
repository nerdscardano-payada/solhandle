export default function formatHandleTokens(raw, decimals) {
  const digits = BigInt(raw || '0').toString().padStart(decimals + 1, '0');
  const integer = decimals ? digits.slice(0, -decimals) : digits;
  const wholeTokens = BigInt(integer);
  if (wholeTokens >= 1_000_000n) {
    const millions = wholeTokens / 1_000_000n;
    const fraction = ((wholeTokens % 1_000_000n) / 1_000n).toString().padStart(3, '0');
    return `${millions},${fraction} M`;
  }
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}