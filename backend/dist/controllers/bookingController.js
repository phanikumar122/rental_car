import prisma from '../prismaClient';
import { notifyBookingCreated, notifyBookingConfirmed, notifyBookingRejected, notifyBookingCancelled, } from '../services/notificationService';
/* ─── POST /api/bookings ─────────────────────────────────────────────────────── */
export const createBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { carId, startDate, endDate, notes } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({ error: 'Invalid date format' });
            return;
        }
        if (start >= end) {
            res.status(400).json({ error: 'Start date must be before end date' });
            return;
        }
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        if (start < fiveMinutesAgo) {
            res.status(400).json({ error: 'Start date cannot be in the past' });
            return;
        }
        const booking = await prisma.$transaction(async (tx) => {
            const car = await tx.car.findUnique({ where: { id: carId } });
            if (!car)
                throw Object.assign(new Error('Car not found'), { code: 'NOT_FOUND' });
            const overlap = await tx.booking.findFirst({
                where: { carId, status: { not: 'CANCELLED' }, startDate: { lt: end }, endDate: { gt: start } },
            });
            if (overlap)
                throw Object.assign(new Error('Car is not available for the selected dates'), { code: 'CONFLICT' });
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const totalAmount = days * car.pricePerDay;
            // Snapshot user contact at booking time
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { fcmToken: true, email: true },
            });
            const newBooking = await tx.booking.create({
                data: {
                    userId,
                    carId,
                    startDate: start,
                    endDate: end,
                    totalAmount,
                    notes: notes ?? null,
                    userPhone: user?.phone ?? null,
                    userEmail: user?.email ?? null,
                },
                include: { car: { select: { name: true } }, user: { select: { id: true, name: true, email: true, phone: true, fcmToken: true } } },
            });
            await tx.car.update({ where: { id: carId }, data: { availability: false } });
            return newBooking;
        });
        // Fire-and-forget — never block the HTTP response
        notifyBookingCreated(booking).catch(console.error);
        res.status(201).json(booking);
    }
    catch (error) {
        console.error('[createBooking]', error);
        const err = error;
        if (err.code === 'NOT_FOUND') {
            res.status(404).json({ error: err.message });
            return;
        }
        if (err.code === 'CONFLICT') {
            res.status(409).json({ error: err.message });
            return;
        }
        res.status(500).json({ error: 'Failed to create booking' });
    }
};
/* ─── PUT /api/bookings/:id/reschedule (User) ───────────────────────────────── */
export const rescheduleBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { startDate, endDate } = req.body;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({ error: 'Invalid date format' });
            return;
        }
        if (start >= end) {
            res.status(400).json({ error: 'Start date must be before end date' });
            return;
        }
        if (start < new Date()) {
            res.status(400).json({ error: 'Start date cannot be in the past' });
            return;
        }
        const booking = await prisma.$transaction(async (tx) => {
            const existing = await tx.booking.findFirst({ where: { id, userId } });
            if (!existing)
                throw Object.assign(new Error('Booking not found'), { code: 'NOT_FOUND' });
            if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
                throw Object.assign(new Error('Cannot reschedule a cancelled or completed booking'), { code: 'INVALID' });
            }
            const overlap = await tx.booking.findFirst({
                where: {
                    carId: existing.carId,
                    id: { not: id },
                    status: { not: 'CANCELLED' },
                    startDate: { lt: end },
                    endDate: { gt: start },
                },
            });
            if (overlap)
                throw Object.assign(new Error('Car is not available for the new dates'), { code: 'CONFLICT' });
            const car = await tx.car.findUnique({ where: { id: existing.carId } });
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return tx.booking.update({
                where: { id },
                data: { startDate: start, endDate: end, totalAmount: days * (car?.pricePerDay ?? 0), status: 'PENDING' },
            });
        });
        res.json(booking);
    }
    catch (error) {
        const err = error;
        if (err.code === 'NOT_FOUND') {
            res.status(404).json({ error: err.message });
            return;
        }
        if (err.code === 'CONFLICT') {
            res.status(409).json({ error: err.message });
            return;
        }
        if (err.code === 'INVALID') {
            res.status(400).json({ error: err.message });
            return;
        }
        console.error('[rescheduleBooking]', error);
        res.status(500).json({ error: 'Failed to reschedule booking' });
    }
};
/* ─── DELETE /api/bookings/:id (User cancel own) ────────────────────────────── */
export const cancelBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const booking = await prisma.$transaction(async (tx) => {
            const existing = await tx.booking.findFirst({
                where: { id, userId },
                include: { car: { select: { name: true } }, user: { select: { id: true, name: true, email: true, phone: true, fcmToken: true } } },
            });
            if (!existing)
                throw Object.assign(new Error('Booking not found'), { code: 'NOT_FOUND' });
            if (existing.status === 'CANCELLED')
                throw Object.assign(new Error('Already cancelled'), { code: 'INVALID' });
            const updated = await tx.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
            const futureBookings = await tx.booking.findFirst({
                where: { carId: existing.carId, status: { in: ['PENDING', 'CONFIRMED'] }, endDate: { gt: new Date() } },
            });
            if (!futureBookings) {
                await tx.car.update({ where: { id: existing.carId }, data: { availability: true } });
            }
            return { ...updated, car: existing.car, user: existing.user };
        });
        notifyBookingCancelled(booking).catch(console.error);
        res.json(booking);
    }
    catch (error) {
        const err = error;
        if (err.code === 'NOT_FOUND') {
            res.status(404).json({ error: err.message });
            return;
        }
        if (err.code === 'INVALID') {
            res.status(400).json({ error: err.message });
            return;
        }
        console.error('[cancelBooking]', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};
/* ─── GET /api/bookings/user ─────────────────────────────────────────────────── */
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { car: { include: { location: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('[getUserBookings]', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};
/* ─── GET /api/bookings (Admin) ──────────────────────────────────────────────── */
export const getAllBookings = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query['page']) || 1);
        const limit = Math.min(100, Number(req.query['limit']) || 20);
        const skip = (page - 1) * limit;
        const status = req.query['status'];
        const where = {};
        if (status)
            where['status'] = status;
        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true, fcmToken: true } },
                    car: { include: { location: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.booking.count({ where }),
        ]);
        res.json({ data: bookings, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    }
    catch (error) {
        console.error('[getAllBookings]', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};
/* ─── PUT /api/bookings/:id (Admin status update) ────────────────────────────── */
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await prisma.booking.findUnique({
            where: { id: id },
            include: { car: { select: { name: true } }, user: { select: { id: true, name: true, email: true, phone: true, fcmToken: true } } },
        });
        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        const updated = await prisma.booking.update({ where: { id: id }, data: { status } });
        if (status === 'CANCELLED' || status === 'COMPLETED') {
            const futureBookings = await prisma.booking.findFirst({
                where: { carId: booking.carId, status: { in: ['PENDING', 'CONFIRMED'] }, endDate: { gt: new Date() } },
            });
            if (!futureBookings) {
                await prisma.car.update({ where: { id: booking.carId }, data: { availability: true } });
            }
        }
        // Send notification based on new status
        const fullBooking = { ...booking, ...updated };
        if (status === 'CONFIRMED')
            notifyBookingConfirmed(fullBooking).catch(console.error);
        if (status === 'CANCELLED')
            notifyBookingCancelled(fullBooking).catch(console.error);
        if (status === 'CANCELLED' && booking.status !== 'CANCELLED') {
            notifyBookingRejected(fullBooking).catch(console.error);
        }
        res.json(updated);
    }
    catch (error) {
        console.error('[updateBookingStatus]', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
};
//# sourceMappingURL=bookingController.js.map