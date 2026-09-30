import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc, getProtocolConfig } from './solanaRpc.ts';
import { PROGRAM_ID } from './solhandleProtocol.ts';

// Keep closed until deployment, accounting and wallet end-to-end checks are complete.
export const HANDLE_PAYMENT_RELEASED = false;
export const HANDLE_MINT = 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump';
export async function handlePaymentStatus(rpcUrl) {
  const [paymentConfig] = PublicKey.findProgramAddressSync([new TextEncoder().encode('token_payment')], new PublicKey(PROGRAM_ID));
  const result = await rpc(rpcUrl, 'getAccountInfo', [paymentConfig.toBase58(), { encoding: 'base64', commitment: 'confirmed' }]);
  if (!result?.value) return { paymentAvailable: false, enabledOnChain: false, releaseReady: HANDLE_PAYMENT_RELEASED, reason: 'On-chain $HANDLE payments have not been configured.' };
  const account = result.value;
  const data = Uint8Array.from(atob(account.data?.[0] || ''), c => c.charCodeAt(0));
  const discriminator = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('account:TokenPaymentConfig'))).slice(0, 8);
  if (account.owner !== PROGRAM_ID || data.length !== 106 || !discriminator.every((b, i) => b === data[i])) throw new Error('Invalid on-chain token payment configuration.');
  const tokenMint = new PublicKey(data.slice(9, 41)).toBase58();
  const quoteSigner = new PublicKey(data.slice(41, 73)).toBase58();
  const treasuryToken = new PublicKey(data.slice(73, 105)).toBase58();
  const protocol = await getProtocolConfig(rpcUrl);
  const enabledOnChain = data[8] === 1 && tokenMint === HANDLE_MINT && !protocol.paused;
  return { paymentAvailable: HANDLE_PAYMENT_RELEASED && enabledOnChain, enabledOnChain, releaseReady: HANDLE_PAYMENT_RELEASED, paymentConfig: paymentConfig.toBase58(), tokenMint, quoteSigner, treasuryToken, reason: !enabledOnChain ? 'On-chain $HANDLE payments are not enabled.' : !HANDLE_PAYMENT_RELEASED ? 'Website activation is pending deployment verification, accounting and wallet checks.' : '' };
}

export async function handleTokenBalance(rpcUrl, wallet, mint, tokenProgram) {
  const result = await rpc(rpcUrl, 'getTokenAccountsByOwner', [wallet, { mint }, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
  let amount = 0n;
  for (const row of result?.value || []) {
    const info = row.account?.data?.parsed?.info;
    if (row.account?.owner !== tokenProgram || info?.owner !== wallet || info?.mint !== mint) throw new Error('Wallet token accounts could not be verified.');
    if (info.state === 'initialized') amount += BigInt(info.tokenAmount.amount);
  }
  return amount.toString();
}