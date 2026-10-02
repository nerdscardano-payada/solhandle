#!/usr/bin/env bash
set -euo pipefail
command -v python3 >/dev/null || { echo 'python3 is required in WSL.' >&2; exit 1; }
test -f src/components/solhandle/partner-mint/devnet-wallet-message.mjs || { echo 'Run from solhandle-repo after extracting the wallet fix.' >&2; exit 1; }
python3 - <<'PY'
from pathlib import Path
from shutil import copy2
path = Path('src/components/solhandle/partner-mint/mint-devnet-phantom.mjs')
original = path.read_text()
content = original
pairs = [
("      const transaction = readSignedTransaction(Buffer.from(body.transaction, 'base64'), pending.message, BUYER);", "      const transaction = readSignedTransaction(Buffer.from(body.transaction, 'base64'), pending.message, BUYER, true);"),
("      assert(await rpc.getBlockHeight() <= pending.lastValidBlockHeight, 'Blockhash expired. Prepare and sign again.');\n      const raw = Buffer.from(transaction.serialize()), signature = signatureOf(transaction);", "      assert(await rpc.getBlockHeight() <= pending.lastValidBlockHeight, 'Blockhash expired. Prepare and sign again.');\n      const simulation = await rpc.simulateTransaction(transaction, { sigVerify: true, commitment: 'confirmed' });\n      assert(!simulation.value.err, 'Signed mint simulation failed; nothing submitted: ' + JSON.stringify(simulation.value.err) + '\\n' + (simulation.value.logs || []).join('\\n'));\n      await validateFresh(pending.q);\n      const raw = Buffer.from(transaction.serialize()), signature = signatureOf(transaction);"),
("const draft = { q: pending.q, message: pending.message, blockhash: pending.blockhash", "const draft = { q: pending.q, message: Buffer.from(transaction.message.serialize()).toString('base64'), preparedMessage: pending.message, blockhash: pending.blockhash")
]
for before, after in pairs:
    if content.count(before) == 1:
        content = content.replace(before, after, 1)
    elif content.count(before) == 0 and content.count(after) == 1:
        continue
    else:
        raise SystemExit('Unexpected pilot version. Server unchanged. Keep all saved mint files.')
if content != original:
    backup = path.with_name(path.name + '.before-wallet-assertions')
    if not backup.exists():
        copy2(path, backup)
    path.write_text(content)
print('Wallet safety-assertion fix installed. Original mint, quote, accounts and signatures remain checked. Saved mint files preserved; no mainnet changes.')
PY