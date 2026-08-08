import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Middleware factory that validates req.body against a Zod schema.
 * Returns 400 with structured field errors on failure.
 */
export declare const validate: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
