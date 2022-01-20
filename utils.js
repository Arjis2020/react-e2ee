const Config = require('./config.json')
let crypto = window.crypto.subtle

function arrayBufferToBase64(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = '';
    for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    var b64 = window.btoa(byteString);

    return b64;
}

function base64ToArrayBuffer(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function addNewLines(str) {
    var finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

function toPrivatePem(privateKey) {
    var b64 = addNewLines(arrayBufferToBase64(privateKey));
    var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";

    return pem;
}

function toPublicPem(publicKey) {
    var b64 = addNewLines(arrayBufferToBase64(publicKey));
    var pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";

    return pem;
}

function encodeMessage(plainText = "") {
    let enc = new TextEncoder()
    return enc.encode(plainText)
}

function getPublicCryptoKey(public_key) {
    return new Promise(async (resolve, reject) => {
        try {
            const pemHeader = "-----BEGIN PUBLIC KEY-----";
            const pemFooter = "-----END PUBLIC KEY-----";
            const pemContents = public_key.substring(pemHeader.length, public_key.length - pemFooter.length);
            const binaryDerString = window.atob(pemContents);
            const spki = base64ToArrayBuffer(binaryDerString);

            let crypto_key = await crypto.importKey(
                Config.main.exports.public,
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

function getPrivateCryptoKey(private_key) {
    return new Promise(async (resolve, reject) => {
        try {
            const pemHeader = "-----BEGIN PRIVATE KEY-----";
            const pemFooter = "-----END PRIVATE KEY-----";
            const pemContents = private_key.substring(pemHeader.length, private_key.length - pemFooter.length);
            const binaryDerString = window.atob(pemContents);
            const pkcs8 = base64ToArrayBuffer(binaryDerString);

            let crypto_key = await crypto.importKey(
                Config.main.exports.private,
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

function getAESCryptoKey(aes_key) {
    return new Promise(async (resolve, reject) => {
        try {
            const raw = base64ToArrayBuffer(window.atob(aes_key))

            let aes_crypto_key = await crypto.importKey(
                Config.pre.exports,
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

function uIntToBase64(u8) {
    return window.btoa(String.fromCharCode.apply(null, u8));
}

function base64ToUint8(str) {
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