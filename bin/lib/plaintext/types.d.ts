export interface IEncryptedText {
    cipher_text: string;
    aes_key: string;
    iv: string;
}
export interface IEncryptTextPayload {
    public_key: string;
    plain_text: string;
}
export interface IDecryptTextPayload {
    aes_key: string;
    iv: string;
    private_key: string;
    encrypted_text: string;
}
export type TEncryptHandler = (public_key: string, plainText: string) => Promise<IEncryptedText>;
export type TEncryptPlaintextHandler = (payload: IEncryptTextPayload) => Promise<IEncryptedText>;
export type TDecryptHandler = (aes_key: string, iv: string, private_key: string, encrypted_text: string) => Promise<string>;
export type TDecryptForPlaintextHandler = (payload: IDecryptTextPayload) => Promise<string>;
