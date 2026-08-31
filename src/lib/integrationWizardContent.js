const productNotes = {
  phantom: "Add resolution inside Phantom’s recipient field and keep both the handle and final address visible on the send confirmation screen.",
  solflare: "For a Solflare product integration, add SolHandle resolution inside Send before transaction construction, then use verified reverse resolution for account identity. This is separate from connecting the Solflare wallet to a dApp through Solana Wallet Adapter.",
  backpack: "Use SolHandle in Send, account profiles and transaction history while preserving Backpack’s existing address controls.",
  solscan: "Index @handle as a searchable alias, deep-link to the current owner wallet and label only a verified Primary Handle.",
  jupiter: "Resolve handles before recipient-dependent actions and use reverse resolution only as a secondary wallet identity label.",
  squads: "Resolve treasury recipients before proposal creation and show handles beside the immutable addresses of members and signers.",
  "magic-eden": "Enrich owner and seller identity without changing listing settlement, custody or the marketplace’s asset verification.",
  tensor: "Display verified owner and seller handles and recognize official SolHandle assets through collection verification.",
  tiplink: "Resolve the recipient before generating a payment link; the link itself must contain the resulting wallet address.",
  decaf: "Resolve consumer and merchant handles before payment construction and retain the destination address in confirmation and receipts.",
  helius: "Expose resolution and reverse-resolution enrichment while keeping direct Solana state authoritative over indexed responses.",
  quicknode: "Offer resolver methods or add-on enrichment with protocol-version, collection and freshness metadata in every response.",
};

const typeContent = {
  wallet: { surface: "Recipient field + account identity", ui: "Show @handle above the shortened base58 destination on confirmation.", imports: "resolveRecipient", code: 'const recipient = await resolveRecipient(input, { connection });\nif (!recipient) throw new Error("Handle not found");\nif (recipient.kind === "solhandle" && !recipient.safeForNativeSol) {\n  throw new Error("Unsafe native SOL destination");\n}\nshowConfirmation(input, recipient.addressString);', tests: "Resolve, transfer ownership, reject fake collection, disclose address, enforce recipient safety." },
  explorer: { surface: "Global search + wallet page", ui: "Search @handle to open its current owner and label wallets only through verified reverse resolution.", imports: "resolveHandle", code: 'const result = await resolveHandle(connection, searchInput);\nif (!result) throw new Error("Handle not found");\nopenWallet(result.addressString);\nrenderLabel(result.handle, result.addressString);', tests: "Search normalization, ownership refresh, Primary Handle validity and stale-index rejection." },
  marketplace: { surface: "Owner, seller + asset pages", ui: "Place @handle beside the address; never replace settlement or custody addresses.", imports: "reverseResolve", code: 'const identity = await reverseResolve(connection, ownerAddress);\nrenderOwner({ address: ownerAddress, handle: identity?.handle });', tests: "Current owner, seller refresh, official collection enforcement and absent-primary fallback." },
  payments: { surface: "Payment recipient + receipt", ui: "Resolve before constructing Solana Pay or direct transfers and disclose the final wallet address.", imports: "resolveRecipient", code: 'const target = await resolveRecipient(input, { connection });\nif (!target) throw new Error("Handle not found");\nif (target.kind === "solhandle" && !target.safeForNativeSol) {\n  throw new Error("Unsafe native SOL destination");\n}\ncreatePayment({ recipient: target.address });', tests: "Safe recipient, address disclosure, payment construction, ownership refresh and not-found handling." },
  application: { surface: "Profiles, recipients + activity", ui: "Use handles as identity labels while addresses remain available for verification.", imports: "reverseResolve", code: 'const identity = await reverseResolve(connection, walletAddress);\nrenderIdentity(identity?.handle ?? shorten(walletAddress));', tests: "Primary ownership, recipient resolution, stale identity removal and address fallback." },
  infrastructure: { surface: "RPC method + indexed enrichment", ui: "Return address, handle, verification source, protocol version and freshness metadata.", imports: "resolveHandle", code: 'const result = await resolveHandle(connection, "@ansem");\nreturn result ? { ...result, authoritative: true } : null;', tests: "Chain parity, transfer freshness, collection spoofing, cache invalidation and deterministic errors." },
};

const codeLocations = {
  wallet: "the function that handles the Send recipient field, immediately after reading what the user typed",
  explorer: "the search submit handler, before your app decides which wallet page to open",
  marketplace: "the owner or seller data loader, after receiving the wallet address and before rendering the label",
  payments: "the payment form submit handler, before creating the Solana Pay URL or transfer instruction",
  application: "the profile or recipient data loader, before rendering a wallet identity",
  infrastructure: "the server-side resolver method, before returning the API or enrichment response",
};

export function getWizardSteps(integration) {
  const flow = typeContent[integration.type];
  const location = codeLocations[integration.type];
  return [
    { title: "Prepare your project", eyebrow: "START HERE", body: `${productNotes[integration.slug]} Find ${location}; that existing function is where SolHandle will be added.`, where: `Project area: ${flow.surface}.`, why: "SolHandle extends your existing address flow; it does not replace wallet connection, signing or transaction creation.", code: 'npm install solhandle-sdk @solana/web3.js\n\nimport { Connection } from "@solana/web3.js";\n\nconst connection = new Connection(\n  "https://your-mainnet-rpc.example",\n  "confirmed"\n);' },
    { title: "Add Mainnet resolution", eyebrow: "PASTE INTO YOUR FLOW", body: `Import ${flow.imports}, then paste this logic inside ${location}. Resolve again immediately before constructing a transaction so ownership is fresh.`, where: `Put it in: ${location}.`, why: "The SDK verifies the deterministic registry, official collection and current Core Asset owner directly through your Mainnet RPC connection.", code: `import { ${flow.imports} } from "solhandle-sdk";\n\n${flow.code}` },
    { title: "Design the native experience", eyebrow: "INTERFACE", body: flow.ui, detail: `Include: ${integration.capabilities.join(" · ")}.` },
    { title: "Apply security rules", eyebrow: "SAFETY", body: "Never send funds to the literal @handle. For native SOL, continue only when the current owner is a safe wallet destination; always expose the final address." },
    { title: `Verify ${integration.name}`, eyebrow: "TEST SUITE", body: `SolHandle verifies ${integration.name} through a reproducible Mainnet test run against the submitted staging build or integration endpoint—not from a written claim.`, where: "Submit the staging URL or build, the exact integration version and a technical contact. The verifier runs on Mainnet with fresh test wallets and handles.", why: "This proves that resolution, ownership changes and safety checks work in the real product—not only in an isolated local script.", checks: ["Resolve a real @handle to its current NFT owner", "Transfer that handle and confirm the destination updates", "Present a lookalike asset from a fake collection and confirm rejection", "Confirm the interface discloses both @handle and base58 address", "Use an unsafe native-SOL destination and confirm the action is blocked"], detail: `Pass condition: all five checks succeed and produce reproducible evidence. Integration-specific scope: ${flow.tests}` },
  ];
}