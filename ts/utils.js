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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToUint8 = exports.uIntToBase64 = exports.getAESCryptoKey = exports.getPrivateCryptoKey = exports.getPublicCryptoKey = exports.toPublicPem = exports.toPrivatePem = exports.encodeMessage = exports.base64ToArrayBuffer = exports.arrayBufferToBase64 = void 0;
const config_json_1 = __importDefault(require("./config.json"));
let crypto = window.crypto.subtle;
function arrayBufferToBase64(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = '';
    for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    var b64 = window.btoa(byteString);
    return b64;
}
exports.arrayBufferToBase64 = arrayBufferToBase64;
function base64ToArrayBuffer(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
exports.base64ToArrayBuffer = base64ToArrayBuffer;
function addNewLines(str) {
    var finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }
    return finalString;
}
function toPrivatePem(privateKey) {
    var b64 = addNewLines(arrayBufferToBase64(privateKey));
    var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";
    return pem;
}
exports.toPrivatePem = toPrivatePem;
function toPublicPem(publicKey) {
    var b64 = addNewLines(arrayBufferToBase64(publicKey));
    var pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
    return pem;
}
exports.toPublicPem = toPublicPem;
function encodeMessage(plainText) {
    let enc = new TextEncoder();
    return enc.encode(plainText);
}
exports.encodeMessage = encodeMessage;
function getPublicCryptoKey(public_key) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const pemHeader = "-----BEGIN PUBLIC KEY-----";
            const pemFooter = "-----END PUBLIC KEY-----";
            const pemContents = public_key.substring(pemHeader.length, public_key.length - pemFooter.length);
            const binaryDerString = window.atob(pemContents);
            const spki = base64ToArrayBuffer(binaryDerString);
            const public_key_format = config_json_1.default.main.exports.public;
            let crypto_key = yield crypto.importKey(public_key_format, spki, {
                name: config_json_1.default.main.name,
                hash: config_json_1.default.main.hash
            }, true, ["encrypt"]);
            resolve(crypto_key);
        }
        catch (err) {
            reject(err);
        }
    }));
}
exports.getPublicCryptoKey = getPublicCryptoKey;
function getPrivateCryptoKey(private_key) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const pemHeader = "-----BEGIN PRIVATE KEY-----";
            const pemFooter = "-----END PRIVATE KEY-----";
            const pemContents = private_key.substring(pemHeader.length, private_key.length - pemFooter.length);
            const binaryDerString = window.atob(pemContents);
            const pkcs8 = base64ToArrayBuffer(binaryDerString);
            const private_key_format = config_json_1.default.main.exports.private;
            let crypto_key = yield crypto.importKey(private_key_format, pkcs8, {
                name: config_json_1.default.main.name,
                hash: config_json_1.default.main.hash
            }, true, ["decrypt"]);
            resolve(crypto_key);
        }
        catch (err) {
            reject(err);
        }
    }));
}
exports.getPrivateCryptoKey = getPrivateCryptoKey;
function getAESCryptoKey(aes_key) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const raw = base64ToArrayBuffer(window.atob(aes_key));
            const pre_key_format = config_json_1.default.pre.exports;
            let aes_crypto_key = yield crypto.importKey(pre_key_format, raw, {
                name: config_json_1.default.pre.name
            }, true, ["encrypt", "decrypt"]);
            resolve(aes_crypto_key);
        }
        catch (err) {
            reject(err);
        }
    }));
}
exports.getAESCryptoKey = getAESCryptoKey;
function uIntToBase64(u8) {
    return window.btoa(String.fromCharCode.apply(null, u8));
}
exports.uIntToBase64 = uIntToBase64;
function base64ToUint8(str) {
    return new Uint8Array(window.atob(str).split('').map(function (c) { return c.charCodeAt(0); }));
}
exports.base64ToUint8 = base64ToUint8;
//# sourceMappingURL=utils.js.map