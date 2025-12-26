import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { validateDto } from '../../shared/middleware/validate.middleware.js';
import { CreateUserDto, UpdateUserDto } from './dto/request/index.js';

const router = Router();
const userController = new UserController();

router.post('/', authenticate, validateDto(CreateUserDto), (req, res) => userController.create(req, res));
router.get('/', authenticate, (req, res) => userController.findAll(req, res));
router.get('/:id', authenticate, (req, res) => userController.findOne(req, res));
router.put('/:id', authenticate, validateDto(UpdateUserDto), (req, res) => userController.update(req, res));
router.delete('/:id', authenticate, (req, res) => userController.delete(req, res));

export default router;
