import { Request, Response, Router } from 'express'
import * as UserController from './users.controller'

const router = Router();

router // 
    .route('/api/users')
    .get(UserController.readUsers)

router // 
    .route('/api/users')
    .post(UserController.createUser)

router //
    .route('/api/users/:username')
    .get(UserController.readUserByUsername)

router //
    .route('/api/users/:username')
    .put(UserController.updateUser)

router
    .route('/api/users/:username')
    .delete(UserController.deleteUser)

export default router;