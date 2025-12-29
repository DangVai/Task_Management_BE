import { Request, Response } from 'express';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

const userService = new UserService();

export class UserController {
    create = async (req: Request, res: Response) => {
        try {
            const userRole = req.user?.role;
            if (!userRole) return res.status(401).json({ message: 'Unauthorized' });

            const dto = plainToInstance(CreateUserDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            const user = await userService.create(dto, userRole);
            res.status(201).json({
                status: 'success',
                message: 'User created successfully',
                data: user
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'fail',
                message: error.message
            });
        }
    };

    findAll = async (req: Request, res: Response) => {
        try {
            const userRole = req.user?.role;
            if (!userRole) return res.status(401).json({ message: 'Unauthorized' });

            const users = await userService.findAll(userRole);
            res.json({
                status: 'success',
                data: users
            });
        } catch (error: any) {
            res.status(403).json({
                status: 'fail',
                message: error.message
            });
        }
    };

    findOne = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userRole = req.user?.role;
            const userId = req.user?.id;
            if (!userRole || !userId) return res.status(401).json({ message: 'Unauthorized' });

            const user = await userService.findOne(id, userRole, userId);
            res.json({
                status: 'success',
                data: user
            });
        } catch (error: any) {
            res.status(404).json({
                status: 'fail',
                message: error.message
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userRole = req.user?.role;
            const userId = req.user?.id;
            if (!userRole || !userId) return res.status(401).json({ message: 'Unauthorized' });

            const dto = plainToInstance(UpdateUserDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) return res.status(400).json({ errors });

            const user = await userService.update(id, dto, userRole, userId);
            res.json({
                status: 'success',
                message: 'User updated successfully',
                data: user
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'fail',
                message: error.message
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userRole = req.user?.role;
            const userId = req.user?.id;
            if (!userRole || !userId) return res.status(401).json({ message: 'Unauthorized' });

            const user = await userService.delete(id, userRole, userId);
            res.json({
                status: 'success',
                message: 'User deleted successfully',
                data: user
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'fail',
                message: error.message
            });
        }
    };
}
