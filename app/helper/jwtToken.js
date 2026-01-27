import { SignJWT, jwtVerify } from 'jose';

export const generateToken = async (payload) => {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key'
  );

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (24 * 60 * 60);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
};

export const verifyToken = async (token) => {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key'
    );

    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const payload = parts[1];
  const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodedPayload);
};