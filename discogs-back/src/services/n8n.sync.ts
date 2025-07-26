import { Request, Response, Router } from 'express';
import * as DiscogsSyncService from '../n8n/ n8n.controller';


const router = Router();

router
    .route('/api/sync-wantlist')
    .get(DiscogsSyncService.syncWantlist);

router
    .route('/api/sync-collection')
    .get(DiscogsSyncService.syncCollection);