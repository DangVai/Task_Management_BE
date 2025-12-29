import { Router } from 'express';
import { registerController, loginController } from './auth.controller.js';
import { validateDto } from '../../shared/middleware/validate.middleware.js';
import { RegisterDto, LoginDto } from './dto/request/index.js';
const router = Router();

router.post('/register',validateDto(RegisterDto), registerController);
router.post('/login',validateDto(LoginDto), loginController);

export default router;
