import { Crypto } from "@peculiar/webcrypto";
import { TextEncoder, TextDecoder } from 'util';

Object.defineProperty(window, 'crypto', {
  get() {
    return new Crypto();
  }
});

Object.assign(window, {
  TextDecoder,
  TextEncoder
});
