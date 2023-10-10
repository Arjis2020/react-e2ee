import E2EE from '../src';
import { IKeyset } from '../src/lib/getKeys/types';

let keys: IKeyset;
beforeAll(async () => {
  keys = await E2EE.getKeys();
});

describe('testing encrypt of plaintext', () => {
  test('should contain keys', () => {
    expect(keys).not.toBeNull();
    expect(keys.private_key).not.toBeNull();
    expect(keys.public_key).not.toBeNull();
  });

  test('should encrypt plaintext using deprecated API', async () => {
    const encrypted = await E2EE.encrypt(
      keys.public_key,
      'Hello from a jest test case',
    );

    expect(encrypted).not.toBeNull();
    expect(encrypted).toHaveProperty('cipher_text');
    expect(encrypted).toHaveProperty('aes_key');
    expect(encrypted).toHaveProperty('iv');
    expect(encrypted.cipher_text).not.toBeNull();
    expect(encrypted.aes_key).not.toBeNull();
    expect(encrypted.iv).not.toBeNull();
  });

  test('should encrypt plaintext using recommended API', async () => {
    const encrypted = await E2EE.encryptPlaintext({
      public_key: keys.public_key,
      plain_text: 'Hello from a jest test case',
    });

    expect(encrypted).not.toBeNull();
    expect(encrypted).toHaveProperty('cipher_text');
    expect(encrypted).toHaveProperty('aes_key');
    expect(encrypted).toHaveProperty('iv');
    expect(encrypted.cipher_text).not.toBeNull();
    expect(encrypted.aes_key).not.toBeNull();
    expect(encrypted.iv).not.toBeNull();
  });
});