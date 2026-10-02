import { pilotRequest, pilotSigner, getPilotIntent, pilotError } from '../../shared/partnerMintRequest.ts';
import preparePartnerMint from '../../shared/partnerMintPrepare.ts';
import submitPartnerMint from '../../shared/partnerMintSubmit.ts';
import partnerMintStatus from '../../shared/partnerMintStatus.ts';
export default async function(req) {
  const requestId = crypto.randomUUID();
  try {
    const { base44, user, body, url } = await pilotRequest(req, ['prepare', 'submit', 'status']);
    const intent = await getPilotIntent(base44, user, body.intentId || body.quoteId);
    const result = body.action === 'status' ? await partnerMintStatus(base44, intent, url)
      : body.action === 'prepare' ? await preparePartnerMint(base44, intent, url, pilotSigner())
      : await submitPartnerMint(base44, intent, url, pilotSigner(), body.signedTransaction);
    return Response.json({ ...result, cluster: 'devnet', requestId }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return pilotError(error, requestId); }
}