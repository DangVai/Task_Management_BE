import { registerController, loginController } from '../../../../src/modules/auth/auth.controller.js';
import { AuthService } from '../../../../src/modules/auth/auth.service.js';

jest.mock('../../../../src/modules/auth/auth.service.js');

const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('AuthController', () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockReq = {
            body: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('registerController', () => {
        it('should register user and return success response', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedpassword',
                fullName: 'Test User',
                role: 'MANAGER' as const,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockToken = 'mocktoken';
            mockReq.body = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };
            mockAuthService.register.mockResolvedValue({ user: mockUser, token: mockToken });

            await registerController(mockReq, mockRes);

            expect(mockAuthService.register).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'User registered successfully',
                data: { user: mockUser, token: mockToken },
            });
        });

        it('should handle error and return fail response', async () => {
            const errorMessage = 'User already exists';
            mockReq.body = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };
            mockAuthService.register.mockRejectedValue(new Error(errorMessage));

            await registerController(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'fail',
                message: errorMessage,
            });
        });
    });

    describe('loginController', () => {
        it('should login user and return success response', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedpassword',
                fullName: 'Test User',
                role: 'MANAGER' as const,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockToken = 'mocktoken';
            mockReq.body = {
                emailOrUsername: 'test@example.com',
                password: 'password123',
            };
            mockAuthService.login.mockResolvedValue({ user: mockUser, token: mockToken });

            await loginController(mockReq, mockRes);

            expect(mockAuthService.login).toHaveBeenCalledWith({
                emailOrUsername: 'test@example.com',
                password: 'password123',
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Login successful',
                data: { user: mockUser, token: mockToken },
            });
        });

        it('should handle error and return fail response', async () => {
            const errorMessage = 'Invalid password';
            mockReq.body = {
                emailOrUsername: 'test@example.com',
                password: 'wrongpassword',
            };
            mockAuthService.login.mockRejectedValue(new Error(errorMessage));

            await loginController(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'fail',
                message: errorMessage,
            });
        });
    });
});
