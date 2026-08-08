import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// User routes
router.post('/',                   authenticate,               createBooking);
router.get( '/user',               authenticate,               getUserBookings);
router.put( '/:id/reschedule',     authenticate,               rescheduleBooking);
router.delete('/:id',              authenticate,               cancelBooking);

// Admin routes
router.get( '/',                   authenticate, authorizeAdmin, getAllBookings);
router.put( '/:id',                authenticate, authorizeAdmin, updateBookingStatus);

export default router;
