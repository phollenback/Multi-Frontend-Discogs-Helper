import { Request, Response, RequestHandler } from 'express';
import { OkPacket } from 'mysql';
import * as N8nDao from './n8n.dao';


export const syncWantlist : RequestHandler = async (req: Request , res: Response) => {
    try {
        let records;

        records = await N8nDao.syncWantlist();
        
        res.status(200).json(
            records
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}

export const syncCollection: RequestHandler = async (req: Request, res: Response) => {
    try {
        let records;

        records = await N8nDao.syncWantlist();
        
        res.status(200).json(
            records
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}
