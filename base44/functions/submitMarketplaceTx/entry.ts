import { secrets } from 'base44:runtime';
import { recoveryActions, retired } from '../../shared/marketplaceRecoveryCodec.ts';
import { submitRecovery } from '../../shared/marketplaceRecoveryFlow.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    if (!recoveryActions.has(body.action)) return retired();
    return Response.json(await submitRecovery(secrets.get('SOLANA_RPC_URL'), body));
  } catch (error) {
    return Response.json({ code: 'RECOVERY_SUBMISSION_REJECTED', error: error.message || 'Cancellation validation failed. Check the saved signature before retrying.', recoveryPath: '/marketplace-recovery' }, { status: 422 });
  }
}