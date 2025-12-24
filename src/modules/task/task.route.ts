import { Router } from 'express';
import { TaskController } from './task.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();
const taskController = new TaskController();

// Get all tasks
router.get('/', authenticate, (req, res) => taskController.getAll(req, res));

// Get task by ID
router.get('/:id', authenticate, (req, res) => taskController.getById(req, res));

// Create task
router.post('/', authenticate, (req, res) => taskController.create(req, res));

// Update task status
router.patch('/:id/status', authenticate, (req, res) => taskController.updateStatus(req, res));

export default router;