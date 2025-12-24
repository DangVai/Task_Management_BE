import { Request, Response } from 'express';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/request/create-task.dto.js';
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

const taskService = new TaskService();

export class TaskController {
    getAll = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const tasks = await taskService.getAll(userId);
            res.json(tasks);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const task = await taskService.getById(id, userId);
            res.json(task);
        } catch (error: any) {
            res.status(403).json({ message: 'Task không tồn tại hoặc bạn không có quyền truy cập' });
        }
    };
    create = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const dto = plainToInstance(CreateTaskDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            const task = await taskService.create(dto, userId);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const dto = plainToInstance(UpdateTaskStatusDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            const task = await taskService.updateStatus(id, dto, userId);
            res.json(task);
        } catch (error: any) {
            res.status(403).json({ message: 'Task không tồn tại hoặc bạn không có quyền sửa' });
        }
    };
}