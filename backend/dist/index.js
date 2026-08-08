import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import locationRoutes from './routes/locationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import offerRoutes from './routes/offerRoutes';
import { startReminderScheduler } from './services/reminderScheduler';
// ─── Startup validation ───────────────────────────────────────────────────────
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`FATAL: Missing required environment variable: ${key}`);
        process.exit(1);
    }
}
if (process.env['JWT_SECRET'].length < 32) {
    console.error('FATAL: JWT_SECRET is too short. Use at least 32 characters.');
    process.exit(1);
}
// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();
const port = Number(process.env['PORT']) || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: process.env['FRONTEND_URL'] || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
// ─── Static Files ─────────────────────────────────────────────────────────────
const uploadsPath = path.join(__dirname, '../public/uploads');
console.log(`📂 Serving uploads from: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/offers', offerRoutes);
// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[UnhandledError]', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});
// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`✅  Server running on http://localhost:${port}`);
    startReminderScheduler();
});
//# sourceMappingURL=index.js.map