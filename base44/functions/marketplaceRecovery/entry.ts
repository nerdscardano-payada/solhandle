import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';
import { recoveryPositions } from '../../shared/marketplaceRecoveryRead.ts';
import { recoveryStatus } from '../../shared/marketplaceRecoveryFlow.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(), url = secrets.get('SOLANA_RPC_URL');
    if (body.action === 'list') return Response.json(await recoveryPositions(url, body));
    if (body.action === 'status') {
      if (await rpc(url, 'getGenesisHash', []) !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw new Error('Recovery requires Solana Mainnet.');
      return Response.json(await recoveryStatus(url, { ...body, action: body.actionType }));
    }
    return Response.json({ error: 'Only public on-chain recovery lookup and signature status are supported.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || 'Recovery is temporarily unavailable. Existing positions have not been changed.' }, { status: 422 });
  }
}