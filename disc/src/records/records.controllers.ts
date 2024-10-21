import { Request, RequestHandler, Response } from 'express'
import * as RecordDao from './records.dao'
import { OkPacket } from 'mysql';

export const readRecords : RequestHandler = async (req: Request , res: Response) => {
    try {
        let records;

        records = await RecordDao.readRecords();
        
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

export const createRecord: RequestHandler = async (req: Request, res: Response) => {
    try {
        const okPacket : OkPacket = await RecordDao.createRecord(req.body);

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

export const readRecordsByUser : RequestHandler = async (req: Request , res: Response) => {
        try 
        {
            let records;
            let userId = parseInt(req.params.userId as string)
    
            console.log('userid: ' + userId);

            records = await RecordDao.readRecordsById(userId);
    
            res.status(200).json(
                records
            );
        } catch (error) {
            console.error('[records.controller][readRecords][Error] ', error);
            res.status(500).json({
                message: 'There was an error when fetching records by id'
            })
        }
}

export const updateRecord : RequestHandler = async (req: Request , res: Response) => {
    try {
        // Update the records first
        const okPacket : OkPacket = await RecordDao.updateRecord(req.body);
        
        console.log('req.body', req.body);
        console.log('records', okPacket);

        res.status(200).json(okPacket);
    } catch (error) {
        console.error('[records.controller][updateRecor][Error] ', error);
        res.status(500).json({
            message: 'There was an error when updating records or tracks',
        });
    }
}

export const deleteRecord : RequestHandler = async (req: Request , res: Response) => {
    try {
        let userId = parseInt(req.params.userId as string)
        let discogsId = parseInt(req.params.discogsId as string)

        console.log('user id: ' + userId)
        console.log('discogs id: ', discogsId);
        
        const response = await RecordDao.deleteRecord(userId, discogsId);

        res.status(200).json(
            response
        );
    } catch (error) {
        console.error('[records.controller[deleteRecord][Error] ', error);
        res.status(500).json({
            message: 'There was an error when deleting records'
        })
    }
}
