import { Request, RequestHandler, Response } from 'express'
import { OkPacket } from 'mysql';
import * as suggService from './suggestions.services'

export const readSuggestions : RequestHandler = async (req: Request , res: Response) => {
    try {
        let suggestions;
        let userId = parseInt(req.params.userId as string)

        suggestions = await suggService.readSuggestions(userId);
        
        res.status(200).json(
            suggestions
        );
    } catch (error) {
        console.error('[records.controller][readRecords][Error] ', error);
        res.status(500).json({
            message: 'There was an error when fetching records'
        })
    }
}