import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, updateProfile, uploadLicense, uploadAvatar, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
const router = express.Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/license', authenticate, uploadLicense);
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);
export default router;
//# sourceMappingURL=authRoutes.js.map