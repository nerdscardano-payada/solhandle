export const lookupCode = `// Node.js ESM: save the downloaded solhandle-sdk.mjs beside this file.
import { Connection, PublicKey } from '@solana/web3.js';
import { reverseResolve, resolveHandle } from './solhandle-sdk.mjs';

const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');

export async function findCreatorHandle(walletAddress) {
  const primary = await reverseResolve(connection, new PublicKey(walletAddress));
  return primary?.handle ?? null; // No primary: allow manual handle entry.
}

export async function checkHandleOwner(handle, walletAddress) {
  const current = await resolveHandle(connection, handle);
  if (!current || !current.address.equals(new PublicKey(walletAddress))) {
    throw new Error('This wallet does not currently own this handle.');
  }
  return {
    handle: current.handle,
    wallet: current.addressString,
    asset: current.assetAddress,
    network: current.network,
  };
}`;

export const challengeCode = `// SERVER: issue only after checking the signed-in user's project permissions.
import { randomBytes } from 'node:crypto';
import { PublicKey } from '@solana/web3.js';

export function makeChallenge({ domain, projectId, sessionId, wallet, handle }) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 5 * 60 * 1000;
  const record = {
    nonce: randomBytes(32).toString('hex'),
    domain, projectId, sessionId,
    wallet: new PublicKey(wallet).toBase58(),
    handle, issuedAt, expiresAt,
  };
  record.message = [
    'SolHandle identity linking',
    'Domain: ' + domain,
    'Action: Link wallet to Project Passport',
    'Project: ' + projectId,
    'Wallet: ' + record.wallet,
    'Handle: ' + handle,
    'Nonce: ' + record.nonce,
    'Issued at: ' + new Date(issuedAt).toISOString(),
    'Expires at: ' + new Date(expiresAt).toISOString(),
    'This signature does not authorize a payment or transfer project access.',
  ].join('\\n');
  return record;
}
// Save the entire record server-side before returning { nonce, message }.
// Set domain from trusted server config, never from the request payload.
// Use the canonical handle returned by checkHandleOwner().`;

export const signingCode = `// BROWSER: use the currently connected Solana wallet adapter.
// challenge is returned by YOUR backend, not a SolHandle endpoint.
export async function signLinkChallenge(challenge, publicKey, signMessage) {
  if (!publicKey || !signMessage) throw new Error('Connect a wallet with message signing.');
  const walletBefore = publicKey.toBase58();
  const signed = await signMessage(new TextEncoder().encode(challenge.message));
  return {
    nonce: challenge.nonce,
    wallet: walletBefore,
    signatureBase64: btoa(Array.from(signed, byte => String.fromCharCode(byte)).join('')),
  };
}
// POST the result to your verification endpoint using your authenticated session.
// On wallet-account change, discard the challenge and start again.`;

export const verifyCode = `// SERVER: Node.js Ed25519 verification, no extra crypto dependency.
import { createPublicKey, verify } from 'node:crypto';
import { PublicKey } from '@solana/web3.js';
import { checkHandleOwner } from './lookup.mjs';

export async function validateLinkProof({ record, sessionId, projectId, signatureBase64 }) {
  // record MUST come from your database, fetched by the submitted nonce.
  if (!record || record.usedAt || record.sessionId !== sessionId ||
      record.projectId !== projectId || record.expiresAt <= Date.now()) {
    throw new Error('Invalid, expired or already used challenge.');
  }
  if (typeof signatureBase64 !== 'string' || signatureBase64.length > 100) {
    throw new Error('Invalid signature.');
  }
  const signature = Buffer.from(signatureBase64, 'base64');
  const key = createPublicKey({
    key: Buffer.concat([
      Buffer.from('302a300506032b6570032100', 'hex'),
      Buffer.from(new PublicKey(record.wallet).toBytes()),
    ]), format: 'der', type: 'spki',
  });
  if (signature.length !== 64 ||
      !verify(null, Buffer.from(record.message, 'utf8'), key, signature)) {
    throw new Error('Wallet signature is invalid.');
  }
  const current = await checkHandleOwner(record.handle, record.wallet);
  if (Date.now() >= record.expiresAt) throw new Error('Challenge expired.');
  return { ...current, verifiedAt: new Date().toISOString() };
}
// Before calling: validate session/CSRF, request size and project permissions.
// After calling: in ONE database transaction, recheck project permissions,
// conditionally consume the nonce WHERE usedAt IS NULL AND expiresAt > now,
// require exactly one updated row, then insert the immutable verification event
// and link the passport. If the conditional update fails, roll back everything.
// Never save a link if nonce consumption fails. Do not trust a client message,
// project ID, wallet or expiry instead of the stored challenge values.`;

