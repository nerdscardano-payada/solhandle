import { secrets } from 'base44:runtime';
import { Uploader } from 'npm:@irys/upload@0.0.15';
import { Solana } from 'npm:@irys/upload-solana@0.1.8';
import bs58 from 'npm:bs58@5.0.0';

export default async function createIrysUploader() {
  const stored = secrets.get('IRYS_UPLOADER_PRIVATE_KEY').trim();
  const keypair = stored.startsWith('[') ? bs58.encode(Uint8Array.from(JSON.parse(stored))) : stored;
  return await Uploader(Solana).withWallet(keypair).withRpc(secrets.get('SOLANA_RPC_URL')).mainnet();
}