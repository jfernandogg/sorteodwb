"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
// @ts-ignore - firebase-admin types may not be installed in all environments
var app_1 = require("firebase-admin/app");
// @ts-ignore - firebase-admin types may not be installed in all environments
var firestore_1 = require("firebase-admin/firestore");
var app;
if (!(0, app_1.getApps)().length) {
    app = (0, app_1.initializeApp)();
}
else {
    app = (0, app_1.getApps)()[0];
}
// Permitir especificar el nombre de la base de datos por variable de entorno o usar 'dwbrifa' por defecto
var databaseId = process.env.FIRESTORE_DATABASE_ID || 'dwbrifa';
console.log('[firebaseServer] databaseId:', databaseId);
// getFirestore puede recibir el ID de la base de datos como segundo argumento
exports.firestore = (0, firestore_1.getFirestore)(app, databaseId);
