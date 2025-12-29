import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';
import { UserResponseDto } from './dto/response/user.response.dto.js';
import { IUserContext } from '../../shared/types/user/user-interfaces.js';

export class UserService {
    async create(createUserDto: CreateUserDto, context: IUserContext): Promise<UserResponseDto> {
        if (context.role !== 'MANAGER') {
            throw new Error('Only managers can create users');
        }

        const existed = await prisma.user.findFirst({
            where: {
                OR: [{ email: createUserDto.email }, { username: createUserDto.username }]
            }
        });

        if (existed) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await prisma.user.create({
            data: { ...createUserDto, password: hashedPassword },
        });

        return new UserResponseDto(user);
    }

    async findOne(id: string, context: IUserContext): Promise<UserResponseDto> {
        if (context.role !== 'MANAGER' && context.userId !== id) {
            throw new Error('Unauthorized');
        }

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) throw new Error('User not found');

        return new UserResponseDto(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto, context: IUserContext): Promise<UserResponseDto> {
        if (context.role !== 'MANAGER' && context.userId !== id) {
            throw new Error('Unauthorized');
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new Error('User not found');

        const updateData: any = { ...updateUserDto };
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return new UserResponseDto(updatedUser);
    }

    async delete(id: string, context: IUserContext): Promise<UserResponseDto> {
        if (context.role !== 'MANAGER' && context.userId !== id) {
            throw new Error('Unauthorized');
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        return new UserResponseDto(updatedUser);
    }
}