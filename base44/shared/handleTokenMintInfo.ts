export const CLASSIC_TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const TOKEN_2022_PROGRAM = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
export function verifyHandleMint(account) {
  const info = account?.data?.parsed?.info;
  if (![CLASSIC_TOKEN_PROGRAM, TOKEN_2022_PROGRAM].includes(account?.owner) || !info?.isInitialized || !Number.isInteger(info.decimals) || info.decimals < 0 || info.decimals > 18) throw new Error('Official $HANDLE mint could not be verified.');
  if (info.freezeAuthority || info.mintAuthority) throw new Error('This payment test requires a fixed-supply token without freeze authority.');
  // Metadata-only Token-2022 extensions do not change transfer/burn accounting.
  // Refuse fees, hooks, confidential transfers, default-frozen accounts and all other extensions.
  if ((info.extensions || []).some(item => !['metadataPointer', 'tokenMetadata'].includes(item.extension))) throw new Error('The token has an unsupported payment extension.');
  return { decimals: info.decimals, tokenProgram: account.owner };
}