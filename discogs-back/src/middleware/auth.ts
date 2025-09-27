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

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }
    
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
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

