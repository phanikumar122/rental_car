import { Request, Response } from 'express';
export declare const getOffers: (req: Request, res: Response) => Promise<void>;
export declare const createOffer: (req: Request, res: Response) => Promise<void>;
export declare const updateOffer: (req: Request, res: Response) => Promise<void>;
export declare const deleteOffer: (req: Request, res: Response) => Promise<void>;
export declare const validateOffer: (req: Request, res: Response) => Promise<void>;
