/**
 * Authentication Controller
 */
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';

// Lazy initialization to ensure database is connected first
let authService: AuthService;
const getAuthService = () => {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
};

/**
 * Login endpoint
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    const result = await getAuthService().login(username, password);

    // Set token in httpOnly cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      sendError(res, 'INVALID_CREDENTIALS', 'Invalid username or password', 401);
    } else {
      next(error);
    }
  }
};

/**
 * Logout endpoint
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  sendSuccess(res, null, 'Logout successful');
};

/**
 * Get current user
 */
export const me = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(res, { user: req.user });
};
