import express from 'express';
import {
  getStats,
  getAllUsers,
  blockUser,
  unblockUser,
  verifyLicense,
  sendManualNotification,
  getNotifications,
  getUploadUrl,
  uploadImage,
} from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, authorizeAdmin);

router.get('/stats',                       getStats);
router.get('/users',                       getAllUsers);
router.put('/users/:id/block',             blockUser);
router.put('/users/:id/unblock',           unblockUser);
router.put('/users/:id/verify-license',    verifyLicense);
router.post('/notifications/send',         sendManualNotification);
router.get('/notifications',               getNotifications);
router.post('/upload-url',                 getUploadUrl);
router.post('/upload', upload.single('image'), uploadImage);

export default router;
