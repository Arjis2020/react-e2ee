# React E2EE

## Installation

Use the package manager [npm](https://nmjs.com/) to install react-e2ee.
```bash
npm install @chatereum/react-e2ee
```
## Usage

Currently, this package can only be used using ```JavaScript```. ```TypeScript``` support is coming soon! :smiley:

```javascript
import E2EE from '@chatereum/react-e2ee';

//generates a RSA-OAEP private key and public key in PEM format
const keys = await E2EE.getKeys();
/*
would return something like:
{
    private_key : "-----BEGIN PRIVATE KEY-----...", //PEM
    public_key : "-------BEGIN PUBLIC KEY-----...." //PEM
}
*/

//encrypts any string format message
//if you want to encrypt a format other than string, convert it into string first
const message = "Made with 💙 by Arjis Chakraborty";
const encrypted = await E2EE.encrypt(keys.public_key, message);
/*
would return something like:
{
    cipher_text: /hfan3ulskxzkjr20mckmicurj38rmdkalclalor\dj3*, //base64
    aes_key: 9r2hnankal92/*gawaoaowrj38jma/daun, //base64
    iv: 1hnfkalmnfinfkeif874fsf&bbdajwk9dkacam //bsae64
}

you can now wire this entire object to the recipient through eg: WebSockets
*/

//on the receiver's end
//decrypting an encrypted message
const decrypted = await E2EE.decrypt(
    encrypted.aes_key, 
    encrypted.iv, 
    keys.private_key, 
    encrypted.cipher_text
);
/*
would return the original message:
decrypted = "Made with 💙 by Arjis Chakraborty"

you can now show this message on the recipient's frontend
*/
```

## How it works

- We generate a private and public ```RSA-OAEP``` keys using ```getKeys()``` function

- We get the raw string message that needs to be encrypted (usually referred to as ```plainText```)

- We then call the ```encrypt()``` function to encrypt our ```plainText``` with the RSA ```public key``` of the recipient.

- Internally, a lot of things are going on in the ```encrypt()``` function. 
    - We first ```encode``` the ```plainText``` using an ```encoder()``` function. Let's call this ```encoded```.

    - Then we generate a ```Diffie-Hellman``` shared secret key using the ```AES-CBC``` cipher of length ```256```. This also requires a ```iv``` padding which is of type ```Uint8Array``` of size ```16```. Ultimately, we get an ```AES``` key back. Let's call this key ```AES``` and the ```iv``` padding as ```IV```.
    
    - Now we take ```encoded``` and encrypt it using ```AES```. This gives us back the encrypted ```plainText```. Let's call this ```encrypted_text```.

    - Now we use the ```public key``` of the recipient to encrypt the ```AES``` key. Let's call this ```encrypted_AES```.

    - To finish the ```encryption``` process, we return an object containing ```encrypted_text```, ```encrypted_AES``` and ```IV```. We send back ```IV``` because we need this in ```decrypt()```.

- Now that we have our encrypted message, we can pass this entire object onto our server to further be passed on to the recipient client.

- On the recipient client, we call the ```decrypt()``` function.

- Again, internally, we have a lot of stuff going on:
    - The recipients takes its ```private key``` and tries to decrypt the ```encrypted_AES```. Let's call this ```AES```.

    - It then tries to use the ```AES``` key alongwith the ```IV``` to decrypt ```encrypted_text```. Let's call this ```encoded_text```.

    - Once we have our ```encoded_text```, we need to decode this into human-readable format (UTF-8).

    - We run a ```text decoder``` function to decode the ```encoded_text```. 

    - Finally, we have our decoded, human-readable ```plainText```.

- This ```plainText``` is what is displayed to the recipient's frontend.

- You can read more about ```End-to-end encryption``` [here](https://en.wikipedia.org/wiki/End-to-end_encryption).

## Prerequisites
These are some important requirements that you need to make sure before you can use this library:

:exclamation: The website on which you intend to use this library must have a TLS or SSL certificate installed, i.e. it must have support for ```HTTPS```. Alternatively, for testing purposes, you should access your site over ```localhost ``` or else the library won't work.

:exclamation: This library is strictly for browser based ```Node.js``` frameworks and specifically for ```React``` as the name already suggests.

:exclamation: DO NOT ever share your ```private key``` over the "wire". You can only share your ```public key``` to the server side or even directly to your recipient client.

## Good to know

:blue_heart: This library uses the ```SubtleCrypto``` library which is embedded in the browser. A down side to ```SubtleCrypto``` is that it can't run on an ```http``` connection that doesn't have any ```TLS``` or ```SSL``` certificates. However, ```localhost``` seems to be an exception. You can learn more about the library [here](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).

:blue_heart: This library is primarily made for ```React``` and some other browser based ```Node.js``` frameworks but you can fork this repository and use the code on any browser based application you like that supports ```SubtleCrypto```.

:blue_heart: I am working on a few examples to demonstrate the full working of this library. Until then, [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) has a lot of documentation to offer.

## Contributing

This repository is open to any contributions to make the library a hassle free solution to End-to-End Encryption in browsers.


Made with :blue_heart: by Arjis Chakraborty

