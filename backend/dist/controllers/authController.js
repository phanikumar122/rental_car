import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';
/* ─── POST /api/auth/register ───────────────────────────────────────────────── */
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: 'USER', phone: phone ?? null },
        });
        const token = jwt.sign({ id: user.id, role: user.role }, process.env['JWT_SECRET'], { expiresIn: '7d' });
        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
            token,
        });
    }
    catch (error) {
        console.error('[register]', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
/* ─── POST /api/auth/login ──────────────────────────────────────────────────── */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        if (user.isBlocked) {
            res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env['JWT_SECRET'], { expiresIn: '7d' });
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatarUrl: user.avatarUrl },
            token,
        });
    }
    catch (error) {
        console.error('[login]', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
/* ─── GET /api/auth/me ──────────────────────────────────────────────────────── */
export const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, licenseUrl: true, licenseVerified: true, isBlocked: true },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('[getMe]', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
/* ─── PUT /api/auth/profile ─────────────────────────────────────────────────── */
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { name, phone } = req.body;
        const data = {};
        if (name !== undefined)
            data['name'] = name;
        if (phone !== undefined)
            data['phone'] = phone;
        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, licenseUrl: true, licenseVerified: true },
        });
        res.json(user);
    }
    catch (error) {
        console.error('[updateProfile]', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
/* ─── POST /api/auth/license ────────────────────────────────────────────────── */
export const uploadLicense = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { licenseUrl } = req.body;
        if (!licenseUrl) {
            res.status(400).json({ error: 'licenseUrl is required' });
            return;
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data: { licenseUrl, licenseVerified: false }, // reset verification when re-uploaded
            select: { id: true, licenseUrl: true, licenseVerified: true },
        });
        res.json(user);
    }
    catch (error) {
        console.error('[uploadLicense]', error);
        res.status(500).json({ error: 'Failed to upload license' });
    }
};
/* ─── POST /api/auth/avatar ────────────────────────────────────────────────── */
export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        // Return the relative path
        const avatarUrl = `/uploads/${req.file.filename}`;
        const user = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
            select: { id: true, avatarUrl: true },
        });
        res.json(user);
    }
    catch (error) {
        console.error('[uploadAvatar]', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
};
/* ─── PUT /api/auth/change-password ─────────────────────────────────────────── */
export const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ error: 'Old and new passwords are required' });
            return;
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Incorrect current password' });
            return;
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('[changePassword]', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};
//# sourceMappingURL=authController.js.map