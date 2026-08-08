import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getOffers = async (req: Request, res: Response): Promise<void> => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, discountPercentage, validUntil, isActive } = req.body;
    
    if (!code || !discountPercentage || !validUntil) {
      res.status(400).json({ error: 'Code, percentage, and expiry date are required' });
      return;
    }

    const offer = await prisma.offer.create({
      data: {
        code: code.toUpperCase(),
        discountPercentage: Number(discountPercentage),
        validUntil: new Date(validUntil),
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    res.status(201).json(offer);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Offer code already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create offer' });
  }
};

export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, validUntil, isActive } = req.body;

    const offer = await prisma.offer.update({
      where: { id: id as string },
      data: {
        code: code?.toUpperCase(),
        discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        isActive,
      },
    });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id: id as string } });
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
};

export const validateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const offer = await prisma.offer.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!offer || !offer.isActive || new Date(offer.validUntil) < new Date()) {
      res.status(400).json({ error: 'Invalid or expired offer code' });
      return;
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
};
