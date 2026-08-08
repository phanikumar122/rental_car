import { Request, Response } from 'express';
export declare const getCars: (req: Request, res: Response) => Promise<void>;
export declare const getCarById: (req: Request, res: Response) => Promise<void>;
export declare const createCar: (req: Request, res: Response) => Promise<void>;
export declare const updateCar: (req: Request, res: Response) => Promise<void>;
export declare const deleteCar: (req: Request, res: Response) => Promise<void>;
