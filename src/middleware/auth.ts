import { Response, NextFunction, Request } from 'express';
import { APIError } from '../config/error';
import status from 'http-status';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

export interface UserRequest extends IncomingMessage {
  user?: JwtPayload;
}

export function checkLoggedInUser(
  req: UserRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new APIError({
        status: status.INTERNAL_SERVER_ERROR,
        message: 'Secret not found',
        errors: 'Secret not found',
      });
    }

    if (!req.headers['authorization']) {
      throw new APIError({
        status: status.UNAUTHORIZED,
        message: 'User not authorized',
        errors: 'User not authorized',
      });
    }

    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    throw new APIError({
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message,
      errors: error,
    });
  }
}

export function getAuthUser(req: Request) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new APIError({
        status: status.INTERNAL_SERVER_ERROR,
        message: 'Secret not found',
        errors: 'Secret not found',
      });
    }

    if (!req.headers['authorization']) {
      throw new APIError({
        status: status.UNAUTHORIZED,
        message: 'User not authorized',
        errors: 'User not authorized',
      });
    }

    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new APIError({
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message,
      errors: error,
    });
  }
}
