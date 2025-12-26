import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDto(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const instance = plainToInstance(dto, req.body);

        const errors = await validate(instance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.map(err => ({
                    field: err.property,
                    errors: Object.values(err.constraints || {}),
                })),
            });
        }

        req.body = instance;
        next();
    };
}
