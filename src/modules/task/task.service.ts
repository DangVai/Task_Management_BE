import { prisma } from '../../config/prisma.js';
import { CreateTaskDto } from './dto/request/create-task.dto.js';
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto.js';
import { UpdateTaskDto } from './dto/request/update-task.dto.js';
import { TaskResponseDto } from './dto/response/task-response.dto.js';

export class TaskService {
    async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskResponseDto> {
        const task = await prisma.task.create({
            data: {
                content: createTaskDto.content,
                userId: userId,
            },
            include: { user: { select: { id: true, username: true } } }
        });
        return new TaskResponseDto(task);
    }

    async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, userId: string): Promise<TaskResponseDto> {
        const task = await prisma.task.findUnique({
            where: { id }
        });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                status: updateTaskStatusDto.status,
            },
            include: { user: { select: { id: true, username: true } } }
        });
        return new TaskResponseDto(updatedTask);
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskResponseDto> {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                ...(updateTaskDto.content !== undefined && { content: updateTaskDto.content }),
                ...(updateTaskDto.status !== undefined && { status: updateTaskDto.status }),
            },
            include: { user: { select: { id: true, username: true } } }
        });
        return new TaskResponseDto(updatedTask);
    }

    async delete(id: string, userId: string) {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.userId !== userId) {
            throw new Error('Unauthorized');
        }

        return await prisma.task.delete({ where: { id } });
    }

    async getAll(userId: string) {
        return await prisma.task.findMany({
            where: { userId },
            include: { user: { select: { id: true, username: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getById(id: string, userId: string) {
        const task = await prisma.task.findUnique({
            where: { id },
            include: { user: { select: { id: true, username: true } } }
        });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.userId !== userId) {
            throw new Error('Unauthorized');
        }

        return task;
    }
}