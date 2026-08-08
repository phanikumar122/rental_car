import express from 'express';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get( '/',    getLocations);   // public
router.post('/',    authenticate, authorizeAdmin, createLocation);
router.put( '/:id', authenticate, authorizeAdmin, updateLocation);
router.delete('/:id', authenticate, authorizeAdmin, deleteLocation);

export default router;
