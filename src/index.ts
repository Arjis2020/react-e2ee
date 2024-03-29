import { getKeys } from './lib/getKeys/getKeys.lib';
import {
    encrypt,
    decrypt,
    encryptPlaintext,
    decryptForPlaintext,
} from './lib/plaintext/plaintext.lib';

import {
    encryptFile,
    decryptFile,
    encryptFileBuffer,
    decryptFileBuffer,
} from './lib/file/file.lib';

export default {
    getKeys,
    /** @deprecated */
    encrypt,
    /** @deprecated */
    encryptFile,
    /** @deprecated */
    decrypt,
    /** @deprecated */
    decryptFile,
    encryptPlaintext,
    encryptFileBuffer,
    decryptForPlaintext,
    decryptFileBuffer,
};
