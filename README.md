# SolHandle

## Non-negotiable protocol rules
1. The blockchain is the source of truth.
2. The SolHandle NFT represents ownership.
3. The registry guarantees uniqueness.
4. The current Core Asset owner is the current Handle owner.
5. The API is an index, never the authority.
6. Payment, registration, and minting are atomic.
7. A Handle can never be minted twice.
8. A burned Handle can never be reissued.
9. SolHandle has no arbitrary seizure power over user-owned handles.
10. Generic words remain publicly registrable unless deliberately protected.

## Deployment boundary
The website is ready for the Devnet protocol integration. It intentionally does not submit a simulated mint: set the deployed Program ID, Collection address, RPC endpoints, and use the externally audited Anchor program before enabling claims.