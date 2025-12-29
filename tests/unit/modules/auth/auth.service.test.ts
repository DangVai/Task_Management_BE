import { AuthService } from '../../../../src/modules/auth/auth.service.js';

jest.mock('../../../../src/config/prisma.js');
jest.mock('bcryptjs');
jest.mock('../../../../src/shared/utils/jwt.util.js');

// Create mock implementations
const mockPrismaUser = {
    findFirst: jest.fn(),
    create: jest.fn(),
};

const mockPrisma = {
    user: mockPrismaUser,
} as any;

const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
};

const mockGenerateToken = jest.fn();

// Replace the actual imports with mocks
Object.defineProperty(require('../../../../src/config/prisma.js'), 'prisma', {
    value: mockPrisma,
    writable: true,
});

Object.defineProperty(require('bcryptjs'), 'hash', {
    value: mockBcrypt.hash,
    writable: true,
});

Object.defineProperty(require('bcryptjs'), 'compare', {
    value: mockBcrypt.compare,
    writable: true,
});

Object.defineProperty(require('../../../../src/shared/utils/jwt.util.js'), 'generateToken', {
    value: mockGenerateToken,
    writable: true,
});

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
                fullName: 'Test User',
            };
            const hashedPassword = 'hashedpassword';
            const createdUser = {
                id: 1,
                email: userData.email,
                username: userData.username,
                password: hashedPassword,
                fullName: userData.fullName,
                role: 'MANAGER',
            };
            const token = 'mocktoken';

            mockPrisma.user.findFirst.mockResolvedValue(null);
            mockBcrypt.hash.mockResolvedValue(hashedPassword);
            mockPrisma.user.create.mockResolvedValue(createdUser);
            mockGenerateToken.mockReturnValue(token);

            const result = await AuthService.register(userData);

            expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [{ email: userData.email }, { username: userData.username }],
                },
            });
            expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(mockPrisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: userData.email,
                    username: userData.username,
                    password: hashedPassword,
                    fullName: userData.fullName,
                },
            });
            expect(mockGenerateToken).toHaveBeenCalledWith({
                userId: createdUser.id,
                email: createdUser.email,
                role: createdUser.role,
            });
            expect(result).toEqual({ user: createdUser, token });
        });

        it('should throw error if user already exists', async () => {
            const userData = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };
            const existingUser = { id: 1, email: userData.email };

            mockPrisma.user.findFirst.mockResolvedValue(existingUser);

            await expect(AuthService.register(userData)).rejects.toThrow('User already exists');
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const loginData = {
                emailOrUsername: 'test@example.com',
                password: 'password123',
            };
            const user = {
                id: 1,
                email: loginData.emailOrUsername,
                username: 'testuser',
                password: 'hashedpassword',
                role: 'MANAGER',
            };
            const token = 'mocktoken';

            mockPrisma.user.findFirst.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(true);
            mockGenerateToken.mockReturnValue(token);

            const result = await AuthService.login(loginData);

            expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { email: loginData.emailOrUsername },
                        { username: loginData.emailOrUsername },
                    ],
                },
            });
            expect(mockBcrypt.compare).toHaveBeenCalledWith(loginData.password, user.password);
            expect(mockGenerateToken).toHaveBeenCalledWith({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            expect(result).toEqual({ user, token });
        });

        it('should throw error if user not found', async () => {
            const loginData = {
                emailOrUsername: 'nonexistent@example.com',
                password: 'password123',
            };

            mockPrisma.user.findFirst.mockResolvedValue(null);

            await expect(AuthService.login(loginData)).rejects.toThrow('User not found');
        });

        it('should throw error if password is invalid', async () => {
            const loginData = {
                emailOrUsername: 'test@example.com',
                password: 'wrongpassword',
            };
            const user = {
                id: 1,
                email: loginData.emailOrUsername,
                password: 'hashedpassword',
            };

            mockPrisma.user.findFirst.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(false);

            await expect(AuthService.login(loginData)).rejects.toThrow('Invalid password');
        });
    });
});
