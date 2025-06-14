"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
var googleapis_1 = require("googleapis");
// Utilidad para enviar correos usando Gmail API con un usuario de servicio
// Requiere que el usuario de servicio tenga delegación de dominio y el correo del usuario real en GMAIL_SENDER_EMAIL
var GMAIL_SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;
var GMAIL_SERVICE_ACCOUNT = process.env.GMAIL_SERVICE_ACCOUNT_KEY;
if (!GMAIL_SENDER_EMAIL)
    throw new Error('GMAIL_SENDER_EMAIL no está definido en las variables de entorno');
if (!GMAIL_SERVICE_ACCOUNT)
    throw new Error('GMAIL_SERVICE_ACCOUNT_KEY no está definido en las variables de entorno');
var serviceAccount = JSON.parse(GMAIL_SERVICE_ACCOUNT);
var SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
var auth = new googleapis_1.google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: SCOPES,
    subject: GMAIL_SENDER_EMAIL, // Para enviar como el usuario real
});
var gmail = googleapis_1.google.gmail({ version: 'v1', auth: auth });
function sendMail(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var raw, res;
        var to = _b.to, subject = _b.subject, message = _b.message, _c = _b.from, from = _c === void 0 ? GMAIL_SENDER_EMAIL : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    raw = Buffer.from("From: ".concat(from, "\nTo: ").concat(to, "\nSubject: ").concat(subject, "\nContent-Type: text/html; charset=utf-8\n\n").concat(message)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                    return [4 /*yield*/, gmail.users.messages.send({
                            userId: 'me',
                            requestBody: {
                                raw: raw,
                            },
                        })];
                case 1:
                    res = _d.sent();
                    return [2 /*return*/, res.data];
            }
        });
    });
}
