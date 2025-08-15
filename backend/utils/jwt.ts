import * as Jose from 'jose';
import { JWTUserPayload } from '../types/jwt.js';
import crypto from 'crypto';

if (!globalThis.crypto) {
  // Polyfill Node crypto for jose
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

function getEncodedSecret(): Uint8Array { 
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return new TextEncoder().encode(secret);
}

export async function signJWT(payload: Partial<JWTUserPayload>, expiresIn: string = '5m'): Promise<string> {
  return await new Jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getEncodedSecret());
}

export async function verifyJWT(token: string): Promise<JWTUserPayload | null> {
  try {
    const { payload } = await Jose.jwtVerify(token, getEncodedSecret());
    return payload as JWTUserPayload;
  } catch (error) {
    console.log('verifyJWT error: ', error);
    return null;
  }
}
