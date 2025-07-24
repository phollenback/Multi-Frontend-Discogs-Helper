import { Request, RequestHandler, Response } from 'express'
import { OkPacket } from 'mysql';
import * as UserDao from './users.dao'
import { execute } from '../services/mysql.connector';

export const readUsers : RequestHandler = async (req: Request , res: Response) => {
    try {
        let users;

        users = await UserDao.readUsers();
        
        res.status(200).json(
            users
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}

export const createUser : RequestHandler = async (req: Request , res: Response) => {
    try {
        const okPacket : OkPacket = await UserDao.createUser(req.body);

        console.log('req.body', req.body);
        console.log('record', okPacket);

        res.status(200).json(okPacket);
    } catch (error) {
        console.error('[records.controller][createRecord][Error] ', error);
        res.status(500).json({
            message: 'There was an error when writing records'
        });
    }
}

export const readUserByUsername : RequestHandler = async (req: Request , res: Response) => {
    try {
        let user;
        let username = req.params.username as string

        user = await UserDao.readUserByUsername(username);
        
        res.status(200).json(
            user
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}

export const updateUser : RequestHandler = async (req: Request , res: Response) => {
    try {
        let username = req.params.username as string

        const okPacket : OkPacket = await UserDao.updateUser(req.body, username);
        
        res.status(200).json(
            okPacket
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}

export const deleteUser : RequestHandler = async (req: Request , res: Response) => {
    try {
        let username = req.params.username as string

        const okPacket : OkPacket = await UserDao.deleteUser(username);
        
        res.status(200).json(
            okPacket
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}

export const authenticateUser: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password required.' });
        return;
    }
    try {
        // Find user by email
        const users = await UserDao.readUsers();
        // The DB returns user_id, username, email, password, created_at
        const user = users.find(u => u.email === email);
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        // Plain text password check (not secure, but matches your DB)
        // If you later hash passwords, use bcrypt.compare here
        const valid = password === user.password;
        if (!valid) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        // Return user info (omit password)
        res.status(200).json({
            message: 'Login successful',
            user: {
                userId: user.user_id, // match frontend expectation
                username: user.username,
                email: user.email
            },
            token: '' // placeholder, implement JWT if needed
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const syncWantlist: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const wantlist = req.body; // Array of wantlist items
    try {
        // Remove all user_records for this user
        await execute('DELETE FROM user_records WHERE user_id = ?', [userId]);
        // Insert all wantlist items
        for (const item of wantlist) {
            await execute(
                'INSERT INTO user_records (user_id, discogs_id, rating, notes, price_threshold, wishlist) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, item.discogs_id, item.rating || 0, item.notes || '', item.price_threshold || 0, 1]
            );
        }
        res.status(200).json({ message: 'Wantlist synced!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to sync wantlist.' });
    }
};
