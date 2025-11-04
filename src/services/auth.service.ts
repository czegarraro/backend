/**
 * Authentication Service
 */
import { generateToken } from '../utils/jwt.utils';
import { AuthUser } from '../types/api.types';

// Demo credentials (hardcoded as per requirements)
const DEMO_CREDENTIALS = {
  username: 'czegarra',
  password: 'czegarra', // In production, this would be hashed
};

export class AuthService {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
    // Validate credentials
    if (username !== DEMO_CREDENTIALS.username || password !== DEMO_CREDENTIALS.password) {
      throw new Error('Invalid credentials');
    }

    const user: AuthUser = { username };
    const token = generateToken(user);

    return { token, user };
  }

  /**
   * Validate user (for protected routes)
   */
  async validateUser(username: string): Promise<AuthUser> {
    if (username !== DEMO_CREDENTIALS.username) {
      throw new Error('User not found');
    }

    return { username };
  }
}
