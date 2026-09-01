import { base44 } from "@/api/base44Client";

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export default async function invokeWithRetry(functionName, payload, attempts = 2) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await base44.functions.invoke(functionName, payload);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await wait(500 * (attempt + 1));
    }
  }
  throw lastError;
}