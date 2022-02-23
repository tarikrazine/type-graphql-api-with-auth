import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(
  payload: Object,
  options?: jwt.SignOptions | undefined
) {
  const privateKey = Buffer.from(
    config.get<string>('privateKey'),
    'base64'
  ).toString('ascii');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(token: string): T | null {
  const publicKey = Buffer.from(
    config.get<string>('publicKey'),
    'base64'
  ).toString('ascii');

  try {
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error: any) {
    return null;
  }
}
