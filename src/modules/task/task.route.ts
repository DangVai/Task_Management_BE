import { Router } from 'express';
import { TaskController } from './task.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();
const taskController = new TaskController();

// Create task
router.post('/', authenticate, (req, res) => taskController.create(req, res));

// Update task status
router.patch('/:id/status', authenticate, (req, res) => taskController.updateStatus(req, res));

// Update task
router.put('/:id', authenticate, (req, res) => taskController.update(req, res));

// Delete task
router.delete('/:id', authenticate, (req, res) => taskController.delete(req, res));

export default router;
