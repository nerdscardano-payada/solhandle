import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const root = process.cwd(), shared = path.join(root, 'base44/shared');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const manifest = fs.readFileSync(path.join(packageRoot, 'PAYLOAD-SHA256SUMS'), 'utf8');
for (const line of manifest.trim().split('\n')) {
  const [expected, name] = line.split('  ');
  if (hash(fs.readFileSync(path.join(packageRoot, name))) !== expected) throw new Error(`STOP: payload changed: ${name}`);
}
for (const [name, expected] of [['solanaRpc.ts', '7b536c99290718e292796d604d52c83f65e87548c8f415a72141dc955d924caf'], ['solhandleProtocol.ts', '151554664d39136db33f22d5f908736377a39993f82419d14505bdd0fd94a9e4']]) {
  if (hash(fs.readFileSync(path.join(shared, name))) !== expected) throw new Error(`STOP: unexpected ${name}`);
}
if (fs.existsSync(path.join(shared, 'earnNetwork.ts'))) throw new Error('STOP: this installer is only for the supplied legacy repository.');
const target = path.join(shared, 'referralEngine.ts'), original = fs.readFileSync(target, 'utf8');
const importAnchor = 'import { PublicKey } from "npm:@solana/web3.js@1.98.4";';
const anchor = '  if (!intent?.referral_profile_id) return { credited: false, reason: "no_referral" };\n  const token = crypto.randomUUID();';
const once = text => original.split(text).length === 2;
if (!once(importAnchor) || !once(anchor) || !original.includes('const RESERVED_CODES = new Set(') || !original.includes('reason: "self_referral"') || original.includes('checkPrimaryMintEarn') || original.includes('lockMintOrigin')) throw new Error('STOP: referral engine does not match the supplied legacy structure.');
const additions = ['partnerMintEarnPolicy.mjs', 'partnerMintEarnGuard.ts', 'partnerMintEarnChecks.mjs'];
for (const name of additions) if (fs.existsSync(path.join(shared, name))) throw new Error(`STOP: ${name} already exists.`);
const changed = original.replace(importAnchor, importAnchor + '\nimport { checkPrimaryMintEarn } from "./partnerMintEarnGuard.ts";\nimport { PROGRAM_ID } from "./solhandleProtocol.ts";').replace(anchor, '  if (!intent?.referral_profile_id) return { credited: false, reason: "no_referral" };\n  const assetAddress = mint.assetAddress || PublicKey.findProgramAddressSync([new TextEncoder().encode("asset"), new TextEncoder().encode(mint.handle)], new PublicKey(PROGRAM_ID))[0].toBase58();\n  const policy = await checkPrimaryMintEarn({ ...mint, source: "MINT", assetAddress }, mint.rpcUrl || Deno.env.get("SOLANA_RPC_URL"));\n  if (!policy.eligible) return { credited: false, reason: policy.reason };\n  const token = crypto.randomUUID();');
const tests = spawnSync(process.execPath, [path.join(packageRoot, 'base44/shared/partnerMintEarnChecks.mjs')], { stdio: 'inherit' });
if (tests.status !== 0) throw new Error('STOP: offline policy checks failed.');
const { default: checkLegacyWiring } = await import('./legacy-earn-wiring-checks.mjs');
await checkLegacyWiring(changed);
if (fs.readFileSync(target, 'utf8') !== original) throw new Error('STOP: referral engine changed during checks.');
const backup = fs.mkdtempSync(path.join(os.homedir(), 'solhandle-legacy-earn-backup.'));
fs.copyFileSync(target, path.join(backup, 'referralEngine.ts'));
for (const name of additions) fs.copyFileSync(path.join(packageRoot, 'base44/shared', name), path.join(shared, name), fs.constants.COPYFILE_EXCL);
fs.writeFileSync(target, changed);
console.log(`Backup: ${backup}`);
console.log(`Legacy referral engine SHA256: ${hash(Buffer.from(changed))}`);
console.log('LEGACY EARN GUARD INSTALLED. No earnNetwork module added; existing referral rules preserved.');
console.log('No deployment, Rust, wallet, dependency or network configuration changes.');