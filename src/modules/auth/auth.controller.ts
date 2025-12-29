import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export const registerController = async (req: Request, res: Response) => {
    try {
        const { user, token } = await authService.register(req.body);
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: { user, token },
        });
    } catch (error: any) {
        let statusCode = 400;
        if (error.message === 'User already exists') {
            statusCode = 409;
        }

        return res.status(statusCode).json({
            status: "fail",
            message: error.message,
        });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { emailOrUsername, password } = req.body;
        const { user, token } = await authService.login({ emailOrUsername, password });

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            data: { user, token },
        });
    } catch (error: any) {
        let statusCode = 400;
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            statusCode = 401;
        }

        return res.status(statusCode).json({
            status: "fail",
            message: error.message,
        });
    }
};