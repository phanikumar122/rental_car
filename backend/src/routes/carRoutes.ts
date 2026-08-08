import express from 'express';
import { getCars, getCarById, createCar, updateCar, deleteCar } from '../controllers/carController';
import { authenticate, authorizeAdmin }   from '../middleware/authMiddleware';
import { validate }                       from '../middleware/validateMiddleware';
import { createCarSchema, updateCarSchema } from '../validators/carValidator';

const router = express.Router();

router.get('/',    getCars);
router.get('/:id', getCarById);

// Admin only — require both authentication and admin role
router.post('/',    authenticate, authorizeAdmin, validate(createCarSchema), createCar);
router.put('/:id',  authenticate, authorizeAdmin, validate(updateCarSchema), updateCar);
router.delete('/:id', authenticate, authorizeAdmin,                          deleteCar);

export default router;
