import { Request, Response, Router } from 'express'
import * as SuggestionsController from './suggestions.controllers'

const router = Router();

router
    .route('/api/suggestions/batch/:userId')
    .get(SuggestionsController.readSuggestions)


export default router;