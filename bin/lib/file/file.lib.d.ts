import { TDecryptFileBufferHandler, TDecryptFileHandler, TEncryptFileBufferHandler, TEncryptFileHandler } from './types';
/**
 * @deprecated
 * @param public_key The public key
 * @param file_buffer The file buffer
 * @returns The encrypted file object
 */
declare const encryptFile: TEncryptFileHandler;
/**
 *
 * @param payload The payload containing all file details
 * @returns Encrypted file
 */
declare const encryptFileBuffer: TEncryptFileBufferHandler;
/**
 * @deprecated
 * @param aes_key The AES key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_buffer The encrypted buffer of file
 * @returns The array buffer to convert to a file object
 */
declare const decryptFile: TDecryptFileHandler;
/**
 * @param payload The encrypted file payload
 * @returns The decrypted file array buffer
 */
declare const decryptFileBuffer: TDecryptFileBufferHandler;
export { encryptFile, encryptFileBuffer, decryptFile, decryptFileBuffer, };
