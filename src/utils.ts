import Config from './config.json'
import { Formats } from './formats'

let crypto = window.crypto.subtle

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = '';
    for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    var b64 = window.btoa(byteString);

    return b64;
}

function base64ToArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function addNewLines(str: string): string {
    var finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

function toPrivatePem(privateKey: ArrayBuffer): string {
    var b64 = addNewLines(arrayBufferToBase64(privateKey));
    var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";

    return pem;
}

function toPublicPem(publicKey: ArrayBuffer): string {
    var b64 = addNewLines(arrayBufferToBase64(publicKey));
    var pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";

    return pem;
}

function encodeMessage(plainText: string): ArrayBuffer {
    let enc = new TextEncoder()
    return enc.encode(plainText)
}

function getPublicCryptoKey(public_key: string): Promise<CryptoKey> {
    return new Promise(async (resolve, reject) => {
        try {
            const pemHeader = "-----BEGIN PUBLIC KEY-----";
            const pemFooter = "-----END PUBLIC KEY-----";
            const pemContents = public_key.substring(pemHeader.length, public_key.length - pemFooter.length);
            const binaryDerString = window.atob(pemContents);
            const spki = base64ToArrayBuffer(binaryDerString);

            const public_key_format: Formats = Config.main.exports.public as Formats

            let crypto_key = await crypto.importKey(
                public_key_format,
                spki,
                {
                    name: Config.main.name,
                    hash: Config.main.hash
                },
                true,
                ["encrypt"]
            )
            resolve(crypto_key)
        }
        catch (err) {
            reject(err)
        }
    })
}

function getPrivateCryptoKey(private_key: string): Promise<CryptoKey> {
    return new Promise(async (resolve, reject) => {
        try {
            const pemHeader = "-----BEGIN PRIVATE KEY-----";
            const pemFooter = "-----END PRIVATE KEY-----";
            const pemContents = private_key.substring(pemHeader.length, private_key.length - pemFooter.length);
            const binaryDerString = window.atob(pemContents);
            const pkcs8 = base64ToArrayBuffer(binaryDerString);

            const private_key_format: Formats = Config.main.exports.private as Formats

            let crypto_key = await crypto.importKey(
                private_key_format,
                pkcs8,
                {
                    name: Config.main.name,
                    hash: Config.main.hash
                },
                true,
                ["decrypt"]
            )
            resolve(crypto_key)
        }
        catch (err) {
            reject(err)
        }
    })
}

function getAESCryptoKey(aes_key: string): Promise<CryptoKey> {
    return new Promise(async (resolve, reject) => {
        try {
            const raw = base64ToArrayBuffer(window.atob(aes_key))

            const pre_key_format: Formats = Config.pre.exports as Formats

            let aes_crypto_key = await crypto.importKey(
                pre_key_format,
                raw,
                {
                    name: Config.pre.name
                },
                true,
                ["encrypt", "decrypt"]
            )

            resolve(aes_crypto_key)
        }
        catch (err) {
            reject(err)
        }
    })
}

function uIntToBase64(u8: Uint8Array): string {
    return window.btoa(String.fromCharCode.apply(null, (u8 as unknown) as Array<number>));
}

function base64ToUint8(str: string): Uint8Array {
    return new Uint8Array(window.atob(str).split('').map(function (c) { return c.charCodeAt(0); }));
}

export {
    arrayBufferToBase64,
    base64ToArrayBuffer,
    encodeMessage,
    toPrivatePem,
    toPublicPem,
    getPublicCryptoKey,
    getPrivateCryptoKey,
    getAESCryptoKey,
    uIntToBase64,
    base64ToUint8
}