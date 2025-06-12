"use strict";
// src/lib/firebaseEnv.ts
// Utilidad para obtener variables de entorno compatible con Firebase Functions y local
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
function getEnv(key) {
    var functionsConfig = null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var functions = require('firebase-functions');
        functionsConfig = functions.config();
    }
    catch (e) {
        functionsConfig = null;
    }
    if (functionsConfig) {
        var _a = key.split('.'), main = _a[0], sub = _a[1];
        if (functionsConfig[main]) {
            return sub ? functionsConfig[main][sub] : functionsConfig[main];
        }
    }
    return process.env[key] || undefined;
}
