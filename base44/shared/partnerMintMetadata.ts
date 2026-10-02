import { buildHandleCardSvg } from './handleCardSvg.ts';
import { fault } from './partnerMintCodec.ts';
export default async function partnerMintMetadata(base44, state) {
  const imageResult = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: new File([buildHandleCardSvg(state.handle)], `${state.handle}-devnet.svg`, { type: 'image/svg+xml' }) });
  const metadata = { name: `@${state.handle}`, symbol: 'SOLHANDLE', description: `SolHandle devnet test identity for @${state.handle}. Not a mainnet asset.`, image: imageResult.file_url, attributes: [{ trait_type: 'Handle', value: `@${state.handle}` }, { trait_type: 'Network', value: 'Solana Devnet' }], properties: { category: 'image', files: [{ uri: imageResult.file_url, type: 'image/svg+xml' }] } };
  const result = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: new File([JSON.stringify(metadata)], `${state.handle}-devnet.json`, { type: 'application/json' }) });
  if (!result.file_url || new TextEncoder().encode(result.file_url).length > 200) fault('METADATA_URI_INVALID', 503);
  return result.file_url;
}