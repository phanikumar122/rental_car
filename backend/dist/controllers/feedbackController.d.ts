import { Request, Response } from 'express';
export declare const submitFeedback: (req: Request, res: Response) => Promise<void>;
export declare const getFeedbacks: (req: Request, res: Response) => Promise<void>;
export declare const approveFeedback: (req: Request, res: Response) => Promise<void>;
export declare const deleteFeedback: (req: Request, res: Response) => Promise<void>;
