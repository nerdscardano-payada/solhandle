# Partner Mint SDK 1.1.0 source preview

Devnet-only administrator pilot. This source extension is not yet an npm release,
public partner API, production integration, or Mainnet activation. The existing
Mainnet resolution exports and constants are unchanged. Do not use the resolution
SDK's MAINNET_RPC, PROGRAM_ID or COLLECTION_ID for Partner Mint.

## Transport and access

`createPartnerMintClient({ partnerId, cluster: 'devnet', invoke })` accepts an
explicit authenticated transport. `invoke(name, payload)` must return
`{ data: responseBody }`. The existing handlers are `partnerMintRead` and
`partnerMintTransaction`. In the hosted example, use the existing app client:

```js
const invoke = (name, payload) => base44.functions.invoke(name, payload);
```

No app secret, service-role token, API key, seed phrase or user signing key belongs
in the browser. This release does not grant external partners administrator
access. Their independent authentication, scoped credentials, origin verification
and public abuse controls are still Phase 2 work. A transport is not an auth bypass.
The SDK does not invent REST routes, deploy a gateway, or bypass backend approval.
An external host needs an approved authenticated transport before it can call the pilot.

## Explicit review then signing

The runnable example is `examples/partner-mint-devnet.js`. The hosted version is
at `/developers/partner-mint/devnet-sdk?partner=devnet-testpartner` and is restricted
to logged-in protocol administrators. It executes this same example module.
Use an approved on-chain Devnet partner, a claimant wallet set to Devnet, and test SOL.
A partner ID is public attribution, not a credential. Normally the claimant must
differ from the partner revenue wallet and protocol treasury.

1. `checkAvailability(handle)` returns advisory on-chain availability, not a reservation.
2. `getMintQuote(handle, walletOrPublicKey)` obtains a live signed quote and intent.
3. `prepareMint(quoted)` simulates and returns the versioned transaction and separate costs.
4. Display the handle, wallet, verified recipients, official collection, exact split,
   expiry, estimated rent/network fees, total debit and wallet priority-fee cap.
5. Only after explicit approval call `mint({ prepared, wallet, onSigned })`.
6. `onSigned(record)` must durably save the signed record before returning. A persistence
   failure stops relay. Persist public signed bytes and intent identifiers, never keys.
7. `getMintStatus(intentId)` checks confirmation/finalization; submit is not success.

The SDK never discovers, selects, reconnects or substitutes wallets. Pass a signing
wallet with `publicKey` and `signTransaction(VersionedTransaction)`. For React
contexts, use a live ref-backed signer, as in the hosted example, to observe wallet
changes during asynchronous steps. The SDK checks payer, dedicated Devnet program,
quote binding, integer split, expiry and review changes. The existing service and
on-chain program remain authoritative for signature validation and settlement.

## Recovery and errors

`submitMint(savedRecord)` relays identical signed bytes without another signature.
First check status. A timeout, missing receipt or PENDING result never authorizes
another intent. CONFIRMED still needs a later FINALIZED check. An EXPIRED result
with a signature is not safely terminal until `expiredWithoutReceiptVerified` is true.
The example restores the signed record after reload using browser-local storage.
Do not clear an unresolved record; a storage clear removes that browser's recovery copy.

`PartnerMintError.code` preserves backend errors such as RATE_LIMITED,
ADMIN_PILOT_ONLY, HANDLE_UNAVAILABLE, QUOTE_EXPIRED, BLOCKHASH_EXPIRED and
PARTNER_NOT_APPROVED. Transport failures use TRANSPORT_ERROR and retain status,
requestId and cause where available. Client guards include DEVNET_ONLY,
INVALID_PARTNER_ID, INVALID_HANDLE, WRONG_CLUSTER, QUOTE_MISMATCH,
INVALID_SPLIT, TRANSACTION_MISMATCH, SIGNER_REQUIRED, ALREADY_SIGNED and WALLET_CHANGED.
REVIEW_CHANGED includes `error.prepared`, which must be shown for fresh approval.
Failures after signing include `error.signedRecord` for recovery, not re-signing.
Wallet rejections are propagated; the SDK never retries signing automatically.

## Amounts, scope and distribution

All lamport amounts are decimal strings. Use BigInt for calculations and SOL only
for display. Partner receives floor(mintFee / 2); protocol gets the remainder.
Account rent, network/priority fees and storage are outside the split. No HANDLE
payments, Earn primary-mint commission, ordinary mint modifications or Mainnet relay.

Package exports: `solhandle-sdk` (existing exports plus factory) and the focused
`solhandle-sdk/partner-mint` subpath. Use this repository's local source package
until a separately approved npm release. No new install command is implied.
React component/widget packaging and partner dashboards are not part of this increment.