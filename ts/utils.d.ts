declare function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
declare function base64ToArrayBuffer(str: string): ArrayBuffer;
declare function toPrivatePem(privateKey: ArrayBuffer): string;
declare function toPublicPem(publicKey: ArrayBuffer): string;
declare function encodeMessage(plainText: string): ArrayBuffer;
declare function getPublicCryptoKey(public_key: string): Promise<CryptoKey>;
declare function getPrivateCryptoKey(private_key: string): Promise<CryptoKey>;
declare function getAESCryptoKey(aes_key: string): Promise<CryptoKey>;
declare function uIntToBase64(u8: Uint8Array): string;
declare function base64ToUint8(str: string): Uint8Array;
export { arrayBufferToBase64, base64ToArrayBuffer, encodeMessage, toPrivatePem, toPublicPem, getPublicCryptoKey, getPrivateCryptoKey, getAESCryptoKey, uIntToBase64, base64ToUint8 };
//# sourceMappingURL=utils.d.ts.map