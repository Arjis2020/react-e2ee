"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getKeys_lib_1 = require("./lib/getKeys/getKeys.lib");
const plaintext_lib_1 = require("./lib/plaintext/plaintext.lib");
const file_lib_1 = require("./lib/file/file.lib");
exports.default = {
    getKeys: getKeys_lib_1.getKeys,
    encrypt: plaintext_lib_1.encrypt,
    encryptFile: file_lib_1.encryptFile,
    decrypt: plaintext_lib_1.decrypt,
    decryptFile: file_lib_1.decryptFile,
    encryptPlaintext: plaintext_lib_1.encryptPlaintext,
    encryptFileBuffer: file_lib_1.encryptFileBuffer,
    decryptForPlaintext: plaintext_lib_1.decryptForPlaintext,
    decryptFileBuffer: file_lib_1.decryptFileBuffer,
};
