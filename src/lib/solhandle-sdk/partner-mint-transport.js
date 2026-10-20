import { PartnerMintError, mintAssert } from './partner-mint-errors.js';

export default function partnerMintTransport(invoke) {
  mintAssert(typeof invoke === 'function', 'TRANSPORT_REQUIRED', 'Provide an authenticated invoke(functionName, payload) transport.');
  return async (action, payload) => {
    const name = ['availability', 'quote'].includes(action) ? 'partnerMintRead' : 'partnerMintTransaction';
    let response;
    try {
      response = await invoke(name, { ...payload, action, cluster: 'devnet' });
    } catch (cause) {
      const body = cause.response?.data;
      throw new PartnerMintError(body?.error?.code || 'TRANSPORT_ERROR', body?.error?.message || cause.message || 'Devnet request failed. Check the existing intent before signing again.', { cause, status: cause.response?.status, requestId: body?.requestId });
    }
    const data = response?.data;
    if (data?.error) throw new PartnerMintError(data.error.code || 'REQUEST_FAILED', data.error.message || 'Devnet request failed.', { requestId: data.requestId });
    mintAssert(data && typeof data === 'object', 'INVALID_RESPONSE', 'The transport must return { data: responseBody }.');
    mintAssert((data.cluster || data.quote?.cluster) === 'devnet', 'WRONG_CLUSTER', 'The service did not return a Devnet response.');
    return data;
  };
}