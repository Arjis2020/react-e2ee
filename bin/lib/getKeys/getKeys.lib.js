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
exports.getKeys = void 0;
const utils_1 = require("../../utils");
const config_json_1 = __importDefault(require("../../config/config.json"));
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
exports.getKeys = getKeys;
;
