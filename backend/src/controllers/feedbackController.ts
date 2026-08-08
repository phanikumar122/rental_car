import { Request, Response } from 'express';
import prisma from '../prismaClient';

/* ─── POST /api/feedback (Public) ────────────────────────────────────────── */
export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !email || !rating || !message) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        rating: Number(rating),
        message,
        isApproved: false, // Wait for admin approval
      },
    });

    res.status(201).json({ message: 'Feedback submitted successfully', data: feedback });
  } catch (error) {
    console.error('[submitFeedback]', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

/* ─── GET /api/feedback (Public/Admin) ───────────────────────────────────── */
export const getFeedbacks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { approvedOnly } = req.query;
    
    const filters: any = {};
    if (approvedOnly === 'true') {
      filters.isApproved = true;
    }

    const feedbacks = await prisma.feedback.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: feedbacks });
  } catch (error) {
    console.error('[getFeedbacks]', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

/* ─── PATCH /api/feedback/:id/approve (Admin) ─────────────────────────────── */
export const approveFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const feedback = await prisma.feedback.update({
      where: { id: id as string },
      data: { isApproved: isApproved ?? true },
    });

    res.json({ message: 'Feedback status updated', data: feedback });
  } catch (error) {
    console.error('[approveFeedback]', error);
    res.status(500).json({ error: 'Failed to update feedback status' });
  }
};

/* ─── DELETE /api/feedback/:id (Admin) ─────────────────────────────────────── */
export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.feedback.delete({
      where: { id: id as string },
    });

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('[deleteFeedback]', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};
