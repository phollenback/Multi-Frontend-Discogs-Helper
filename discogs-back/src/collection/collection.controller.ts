import { Request, RequestHandler, Response } from 'express'
import * as CollectionDao from './collection.dao'
import * as RecordDao from '../records/records.dao'
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
        // First, create the record in the records table if it doesn't exist
        const recordItem = {
            discogsId: parseInt(req.body.discogsId),
            title: req.body.title || '',
            artist: req.body.artist || '',
            releaseYear: req.body.releaseYear ? (parseInt(req.body.releaseYear) || 0).toString() : '0',
            genre: req.body.genre || '',
            styles: req.body.styles || ''
        };
        
        try {
            await RecordDao.createRecord(recordItem);
            console.log('Created record:', recordItem);
        } catch (error) {
            // If record already exists, that's fine
            console.log('Record might already exist:', error);
        }
        
        // Then create the user record
        const item = {
            userId: parseInt(req.body.userId),
            discogsId: parseInt(req.body.discogsId),
            title: req.body.title || '',
            artist: req.body.artist || '',
            genres: req.body.genres || '',
            released: req.body.released || '',
            styles: req.body.styles || '',
            notes: req.body.notes || '',
            rating: req.body.rating || '0',
            priceThreshold: req.body.price_threshold || '',
            wishlist: req.body.wishlist || '0'
        };
        
        const okPacket : OkPacket = await CollectionDao.createCollectionItem(item);

        console.log('req.body', req.body);
        console.log('constructed item', item);
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
        // Upsert the record
        const item = {
            userId,
            discogsId,
            title: '',
            artist: '',
            genres: '',
            released: '',
            styles: '',
            rating: req.body.rating,
            notes: req.body.notes,
            priceThreshold: req.body.price_threshold,
            wishlist: req.body.wishlist || 0
        };
        const okPacket : OkPacket = await CollectionDao.upsertCollectionItem(item);
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