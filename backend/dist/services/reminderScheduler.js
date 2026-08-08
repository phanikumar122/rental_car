import cron from 'node-cron';
import prisma from '../prismaClient';
import { notifyReminder } from './notificationService';
export const startReminderScheduler = () => {
    const schedule = process.env['REMINDER_CRON_SCHEDULE'] || '*/30 * * * *';
    cron.schedule(schedule, async () => {
        console.log('[Reminder] Running scheduled reminder check...');
        try {
            const now = new Date();
            // ── 24-hour reminder window: pickups between 23h and 25h from now ──────
            const start24 = new Date(now.getTime() + 23 * 60 * 60 * 1000);
            const end24 = new Date(now.getTime() + 25 * 60 * 60 * 1000);
            // ── 1-hour reminder window: pickups between 45min and 75min from now ───
            const start1 = new Date(now.getTime() + 45 * 60 * 1000);
            const end1 = new Date(now.getTime() + 75 * 60 * 1000);
            // Find confirmed bookings in these windows that haven't received reminders
            const [bookings24, bookings1] = await Promise.all([
                prisma.booking.findMany({
                    where: {
                        status: 'CONFIRMED',
                        startDate: { gte: start24, lte: end24 },
                        notifications: {
                            none: { event: 'REMINDER_24H', status: 'SENT' },
                        },
                    },
                    include: { user: { select: { id: true, name: true, email: true } }, car: { select: { name: true } } },
                }),
                prisma.booking.findMany({
                    where: {
                        status: 'CONFIRMED',
                        startDate: { gte: start1, lte: end1 },
                        notifications: {
                            none: { event: 'REMINDER_1H', status: 'SENT' },
                        },
                    },
                    include: { user: { select: { id: true, name: true, email: true } }, car: { select: { name: true } } },
                }),
            ]);
            console.log(`[Reminder] 24h: ${bookings24.length}, 1h: ${bookings1.length}`);
            await Promise.allSettled([
                ...bookings24.map((b) => notifyReminder(b, 'REMINDER_24H')),
                ...bookings1.map((b) => notifyReminder(b, 'REMINDER_1H')),
            ]);
        }
        catch (err) {
            console.error('[Reminder] Scheduler error:', err);
        }
    });
    console.log(`✅ Reminder scheduler started (cron: ${schedule})`);
};
//# sourceMappingURL=reminderScheduler.js.map