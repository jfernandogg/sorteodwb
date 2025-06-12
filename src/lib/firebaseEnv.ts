
// Intentionally using 'use server' for Next.js API routes or Server Actions
// if this file were to be imported by such components.
// However, for API routes, it's often not strictly necessary for simple env var access.
// 'use server'; 

/**
 * Retrieves an environment variable.
 * Converts keys like 'namespace.key' to 'NAMESPACE_KEY' before lookup.
 * @param key The key of the environment variable (e.g., 'bold.api_key').
 * @returns The value of the environment variable, or undefined if not found.
 */
export function getEnv(key: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) {
    // This might happen in certain client-side contexts if not careful,
    // but for API routes, process.env should be available.
    console.warn(`process.env is not available. Cannot get env var: ${key}`);
    return undefined;
  }
  const envVarName = key.toUpperCase().replace(/\./g, '_');
  return process.env[envVarName];
}
