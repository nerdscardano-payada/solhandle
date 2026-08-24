export function normalizeHandle(value: unknown) {
  return String(value || "").trim().replace(/^@+/, "").toLowerCase();
}

export function normalizeDomain(value: unknown) {
  return String(value || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\.$/, "");
}

export function claimMessage(request: Record<string, unknown>) {
  return [
    "SolHandle official claim",
    `Handle: @${request.handle}`,
    `Domain: ${request.official_domain}`,
    `Recipient: ${request.recipient_wallet}`,
    `Challenge: ${request.challenge}`,
    `Expires: ${request.challenge_expires_at}`
  ].join("\n");
}

export function verifiedStatus(domainVerified: boolean, walletVerified: boolean) {
  if (domainVerified && walletVerified) return "verified";
  if (domainVerified) return "domain_verified";
  return "pending";
}