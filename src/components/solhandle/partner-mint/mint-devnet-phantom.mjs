import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSignedTransaction } from './devnet-signed-transaction.mjs';
import { rpc, BUYER, HANDLE, preflight, prepare, validateFresh, signatureOf, verify } from './devnet-pilot-chain.mjs';
assert(process.argv.includes('--mint-devnet'), 'Start with --mint-devnet. Nothing is minted until Phantom signs.');
await preflight();
const directory = dirname(fileURLToPath(import.meta.url));
const stateFile = join(directory, '.devnet-pilot-partnerpilot1.json');
let saved = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : null;
if (saved) {
  const transaction = readSignedTransaction(Buffer.from(saved.transaction, 'base64'), saved.message, BUYER);
  assert(signatureOf(transaction) === saved.signature, 'Invalid saved mint signature. Do not remove it before checking the on-chain signature.');
  console.log('Recovering existing devnet mint:', saved.signature);
}
const require = createRequire(import.meta.url);
const library = readFileSync(join(dirname(require.resolve('@solana/web3.js')), 'index.iife.min.js'));
const token = randomBytes(32).toString('hex');
const html = readFileSync(join(directory, 'devnet-pilot.html'), 'utf8').replace('__TOKEN__', token);
let pending = null, busy = false;
async function status() {
  if (!saved) return { status: 'READY', cluster: 'devnet', handle: '@' + HANDLE, buyer: BUYER.toBase58(), mintExecuted: false };
  const result = await verify(saved); console.log(JSON.stringify(result, null, 2)); return result;
}
const server = createServer(async (req, res) => {
  const host = req.headers.host;
  if (!['localhost:8787', '127.0.0.1:8787'].includes(host)) { res.writeHead(403); res.end(); return; }
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none'; connect-src 'self'");
  if (req.method === 'GET' && req.url === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); return; }
  if (req.method === 'GET' && req.url === '/web3.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(library); return; }
  res.setHeader('Content-Type', 'application/json');
  try {
    assert(req.method === 'POST' && ['/prepare', '/submit', '/status'].includes(req.url), 'Invalid request');
    assert(req.headers.origin === 'http://' + host && req.headers['x-local-token'] === token, 'Local authorization failed');
    let text = ''; for await (const chunk of req) { text += chunk; assert(text.length <= 20000, 'Request too large'); }
    const body = JSON.parse(text || '{}');
    if (req.url === '/status') { res.end(JSON.stringify(await status())); return; }
    assert(!busy && !saved, 'Mint preparation/submission already started. Check Status; never sign a new mint after a submission.');
    busy = true;
    try {
      if (req.url === '/prepare') { pending = await prepare(); res.end(JSON.stringify({ transaction: pending.transaction, preview: pending.preview })); return; }
      assert(pending && typeof body.transaction === 'string', 'Prepare the mint first');
      const transaction = readSignedTransaction(Buffer.from(body.transaction, 'base64'), pending.message, BUYER, true);
      await validateFresh(pending.q);
      assert(await rpc.getBlockHeight() <= pending.lastValidBlockHeight, 'Blockhash expired. Prepare and sign again.');
      const simulation = await rpc.simulateTransaction(transaction, { sigVerify: true, commitment: 'confirmed' });
      assert(!simulation.value.err, 'Signed mint simulation failed; nothing submitted: ' + JSON.stringify(simulation.value.err) + '\n' + (simulation.value.logs || []).join('\n'));
      await validateFresh(pending.q);
      const raw = Buffer.from(transaction.serialize()), signature = signatureOf(transaction);
      const draft = { q: pending.q, message: Buffer.from(transaction.message.serialize()).toString('base64'), preparedMessage: pending.message, blockhash: pending.blockhash, lastValidBlockHeight: pending.lastValidBlockHeight, transaction: raw.toString('base64'), signature };
      // Save the EXACT signed bytes and signature before any broadcast. No private key is stored.
      writeFileSync(stateFile, JSON.stringify(draft, null, 2), { mode: 0o600, flag: 'wx' }); saved = draft;
      console.log('Devnet mint signature (also saved locally):', signature);
      try {
        await rpc.sendRawTransaction(raw, { skipPreflight: false, maxRetries: 3 });
        res.end(JSON.stringify(await status()));
      } catch (error) {
        console.error('Broadcast/confirmation uncertain:', error.message);
        res.end(JSON.stringify({ status: 'PENDING', signature, message: 'Broadcast or confirmation uncertain. Click Status; do not sign a new mint.', doNotCreateNewMint: true }));
      }
    } finally { busy = false; }
  } catch (error) { res.statusCode = 400; res.end(JSON.stringify({ error: error.message })); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(8787, '127.0.0.1', () => console.log('Open http://localhost:8787 with Phantom on Devnet. Quote: 50 seconds. Stop the old registration server first. No mainnet calls or indexing.'));