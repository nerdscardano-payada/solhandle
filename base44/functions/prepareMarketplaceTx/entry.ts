import { secrets } from 'base44:runtime';
import { recoveryActions, retired } from '../../shared/marketplaceRecoveryCodec.ts';
import { prepareRecovery } from '../../shared/marketplaceRecoveryFlow.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    if (!recoveryActions.has(body.action)) return retired();
    return Response.json(await prepareRecovery(secrets.get('SOLANA_RPC_URL'), body));
  } catch (error) {
    return Response.json({ code: 'RECOVERY_PREPARATION_FAILED', error: error.message || 'Unable to prepare cancellation. No transaction was relayed.', recoveryPath: '/marketplace-recovery' }, { status: 422 });
  }
}