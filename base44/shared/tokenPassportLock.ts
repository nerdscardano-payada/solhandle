import { profileError } from './handleProfileProof.ts';
// Serialize wallet-authorized writes per pilot. This prevents concurrent starts
// from counting one wallet twice and protects publication/withdrawal ordering.
export async function withPassportLock(db, pilot, work) {
  const token = crypto.randomUUID(), now = new Date().toISOString();
  const result = await db.TokenPassportPilot.updateMany({ id: pilot.id, $or: [{ lock_until: { $exists: false } }, { lock_until: { $lt: now } }] }, { $set: { write_lock: token, lock_until: new Date(Date.now() + 120000).toISOString() } });
  if (result.updated !== 1) throw profileError('Een pilotregistratie wordt verwerkt. Wacht even en probeer opnieuw; je aanvraag is niet bevestigd.', 409);
  try { return await work(); }
  finally { await db.TokenPassportPilot.updateMany({ id: pilot.id, write_lock: token }, { $set: { write_lock: '', lock_until: new Date(0).toISOString() } }); }
}