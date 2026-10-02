import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

// Local-only registration bridge: private authority stays in WSL, no mainnet calls.
const program = new PublicKey('ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT');
const wallet = new PublicKey('BKWUshcZsL3VKSVo2Ficqr2KJYRzjBDLMuoeyLjH2cqk');
const id = 'devnet-testpartner';
const quoteSigner = '9N351uhUi2mzsa4d7LL9B5ii1tbM8q12CVLqPXuFRk2e';
const authority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(join(homedir(), '.config/solana/solhandle-devnet.json'), 'utf8'))));
assert.equal(authority.publicKey.toBase58(), 'ECnRhUUS5ccr5RUGyXGbwzNytMSvT9bBn2jdGQgqvQyE', 'Unexpected devnet authority');
const rpc = new Connection('https://api.devnet.solana.com', 'confirmed');
assert.equal(await rpc.getGenesisHash(), 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG', 'Not devnet');
assert((await rpc.getAccountInfo(program))?.executable, 'Devnet program missing');
const hash = text => createHash('sha256').update(text).digest();
const pda = (...seeds) => PublicKey.findProgramAddressSync(seeds.map(s => typeof s === 'string' ? Buffer.from(s) : s), program)[0];
const config = pda('config'), settings = pda('partner_mint'), partner = pda('partner', hash(id));
function bytes(account, name, size) {
  assert(account && account.owner.equals(program) && !account.executable, name + ': missing or invalid owner');
  assert(account.data.length >= size && account.data.subarray(0, 8).equals(hash('account:' + name).subarray(0, 8)), name + ': invalid layout');
  return account.data;
}
async function disabledSettings() {
  const data = bytes(await rpc.getAccountInfo(settings), 'PartnerMintSettings', 82);
  assert(new PublicKey(data.subarray(8, 40)).equals(config), 'Settings config mismatch');
  assert.equal(data[40], 0, 'Stop: Partner Mint is enabled');
  assert.equal(new PublicKey(data.subarray(41, 73)).toBase58(), quoteSigner, 'Quote signer mismatch');
  return data;
}
const configBefore = bytes(await rpc.getAccountInfo(config), 'Config', 187);
assert.equal(configBefore[186], 2, 'Protocol version must be 2');
assert(new PublicKey(configBefore.subarray(8, 40)).equals(authority.publicKey), 'Config authority mismatch');
assert(!wallet.equals(authority.publicKey) && wallet.toBase58() !== quoteSigner && !wallet.equals(new PublicKey(configBefore.subarray(72, 104))), 'Use a separate partner wallet');
const settingsBefore = await disabledSettings();
function receipt(account, signature) {
  const data = bytes(account, 'MintPartner', 88), length = data.readUInt32LE(40), end = 44 + length;
  assert(length === id.length && data.length >= end + 43 && data.subarray(44, end).toString() === id, 'Partner ID mismatch');
  assert(new PublicKey(data.subarray(8, 40)).equals(config), 'Partner config mismatch');
  assert(new PublicKey(data.subarray(end, end + 32)).equals(wallet), 'Existing partner wallet differs; refusing overwrite');
  assert.equal(data[end + 32], 0, 'Partner is not approved');
  assert.equal(data[end + 41], 0, 'Self mint must remain disabled');
  return { cluster: 'devnet', program: program.toBase58(), partnerId: id, partner: partner.toBase58(), revenueWallet: wallet.toBase58(), status: 'APPROVED', revision: data.readBigUInt64LE(end + 33).toString(), allowSelfMint: false, mintEnabled: false, ...(signature ? { signature } : { unchanged: true }) };
}
const existing = await rpc.getAccountInfo(partner);
if (existing) {
  console.log(JSON.stringify(receipt(existing), null, 2));
} else {
  const walletAccount = await rpc.getAccountInfo(wallet);
  assert(walletAccount?.owner.equals(SystemProgram.programId) && !walletAccount.executable, 'Partner wallet must exist on devnet as a System wallet. Receive a small amount of devnet SOL first.');
  const require = createRequire(import.meta.url);
  const browserLibrary = readFileSync(join(dirname(require.resolve('@solana/web3.js')), 'index.iife.min.js'));
  const token = randomBytes(32).toString('hex');
  let pending = null, broadcastAttempted = false, completed = null, submitting = false;
  const html = `<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SolHandle devnet partnerregistratie</title>
<style>body{background:#050811;color:#e2e8f0;font:16px system-ui;max-width:700px;margin:60px auto;padding:24px}button{background:#67e8f9;color:#000;padding:14px 22px;border:0;border-radius:8px;font:inherit;cursor:pointer}button:disabled{opacity:.5;cursor:wait}code,pre{overflow-wrap:anywhere;white-space:pre-wrap}p{line-height:1.6}</style>
<h1>Devnet-testpartner registreren</h1><p>Uitsluitend Solana devnet. Zet Phantom op <strong>Devnet</strong> en selecteer deze wallet:</p><code>${wallet.toBase58()}</code><p>Partner-ID: <strong>${id}</strong>. Partneropbrengst: 50% van de mintprijs, exclusief netwerk- en accountkosten. Deze registratie mint niets en houdt Partner Mint uitgeschakeld. De lokale authority betaalt de registratiekosten.</p><button id="register">Verbinden en registreren met Phantom</button><pre id="result" role="status"></pre>
<script src="/web3.js"></script><script>
const button=document.getElementById('register'), output=document.getElementById('result');
async function call(path,body){const res=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','X-Local-Token':'${token}'},body:JSON.stringify(body)});const data=await res.json();if(!res.ok)throw new Error(data.error);return data;}
button.onclick=async()=>{button.disabled=true;let submitted=false;try{
const provider=window.phantom?.solana || window.solana;if(!provider?.isPhantom)throw new Error('Open deze lokale pagina in de browser met de Phantom-extensie.');
output.textContent='Phantom verbinden...';await provider.connect();if(provider.publicKey.toBase58()!=='${wallet.toBase58()}')throw new Error('Selecteer de afgesproken ontvangwallet in Phantom.');
output.textContent='Registratie voorbereiden...';const prepared=await call('/prepare',{});const transaction=solanaWeb3.Transaction.from(Uint8Array.from(atob(prepared.transaction),c=>c.charCodeAt(0)));
output.textContent='Controleer en onderteken de registratie in Phantom. Er wordt niets gemint.';const signed=await provider.signTransaction(transaction);
const raw=signed.serialize();let text='';for(const value of raw)text+=String.fromCharCode(value);
output.textContent='Registratie indienen op devnet...';submitted=true;const result=await call('/submit',{transaction:btoa(text)});output.textContent=JSON.stringify(result,null,2);button.textContent='Geregistreerd';
}catch(error){output.textContent=error.message+(submitted?'\\nControleer de WSL-uitvoer. Start geen nieuwe registratie voordat de vermelde transactie is gecontroleerd.':'');button.disabled=submitted;}};
</script></html>`;
  const server = createServer(async (req, res) => {
    const host = req.headers.host;
    if (!['127.0.0.1:8787', 'localhost:8787'].includes(host)) { res.writeHead(403); res.end(); return; }
    res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none'; connect-src 'self'");
    if (req.method === 'GET' && req.url === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); return; }
    if (req.method === 'GET' && req.url === '/web3.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(browserLibrary); return; }
    res.setHeader('Content-Type', 'application/json');
    try {
      assert(req.method === 'POST' && ['/prepare', '/submit'].includes(req.url), 'Invalid request');
      assert(req.headers.origin === 'http://' + host && req.headers['x-local-token'] === token, 'Local request authorization failed');
      let text = ''; for await (const chunk of req) { text += chunk; assert(text.length <= 20000, 'Request too large'); }
      const body = JSON.parse(text || '{}');
      if (req.url === '/prepare') {
        assert(!broadcastAttempted, 'A transaction was already submitted. Check its signature in WSL first.');
        assert((await disabledSettings()).equals(settingsBefore), 'Settings changed; restart after reviewing them');
        assert(!(await rpc.getAccountInfo(partner)), 'Partner already exists; restart to read the result');
        const latest = await rpc.getLatestBlockhash(), name = Buffer.from(id), length = Buffer.alloc(4); length.writeUInt32LE(name.length);
        const transaction = new Transaction({ feePayer: authority.publicKey, recentBlockhash: latest.blockhash });
        transaction.add(new TransactionInstruction({ programId: program, keys: [
          { pubkey: authority.publicKey, isSigner: true, isWritable: true }, { pubkey: config, isSigner: false, isWritable: false },
          { pubkey: settings, isSigner: false, isWritable: false }, { pubkey: partner, isSigner: false, isWritable: true },
          { pubkey: wallet, isSigner: true, isWritable: false }, { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ], data: Buffer.concat([hash('global:create_mint_partner').subarray(0, 8), length, name]) }));
        transaction.partialSign(authority); pending = { message: transaction.serializeMessage(), ...latest };
        res.end(JSON.stringify({ transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64') })); return;
      }
      assert(pending && !submitting, 'No prepared transaction or submission already in progress');
      assert(typeof body.transaction === 'string', 'Signed transaction required');
      const transaction = Transaction.from(Buffer.from(body.transaction, 'base64'));
      assert(transaction.serializeMessage().equals(pending.message) && transaction.verifySignatures(), 'Transaction changed or required signatures missing');
      if (completed) { res.end(JSON.stringify(completed)); return; }
      assert(!broadcastAttempted, 'Already submitted; check WSL signature before retrying');
      submitting = true;
      try {
        assert((await disabledSettings()).equals(settingsBefore), 'Settings changed');
        assert(await rpc.getBlockHeight() <= pending.lastValidBlockHeight, 'Transaction expired before submission. Reload this page and sign a fresh registration.');
        const raw = transaction.serialize();
        // Derive the signature before sending so a timeout never loses its identity.
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const signatureBytes = transaction.signature;
        let number = BigInt('0x' + signatureBytes.toString('hex')), signature = '';
        while (number > 0n) { signature = alphabet[Number(number % 58n)] + signature; number /= 58n; }
        for (const value of signatureBytes) { if (value !== 0) break; signature = '1' + signature; }
        console.log('Devnet registratie-signature:', signature);
        broadcastAttempted = true;
        await rpc.sendRawTransaction(raw, { skipPreflight: false, maxRetries: 3 });
        const confirmation = await rpc.confirmTransaction({ signature, blockhash: pending.blockhash, lastValidBlockHeight: pending.lastValidBlockHeight }, 'confirmed');
        assert(!confirmation.value.err, 'Registration failed: ' + JSON.stringify(confirmation.value.err));
        assert(bytes(await rpc.getAccountInfo(config), 'Config', 187).equals(configBefore), 'Config changed unexpectedly');
        assert((await disabledSettings()).equals(settingsBefore), 'Settings changed unexpectedly');
        completed = receipt(await rpc.getAccountInfo(partner), signature);
        console.log(JSON.stringify(completed, null, 2)); res.end(JSON.stringify(completed));
      } finally { submitting = false; }
    } catch (error) { res.statusCode = 400; res.end(JSON.stringify({ error: error.message })); }
  });
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(8787, '127.0.0.1', () => console.log('Open http://localhost:8787 in de Windows-browser met Phantom op Devnet. Stop na registratie met Ctrl+C.'));
}