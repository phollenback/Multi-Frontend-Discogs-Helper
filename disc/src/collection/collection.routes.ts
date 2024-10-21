import { Request, Response, Router } from 'express'
import * as CollectionsController from './collection.controller'

const router = Router();
router  //
    .route('/api/users/:userId/collection')
    .get(CollectionsController.readCollection)
   
router // 
    .route('/api/users/:userId/collection')
    .post(CollectionsController.createCollectionItem)

router //
    .route('/api/users/:userId/collection/:discogsId')
    .get(CollectionsController.readCollectionItem)

router //
    .route('/api/users/:userId/collection/:discogsId')
    .put(CollectionsController.updateCollectionItem)

router //
    .route('/api/users/:userId/collection/:discogsId')
    .delete(CollectionsController.deleteCollectionItem)

export default router;