import E2EE from '../src';
import { IKeyset } from '../src/lib/getKeys/types';
import fs from 'fs';

let keys: IKeyset;
let fileBuffer: ArrayBuffer;
beforeAll(async () => {
  keys = await E2EE.getKeys();
  fileBuffer = fs.readFileSync('public/test.txt').buffer;
});

describe('testing encrypt of file', () => {
  test('should contain keys', () => {
    expect(keys).not.toBeNull();
    expect(keys.private_key).not.toBeNull();
    expect(keys.public_key).not.toBeNull();
  });

  test('should encrypt file using deprecated API', async () => {
    const encryptedFile = await E2EE.encryptFile(
      keys.public_key,
      fileBuffer,
    );

    expect(encryptedFile).not.toBeNull();
    expect(encryptedFile).toHaveProperty('cipher_buffer');
    expect(encryptedFile).toHaveProperty('aes_key');
    expect(encryptedFile).toHaveProperty('iv');
    expect(encryptedFile.cipher_buffer).not.toBeNull();
    expect(encryptedFile.aes_key).not.toBeNull();
    expect(encryptedFile.iv).not.toBeNull();
  });

  test('should encrypt file using recommended API', async () => {
    const encryptedFile = await E2EE.encryptFileBuffer({
      public_key: keys.public_key,
      file_buffer: fileBuffer,
    });

    expect(encryptedFile).not.toBeNull();
    expect(encryptedFile).toHaveProperty('cipher_buffer');
    expect(encryptedFile).toHaveProperty('aes_key');
    expect(encryptedFile).toHaveProperty('iv');
    expect(encryptedFile.cipher_buffer).not.toBeNull();
    expect(encryptedFile.aes_key).not.toBeNull();
    expect(encryptedFile.iv).not.toBeNull();
  });
});