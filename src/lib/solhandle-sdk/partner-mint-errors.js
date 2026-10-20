export class PartnerMintError extends Error {
  constructor(code, message, details = {}) {
    super(message, details.cause ? { cause: details.cause } : undefined);
    this.name = 'PartnerMintError';
    this.code = code;
    Object.assign(this, details);
  }
}
export const mintAssert = (condition, code, message) => {
  if (!condition) throw new PartnerMintError(code, message);
};