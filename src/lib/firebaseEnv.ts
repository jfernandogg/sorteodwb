// src/lib/firebaseEnv.ts
// Utilidad para obtener variables de entorno compatible con Firebase Functions y local

export function getEnv(key: string): string | undefined {
  let functionsConfig: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const functions = require('firebase-functions');
    functionsConfig = functions.config();
  } catch (e) {
    functionsConfig = null;
  }
  if (functionsConfig) {
    const [main, sub] = key.split('.');
    if (functionsConfig[main]) {
      return sub ? functionsConfig[main][sub] : functionsConfig[main];
    }
  }
  return process.env[key] || undefined;
}
