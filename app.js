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

let crypto = window.crypto.subtle

function getKeys() {
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

            const spki_public_key = await crypto.exportKey(Config.main.exports.public, RSA_KEY.publicKey)
            const pkcs8_private_key = await crypto.exportKey(Config.main.exports.private, RSA_KEY.privateKey)

            /* var AES_KEY = await crypto.generateKey(
                {
                    name: Config.pre.name,
                    length: Config.pre.length
                },
                true,
                ["encrypt", "decrypt"]
            )

            const raw_aes_key = await crypto.exportKey(Config.pre.exports, AES_KEY) */

            resolve({
                public_key: toPublicPem(spki_public_key),
                private_key: toPrivatePem(pkcs8_private_key),
                //aes_key: arrayBufferToBase64(raw_aes_key)
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

function encrypt(public_key, plainText = "") {
    return new Promise(async (resolve, reject) => {
        try {
            let rsa_crypto_key = await getPublicCryptoKey(public_key)
            //let aes_crypto_key = await getAESCryptoKey(aes_key)

            let encoded_text = encodeMessage(plainText)

            var AES_KEY = await crypto.generateKey(
                {
                    name: Config.pre.name,
                    length: Config.pre.length
                },
                true,
                ["encrypt", "decrypt"]
            )

            const raw_aes_key = arrayBufferToBase64(await crypto.exportKey(Config.pre.exports, AES_KEY))

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
                rsa_crypto_key,
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

function decrypt(aes_key, iv, private_key, encrypted_text) {
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
                base64ToArrayBuffer(window.atob(encrypted_text))
            )

            resolve(dec.decode(decrypted))
        }
        catch (err) {
            reject(err)
        }
    })
}

export default { getKeys, encrypt, decrypt }