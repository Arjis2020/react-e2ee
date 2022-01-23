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
const utils_1 = require("./utils");
const config_json_1 = __importDefault(require("./config.json"));
let crypto = window.crypto.subtle;
function getKeys() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            var RSA_KEY = yield crypto.generateKey({
                name: config_json_1.default.main.name,
                modulusLength: config_json_1.default.main.modulus,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: config_json_1.default.main.hash
            }, true, ["encrypt", "decrypt"]);
            const spki_public_key_format = config_json_1.default.main.exports.public;
            const pkcs8_private_key_format = config_json_1.default.main.exports.private;
            const spki_public_key = yield crypto.exportKey(spki_public_key_format, RSA_KEY.publicKey);
            const pkcs8_private_key = yield crypto.exportKey(pkcs8_private_key_format, RSA_KEY.privateKey);
            resolve({
                public_key: (0, utils_1.toPublicPem)(spki_public_key),
                private_key: (0, utils_1.toPrivatePem)(pkcs8_private_key),
            });
        }
        catch (err) {
            reject(err);
        }
    }));
}
function encrypt(public_key, plainText) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let rsa_crypto_key = yield (0, utils_1.getPublicCryptoKey)(public_key);
            let encoded_text = (0, utils_1.encodeMessage)(plainText);
            var AES_KEY = yield crypto.generateKey({
                name: config_json_1.default.pre.name,
                length: config_json_1.default.pre.length
            }, true, ["encrypt", "decrypt"]);
            const raw_aes_key_format = config_json_1.default.pre.exports;
            const raw_aes_key = (0, utils_1.arrayBufferToBase64)(yield crypto.exportKey(raw_aes_key_format, AES_KEY));
            let encoded_aes = (0, utils_1.encodeMessage)(raw_aes_key);
            let iv = window.crypto.getRandomValues(new Uint8Array(16));
            let aes_encrypted = yield crypto.encrypt({
                name: config_json_1.default.pre.name,
                iv
            }, AES_KEY, encoded_text);
            let rsa_encrypted_aes = yield crypto.encrypt({
                name: config_json_1.default.main.name
            }, rsa_crypto_key, encoded_aes);
            resolve({
                cipher_text: (0, utils_1.arrayBufferToBase64)(aes_encrypted),
                aes_key: (0, utils_1.arrayBufferToBase64)(rsa_encrypted_aes),
                iv: (0, utils_1.uIntToBase64)(iv)
            });
        }
        catch (err) {
            reject(err);
        }
    }));
}
function decrypt(aes_key, iv, private_key, encrypted_text) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let rsa_crypto_key = yield (0, utils_1.getPrivateCryptoKey)(private_key);
            let dec = new TextDecoder();
            let aes_decrypted = yield crypto.decrypt({
                name: config_json_1.default.main.name
            }, rsa_crypto_key, (0, utils_1.base64ToArrayBuffer)(window.atob(aes_key)));
            let decoded_aes = dec.decode(aes_decrypted);
            let aes_crypto_key = yield (0, utils_1.getAESCryptoKey)(decoded_aes);
            let decrypted = yield crypto.decrypt({
                name: config_json_1.default.pre.name,
                iv: (0, utils_1.base64ToUint8)(iv)
            }, aes_crypto_key, (0, utils_1.base64ToArrayBuffer)(window.atob(encrypted_text)));
            resolve(dec.decode(decrypted));
        }
        catch (err) {
            reject(err);
        }
    }));
}
exports.default = { getKeys, encrypt, decrypt };
//# sourceMappingURL=index.js.map