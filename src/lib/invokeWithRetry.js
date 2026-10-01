import { base44 } from "@/api/base44Client";

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export default async function invokeWithRetry(functionName, payload, attempts = 2) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await base44.functions.invoke(functionName, payload);
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      const rateLimited = status === 429 || /rate limit/i.test(error.response?.data?.error || error.message || '');
      if (status && status < 500 && !rateLimited) throw error;
      if (attempt < attempts - 1) await wait(rateLimited ? 5000 * (attempt + 1) : 500 * (attempt + 1));
    }
  }
  throw lastError;
}