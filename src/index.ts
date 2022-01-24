import {
    base64ToArrayBuffer,
    arrayBufferToBase64,
    toPrivatePem,
    toPublicPem,
    encodeMessage,
    getPrivateCryptoKey,
    getPublicCryptoKey,
    getAESCryptoKey,
    uIntToBase64,
    base64ToUint8
} from './utils'
import Config from './config.json'
import { Formats } from './formats'

let crypto = window.crypto.subtle

function getKeys(): Promise<{ public_key: string, private_key: string }> {
    return new Promise(async (resolve, reject) => {
        try {
            var RSA_KEY = await crypto.generateKey({
                name: Config.main.name,
                modulusLength: Config.main.modulus,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: Config.main.hash
            },
                true,
                ["encrypt", "decrypt"]
            )

            const spki_public_key_format: Formats = Config.main.exports.public as Formats
            const pkcs8_private_key_format: Formats = Config.main.exports.private as Formats

            const spki_public_key = await crypto.exportKey(spki_public_key_format, RSA_KEY.publicKey as CryptoKey)
            const pkcs8_private_key = await crypto.exportKey(pkcs8_private_key_format, RSA_KEY.privateKey as CryptoKey)

            resolve({
                public_key: toPublicPem(spki_public_key),
                private_key: toPrivatePem(pkcs8_private_key),
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

function encrypt(public_key: string, plainText: string): Promise<{ cipher_text: string, aes_key: string, iv: string }> {
    return new Promise(async (resolve, reject) => {
        try {
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

            const raw_aes_key_format: Formats = Config.pre.exports as Formats

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

            resolve({
                cipher_text: arrayBufferToBase64(aes_encrypted),
                aes_key: arrayBufferToBase64(rsa_encrypted_aes),
                iv: uIntToBase64(iv)
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

function decrypt(aes_key: string, iv: string, private_key: string, encrypted_text: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
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

            resolve(dec.decode(decrypted))
        }
        catch (err) {
            reject(err)
        }
    })
}

function encryptFile(public_key:string, file_buffer: ArrayBuffer) : Promise<{ cipher_buffer: ArrayBuffer, aes_key: string, iv: string }> {
    return new Promise(async (resolve, reject) => {
        try {
            let rsa_crypto_key = await getPublicCryptoKey(public_key)

            var AES_KEY = await crypto.generateKey(
                {
                    name: Config.pre.name,
                    length: Config.pre.length
                },
                true,
                ["encrypt", "decrypt"]
            )

            const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(Config.pre.exports as Formats, AES_KEY))

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

            resolve({
                cipher_buffer: aes_encrypted,
                aes_key: arrayBufferToBase64(rsa_encrypted_aes),
                iv: uIntToBase64(iv)
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

function decryptFile(aes_key:string, iv:string, private_key:string, encrypted_buffer:ArrayBuffer) : Promise<ArrayBuffer> {
    return new Promise(async (resolve, reject) => {
        try {
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

            resolve(decrypted)
        }
        catch (err) {
            reject(err)
        }
    })
}

export default { getKeys, encrypt, decrypt, encryptFile, decryptFile }