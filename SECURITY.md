# SolHandle security reporting

Report suspected vulnerabilities privately through https://solhandle.io/contact.
Start your message with "Security report" and include the affected feature or program, steps to reproduce, and potential impact. The form opens your email application; you must send the prepared message yourself.

Policy: https://solhandle.io/contact#security

Do not access other users' data, move funds, disrupt services, or exploit vulnerabilities on mainnet. Use local tests or devnet where possible. Coordinate public disclosure so the issue can be investigated and addressed. Reporting does not authorize exploitation or guarantee a reward. Never send private keys or seed phrases.

## Mainnet program

Program ID: `B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf`

The repository's `security.txt` is the human-readable security contact file. Solana Explorer reads the separate security metadata embedded by `solana_security_txt::security_txt!` in `programs/solhandle/src/lib.rs`, not this repository file. Both point to the same contact page and policy. Keep those URLs consistent when editing either file. Renew the `Expires` date in `security.txt` before it expires.

Adding files to this repository does not update mainnet. The embedded metadata becomes visible only after an authorized program upgrade. This is not a security audit.

## Safe upgrade and re-verification checklist

1. Start from the previously verified mainnet commit `2f585518fe37149036b57f459c9476fd7b92a00d`, or review every difference against it before deploying. Apply only the security metadata and dependency changes if this is intended as a security-contact-only upgrade. Do not deploy unrelated program changes.
2. Keep the compiler/container and build flags from the successful mainnet verification. This workspace's Anchor configuration and dependency lockfile are not aligned with its program manifest; resolve that in the reviewed release before building. Do not regenerate the entire lockfile blindly.
3. Resolve and commit the direct `solana-security-txt = "=1.1.3"` dependency and resulting lockfile change using Cargo in the Linux/WSL build environment. Commit the reviewed source and publish it to the GitHub repository before remote verification.
4. Publish the website contact-policy update and check that both contact URLs are reachable.
5. Build reproducibly with the same verified toolchain. Inspect the resulting binary locally with `query-security-txt target/deploy/solhandle.so` (adjust the path to the actual reproducible-build output). Confirm the name, contact link, policy and program ID before signing anything.
6. Check mainnet genesis and the existing program's upgrade authority. Only the authorized wallet may upgrade the existing program. Do not initialize a new program or collection, rotate the program ID, or change protocol settings for this metadata update. Do not use the initial-deployment script.
7. Upgrade the existing program using the inspected reproducible binary, after reviewing the transaction and costs. Keep private keys local; never send them through chat.
8. Compare the deployed program hash with that exact binary, then register the new GitHub commit/build parameters and submit a new remote verification job. The previous verification hash will no longer describe the upgraded binary.
9. After confirmation, inspect https://explorer.solana.com/address/B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf/security and https://verify.osec.io/status/B7xiwfxGcR2Xz7tcUKrkB8Ly6NV8jU7LH1m6GJZRUuf.

No mainnet upgrade is performed by adding these repository files.