
// src/lib/firebaseEnv.ts

/**
 * Retrieves an environment variable directly from process.env.
 * The calling code should ensure it requests the variable name
 * exactly as it's defined in the environment (e.g., process.env.BOLD_API_KEY).
 * @param key The exact key of the environment variable (e.g., 'BOLD_API_KEY').
 * @returns The value of the environment variable, or undefined if not found.
 */
export function getEnv(key: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) {
    console.warn(`process.env is not available. Cannot get env var: ${key}`);
    return undefined;
  }
  return process.env[key];
}
