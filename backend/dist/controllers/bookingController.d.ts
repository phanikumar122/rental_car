import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const createBooking: (req: AuthRequest, res: Response) => Promise<void>;
export declare const rescheduleBooking: (req: AuthRequest, res: Response) => Promise<void>;
export declare const cancelBooking: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserBookings: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllBookings: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBookingStatus: (req: AuthRequest, res: Response) => Promise<void>;
