import { Request, Response } from 'express';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IUserContext } from '../../shared/types/user/user-interfaces.js';
import { prisma } from '../../config/prisma.js';

const userService = new UserService();

export class UserController {
    private getContext(req: Request): IUserContext | null {
        if (!req.user) return null;
        return {
            userId: req.user.id,
            role: req.user.role,
            email: req.user.email
        };
    }


    create = async (req: Request, res: Response) => {
        try {
            const context = this.getContext(req);
            if (!context) return res.status(401).json({ message: 'Unauthorized' });

            // Chuyển body thành class DTO và validate
            const dto = plainToInstance(CreateUserDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            // Truyền context vào service (thay vì truyền lẻ role)
            const user = await userService.create(dto, context);

            res.status(201).json({
                status: 'success',
                message: 'User created successfully',
                data: user
            });
        } catch (error: any) {
            res.status(400).json({ status: 'fail', message: error.message });
        }
    };

    findOne = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const context = this.getContext(req);
            if (!context) return res.status(401).json({ message: 'Unauthorized' });

            // Sử dụng hàm findOne mới nhận context
            const user = await userService.findOne(id, context);

            res.json({ status: 'success', data: user });
        } catch (error: any) {
            res.status(404).json({ status: 'fail', message: error.message });
        }
    };

    findAll = async (req: Request, res: Response) => {
        try {
            const context = this.getContext(req);
            if (!context) return res.status(401).json({ message: 'Unauthorized' });

            // Only managers can view all users
            if (context.role !== 'MANAGER') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const users = await prisma.user.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            res.json({ status: 'success', data: users });
        } catch (error: any) {
            res.status(500).json({ status: 'fail', message: error.message });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const context = this.getContext(req);
            if (!context) return res.status(401).json({ message: 'Unauthorized' });

            // Chuyển body thành class DTO và validate
            const dto = plainToInstance(UpdateUserDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            const user = await userService.update(id, dto, context);

            res.json({
                status: 'success',
                message: 'User updated successfully',
                data: user
            });
        } catch (error: any) {
            res.status(400).json({ status: 'fail', message: error.message });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const context = this.getContext(req);
            if (!context) return res.status(401).json({ message: 'Unauthorized' });

            const user = await userService.delete(id, context);

            res.json({
                status: 'success',
                message: 'User deleted successfully',
                data: user
            });
        } catch (error: any) {
            res.status(400).json({ status: 'fail', message: error.message });
        }
    };
}
