# SolHandleMint React source component

Reusable React UI on the existing Partner Mint SDK. This is an in-repository source component using the project's Tailwind tokens and UI primitives, not a published standalone npm package. Backend access remains administrator-only and Devnet-only. No public partner access or Mainnet activation is added.

```jsx
import SolHandleMint from '@/components/solhandle/partner-mint/react/SolHandleMint';

<SolHandleMint
  partnerId="devnet-testpartner"
  cluster="devnet"
  wallet={connectedWallet}
  invoke={authenticatedInvoke}
  onConnect={openWalletChooser}
  onDisconnect={disconnectWallet}
  theme="dark"
  buttonText="Kosten akkoord: ondertekenen en minten op Devnet"
  onSuccess={record => showVerifiedReceipt(record.receipt)}
  onError={error => showError(error.message)}
/>
```

`wallet` supplies `publicKey` (with `toBase58()`), `connected`, optional `connecting`, and `signTransaction(transaction)`. An optional `wallet.adapter` identity is checked for wallet-adapter integrations. The component never discovers, selects or automatically connects another wallet. Supply stable signing methods for custom adapters.

`invoke(name, payload)` is the authenticated transport accepted by the existing SDK. It returns the response body or `{data: responseBody}`. The component does not import the app client or auth context. The host owns wallet connection, authentication and callbacks. Never put administrator credentials, API secrets or private keys in browser props.

`onSuccess(record)` fires once per finalized intent per mounted component, including a restored finalized result. It does not fire for PENDING or CONFIRMED. Callbacks should not throw and should be idempotent across remounts. `onError(error)` receives SDK, transport, connection or persistence errors. Inline error feedback remains visible.

`theme` supports `dark` (default) and `light`. `className` adds host styling, and `buttonText` changes the explicit signing button. Cluster, fee, split, collection, treasury, quote signer and metadata rules cannot be changed by presentation props. Transaction disclosures are always shown.

Search is advisory. Quote/preparation and explicit signing are separate actions. Quotes expire visibly and require another review. Signed bytes are saved to browser localStorage before relay under the existing `solhandle-sdk-devnet:<partnerId>` key, retaining recovery from the previous SDK example. A saved signed intent blocks a new mint until checked and definitively resolved. Status and same-byte relay never request another signature. Browser storage is not an authoritative chain receipt; users should use a trusted browser profile. No server rendering of live wallet flows is implied.

The live administrator example at `/developers/partner-mint/devnet-sdk` now renders this exact component. A separately packaged React distribution, public partner credentials/domain verification and hosted widget remain later work.