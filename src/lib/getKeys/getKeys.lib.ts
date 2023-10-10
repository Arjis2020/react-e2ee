import {
    toPrivatePem,
    toPublicPem,
} from '../../utils';
import Config from '../../config/config.json';
import { TFormats } from "../types";
import { TGetKeysHandler } from './types';

let crypto = window.crypto.subtle;

/**
 * 
 * @returns The private and public key set / key pair
 */
const getKeys: TGetKeysHandler = async () => {
    var RSA_KEY = await crypto.generateKey(
        {
            name: Config.main.name,
            modulusLength: Config.main.modulus,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: Config.main.hash,
        },
        true,
        ["encrypt", "decrypt"],
    );

    const spki_public_key_format: TFormats = Config.main.exports.public as TFormats
    const pkcs8_private_key_format: TFormats = Config.main.exports.private as TFormats

    const spki_public_key = await crypto.exportKey(spki_public_key_format, RSA_KEY.publicKey as CryptoKey)
    const pkcs8_private_key = await crypto.exportKey(pkcs8_private_key_format, RSA_KEY.privateKey as CryptoKey)

    return {
        public_key: toPublicPem(spki_public_key),
        private_key: toPrivatePem(pkcs8_private_key),
    };
};

export {
    getKeys,
};
