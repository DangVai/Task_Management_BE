import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';

export class UserService {
    async create(createUserDto: CreateUserDto, currentUserRole: string) {
        if (currentUserRole !== 'MANAGER') {
            throw new Error('Only managers can create users');
        }

        const existed = await prisma.user.findFirst({
            where: {
                OR: [{ email: createUserDto.email }, { username: createUserDto.username }]
            }
        });

        if (existed) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return await prisma.user.create({
            data: {
                email: createUserDto.email,
                username: createUserDto.username,
                password: hashedPassword,
                fullName: createUserDto.fullName
            },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async findAll(currentUserRole: string) {
        if (currentUserRole !== 'MANAGER') {
            throw new Error('Only managers can view all users');
        }

        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async findOne(id: string, currentUserRole: string, currentUserId: string) {
        if (currentUserRole !== 'MANAGER' && currentUserId !== id) {
            throw new Error('Unauthorized');
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto, currentUserRole: string, currentUserId: string) {
        if (currentUserRole !== 'MANAGER' && currentUserId !== id) {
            throw new Error('Unauthorized');
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        // Check for unique constraints if email or username are being updated
        if (updateUserDto.email || updateUserDto.username) {
            const existed = await prisma.user.findFirst({
                where: {
                    OR: [
                        updateUserDto.email ? { email: updateUserDto.email } : {},
                        updateUserDto.username ? { username: updateUserDto.username } : {}
                    ].filter(obj => Object.keys(obj).length > 0),
                    NOT: { id }
                }
            });

            if (existed) {
                throw new Error('Email or username already exists');
            }
        }

        const updateData: any = {};
        if (updateUserDto.email !== undefined) updateData.email = updateUserDto.email;
        if (updateUserDto.username !== undefined) updateData.username = updateUserDto.username;
        if (updateUserDto.fullName !== undefined) updateData.fullName = updateUserDto.fullName;
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async delete(id: string, currentUserRole: string, currentUserId: string) {
        if (currentUserRole !== 'MANAGER' && currentUserId !== id) {
            throw new Error('Unauthorized');
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        // Soft delete by setting isActive to false
        return await prisma.user.update({
            where: { id },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                isActive: true
            }
        });
    }
}
