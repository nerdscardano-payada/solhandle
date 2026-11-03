import AdvisorCopyBlock from '@/components/solhandle/ai-advisor/AdvisorCopyBlock';
const environment='SOLANA_RPC_URL=REPLACE_WITH_YOUR_PRIVATE_MAINNET_RPC_URL';
const node='// Server only: Node.js. Load SOLANA_RPC_URL before this runs.\nconst mainnetRpcUrl = process.env.SOLANA_RPC_URL;\nif (!mainnetRpcUrl) {\n  throw new Error("Set SOLANA_RPC_URL on your server, then restart it.");\n}';
const deno='// Server only: Deno. Use this instead of the Node.js example.\nconst mainnetRpcUrl = Deno.env.get("SOLANA_RPC_URL");\nif (!mainnetRpcUrl) {\n  throw new Error("Set SOLANA_RPC_URL on your server, then restart it.");\n}';
export default function AdvisorRpcSetup() {
 return <section className="advisor-rpc-setup">
  <h4>2. Set up your Solana connection (RPC)</h4>
  <p>An RPC is the server your application uses to read Solana. Use your project's existing dedicated Solana Mainnet RPC, or obtain a Mainnet endpoint from an RPC provider. Do not use a Devnet or Testnet endpoint.</p>
  <ol>
   <li><strong>Save the URL on your server.</strong> In your hosting provider's server secrets or environment settings, add a variable named <code>SOLANA_RPC_URL</code>. Its value is your full Mainnet RPC URL, including its provider key if required. This belongs to the project integrating SolHandle; SolHandle does not supply their RPC credentials.</li>
   <li><strong>For local development only:</strong> put the line below in a private <code>.env</code> file in your server project. Replace the placeholder with your own URL. Add <code>.env</code> to <code>.gitignore</code>; never commit or share it. A .env file is not loaded automatically by every server: use your framework's server environment loader, or Node.js 20.6+ with <code>node --env-file=.env YOUR_SERVER_ENTRY.js</code>, replacing the entry name with your actual server entry.</li>
  </ol>
  <AdvisorCopyBlock label="Local server .env example: replace the placeholder" value={environment}/>
  <p><strong>Read the saved value:</strong> choose only the example matching your server runtime, Node.js or Deno. Put it alongside the helper in your server code, before calling the helper. Both define <code>mainnetRpcUrl</code>, which the examples below pass to the SDK helper. Other runtimes should use their own server secret reader.</p>
  <AdvisorCopyBlock label="Node.js server: read SOLANA_RPC_URL" value={node}/>
  <AdvisorCopyBlock label="Deno server: alternative to Node.js" value={deno}/>
  <p><strong>Restart or redeploy your server</strong> after saving the variable. Never put the URL in browser code, a public environment variable such as <code>VITE_*</code> or <code>NEXT_PUBLIC_*</code>, a response, or a log. Your interface calls your own server; only the server contacts the private RPC.</p>
  <p><strong>Check the connection:</strong> use the integration below with a real existing Mainnet handle. Confirm that the returned address matches its current owner. If a lookup fails, check that the variable is loaded, the provider key is valid and the endpoint is Mainnet; show an error and never continue a payment with an old result. A successful lookup alone does not verify the whole integration.</p>
 </section>;
}