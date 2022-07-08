//import crypto from 'crypto'
const crypto = require('crypto');

const hex    = `hex`
const utf8   = `utf8`
const base64 = `base64`

const BLOCK_SIZE = 16
const algorithm   = `aes-256-gcm`

class Aes {

  static encrypt(iv, key, plaintext, aad = '') {
    const cipher = crypto.createCipheriv(
      algorithm, key, iv
    ).setAAD(Buffer.from(aad))

    return Buffer.concat([
      cipher.update(plaintext, utf8),
      cipher.final(),
      cipher.getAuthTag()
    ]).toString(base64)
  }

  static decrypt(iv, key, ciphertext, aad = '') {
      try {
          const buf = Buffer.from(ciphertext, base64);
          const tag = buf.slice(-BLOCK_SIZE);
          const payload = buf.slice(0, -BLOCK_SIZE);

          const decipher = crypto.createDecipheriv(algorithm, key, iv);

          const tagLen = tag.length;
          if (tagLen > 16 || (tagLen < 12 && tagLen !== 8 && tagLen !== 4)) {
              const backport = new TypeError(`Invalid authentication tag length: ${tagLen}`);
              backport.code = 'ERR_CRYPTO_INVALID_AUTH_TAG';
              throw backport;
          }
          decipher.setAuthTag(tag).setAAD(Buffer.from(aad));

          return Buffer.concat([
                  decipher.update(payload, hex),
                  decipher.final(),
          ]).toString(utf8);
    } catch(e) {
        console.log(e);
    }
  }

}

module.exports = Aes;
//export default Aes