export const transferCode = `import { resolveHandle } from './solhandle-sdk.mjs';

export async function refreshAssociation(connection, savedVerification) {
  try {
    const current = await resolveHandle(connection, savedVerification.handle);
    if (!current || current.assetAddress !== savedVerification.asset ||
        current.addressString !== savedVerification.wallet) {
      return { status: 'REVERIFICATION_REQUIRED', currentWallet: current?.addressString ?? null };
    }
    return { status: 'VERIFIED', currentWallet: current.addressString };
  } catch (error) {
    if (error.code === 'HANDLE_RETIRED') {
      return { status: 'REVERIFICATION_REQUIRED', currentWallet: null };
    }
    // RPC failure or invalid data is not proof of transfer.
    return { status: 'UNAVAILABLE', currentWallet: null };
  }
}
// Persist status separately. Never overwrite savedVerification.wallet.
// Once invalidated, do not automatically restore VERIFIED on a later match;
// require a new signature and a new verification event.
// Reports reference verificationEventId + originalWallet, never just @handle.`;

export const guideSections = [
  { id: 'overview', title: '01 / Scope and responsibilities', text: 'Pilot: link one creator wallet and its SolHandle to a Project Passport, then reuse the pattern for Project Atlas. Existing Wallet Watch and Terminal replay lookups remain unchanged.', bullets: ['SolHandle provides canonical on-chain handle resolution and ownership checks. A verified handle is not an endorsement of the person or project.', 'Parallax provides wallet connection, signed-message challenges, server-side signature verification, project permissions and durable history.', 'This is an implementation guide with reference snippets, not a hosted project-linking service. The challenge and persistence endpoints belong to Parallax. No private keys or seed phrases are ever requested.'] },
  { id: 'setup', title: '02 / SDK setup and network', text: 'Download the self-contained SDK below and save it as solhandle-sdk.mjs in your Node.js ESM project. It includes the existing SolHandle resolver and MIT license. This route does not depend on an unverified npm package release.', code: 'npm install @solana/web3.js@^1.98.4\n# Configure SOLANA_RPC_URL on your server with your production Mainnet RPC.\n# Save the lookup snippet as lookup.mjs beside solhandle-sdk.mjs.', language: 'Setup', bullets: ['Network: Solana mainnet-beta. Commitment in these examples: confirmed. For higher assurance, perform a finalized recheck before treating a link as durable.', 'Program: B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf', 'Official collection: 7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP', 'Protocol version: 2. Handles: 1–20 letters a–z or digits 0–9, canonicalized to lowercase. Keep private RPC credentials on the server.'] },
  { id: 'lookup', title: '03 / Resolve and display the creator identity', text: 'Use reverse lookup for the connected wallet. If no primary is set, let the creator enter a handle and run the same forward ownership check. Display the full current wallet address beside the handle; do not label lookup alone as wallet authentication.', code: lookupCode, language: 'lookup.mjs • Node.js ESM', bullets: ['Catch lookup failures in your UI and show an unavailable/retry state. Do not infer handle availability from a failed lookup.', 'The SDK validates the canonical registry, official Core asset and collection, then reads its current owner. Native SOL destination classification is unrelated to signing control or project permissions.'] },
  { id: 'challenge', title: '04 / Issue a single-use linking challenge', text: 'Recommended endpoint contract: POST /identity/challenge on your own server, with the selected project, wallet and handle. Authenticate the session, check permission to manage that project, resolve ownership, then create and store the challenge. A five-minute lifetime is an example policy, not a protocol requirement.', code: challengeCode, language: 'Server reference', bullets: ['Return only nonce and exact message to the browser. Bind each stored challenge to its session, project, canonical handle and wallet.', 'Apply per-session/IP rate limits, request-size limits and CSRF protection where cookie authentication is used. Do not log signatures or complete challenge payloads unnecessarily.'] },
  { id: 'sign', title: '05 / Sign the message, not a transaction', text: 'Ask the creator to sign only after an explicit Link passport action. This proves control of the signing key without transferring funds or an NFT. A refusal leaves the passport unchanged.', code: signingCode, language: 'Browser reference', bullets: ['If message signing is unsupported, stop and explain that a compatible wallet is required. Never silently substitute a payment or transaction.', 'Discard pending verification when the connected account changes. The server always checks the stored wallet, not a client-provided replacement.'] },
  { id: 'verify', title: '06 / Verify and commit the link', text: 'Recommended endpoint contract: POST /identity/verify on your own server. Fetch the challenge by nonce, use its exact stored message, verify the signature and re-resolve ownership. The helper below validates the proof; the atomic database operation described underneath is mandatory before creating the link.', code: verifyCode, language: 'Server reference • save beside lookup.mjs', bullets: ['Store an immutable verification event with id, projectId, actorUserId, wallet, canonical handle, asset address, network, commitment and verifiedAt. Store nonce consumption with a conditional database update in the same transaction as the link.', 'Create reports with originalWallet, handleAtReportTime and verificationEventId. Read historical attribution from that event, never by resolving the name today.', 'A new verification creates a new event. Do not rewrite old events or reports. A wallet signature does not itself grant permission to manage a project.'] },
  { id: 'transfers', title: '07 / Transfers, monitoring and historical reports', text: 'Recheck on passport access and immediately before sensitive actions. For background monitoring, poll active associations with a bounded queue, or subscribe to the official asset account through your RPC provider and rerun canonical resolution after a change. Recheck after subscription reconnects.', code: transferCode, language: 'Ownership refresh reference', bullets: ['Polling detects current owner mismatches, not every intermediate transfer. A transfer away and back between checks can be missed. If every transfer must invalidate proof, add durable transaction/event tracking with replay and checkpoints; subscriptions alone are not a complete history.', 'On confirmed ownership change, persist REVERIFICATION_REQUIRED and require a fresh proof. On RPC failure, use UNAVAILABLE and block new links and sensitive identity-dependent actions until checked; do not claim a transfer occurred.', 'Example: @ansem moves from wallet A to B. The current address becomes B; the original passport and reports remain attributed to A. B receives no project access. Re-linking requires existing project authorization and a new proof.'] },
  { id: 'costs', title: '08 / Costs, limits and caching', text: 'The downloadable SDK is MIT-licensed. Direct resolution uses Parallax’s own Solana RPC and makes no SolHandle-hosted API calls. Reads and message signatures do not incur Solana transaction fees; provider charges may still apply.', bullets: ['In the current SDK, a successful forward lookup normally uses two RPC requests: a batched registry/asset/config read and a destination account read. A successful primary reverse lookup normally uses three. Missing records and errors can finish earlier; provider billing and retries may differ.', 'Use short display caches, for example 30 seconds, and label the last checked time. Bypass your application cache for linking and sensitive actions. Avoid full registry scans for this flow.', 'RPC request quotas, WebSocket limits and prices belong to your provider. Use bounded concurrency and backoff on throttling. No hosted API quota, price or uptime commitment is agreed by this guide.', 'Estimate usage from active associations, refresh cadence and verification traffic. If checks are scheduled every N minutes, baseline forward polling is approximately active associations × 60/N × 2 RPC requests per hour, before retries and user activity.'] },
  { id: 'acceptance', title: '09 / Joint pilot acceptance checklist', text: 'Start with one Project Passport and expand to Atlas only after this complete flow is accepted together.', bullets: ['Connect, show primary handle and full wallet, sign, verify and persist a passport link.', 'No primary handle: manual selection succeeds only for a currently owned handle.', 'Wrong wallet, account switch, signature refusal, altered message, expired nonce and replay all leave the passport unchanged.', 'Two concurrent verification requests using the same nonce produce exactly one committed link/event.', 'A handle transfer invalidates the association without moving project access or historical reports; a fresh proof requires project permission.', 'Retired handles, RPC outages, throttling and subscription reconnects show the correct state without stale success.', 'Confirm production RPC configuration, expected traffic, agreed monitoring interval and whether intermediate transfers must be captured.'] },
];