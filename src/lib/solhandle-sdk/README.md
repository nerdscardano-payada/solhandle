# SolHandle

Human-readable wallet identities for Solana.

`@ansem → current verified Core Asset owner`

## Quick start

```bash
npm install solhandle-sdk @solana/web3.js
```

```js
import { Connection } from "@solana/web3.js";
import { resolveHandle } from "solhandle-sdk";

const connection = new Connection("https://your-mainnet-rpc.example", "confirmed");
const result = await resolveHandle(connection, "@ansem");

if (result) console.log(result.address.toBase58());
```

Solana is the source of truth. Resolution does not call SolHandle, Base44, an indexer, or a private API.

## Mainnet constants

- Program: `B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf`
- Official Core Collection: `7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP`
- Protocol version: `2`
- Network: `mainnet-beta`

These values are immutable exports in the package. Production integrations should provide a dedicated RPC endpoint.

## Deployed protocol compatibility

The Partner SDK package is version `1.0.0`, while the deployed on-chain protocol is version `2`. The live protocol uses lowercase `a-z` and `0-9`, 1–20 characters, with direct canonical-name PDA seeds. Hash-based seeds, underscores, 32-character names, and version fields inside every record would require a new on-chain protocol deployment and are intentionally not simulated by this SDK.

## Public API

- `isSolHandle(input)`
- `normalizeHandle(input)` / `validateHandle(input)`
- `deriveHandlePda(handle)` / `getHandlePda(handle)`
- `resolveHandle(connection, handle)`
- `reverseResolve(connection, wallet)` / `getPrimaryHandle(...)`
- `getHandle(connection, handle)`
- `verifyOwnership(connection, handle, wallet)`
- `buildSetPrimaryInstruction(handle, wallet)`
- `resolveRecipient(input, options)`
- `isHandleAvailable(handle, options)`
- `getHandlesByOwner(wallet, options)`

The earlier `resolveHandle(handle, { connection })` calling style remains supported.

## Verification performed

A successful result is returned only after verifying:

1. canonical handle syntax and deterministic HandleRecord PDA;
2. HandleRecord ownership by the official SolHandle program;
3. supported Config protocol version;
4. registry canonical name and linked deterministic asset;
5. asset ownership by Metaplex Core;
6. membership in the official SolHandle collection;
7. the current owner read directly from the Core Asset account.

If the Core Asset has been burned while its permanent registry remains, resolution throws `HANDLE_RETIRED`. Reverse resolution re-runs forward verification and returns `null` when the wallet no longer owns the asset.

## Recipient flow

```js
const recipient = await resolveRecipient(input, { connection });
if (!recipient) throw new Error("Handle not found");
if (recipient.kind === "solhandle" && !recipient.safeForNativeSol) {
  throw new Error("Unsafe native SOL destination");
}
const destination = recipient.address;
```

Always show the final base58 destination before confirmation and refresh resolution immediately before constructing a payment transaction.

## Deterministic errors

`SolHandleError.code` can be:

- `INVALID_HANDLE`
- `HANDLE_RETIRED`
- `UNSUPPORTED_PROTOCOL_VERSION`
- `INVALID_REGISTRY_ACCOUNT`
- `INVALID_COLLECTION`
- `ASSET_NOT_FOUND`
- `OWNERSHIP_INVALID`
- `PRIMARY_HANDLE_STALE`
- `RPC_ERROR`

## Set primary without Anchor

```js
const instruction = buildSetPrimaryInstruction("@ansem", walletPublicKey);
transaction.add(instruction);
```

The package depends only on `@solana/web3.js`; Anchor and Metaplex client packages are not required.

## Release checks

From this package directory:

```bash
npm test
npm run pack:check
```

SolHandle SDK is released under the MIT License. See `LICENSE` for the full terms.