import { Request, Response } from 'express';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/request/create-task.dto.js';
import { UpdateTaskDto } from './dto/request/update-task.dto.js';
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

const taskService = new TaskService();

export class TaskController {
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

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const dto = plainToInstance(UpdateTaskDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            const task = await taskService.update(id, dto, userId);
            res.json(task);
        } catch (error: any) {
            res.status(403).json({ message: 'Task không tồn tại hoặc bạn không có quyền sửa' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            await taskService.delete(id, userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(403).json({ message: 'Task không tồn tại hoặc bạn không có quyền xóa' });
        }
    };
}
