// Application-only retirement. No on-chain program or ownership changes.
export const earnRetired = true;
export function earnRetiredResponse() {
  return Response.json({ code: 'EARN_RETIRED', enabled: false, valid: false, error: 'This service is no longer available.' }, { status: 410 });
}