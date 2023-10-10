import {
  TDecryptForPlaintextHandler,
  TDecryptHandler,
  TEncryptHandler,
  TEncryptPlaintextHandler,
} from "./types";
import { TFormats } from "../types";
import {
  getPublicCryptoKey,
  encodeMessage,
  arrayBufferToBase64,
  uIntToBase64,
  getPrivateCryptoKey,
  base64ToArrayBuffer,
  getAESCryptoKey,
  base64ToUint8,
} from "../../utils";
import Config from '../../config/config.json';

let crypto = window.crypto.subtle;

/**
 * 
 * @param public_key The public key
 * @param plainText The plain text string to encrypt
 * @returns The encrypted text payload
 * @deprecated This method will be removed in future releases
 */
const encrypt: TEncryptHandler = async (public_key, plainText) => {
  let rsa_crypto_key = await getPublicCryptoKey(public_key)

  let encoded_text = encodeMessage(plainText)

  var AES_KEY = await crypto.generateKey(
    {
      name: Config.pre.name,
      length: Config.pre.length
    },
    true,
    ["encrypt", "decrypt"]
  )

  const raw_aes_key_format: TFormats = Config.pre.exports as TFormats

  const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(raw_aes_key_format, AES_KEY))

  let encoded_aes = encodeMessage(raw_aes_key)

  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  let aes_encrypted = await crypto.encrypt(
    {
      name: Config.pre.name,
      iv
    },
    AES_KEY,
    encoded_text
  )

  let rsa_encrypted_aes = await crypto.encrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key as CryptoKey,
    encoded_aes
  )

  return {
    cipher_text: arrayBufferToBase64(aes_encrypted),
    aes_key: arrayBufferToBase64(rsa_encrypted_aes),
    iv: uIntToBase64(iv)
  };
}

/**
 * 
 * @param payload The payload containing public key and plain text string
 * @returns The encrypted text
 */
const encryptPlaintext: TEncryptPlaintextHandler = async (payload) => {
  const { public_key, plain_text } = payload;
  let rsa_crypto_key = await getPublicCryptoKey(public_key);

  let encoded_text = encodeMessage(plain_text);

  var AES_KEY = await crypto.generateKey(
    {
      name: Config.pre.name,
      length: Config.pre.length
    },
    true,
    ["encrypt", "decrypt"]
  )

  const raw_aes_key_format: TFormats = Config.pre.exports as TFormats

  const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(raw_aes_key_format, AES_KEY))

  let encoded_aes = encodeMessage(raw_aes_key)

  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  let aes_encrypted = await crypto.encrypt(
    {
      name: Config.pre.name,
      iv
    },
    AES_KEY,
    encoded_text
  )

  let rsa_encrypted_aes = await crypto.encrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key as CryptoKey,
    encoded_aes
  )

  return {
    cipher_text: arrayBufferToBase64(aes_encrypted),
    aes_key: arrayBufferToBase64(rsa_encrypted_aes),
    iv: uIntToBase64(iv)
  };
}

/**
 * 
 * @param aes_key The aes key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_text The encrypted text
 * @returns The decrypted text
 * @deprecated This method will be removed in future releases
 */
const decrypt: TDecryptHandler = async (aes_key, iv, private_key, encrypted_text) => {
  let rsa_crypto_key = await getPrivateCryptoKey(private_key)
  let dec = new TextDecoder()

  let aes_decrypted = await crypto.decrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key as CryptoKey,
    base64ToArrayBuffer(window.atob(aes_key))
  )

  let decoded_aes = dec.decode(aes_decrypted)

  let aes_crypto_key = await getAESCryptoKey(decoded_aes)

  let decrypted = await crypto.decrypt(
    {
      name: Config.pre.name,
      iv: base64ToUint8(iv)
    },
    aes_crypto_key as CryptoKey,
    base64ToArrayBuffer(window.atob(encrypted_text))
  )
  return dec.decode(decrypted);
}

/**
 * 
 * @param payload The payload with required parameters to decrypt the encrypted text
 */
const decryptForPlaintext: TDecryptForPlaintextHandler = async (payload) => {
  const {
    encrypted_text: {
      aes_key,
      iv,
      cipher_text,
    },
    private_key,
  } = payload;

  let rsa_crypto_key = await getPrivateCryptoKey(private_key)
  let dec = new TextDecoder()

  let aes_decrypted = await crypto.decrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key as CryptoKey,
    base64ToArrayBuffer(window.atob(aes_key))
  )

  let decoded_aes = dec.decode(aes_decrypted)

  let aes_crypto_key = await getAESCryptoKey(decoded_aes)

  let decrypted = await crypto.decrypt(
    {
      name: Config.pre.name,
      iv: base64ToUint8(iv)
    },
    aes_crypto_key as CryptoKey,
    base64ToArrayBuffer(window.atob(cipher_text)),
  )
  return dec.decode(decrypted);
}

export {
  encrypt,
  encryptPlaintext,
  decrypt,
  decryptForPlaintext,
};