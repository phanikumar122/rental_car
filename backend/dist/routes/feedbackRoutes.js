import express from 'express';
import { submitFeedback, getFeedbacks, approveFeedback, deleteFeedback } from '../controllers/feedbackController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';
const router = express.Router();
// Public: Submit feedback
router.post('/', submitFeedback);
// Public/Admin: Get feedback (can filter by approvedOnly)
router.get('/', getFeedbacks);
// Admin Only: Manage feedback
router.patch('/:id/approve', authenticate, authorizeAdmin, approveFeedback);
router.delete('/:id', authenticate, authorizeAdmin, deleteFeedback);
export default router;
//# sourceMappingURL=feedbackRoutes.js.map