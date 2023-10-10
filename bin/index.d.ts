import { getKeys } from './lib/getKeys/getKeys.lib';
declare const _default: {
    getKeys: typeof getKeys;
    encrypt: import("./lib/plaintext/types").TEncryptHandler;
    encryptFile: import("./lib/file/types").TEncryptFileHandler;
    decrypt: import("./lib/plaintext/types").TDecryptHandler;
    decryptFile: import("./lib/file/types").TDecryptFileHandler;
    encryptPlaintext: import("./lib/plaintext/types").TEncryptPlaintextHandler;
    encryptFileBuffer: import("./lib/file/types").TEncryptFileBufferHandler;
    decryptForPlaintext: import("./lib/plaintext/types").TDecryptForPlaintextHandler;
    decryptFileBuffer: import("./lib/file/types").TDecryptFileBufferHandler;
};
export default _default;
