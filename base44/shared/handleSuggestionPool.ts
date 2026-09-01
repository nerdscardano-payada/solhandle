const fallbackSuggestions = [
  ["orbit", ["identity", "space"], ["personal", "solana"]],
  ["ember", ["identity", "creative"], ["personal", "modern"]],
  ["drift", ["identity", "movement"], ["personal", "solana"]],
  ["pixel", ["identity", "digital"], ["creative", "modern"]],
  ["lunar", ["identity", "space"], ["personal", "web3"]],
  ["bloom", ["identity", "nature"], ["personal", "positive"]],
  ["swift", ["identity", "movement"], ["personal", "modern"]],
  ["echo", ["identity", "creative"], ["personal", "memorable"]],
  ["cloud", ["identity", "digital"], ["personal", "modern"]],
  ["vibe", ["identity", "social"], ["personal", "memorable"]],
  ["247", ["numbers", "identity"], ["numeric", "personal"]],
  ["404", ["numbers", "digital"], ["numeric", "memorable"]],
  ["808", ["numbers", "creative"], ["numeric", "music"]],
  ["314", ["numbers", "identity"], ["numeric", "personal"]],
  ["1010", ["numbers", "digital"], ["numeric", "modern"]],
  ["2026", ["numbers", "identity"], ["numeric", "personal"]],
  ["2121", ["numbers", "identity"], ["numeric", "memorable"]],
  ["12345", ["numbers", "identity"], ["numeric", "personal"]]
];

export function getFallbackSuggestions() {
  return fallbackSuggestions.map(([handle, categories, tags]) => ({ handle, categories, tags, handle_score: 50 }));
}

export function uniqueSuggestionRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const handle = String(row?.handle || "").toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle) || seen.has(handle)) return false;
    seen.add(handle);
    row.handle = handle;
    return true;
  });
}

export function shuffled(rows) {
  return [...rows].sort(() => Math.random() - 0.5);
}