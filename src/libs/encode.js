import { CONFIG } from '../config';
import { Rot13 } from './rot13_javascript';

const jwt = require('jsonwebtoken');
const base64 = require('base-64');
const utf8 = require('utf8');
const API_TOKEN = CONFIG.API_TOKEN;
export function create_jwt_token(payload, expiresIn = '10h')
{
    return jwt.sign(payload, API_TOKEN, {
        algorithm: 'HS256',
        expiresIn: expiresIn,
    });
}
export function decode_jwt_token(token)
{
    try
    {
        var decoded = jwt.verify(token, API_TOKEN);
        return {
            valid: true,
            value: decoded,
        }
    } catch (e)
    {
        return { valid: false };
    }
}
export function rot13_encode(str)
{
    var r = new Rot13();
    return r.rotate(str);
}
export function base64_encode(str)
{
    return base64.encode(utf8.encode(str));
}
export function base64_decode(str)
{
    return utf8.decode(base64.decode(str));
}