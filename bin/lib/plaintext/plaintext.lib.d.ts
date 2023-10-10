import { TDecryptForPlaintextHandler, TDecryptHandler, TEncryptHandler, TEncryptPlaintextHandler } from "./types";
/**
 *
 * @param public_key The public key
 * @param plainText The plain text string to encrypt
 * @returns The encrypted text payload
 * @deprecated This method will be removed in future releases
 */
declare const encrypt: TEncryptHandler;
/**
 *
 * @param payload The payload containing public key and plain text string
 * @returns The encrypted text
 */
declare const encryptPlaintext: TEncryptPlaintextHandler;
/**
 *
 * @param aes_key The aes key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_text The encrypted text
 * @returns The decrypted text
 * @deprecated This method will be removed in future releases
 */
declare const decrypt: TDecryptHandler;
/**
 *
 * @param payload The payload with required parameters to decrypt the encrypted text
 */
declare const decryptForPlaintext: TDecryptForPlaintextHandler;
export { encrypt, encryptPlaintext, decrypt, decryptForPlaintext, };
