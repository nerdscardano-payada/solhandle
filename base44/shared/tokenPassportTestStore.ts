export const passportFailure = (message, status = 400) => Object.assign(new Error(message), { status });
export async function readPassportTest(db) {
  const page = await db.TokenPassportTestRegistry.filter({ scope: 'ADMIN_TEST' }, { limit: 2 });
  if (page.items.length !== 1) throw passportFailure('Test storage needs administrator provisioning. No records were changed.', 503);
  const row = page.items[0];
  if (!Number.isSafeInteger(row.version) || !Array.isArray(row.items) || !Array.isArray(row.challenges) || !Array.isArray(row.history)) throw passportFailure('Test storage needs administrator review.', 503);
  return row;
}
export async function changePassportTest(db, mutate) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = await readPassportTest(db);
    if(row.production_migrated)throw passportFailure('The registration workspace has been upgraded. Reload the page.',409);
    const next = { items: structuredClone(row.items), challenges: structuredClone(row.challenges), history: structuredClone(row.history) };
    const result = mutate(next);
    if (next.items.length > 20 || next.challenges.length > 20 || next.history.length > 100 || new TextEncoder().encode(JSON.stringify(next)).length > 48000) throw passportFailure('The bounded test workspace is full. No history was removed. Ask an administrator to archive this pilot before continuing.', 409);
    const changed = await db.TokenPassportTestRegistry.updateMany({ id: row.id, version: row.version }, { $set: { ...next, version: row.version + 1 } });
    if (changed.updated === 1) return result;
  }
  throw passportFailure('Another action changed this workspace. Refresh and try again.', 409);
}
export function passportEvent(state, item, actor, action, reason = '') {
  state.history.push({ id: crypto.randomUUID(), association_id: item.id, revision: item.revision, actor, action, reason, at: new Date().toISOString() });
}
export function passportItem(row, id) {
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) throw passportFailure('Invalid registration.');
  const item = row.items.find(value => value.id === id);
  if (!item) throw passportFailure('Registration not found.', 404);
  return item;
}