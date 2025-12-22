import { prisma } from '../../config/prisma.js';
import { CreateTaskDto } from './dto/request/create-task.dto.js';
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto.js';

export class TaskService {
    async create(createTaskDto: CreateTaskDto, userId: string) {
        return await prisma.task.create({
            data: {
                content: createTaskDto.content,
                userId: userId,
            },
            include: { user: { select: { id: true, username: true } } }
        });
    }

    async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, userId: string) {
        // Kiểm tra task tồn tại và thuộc về user
        const task = await prisma.task.findUnique({
            where: { id }
        });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.userId !== userId) {
            throw new Error('Unauthorized');
        }

        return await prisma.task.update({
            where: { id },
            data: {
                status: updateTaskStatusDto.status,
            },
            include: { user: { select: { id: true, username: true } } }
        });
    }
}