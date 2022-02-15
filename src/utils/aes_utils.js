'use strict';

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cfb';


export function AESEncrypt(keyStr, text)
{
    // const hash = crypto.createHash('sha256');
    // hash.update(keyStr);
    // const keyBytes = hash.digest();
    const keyBytes = Buffer.from(keyStr)

    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, keyBytes, iv);
    // console.log('IV:', iv);
    let enc = [iv, cipher.update(text, 'utf8')];
    enc.push(cipher.final());
    return Buffer.concat(enc).toString('base64');
}

export function AESDecrypt(keyStr, text)
{
    // const hash = crypto.createHash('sha256');
    // hash.update(keyStr);
    // const keyBytes = hash.digest();
    const keyBytes = Buffer.from(keyStr)

    const contents = Buffer.from(text, 'base64');
    const iv = contents.slice(0, 16);
    const textBytes = contents.slice(16);
    const decipher = createDecipheriv(algorithm, keyBytes, iv);
    let res = decipher.update(textBytes, '', 'utf8');
    res += decipher.final('utf8');
    return res;
}