
import {
  base64ToArrayBuffer,
  arrayBufferToBase64,
  encodeMessage,
  getPrivateCryptoKey,
  getPublicCryptoKey,
  getAESCryptoKey,
  uIntToBase64,
  base64ToUint8
} from '../../utils';
import Config from '../../config/config.json';
import { TFormats } from '../types';
import { TDecryptFileBufferHandler, TDecryptFileHandler, TEncryptFileBufferHandler, TEncryptFileHandler } from './types';

let crypto = window.crypto.subtle;

/**
 * @deprecated
 * @param public_key The public key
 * @param file_buffer The file buffer
 * @returns The encrypted file object
 */
const encryptFile: TEncryptFileHandler = async (public_key, file_buffer) => {
  let rsa_crypto_key = await getPublicCryptoKey(public_key)

  var AES_KEY = await crypto.generateKey(
    {
      name: Config.pre.name,
      length: Config.pre.length
    },
    true,
    ["encrypt", "decrypt"]
  )

  const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(Config.pre.exports as TFormats, AES_KEY))

  let encoded_aes = encodeMessage(raw_aes_key)

  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  let aes_encrypted = await crypto.encrypt(
    {
      name: Config.pre.name,
      iv
    },
    AES_KEY,
    file_buffer
  )

  let rsa_encrypted_aes = await crypto.encrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    encoded_aes
  )

  return {
    cipher_buffer: aes_encrypted,
    aes_key: arrayBufferToBase64(rsa_encrypted_aes),
    iv: uIntToBase64(iv)
  };
}

/**
 * 
 * @param payload The payload containing all file details
 * @returns Encrypted file
 */
const encryptFileBuffer: TEncryptFileBufferHandler = async (payload) => {
  const {
    public_key,
    file_buffer,
  } = payload;
  let rsa_crypto_key = await getPublicCryptoKey(public_key)

  var AES_KEY = await crypto.generateKey(
    {
      name: Config.pre.name,
      length: Config.pre.length
    },
    true,
    ["encrypt", "decrypt"]
  )

  const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(Config.pre.exports as TFormats, AES_KEY))

  let encoded_aes = encodeMessage(raw_aes_key)

  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  let aes_encrypted = await crypto.encrypt(
    {
      name: Config.pre.name,
      iv
    },
    AES_KEY,
    file_buffer
  )

  let rsa_encrypted_aes = await crypto.encrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    encoded_aes
  )

  return {
    cipher_buffer: aes_encrypted,
    aes_key: arrayBufferToBase64(rsa_encrypted_aes),
    iv: uIntToBase64(iv)
  };
}

/**
 * @deprecated
 * @param aes_key The AES key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_buffer The encrypted buffer of file
 * @returns The array buffer to convert to a file object
 */
const decryptFile: TDecryptFileHandler = async (aes_key, iv, private_key, encrypted_buffer) => {
  let rsa_crypto_key = await getPrivateCryptoKey(private_key)
  let dec = new TextDecoder()

  let aes_decrypted = await crypto.decrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    base64ToArrayBuffer(window.atob(aes_key))
  )

  let decoded_aes = dec.decode(aes_decrypted)

  let aes_crypto_key = await getAESCryptoKey(decoded_aes)

  let decrypted = await crypto.decrypt(
    {
      name: Config.pre.name,
      iv: base64ToUint8(iv)
    },
    aes_crypto_key,
    encrypted_buffer
  )

  return decrypted;
}

/**
 * @param payload The encrypted file payload
 * @returns The decrypted file array buffer
 */
const decryptFileBuffer: TDecryptFileBufferHandler = async (payload) => {
  const {
    encrypted_buffer: {
      aes_key,
      iv,
      cipher_buffer,
    },
    private_key,
  } = payload;

  let rsa_crypto_key = await getPrivateCryptoKey(private_key)
  let dec = new TextDecoder()

  let aes_decrypted = await crypto.decrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    base64ToArrayBuffer(window.atob(aes_key))
  )

  let decoded_aes = dec.decode(aes_decrypted)

  let aes_crypto_key = await getAESCryptoKey(decoded_aes)

  let decrypted = await crypto.decrypt(
    {
      name: Config.pre.name,
      iv: base64ToUint8(iv)
    },
    aes_crypto_key,
    cipher_buffer,
  )

  return decrypted;
}

export {
  encryptFile,
  encryptFileBuffer,
  decryptFile,
  decryptFileBuffer,
};