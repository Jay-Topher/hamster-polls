import jwt from 'jsonwebtoken';
import { APIError } from '../config/error';

export function signToken(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new APIError({
      status: 400,
      message: 'Token secret not found',
      errors: 'No token secret',
    });
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
