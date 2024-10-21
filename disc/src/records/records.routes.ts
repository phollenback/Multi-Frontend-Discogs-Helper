import { Request, Response, Router } from 'express'
import * as RecordsController from './records.controllers'

const router = Router();
router // 
    .route('/api/records')
    .get(RecordsController.readRecords)
   
router // 
    .route('/api/records')
    .post(RecordsController.createRecord)

router // 
    .route('/api/records/:userId')    
    .get(RecordsController.readRecordsByUser)

router
    .route('/api/records/:discogsId')
    .put(RecordsController.updateRecord)

router //
    .route('/api/records/:userId/:discogsId')
    .delete(RecordsController.deleteRecord)

export default router;