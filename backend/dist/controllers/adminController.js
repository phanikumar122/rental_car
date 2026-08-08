import prisma from '../prismaClient';
import { sendEmail } from '../services/notificationService';
import { getPresignedUploadUrl } from '../services/storageService';
/* ─── GET /api/admin/stats ──────────────────────────────────────────────────── */
export const getStats = async (_req, res) => {
    try {
        const [totalBookings, totalUsers, availableCars, revenueData, pendingBookings] = await Promise.all([
            prisma.booking.count(),
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.car.count({ where: { availability: true } }),
            prisma.booking.findMany({
                where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
                select: { totalAmount: true },
            }),
            prisma.booking.count({ where: { status: 'PENDING' } }),
        ]);
        const revenue = revenueData.reduce((s, b) => s + b.totalAmount, 0);
        res.json({ totalBookings, activeUsers: totalUsers, availableCars, revenue, pendingBookings });
    }
    catch (error) {
        console.error('[getStats]', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
/* ─── GET /api/admin/users ──────────────────────────────────────────────────── */
export const getAllUsers = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query['page']) || 1);
        const limit = Math.min(100, Number(req.query['limit']) || 20);
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                orderBy: { createdAt: 'desc' }, skip, take: limit,
                select: {
                    id: true, name: true, email: true, phone: true, role: true,
                    isBlocked: true, licenseUrl: true, licenseVerified: true, createdAt: true,
                    _count: { select: { bookings: true } },
                },
            }),
            prisma.user.count(),
        ]);
        res.json({ data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    }
    catch (error) {
        console.error('[getAllUsers]', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
/* ─── PUT /api/admin/users/:id/block ────────────────────────────────────────── */
export const blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.update({ where: { id: id }, data: { isBlocked: true }, select: { id: true, name: true, isBlocked: true } });
        res.json(user);
    }
    catch (error) {
        console.error('[blockUser]', error);
        res.status(500).json({ error: 'Failed' });
    }
};
/* ─── PUT /api/admin/users/:id/unblock ──────────────────────────────────────── */
export const unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.update({ where: { id: id }, data: { isBlocked: false }, select: { id: true, name: true, isBlocked: true } });
        res.json(user);
    }
    catch (error) {
        console.error('[unblockUser]', error);
        res.status(500).json({ error: 'Failed' });
    }
};
/* ─── PUT /api/admin/users/:id/verify-license ───────────────────────────────── */
export const verifyLicense = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.update({ where: { id: id }, data: { licenseVerified: true }, select: { id: true, name: true, licenseVerified: true } });
        res.json(user);
    }
    catch (error) {
        console.error('[verifyLicense]', error);
        res.status(500).json({ error: 'Failed' });
    }
};
/* ─── POST /api/admin/notifications/send ────────────────────────────────────── */
export const sendManualNotification = async (req, res) => {
    try {
        const { userId, channel, message } = req.body;
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        let success = false;
        if (channel === 'EMAIL') {
            success = await sendEmail(user.email, 'Message from Royal Car Travels', `<p>${message}</p>`);
        }
        else {
            res.status(400).json({ error: 'Channel unsupported or missing user token' });
            return;
        }
        await prisma.notification.create({
            data: {
                userId: user.id,
                channel,
                event: 'MANUAL',
                message,
                status: success ? 'SENT' : 'FAILED',
                sentAt: success ? new Date() : undefined
            }
        });
        res.json({ success });
    }
    catch (error) {
        console.error('[sendManualNotification]', error);
        res.status(500).json({ error: 'Failed' });
    }
};
/* ─── GET /api/admin/notifications ──────────────────────────────────────────── */
export const getNotifications = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query['page']) || 1);
        const limit = Math.min(100, Number(req.query['limit']) || 20);
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit, include: { user: { select: { name: true, email: true } } } }),
            prisma.notification.count(),
        ]);
        res.json({ data: notifications, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    }
    catch (error) {
        console.error('[getNotifications]', error);
        res.status(500).json({ error: 'Failed' });
    }
};
/* ─── POST /api/admin/upload-url ───────────────────────────────────────────── */
export const getUploadUrl = async (req, res) => {
    try {
        const { fileName, contentType } = req.body;
        if (!fileName || !contentType) {
            res.status(400).json({ error: 'fileName and contentType are required' });
            return;
        }
        const { uploadUrl, publicUrl, key } = await getPresignedUploadUrl(fileName, contentType);
        res.json({ uploadUrl, publicUrl, key });
    }
    catch (error) {
        console.error('[getUploadUrl]', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
};
/* ─── POST /api/admin/upload ────────────────────────────────────────────────── */
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        // Return the relative path instead of an absolute URL for better portability
        const publicUrl = `/uploads/${req.file.filename}`;
        res.json({ publicUrl, filename: req.file.filename });
    }
    catch (error) {
        console.error('[uploadImage]', error);
        res.status(500).json({ error: 'Upload failed' });
    }
};
//# sourceMappingURL=adminController.js.map