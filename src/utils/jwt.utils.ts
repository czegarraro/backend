/**
 * JWT Utilities
 */
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthUser } from '../types/api.types';

/**
 * Generate JWT token
 */
export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    { username: user.username },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): AuthUser => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
