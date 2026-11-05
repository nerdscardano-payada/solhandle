import { profileError } from './handleProfileProof.ts';
import { withPassportLock } from './tokenPassportLock.ts';
export async function passportAdmin(base44, body) {
  const user = await base44.auth.me().catch(error => error.status === 401 ? null : Promise.reject(error));
  if (user?.role !== 'admin') throw profileError('Alleen beheerders hebben toegang.', 403);
  const db = base44.asServiceRole.entities;
  let pilot = (await db.TokenPassportPilot.filter({ scope: 'passport-pilot-v1' }, { sort: 'created_date', limit: 1 })).items[0];
  if (body.action === 'adminLaunch') {
    if (pilot) throw profileError('Deze pilot heeft al een vaste testperiode.', 409);
    const now = new Date(); pilot = await db.TokenPassportPilot.create({ scope: 'passport-pilot-v1', starts_at: now.toISOString(), ends_at: new Date(now.getTime() + 28 * 86400000).toISOString(), target_starters: 20, target_completions: 12 });
  }
  if (!pilot) return { pilot: null };
  if (body.action === 'adminInvite') {
    if (new Date() >= new Date(pilot.ends_at)) throw profileError('De pilot is afgelopen.', 409);
    const invitation = await db.TokenPassportInvitation.create({ pilot_id: pilot.id, code: crypto.randomUUID() }); return { code: invitation.code };
  }
  if (body.action === 'adminExclude') {
    if (!/^[a-f0-9]{24}$/.test(body.enrollment_id || '') || typeof body.reason !== 'string' || body.reason.trim().length < 5 || body.reason.length > 400) throw profileError('Geef een deelnemer en een duidelijke uitsluitingsreden.');
    const row = (await db.TokenPassportEnrollment.filter({ id: body.enrollment_id, pilot_id: pilot.id }, { limit: 1 })).items[0]; if (!row) throw profileError('Deelnemer niet gevonden.', 404);
    await withPassportLock(db, pilot, async () => {
      await db.TokenPassportEnrollment.update(row.id, { status: 'ineligible', eligible: false, reason: `Beheer: ${body.reason.trim()}` });
      await db.TokenPassport.updateMany({ enrollment_id: row.id, status: 'published' }, { $set: { status: 'withdrawn' } });
    });
  }
  const eligible = { pilot_id: pilot.id, eligible: true, status: { $in: ['started','completed'] }, started_at: { $gte: pilot.starts_at, $lt: pilot.ends_at } };
  const [cohort, participants, groups, total] = await Promise.all([
    db.TokenPassportEnrollment.filter(eligible, { sort: 'started_at', limit: 20, fields: ['id','status','started_at'] }),
    db.TokenPassportEnrollment.filter({ pilot_id: pilot.id }, { sort: '-created_date', limit: 20, ...(body.cursor ? { cursor: body.cursor } : {}) }),
    db.TokenPassportEnrollment.aggregate({ query: { pilot_id: pilot.id }, groupBy: 'status' }), db.TokenPassportEnrollment.count(eligible)
  ]);
  const completed = cohort.items.length ? await db.TokenPassportEnrollment.count({ id: { $in: cohort.items.map(row => row.id) }, status: 'completed', completed_at: { $lt: pilot.ends_at } }) : 0;
  const finished = new Date() >= new Date(pilot.ends_at), starters = cohort.items.length;
  return { pilot, participants, groups: groups.rows, eligible_total: total, starters, completed, percentage: starters ? Math.round(completed / starters * 100) : 0, decision: !finished ? 'Test loopt. Nog geen eindoordeel.' : starters < 20 ? 'Onvoldoende steekproef; geen automatisch productfalen.' : completed >= 12 ? 'Pilotdoel behaald. Een vervolgtest is gerechtvaardigd; betaalbereidheid is niet aangetoond.' : 'Pilotdoel niet behaald. Onderzoek uitval en verbeter de registratieflow.' };
}