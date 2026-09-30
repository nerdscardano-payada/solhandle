import { fixture } from './fixture.mjs';
import { security } from './security.mjs';
import { payments } from './payments.mjs';
import { connection } from './transport.mjs';
import { PROGRAM, CORE } from './codec.mjs';
let passed = 0;
async function check(label, action) {
  await action();
  passed++;
  console.log(`PASS ${passed}: ${label}`);
}
try {
  if (connection.rpcEndpoint !== 'http://127.0.0.1:18899') throw new Error('Localhost-only safety guard failed');
  for (const address of [PROGRAM, CORE]) {
    if (!(await connection.getAccountInfo(address))?.executable) throw new Error(`Missing local executable: ${address}`);
  }
  const f = await fixture();
  await payments(f, check);
  await security(f, check);
  console.log(`LOCAL PAYMENT TESTS PASSED: ${passed}. No mainnet deployment. No production quote key used.`);
  console.log('This suite covers contract payments only, not website wiring, a security audit or all marketplace instructions.');
} catch (error) {
  console.error(`STOP — tests incomplete after ${passed} passes.\n${error.stack || error}`);
  process.exitCode = 1;
}