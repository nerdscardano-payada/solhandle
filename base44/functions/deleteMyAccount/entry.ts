import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Sign in to delete your account.' }, { status: 401 });
    const body = await req.json();
    if (body.confirmation !== 'DELETE') return Response.json({ error: 'Explicit confirmation is required.' }, { status: 400 });
    await base44.asServiceRole.entities.User.delete(user.id);
    return Response.json({ deleted: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Account deletion failed.' }, { status: error.status === 401 ? 401 : 500 });
  }
}