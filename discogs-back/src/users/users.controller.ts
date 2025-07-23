import { Request, RequestHandler, Response } from 'express'
import { OkPacket } from 'mysql';
import * as UserDao from './users.dao'

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

export function authenticateUser(authenticateUser: any) {
try {
        // check for username and password in the request body
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        // return an error as response
    }
}
