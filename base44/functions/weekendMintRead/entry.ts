import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { weekendSnapshot } from '../../shared/weekendCampaign.ts';
export default async function(req: Request): Promise<Response> {
  try {
    // Deliberately public: returns only this campaign's chain proofs and settlement receipts.
    return Response.json(await weekendSnapshot(createClientFromRequest(req).asServiceRole));
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}