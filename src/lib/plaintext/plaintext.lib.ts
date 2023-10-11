import {
  type TDecryptForPlaintextHandler,
  type TDecryptHandler,
  type TEncryptHandler,
  type TEncryptPlaintextHandler
} from './types'
import { type TFormats } from '../types'
import {
  getPublicCryptoKey,
  encodeMessage,
  arrayBufferToBase64,
  uIntToBase64,
  getPrivateCryptoKey,
  base64ToArrayBuffer,
  getAESCryptoKey,
  base64ToUint8
} from '../../utils'
import Config from '../../config/config.json';

const crypto = window.crypto.subtle

/**
 * @deprecated This method will be removed in future releases. Use 'encryptPlaintext' instead
 * @param public_key The public key
 * @param plainText The plain text string to encrypt
 * @returns The encrypted text payload
 */
const encrypt: TEncryptHandler = async (public_key, plainText) => {
  const rsa_crypto_key = await getPublicCryptoKey(public_key);

  const encoded_text = encodeMessage(plainText);

  const AES_KEY = await crypto.generateKey(
    {
      name: Config.pre.name,
      length: Config.pre.length
    },
    true,
    ['encrypt', 'decrypt']
  )

  const raw_aes_key_format: TFormats = Config.pre.exports as TFormats

  const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(raw_aes_key_format, AES_KEY))

  const encoded_aes = encodeMessage(raw_aes_key);

  const iv = window.crypto.getRandomValues(new Uint8Array(16))
  const aes_encrypted = await crypto.encrypt(
    {
      name: Config.pre.name,
      iv
    },
    AES_KEY,
    encoded_text
  );

  const rsa_encrypted_aes = await crypto.encrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    encoded_aes
  );

  return {
    cipher_text: arrayBufferToBase64(aes_encrypted),
    aes_key: arrayBufferToBase64(rsa_encrypted_aes),
    iv: uIntToBase64(iv)
  };
};

/**
 * @param payload The payload containing public key and plain text string
 * @returns The encrypted text
 */
const encryptPlaintext: TEncryptPlaintextHandler = async (payload) => {
  const { public_key, plain_text } = payload;
  const rsa_crypto_key = await getPublicCryptoKey(public_key)

  const encoded_text = encodeMessage(plain_text)

  const AES_KEY = await crypto.generateKey(
    {
      name: Config.pre.name,
      length: Config.pre.length
    },
    true,
    ['encrypt', 'decrypt']
  )

  const raw_aes_key_format: TFormats = Config.pre.exports as TFormats

  const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(raw_aes_key_format, AES_KEY))

  const encoded_aes = encodeMessage(raw_aes_key);

  const iv = window.crypto.getRandomValues(new Uint8Array(16))
  const aes_encrypted = await crypto.encrypt(
    {
      name: Config.pre.name,
      iv
    },
    AES_KEY,
    encoded_text
  );

  const rsa_encrypted_aes = await crypto.encrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    encoded_aes
  );

  return {
    cipher_text: arrayBufferToBase64(aes_encrypted),
    aes_key: arrayBufferToBase64(rsa_encrypted_aes),
    iv: uIntToBase64(iv)
  };
};

/**
 * @deprecated This method will be removed in future releases. Use 'decryptPlaintext' instead
 * @quickfix 'decryptPlaintext'
 * @param aes_key The aes key
 * @param iv The IV padding
 * @param private_key The private key
 * @param encrypted_text The encrypted text
 * @returns The decrypted text
 */
const decrypt: TDecryptHandler = async (aes_key, iv, private_key, encrypted_text) => {
  const rsa_crypto_key = await getPrivateCryptoKey(private_key);
  const dec = new TextDecoder();

  const aes_decrypted = await crypto.decrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    base64ToArrayBuffer(window.atob(aes_key))
  );

  const decoded_aes = dec.decode(aes_decrypted);

  const aes_crypto_key = await getAESCryptoKey(decoded_aes);

  const decrypted = await crypto.decrypt(
    {
      name: Config.pre.name,
      iv: base64ToUint8(iv)
    },
    aes_crypto_key,
    base64ToArrayBuffer(window.atob(encrypted_text))
  );
  return dec.decode(decrypted);
}

/**
 * @param payload The payload with required parameters to decrypt the encrypted text
 */
const decryptForPlaintext: TDecryptForPlaintextHandler = async (payload) => {
  const {
    encrypted_text: {
      aes_key,
      iv,
      cipher_text
    },
    private_key
  } = payload;

  const rsa_crypto_key = await getPrivateCryptoKey(private_key);
  const dec = new TextDecoder();

  const aes_decrypted = await crypto.decrypt(
    {
      name: Config.main.name
    },
    rsa_crypto_key,
    base64ToArrayBuffer(window.atob(aes_key))
  );

  const decoded_aes = dec.decode(aes_decrypted);

  const aes_crypto_key = await getAESCryptoKey(decoded_aes);

  const decrypted = await crypto.decrypt(
    {
      name: Config.pre.name,
      iv: base64ToUint8(iv)
    },
    aes_crypto_key,
    base64ToArrayBuffer(window.atob(cipher_text))
  )
  return dec.decode(decrypted);
}

export {
  encrypt,
  encryptPlaintext,
  decrypt,
  decryptForPlaintext
}
