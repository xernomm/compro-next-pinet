import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { initDB } from './db';

// @ts-ignore - JS model
import { User } from './models/index';

interface JWTPayload {
  id: number;
}

export async function authenticateRequest(request: NextRequest) {
  await initDB();

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user || !user.is_active) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function generateToken(id: number) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
}

export function unauthorizedResponse(message = 'Not authorized') {
  return Response.json({ success: false, message }, { status: 401 });
}

export function forbiddenResponse(message = 'Forbidden') {
  return Response.json({ success: false, message }, { status: 403 });
}

export async function requireAuth(request: NextRequest) {
  const user = await authenticateRequest(request);
  if (!user) {
    return { user: null, error: unauthorizedResponse() };
  }
  return { user, error: null };
}

export async function requireRole(request: NextRequest, ...roles: string[]) {
  const { user, error } = await requireAuth(request);
  if (error) return { user: null, error };
  if (!roles.includes(user.role)) {
    return { user: null, error: forbiddenResponse(`Role ${user.role} is not authorized`) };
  }
  return { user, error: null };
}
