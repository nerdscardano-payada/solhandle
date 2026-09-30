export default function formatHandleTokens(raw, decimals) {
  const digits = BigInt(raw || '0').toString().padStart(decimals + 1, '0');
  const integer = decimals ? digits.slice(0, -decimals) : digits;
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}