import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { CLASSIC_TOKEN_PROGRAM, TOKEN_2022_PROGRAM } from './handleTokenMintInfo.ts';

export function accountBytes(account) {
  if (!Array.isArray(account?.data) || account.data[1] !== 'base64') throw new Error('Unsupported account encoding.');
  return Uint8Array.from(atob(account.data[0]), c => c.charCodeAt(0));
}
export function reader(bytes) {
  let offset = 0;
  const take = length => { if (!Number.isInteger(length) || length < 0 || offset + length > bytes.length) throw new Error('Malformed token metadata.'); const result = bytes.slice(offset, offset + length); offset += length; return result; };
  const u8 = () => take(1)[0];
  const u32 = () => new DataView(take(4).buffer).getUint32(0, true);
  const key = () => new PublicKey(take(32)).toBase58();
  const text = () => { const length = u32(); if (length > 4096) throw new Error('Metadata string exceeds safety limit.'); return new TextDecoder('utf-8', { fatal: true }).decode(take(length)).replace(/\0+$/, ''); };
  return { take, u8, u32, key, text };
}
export function decodeMint(account) {
  if (!account || account.executable || ![CLASSIC_TOKEN_PROGRAM, TOKEN_2022_PROGRAM].includes(account.owner)) throw new Error('Account is not an SPL Token or Token-2022 mint.');
  const bytes = accountBytes(account);
  if (bytes.length < 82 || (account.owner === CLASSIC_TOKEN_PROGRAM && bytes.length !== 82)) throw new Error('Invalid mint account layout. Token accounts are not accepted.');
  const view = new DataView(bytes.buffer);
  const authority = offset => { const option = view.getUint32(offset, true); if (![0, 1].includes(option)) throw new Error('Invalid mint authority layout.'); return option === 1 ? new PublicKey(bytes.slice(offset + 4, offset + 36)).toBase58() : null; };
  if (bytes[45] !== 1) throw new Error('Mint is not initialized.');
  const extensions = [];
  if (bytes.length !== 82) {
    if (account.owner !== TOKEN_2022_PROGRAM || bytes.length < 166 || bytes[165] !== 1 || bytes.slice(82, 165).some(b => b !== 0)) throw new Error('Invalid Token-2022 mint layout.');
    let offset = 166;
    while (offset < bytes.length) {
      if (bytes.slice(offset).every(b => b === 0)) break;
      if (offset + 4 > bytes.length) throw new Error('Truncated token extension.');
      const type = view.getUint16(offset, true), length = view.getUint16(offset + 2, true); offset += 4;
      if (!type || offset + length > bytes.length || extensions.some(item => item.type === type)) throw new Error('Malformed token extension.');
      extensions.push({ type, bytes: bytes.slice(offset, offset + length) }); offset += length;
    }
  }
  return { decimals: bytes[44], supplyRaw: view.getBigUint64(36, true).toString(), mintAuthority: authority(0), freezeAuthority: authority(46), extensions, program: account.owner === CLASSIC_TOKEN_PROGRAM ? 'SPL Token' : 'Token-2022' };
}
export function normalizeTokenSymbol(raw) {
  if (typeof raw !== 'string' || /[^\x00-\x7F]/.test(raw)) return { candidate: null, reason: 'Non-ASCII symbol requires manual review. Unicode lookalikes are not accepted.' };
  const symbol = raw.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '').normalize('NFKC').toUpperCase().replace(/^\$/, '');
  return /^[A-Z0-9]{1,10}$/.test(symbol) ? { candidate: '$' + symbol, reason: null } : { candidate: null, reason: 'Metadata symbol must normalize to 1–10 ASCII letters or digits. Manual review required.' };
}