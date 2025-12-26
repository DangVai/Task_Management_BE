import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { generateToken } from '../../shared/utils/jwt.util.js';

export class AuthService {
    static async register(data: {
        email: string;
        username: string;
        password: string;
        fullName?: string;
    }) {
        const existed = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }]
            }
        });

        if (existed) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: hashedPassword,
                fullName: data.fullName
            }
        });

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role ||'MANAGER',
        });

        return { user, token };
    }

    static async login(data: { emailOrUsername: string; password: string }) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.emailOrUsername },
                    { username: data.emailOrUsername }
                ]
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return { user, token };
    }
}
