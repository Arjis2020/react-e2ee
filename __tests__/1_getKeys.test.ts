import E2EE from '../src';

describe('testing getKeys()', () => {
  test('should have public and private keys', async () => {
    const keys = await E2EE.getKeys();
    expect(keys).toHaveProperty('private_key');
    expect(keys).toHaveProperty('public_key');
  });
  
  test('should have key pair values', async () => {
    const keys = await E2EE.getKeys();
    expect(keys.private_key).not.toBeNull();
    expect(keys.public_key).not.toBeNull();
  });
});