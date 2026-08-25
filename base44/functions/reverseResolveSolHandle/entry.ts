import { secrets } from 'base44:runtime';
import { reverseOnChain } from '../../shared/solhandleResolver.ts';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
export default async function(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  try {
    const { address } = await req.json();
    const result = await reverseOnChain(secrets.get('SOLANA_RPC_URL'), address);
    if (!result) return Response.json({ error: 'No verified primary SolHandle found.' }, { status: 404, headers });
    return Response.json(result, { headers });
  } catch (error) { return Response.json({ error: error.message }, { status: 400, headers }); }
}