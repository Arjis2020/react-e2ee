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
exports.decryptForPlaintext = exports.decrypt = exports.encryptPlaintext = exports.encrypt = void 0;
const utils_1 = require("../../utils");
const config_json_1 = __importDefault(require("../../config/config.json"));
let crypto = window.crypto.subtle;
/**
 *
 * @param public_key The public key
 * @param plainText The plain text string to encrypt
 * @returns The encrypted text payload
 * @deprecated This method will be removed in future releases
 */
const encrypt = (public_key, plainText) => __awaiter(void 0, void 0, void 0, function* () {
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
    return {
        cipher_text: (0, utils_1.arrayBufferToBase64)(aes_encrypted),
        aes_key: (0, utils_1.arrayBufferToBase64)(rsa_encrypted_aes),
        iv: (0, utils_1.uIntToBase64)(iv)
    };
});
exports.encrypt = encrypt;
/**
 *
 * @param payload The payload containing public key and plain text string
 * @returns The encrypted text
 */
const encryptPlaintext = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { public_key, plain_text } = payload;
    let rsa_crypto_key = yield (0, utils_1.getPublicCryptoKey)(public_key);
    let encoded_text = (0, utils_1.encodeMessage)(plain_text);
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
    return {
        cipher_text: (0, utils_1.arrayBufferToBase64)(aes_encrypted),
        aes_key: (0, utils_1.arrayBufferToBase64)(rsa_encrypted_aes),
        iv: (0, utils_1.uIntToBase64)(iv)
    };
});
exports.encryptPlaintext = encryptPlaintext;
/**
 *
 * @param aes_key The aes key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_text The encrypted text
 * @returns The decrypted text
 * @deprecated This method will be removed in future releases
 */
const decrypt = (aes_key, iv, private_key, encrypted_text) => __awaiter(void 0, void 0, void 0, function* () {
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
    return dec.decode(decrypted);
});
exports.decrypt = decrypt;
/**
 *
 * @param payload The payload with required parameters to decrypt the encrypted text
 */
const decryptForPlaintext = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { aes_key, iv, private_key, encrypted_text, } = payload;
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
    return dec.decode(decrypted);
});
exports.decryptForPlaintext = decryptForPlaintext;
