import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();
const userController = new UserController();

router.post('/', authenticate, userController.create);
router.get('/', authenticate, userController.findAll);
router.get('/:id', authenticate, userController.findOne);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, userController.delete);

export default router;
