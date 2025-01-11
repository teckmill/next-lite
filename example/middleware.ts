import { NextResponse } from '../src/server/response';
import { NextRequest } from '../src/server/request';
import type { Middleware } from '../src/router/types';

export const authMiddleware: Middleware = async (req, next) => {
  // Example: Check if user is authenticated
  const token = req.cookies.get('auth-token');
  
  if (!token && req.url.includes('/dashboard')) {
    // Redirect to login if trying to access dashboard without auth
    return NextResponse.redirect('/login');
  }
  
  // Continue to next middleware or route handler
  return next();
};

export const loggingMiddleware: Middleware = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;
  
  console.log(`[${new Date().toISOString()}] Completed in ${duration}ms`);
  
  return response;
};
