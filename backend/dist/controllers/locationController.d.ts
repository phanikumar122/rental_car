import { Request, Response } from 'express';
export declare const getLocations: (_req: Request, res: Response) => Promise<void>;
export declare const createLocation: (req: Request, res: Response) => Promise<void>;
export declare const updateLocation: (req: Request, res: Response) => Promise<void>;
export declare const deleteLocation: (req: Request, res: Response) => Promise<void>;
