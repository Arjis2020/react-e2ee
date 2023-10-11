import Config from './config/config.json';
import { TFormats } from './lib/types';

let crypto = window.crypto.subtle;

const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(arrayBuffer);
    const byteString = byteArray.reduce<string>((prev, curr) => prev + String.fromCharCode(curr), '');
    const b64 = window.btoa(byteString);

    return b64;
}

const base64ToArrayBuffer = (str: string): ArrayBuffer => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

const addNewLines = (str: string): string => {
    var finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

const toPrivatePem = (privateKey: ArrayBuffer): string => {
    const b64 = addNewLines(arrayBufferToBase64(privateKey));
    const pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";

    return pem;
}

const toPublicPem = (publicKey: ArrayBuffer): string => {
    const b64 = addNewLines(arrayBufferToBase64(publicKey));
    const pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";

    return pem;
}

const encodeMessage = (plainText: string): ArrayBuffer => {
    let enc = new TextEncoder()
    return enc.encode(plainText)
}

const getPublicCryptoKey = async (public_key: string): Promise<CryptoKey> => {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = public_key.substring(pemHeader.length, public_key.length - pemFooter.length);
    const binaryDerString = window.atob(pemContents);
    const spki = base64ToArrayBuffer(binaryDerString);

    const public_key_format: TFormats = Config.main.exports.public as TFormats

    const crypto_key = await crypto.importKey(
        public_key_format,
        spki,
        {
            name: Config.main.name,
            hash: Config.main.hash
        },
        true,
        ["encrypt"]
    );
    return crypto_key;
}

const getPrivateCryptoKey = async (private_key: string): Promise<CryptoKey> => {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = private_key.substring(pemHeader.length, private_key.length - pemFooter.length);
    const binaryDerString = window.atob(pemContents);
    const pkcs8 = base64ToArrayBuffer(binaryDerString);

    const private_key_format: TFormats = Config.main.exports.private as TFormats

    const crypto_key = await crypto.importKey(
        private_key_format,
        pkcs8,
        {
            name: Config.main.name,
            hash: Config.main.hash
        },
        true,
        ["decrypt"]
    );
    return crypto_key;
}

const getAESCryptoKey = async (aes_key: string): Promise<CryptoKey> => {
    const raw = base64ToArrayBuffer(window.atob(aes_key));
    const pre_key_format: TFormats = Config.pre.exports as TFormats

    let aes_crypto_key = await crypto.importKey(
        pre_key_format,
        raw,
        {
            name: Config.pre.name
        },
        true,
        ["encrypt", "decrypt"]
    )

    return aes_crypto_key;
}

const uIntToBase64 = (u8: Uint8Array): string => window.btoa(String.fromCharCode.apply(null, (u8 as unknown) as Array<number>));

const base64ToUint8 = (str: string): Uint8Array => new Uint8Array(window.atob(str).split('').map(function (c) { return c.charCodeAt(0); }));

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
    base64ToUint8,
};