# @solhandle/sdk

Official read-only Mainnet Beta SDK for resolving and verifying SolHandle identities directly against Solana.

## Trust model

Solana is the source of truth. The SDK derives deterministic protocol accounts, verifies the SolHandle program owner, verifies the Metaplex Core asset, and requires membership of the official SolHandle collection before returning an identity.

- Program: `B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf`
- Collection: `7XZzcbeFBxQA63n9avz44vnbpv34hDGYyHfCDmTdPBJP`
- Network: `mainnet-beta`

## Install

```bash
npm install @solhandle/sdk @solana/web3.js
```

## Resolve a handle

```js
import { resolveHandle } from "@solhandle/sdk";

const identity = await resolveHandle("@ansem", {
  rpcUrl: "https://your-mainnet-rpc.example",
});

if (identity?.verified) {
  console.log(identity.address);
}
```

Applications sending native SOL must also require `safeForNativeSol === true`. A verified handle may resolve to a valid NFT owner that is not a safe native-SOL destination.

## Use an existing connection

```js
import { Connection } from "@solana/web3.js";
import { resolveHandle } from "@solhandle/sdk";

const connection = new Connection("https://your-mainnet-rpc.example", "confirmed");
const identity = await resolveHandle("ansem", { connection });
```

## Reverse resolution

```js
import { reverseResolve } from "@solhandle/sdk";

const primary = await reverseResolve("WALLET_ADDRESS", {
  rpcUrl: "https://your-mainnet-rpc.example",
});
```

Reverse resolution is accepted only when the primary record still resolves to an official asset currently owned by that wallet.

## API

- `normalizeHandle(value)`
- `validateHandle(value)`
- `resolveHandle(handle, options)` / `getHandle(handle, options)`
- `verifySolHandle(handle, options)`
- `isHandleAvailable(handle, options)`
- `reverseResolve(wallet, options)` / `getPrimaryHandle(wallet, options)`
- `getHandlesByOwner(wallet, options)`
- `getHandlePda(handle)`, `getAssetPda(handle)`, `getPrimaryHandlePda(wallet)`

`options` accepts an existing `connection`, or an `rpcUrl` and optional commitment. Production integrations should provide a dedicated Mainnet RPC URL rather than relying on the public default endpoint.

## Before first publication

1. Confirm ownership of the npm scope `@solhandle`.
2. Choose and add the intended open-source license; the package remains `UNLICENSED` until that decision is made.
3. Run `npm test` and `npm run pack:check` from this directory.
4. Authenticate with npm and publish with `npm publish`.