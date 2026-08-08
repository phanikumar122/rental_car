import express from 'express';
import { getOffers, createOffer, updateOffer, deleteOffer, validateOffer } from '../controllers/offerController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';
const router = express.Router();
// Public/User routes
router.post('/validate', authenticate, validateOffer);
// Admin routes
router.get('/', authenticate, authorizeAdmin, getOffers);
router.post('/', authenticate, authorizeAdmin, createOffer);
router.put('/:id', authenticate, authorizeAdmin, updateOffer);
router.delete('/:id', authenticate, authorizeAdmin, deleteOffer);
export default router;
//# sourceMappingURL=offerRoutes.js.map