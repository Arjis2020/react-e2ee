export interface IEncryptedFile {
  cipher_buffer: ArrayBuffer
  aes_key: string
  iv: string
}

interface IEncrypteFilePayload {
  public_key: string
  file_buffer: ArrayBuffer
}

interface IDecryptFilePayload {
  encrypted_buffer: IEncryptedFile
  private_key: string
}

export type TEncryptFileHandler = (public_key: string, file_buffer: ArrayBuffer) => Promise<IEncryptedFile>
export type TEncryptFileBufferHandler = (payload: IEncrypteFilePayload) => Promise<IEncryptedFile>
export type TDecryptFileHandler = (aes_key: string, iv: string, private_key: string, encrypted_buffer: ArrayBuffer) => Promise<ArrayBuffer>
export type TDecryptFileBufferHandler = (payload: IDecryptFilePayload) => Promise<ArrayBuffer>
