import { digest, capability, fail } from './integrationOptions.ts';
export function publicReceipt(record, type) {
  return { submission_id:record.id, reference:record.reference, type, recommendations:type === 'project' ? (record.recommendations || []).map(({score,...r}) => r) : [], technical_review_requested:record.technical_review_requested || false, email_confirmation_queued:!!record.confirmation_email };
}
export async function receiptRecord(db, token, type) {
  if (!['project','nomination'].includes(type)) fail('Invalid receipt type.');
  const entity = type === 'project' ? db.IntegrationSubmission : db.IntegrationNomination;
  const {items} = await entity.filter({receipt_hash:await digest(capability(token))},{limit:1});
  if (!items[0]) fail('Receipt not found. Keep the receipt code from your submission.',404);
  return {entity,record:items[0]};
}