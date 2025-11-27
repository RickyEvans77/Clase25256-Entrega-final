import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function validateCredentials(username, password) {
  const userEnv = process.env.AUTH_USER;
  const passEnv = process.env.AUTH_PASS;
  return username === userEnv && password === passEnv;
}

export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  if (!secret) throw new Error('JWT_SECRET no definido en .env');
  return jwt.sign(payload, secret, { expiresIn });
}