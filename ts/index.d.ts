declare function getKeys(): Promise<{
    public_key: string;
    private_key: string;
}>;
declare function encrypt(public_key: string, plainText: string): Promise<{
    cipher_text: string;
    aes_key: string;
    iv: string;
}>;
declare function decrypt(aes_key: string, iv: string, private_key: string, encrypted_text: string): Promise<string>;
declare const _default: {
    getKeys: typeof getKeys;
    encrypt: typeof encrypt;
    decrypt: typeof decrypt;
};
export default _default;
//# sourceMappingURL=index.d.ts.map