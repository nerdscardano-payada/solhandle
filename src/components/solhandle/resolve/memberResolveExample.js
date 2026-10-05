export const memberJavascript = `async function getMemberLabel(address) {
  try {
    const response = await fetch("https://sol-handle-core.base44.app/functions/reverseResolveSolHandle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
      cache: "no-store"
    });
    if (response.status === 404) return address;
    if (!response.ok) throw new Error("Lookup unavailable");
    const result = await response.json();
    if (!result.verified || result.network !== "mainnet-beta" ||
        result.address !== address || !result.primaryHandle) return address;
    return result.primaryHandle;
  } catch {
    return address; // Keep the original wallet visible on failure.
  }
}

// Add data-solhandle-wallet to the wallet labels your platform renders.
// Keep your member IDs and wallet addresses unchanged.
async function updateMemberLabels(root = document) {
  for (const label of root.querySelectorAll("[data-solhandle-wallet]")) {
    const address = label.dataset.solhandleWallet;
    label.textContent = address;
    label.textContent = await getMemberLabel(address);
    label.title = address;
  }
}

// Call after rendering each visible page of members, comments or leaderboard rows.
updateMemberLabels();`;
export const memberMarkup = `<span data-solhandle-wallet="MEMBER_WALLET_ADDRESS">MEMBER_WALLET_ADDRESS</span>`;