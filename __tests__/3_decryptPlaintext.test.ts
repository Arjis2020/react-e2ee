import E2EE from '../src';
import { IKeyset } from '../src/lib/getKeys/types';
import { IEncryptedText } from '../src/lib/plaintext/types';

const textToEncrypt = 'Hello from a jest test case';
let keys: IKeyset;
let encrypted: IEncryptedText;
beforeAll(async () => {
  keys = await E2EE.getKeys();
  encrypted = await E2EE.encryptPlaintext({
    public_key: keys.public_key,
    plain_text: textToEncrypt,
  });
});

describe('testing encrypt()', () => {
  test('should contain keys', () => {
    expect(keys).not.toBeNull();
    expect(keys.private_key).not.toBeNull();
    expect(keys.public_key).not.toBeNull();
  });

  test('should have encrypted text', async () => {
    expect(encrypted).not.toBeNull();
    expect(encrypted).toHaveProperty('cipher_text');
    expect(encrypted).toHaveProperty('aes_key');
    expect(encrypted).toHaveProperty('iv');
    expect(encrypted.cipher_text).not.toBeNull();
    expect(encrypted.aes_key).not.toBeNull();
    expect(encrypted.iv).not.toBeNull();
  });

  test('should have decrypted text using deprecated API', async () => {
    const decrypted = await E2EE.decrypt(
      encrypted.aes_key,
      encrypted.iv,
      keys.private_key,
      encrypted.cipher_text,
    );

    expect(decrypted).not.toBeNull();
    expect(decrypted).toBe(textToEncrypt);
  });

  test('should have decrypted text using recommended API', async () => {
    const decrypted = await E2EE.decryptForPlaintext({
      encrypted_text: encrypted,
      private_key: keys.private_key,
    });

    expect(decrypted).not.toBeNull();
    expect(decrypted).toBe(textToEncrypt);
  });
});