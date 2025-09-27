import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
        try {
            const payload = verifyToken(token);
            req.user = payload;
        } catch (error) {
            // Token is invalid but we continue without authentication
            req.user = undefined;
        }
    }
    
    next();
};

