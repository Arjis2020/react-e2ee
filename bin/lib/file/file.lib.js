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
exports.decryptFileBuffer = exports.decryptFile = exports.encryptFileBuffer = exports.encryptFile = void 0;
const utils_1 = require("../../utils");
const config_json_1 = __importDefault(require("../../config/config.json"));
let crypto = window.crypto.subtle;
/**
 * @deprecated
 * @param public_key The public key
 * @param file_buffer The file buffer
 * @returns The encrypted file object
 */
const encryptFile = (public_key, file_buffer) => __awaiter(void 0, void 0, void 0, function* () {
    let rsa_crypto_key = yield (0, utils_1.getPublicCryptoKey)(public_key);
    var AES_KEY = yield crypto.generateKey({
        name: config_json_1.default.pre.name,
        length: config_json_1.default.pre.length
    }, true, ["encrypt", "decrypt"]);
    const raw_aes_key = (0, utils_1.arrayBufferToBase64)(yield crypto.exportKey(config_json_1.default.pre.exports, AES_KEY));
    let encoded_aes = (0, utils_1.encodeMessage)(raw_aes_key);
    let iv = window.crypto.getRandomValues(new Uint8Array(16));
    let aes_encrypted = yield crypto.encrypt({
        name: config_json_1.default.pre.name,
        iv
    }, AES_KEY, file_buffer);
    let rsa_encrypted_aes = yield crypto.encrypt({
        name: config_json_1.default.main.name
    }, rsa_crypto_key, encoded_aes);
    return {
        cipher_buffer: aes_encrypted,
        aes_key: (0, utils_1.arrayBufferToBase64)(rsa_encrypted_aes),
        iv: (0, utils_1.uIntToBase64)(iv)
    };
});
exports.encryptFile = encryptFile;
/**
 *
 * @param payload The payload containing all file details
 * @returns Encrypted file
 */
const encryptFileBuffer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { public_key, file_buffer, } = payload;
    let rsa_crypto_key = yield (0, utils_1.getPublicCryptoKey)(public_key);
    var AES_KEY = yield crypto.generateKey({
        name: config_json_1.default.pre.name,
        length: config_json_1.default.pre.length
    }, true, ["encrypt", "decrypt"]);
    const raw_aes_key = (0, utils_1.arrayBufferToBase64)(yield crypto.exportKey(config_json_1.default.pre.exports, AES_KEY));
    let encoded_aes = (0, utils_1.encodeMessage)(raw_aes_key);
    let iv = window.crypto.getRandomValues(new Uint8Array(16));
    let aes_encrypted = yield crypto.encrypt({
        name: config_json_1.default.pre.name,
        iv
    }, AES_KEY, file_buffer);
    let rsa_encrypted_aes = yield crypto.encrypt({
        name: config_json_1.default.main.name
    }, rsa_crypto_key, encoded_aes);
    return {
        cipher_buffer: aes_encrypted,
        aes_key: (0, utils_1.arrayBufferToBase64)(rsa_encrypted_aes),
        iv: (0, utils_1.uIntToBase64)(iv)
    };
});
exports.encryptFileBuffer = encryptFileBuffer;
/**
 * @deprecated
 * @param aes_key The AES key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_buffer The encrypted buffer of file
 * @returns The array buffer to convert to a file object
 */
const decryptFile = (aes_key, iv, private_key, encrypted_buffer) => __awaiter(void 0, void 0, void 0, function* () {
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
    }, aes_crypto_key, encrypted_buffer);
    return decrypted;
});
exports.decryptFile = decryptFile;
/**
 * @param payload The encrypted file payload
 * @returns The decrypted file array buffer
 */
const decryptFileBuffer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { aes_key, iv, private_key, encrypted_buffer, } = payload;
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
    }, aes_crypto_key, encrypted_buffer);
    return decrypted;
});
exports.decryptFileBuffer = decryptFileBuffer;
