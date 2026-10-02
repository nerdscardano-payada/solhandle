#!/usr/bin/env bash
set -euo pipefail
command -v python3 >/dev/null || { echo 'python3 is required in WSL.' >&2; exit 1; }
test -f src/components/solhandle/partner-mint/devnet-signed-transaction.mjs || { echo 'Run from your solhandle-repo after extracting the fix package.' >&2; exit 1; }
python3 - <<'PY'
from pathlib import Path
from shutil import copy2
root = Path('src/components/solhandle/partner-mint')
edits = {
'mint-devnet-phantom.mjs': [
("import { Transaction } from '@solana/web3.js';", "import { readSignedTransaction } from './devnet-signed-transaction.mjs';"),
("  const transaction = Transaction.from(Buffer.from(saved.transaction, 'base64'));\n  assert(transaction.verifySignatures() && signatureOf(transaction) === saved.signature && transaction.serializeMessage().toString('base64') === saved.message && transaction.feePayer.equals(BUYER), 'Invalid saved mint. Do not remove it before checking the on-chain signature.');", "  const transaction = readSignedTransaction(Buffer.from(saved.transaction, 'base64'), saved.message, BUYER);\n  assert(signatureOf(transaction) === saved.signature, 'Invalid saved mint signature. Do not remove it before checking the on-chain signature.');"),
("      const transaction = Transaction.from(Buffer.from(body.transaction, 'base64'));\n      assert(transaction.verifySignatures() && transaction.serializeMessage().toString('base64') === pending.message, 'Phantom changed the transaction or signature is invalid');", "      const transaction = readSignedTransaction(Buffer.from(body.transaction, 'base64'), pending.message, BUYER);"),
("      const raw = transaction.serialize(), signature = signatureOf(transaction);", "      const raw = Buffer.from(transaction.serialize()), signature = signatureOf(transaction);")
],
'devnet-pilot-chain.mjs': [
('TransactionInstruction, VersionedTransaction, Ed25519Program', 'TransactionInstruction, TransactionMessage, VersionedTransaction, Ed25519Program'),
("  const simulation = await rpc.simulateTransaction(new VersionedTransaction(transaction.compileMessage()), { sigVerify: false, commitment: 'confirmed' });", "  const versioned = new VersionedTransaction(new TransactionMessage({ payerKey: BUYER, recentBlockhash: latest.blockhash, instructions: transaction.instructions }).compileToV0Message());\n  const simulation = await rpc.simulateTransaction(versioned, { sigVerify: false, commitment: 'confirmed' });"),
("  const fee = (await rpc.getFeeForMessage(transaction.compileMessage())).value; assert(fee !== null, 'Fee unavailable');", "  const fee = (await rpc.getFeeForMessage(versioned.message)).value; assert(fee !== null, 'Fee unavailable');"),
("message: transaction.serializeMessage().toString('base64'), transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64')", "message: Buffer.from(versioned.message.serialize()).toString('base64'), transaction: Buffer.from(versioned.serialize()).toString('base64')"),
("  const b = transaction.signature; assert(b?.length === 64, 'Missing buyer signature');", "  const b = Buffer.from(transaction.signature ?? transaction.signatures[0]); assert(b.length === 64, 'Missing buyer signature');"),
("  assert(tx.transaction.message.serialize().toString('base64') === saved.message, 'Confirmed message differs');", "  assert(Buffer.from(tx.transaction.message.serialize()).toString('base64') === saved.message, 'Confirmed message differs');"),
('  const keys = tx.transaction.message.accountKeys;', '  const keys = tx.transaction.message.staticAccountKeys ?? tx.transaction.message.accountKeys;')
],
'devnet-pilot.html': [
('const transaction=solanaWeb3.Transaction.from(Uint8Array.from(atob(prepared.transaction),c=>c.charCodeAt(0)));', 'const transaction=solanaWeb3.VersionedTransaction.deserialize(Uint8Array.from(atob(prepared.transaction),c=>c.charCodeAt(0)));')
]
}
updates = []
for name, pairs in edits.items():
    path = root / name
    original = path.read_text()
    content = original
    for before, after in pairs:
        if content.count(before) == 1:
            content = content.replace(before, after, 1)
        elif content.count(before) == 0 and content.count(after) == 1:
            continue
        else:
            raise SystemExit('Unexpected pilot version in ' + name + '. Nothing patched; do not remove any saved mint.')
    if content != original:
        updates.append((path, content))
for path, content in updates:
    backup = path.with_name(path.name + '.before-versioned-fix')
    if not backup.exists():
        copy2(path, backup)
    path.write_text(content)
print('Devnet Phantom encoding fix installed. Saved signed transactions preserved. No mainnet changes.')
PY