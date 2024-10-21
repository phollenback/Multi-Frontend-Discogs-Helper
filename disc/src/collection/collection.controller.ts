import { Request, RequestHandler, Response } from 'express'
import * as CollectionDao from './collection.dao'
import { OkPacket } from 'mysql';

export const readCollection : RequestHandler = async (req: Request , res: Response) => {
    try {
        let records;
        let userId = parseInt(req.params.userId as string)

        records = await CollectionDao.readCollection(userId);
        
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

export const createCollectionItem : RequestHandler = async (req: Request , res: Response) => {
    try {
        const okPacket : OkPacket = await CollectionDao.createCollectionItem(req.body);

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

export const readCollectionItem : RequestHandler = async (req: Request , res: Response) => {
    try 
        {
            let record;
            let userId = parseInt(req.params.userId as string)
            let discogsId = parseInt(req.params.discogsId as string)
    
            console.log('userID: ' + userId)
            console.log('discogsId: ' + discogsId);

            record = await CollectionDao.readCollectionItem(userId, discogsId);
    
            res.status(200).json(
                record
            );
        } catch (error) {
            console.error('[records.controller][readRecords][Error] ', error);
            res.status(500).json({
                message: 'There was an error when fetching records by id'
            })
        }
}

export const updateCollectionItem : RequestHandler = async (req: Request , res: Response) => {
    try {
        let userId = parseInt(req.params.userId as string)
        let discogsId = parseInt(req.params.discogsId as string)
        // Update the records first
        const okPacket : OkPacket = await CollectionDao.updateCollectionItem(req.body, userId, discogsId);
        
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

export const deleteCollectionItem : RequestHandler = async (req: Request , res: Response) => {
    try {
        let userId = parseInt(req.params.userId as string)
        let discogsId = parseInt(req.params.discogsId as string)

        console.log('user id: ' + userId)
        console.log('discogs id: ', discogsId);
        
        const response = await CollectionDao.deleteCollectionItem(userId, discogsId);

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