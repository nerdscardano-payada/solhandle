export const ERROR_CODES = Object.freeze({
  INVALID_HANDLE: "INVALID_HANDLE",
  HANDLE_RETIRED: "HANDLE_RETIRED",
  UNSUPPORTED_PROTOCOL_VERSION: "UNSUPPORTED_PROTOCOL_VERSION",
  INVALID_REGISTRY_ACCOUNT: "INVALID_REGISTRY_ACCOUNT",
  INVALID_COLLECTION: "INVALID_COLLECTION",
  ASSET_NOT_FOUND: "ASSET_NOT_FOUND",
  OWNERSHIP_INVALID: "OWNERSHIP_INVALID",
  PRIMARY_HANDLE_STALE: "PRIMARY_HANDLE_STALE",
  RPC_ERROR: "RPC_ERROR",
});

export class SolHandleError extends Error {
  constructor(code, message, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = "SolHandleError";
    this.code = code;
  }
}