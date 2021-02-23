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

export function getUserFromToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new APIError({
        status: 400,
        message: 'Token secret not found',
        errors: 'No token secret',
      });

    const decoded = jwt.verify(token, secret);

    return decoded;
  } catch (error) {
    console.error(error);
    throw new APIError({
      message: error.message,
      status: 500,
    });
  }
}
