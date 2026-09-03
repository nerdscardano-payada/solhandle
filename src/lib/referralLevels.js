export function referralLevel(count = 0) {
  if (count >= 500) return { name: "Legend", next: null };
  if (count >= 100) return { name: "Partner", next: 500 };
  if (count >= 25) return { name: "Ambassador", next: 100 };
  if (count >= 5) return { name: "Scout", next: 25 };
  return { name: "Rising promoter", next: 5 };
}

export const sol = (lamports = 0) => `${(Number(lamports) / 1e9).toFixed(3)} SOL`;