import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export const registerController = async (req: Request, res: Response) => {
    try {
        const { user, token } = await AuthService.register(req.body);
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: { user, token },
        });
    } catch (error: any) {
        return res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { emailOrUsername, password } = req.body;
        const { user, token } = await AuthService.login({ emailOrUsername, password });

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            data: { user, token },
        });
    } catch (error: any) {
        return res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};