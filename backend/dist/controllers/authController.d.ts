import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const uploadLicense: (req: AuthRequest, res: Response) => Promise<void>;
export declare const uploadAvatar: (req: AuthRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
