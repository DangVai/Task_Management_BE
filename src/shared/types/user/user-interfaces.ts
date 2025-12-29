import { Role } from '@prisma/client';

export interface IUserContext {
    userId: string;
    role: Role;
    email: string;
}

export interface IUserDto {
    id: string;
    email: string;
    username: string;
    fullName?: string | null;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}