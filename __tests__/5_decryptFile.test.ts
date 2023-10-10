import E2EE from '../src';
import { IKeyset } from '../src/lib/getKeys/types';
import fs from 'fs';
import { IEncryptedFile } from '../src/lib/file/types';

let keys: IKeyset;
let encryptedFile: IEncryptedFile;
let fileBuffer: ArrayBuffer;
beforeAll(async () => {
  keys = await E2EE.getKeys();
  fileBuffer = fs.readFileSync('public/test.txt').buffer;
  encryptedFile = await E2EE.encryptFile(
    keys.public_key,
    fileBuffer,
  );
});

describe('testing encrypt()', () => {
  test('should contain keys', () => {
    expect(keys).not.toBeNull();
    expect(keys.private_key).not.toBeNull();
    expect(keys.public_key).not.toBeNull();
  });

  test('should have encrypted file', async () => {
    expect(encryptedFile).not.toBeNull();
    expect(encryptedFile).toHaveProperty('cipher_buffer');
    expect(encryptedFile).toHaveProperty('aes_key');
    expect(encryptedFile).toHaveProperty('iv');
    expect(encryptedFile.cipher_buffer).not.toBeNull();
    expect(encryptedFile.aes_key).not.toBeNull();
    expect(encryptedFile.iv).not.toBeNull();
  });

  test('should have decrypted text using deprecated API', async () => {
    const decrypted = await E2EE.decryptFile(
      encryptedFile.aes_key,
      encryptedFile.iv,
      keys.private_key,
      encryptedFile.cipher_buffer,
    );

    expect(decrypted).not.toBeNull();
    expect(decrypted.byteLength).toBe(fileBuffer.byteLength);
  });

  test('should have decrypted text using recommended API', async () => {
    const decrypted = await E2EE.decryptFileBuffer({
      encrypted_buffer: encryptedFile,
      private_key: keys.private_key,
    });

    expect(decrypted).not.toBeNull();
    expect(decrypted.byteLength).toBe(fileBuffer.byteLength);
  });
});