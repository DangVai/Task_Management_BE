import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        details?: any;
    };
}

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
    };

    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
): void => {
    const response: ApiResponse = {
        success: false,
        message,
        error: {
            code,
            ...(details && { details }),
        },
    };

    res.status(statusCode).json(response);
};
