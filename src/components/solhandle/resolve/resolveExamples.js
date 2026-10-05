export const endpoint = 'https://sol-handle-core.base44.app/functions/resolveSolHandle';
export const javascript = `async function resolveSolHandle(handle) {
  const response = await fetch("${endpoint}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle }),
    cache: "no-store"
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Resolution failed.");
  if (!result.verified || !result.collectionVerified ||
      result.network !== "mainnet-beta") {
    throw new Error("Unverified SolHandle result.");
  }
  return result;
}

// Inside an async event handler or an ES module:
const identity = await resolveSolHandle("@ansem");
console.log(identity.address); // Current owner wallet address`;
export const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SolHandle Resolve</title>
<form id="resolve-form">
  <label for="handle">SolHandle</label>
  <input id="handle" value="@ansem" required>
  <button id="resolve-button" type="submit">Resolve</button>
</form>
<p id="wallet" role="status" style="overflow-wrap:anywhere"></p>
<script>
${javascript.split('\n// Inside')[0]}
const form = document.getElementById("resolve-form");
const button = document.getElementById("resolve-button");
const output = document.getElementById("wallet");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  output.textContent = "Resolving…";
  try {
    const identity = await resolveSolHandle(document.getElementById("handle").value);
    output.textContent = identity.handle + " → " + identity.address;
  } catch (error) {
    output.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
</script>
</html>`;
export const curl = `curl -X POST '${endpoint}' \\
  -H 'Content-Type: application/json' \\
  -d '{"handle":"@ansem"}'`;
export const responseExample = JSON.stringify({handle:'@solhandle',address:'CZvu8vnzLKyfGmbpixypQcfW4iiw7em43utW4k6ordYP',status:'claimed',verified:true,collectionVerified:true,safeForNativeSol:true,destinationType:'SYSTEM_WALLET',handlePda:'36tDQhnZS4N2vpiMTZkHVGT9Me9ShydESKTXLp8cYvX2',assetAddress:'HCKA5z8FSog2KrvNQcDTXqWg8yL7fDXCAhTyVFMuH8SS',network:'mainnet-beta'}, null, 2);
export const sdk = `// npm install solhandle-sdk@1.0.1 @solana/web3.js@^1.98.4
import { Connection } from "@solana/web3.js";
import { resolveHandle } from "solhandle-sdk";

// Set rpcUrl to your own Mainnet RPC endpoint.
const connection = new Connection(rpcUrl, "confirmed");
const identity = await resolveHandle(connection, "@ansem");
if (!identity) throw new Error("Handle not found.");
console.log(identity.address.toBase58());`;
export const sections = [
  {id:'quick-start',title:'1. JavaScript: one request, one identity',text:'Copy this into your application. Works with native fetch in modern browsers and Node.js 18+. No API key, wallet connection, npm package or personal RPC endpoint is required for this hosted resolver.',code:javascript,language:'JavaScript'},
  {id:'website',title:'2. Drop into any website',text:'A complete standalone page with loading and error states. Copy it into an HTML file or download the ready-to-use example. It resolves addresses only; it does not connect a wallet, sign messages or send funds.',code:html,language:'HTML',download:true},
  {id:'api',title:'3. HTTP API',text:'POST JSON with a handle, with or without one leading @. Canonical names use 1–20 letters or digits and are normalized to lowercase. The endpoint supports browser CORS for POST and OPTIONS; responses use Cache-Control: no-store. Use the exact endpoint below, not a proposed /api route.',code:curl,language:'Shell'},
  {id:'response',title:'4. Response contract',text:'Example response for @solhandle, observed when this guide was created. Addresses are not constants: the NFT can be transferred. Always use the current result, not this example address.',code:responseExample,language:'JSON'},
  {id:'sdk',title:'5. Direct on-chain SDK',text:'Prefer independent chain reads? The published solhandle-sdk 1.0.1 package includes TypeScript declarations and an MIT license. Supply your own Mainnet RPC endpoint. It validates the protocol configuration, registry, deterministic asset, official collection and current owner without calling our hosted API.',code:sdk,language:'JavaScript'}
];