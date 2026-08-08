import { Request, Response } from 'express';
import prisma from '../prismaClient';

/* ─── GET /api/cars ──────────────────────────────────────────────────────────── */
export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, type, minPrice, maxPrice, page, limit, available } = req.query;

    const filters: Record<string, unknown> = {};
    if (location) filters['locationId'] = String(location);
    if (type)     filters['type']       = String(type);
    if (available === 'true') filters['availability'] = true;
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter['gte'] = Number(minPrice);
      if (maxPrice) priceFilter['lte'] = Number(maxPrice);
      filters['pricePerDay'] = priceFilter;
    }

    // [FIX S-06] Pagination support
    const pageNum  = Math.max(1, Number(page)  || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));
    const skip     = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where:   filters,
        include: { location: true },
        skip,
        take:    limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.count({ where: filters }),
    ]);

    res.json({
      data:  cars,
      meta:  { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error('[getCars]', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

/* ─── GET /api/cars/:id ──────────────────────────────────────────────────────── */
export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const car = await prisma.car.findUnique({
      where:   { id: id as string },
      include: { location: true },
    });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.json(car);
  } catch (error) {
    console.error('[getCarById]', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

/* ─── POST /api/cars (Admin) ─────────────────────────────────────────────────── */
export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.body is already validated and coerced by the validate middleware
    const { 
      name, type, fuel, transmission, seating, mileage, 
      pricePerDay, pricePerHour, imageKey, images, locationId 
    } = req.body;

    const car = await prisma.car.create({
      data: {
        name,
        type,
        fuel:         fuel         ?? undefined,
        transmission: transmission ?? undefined,
        seating:      seating      ?? undefined,
        mileage:      mileage      ?? null,
        pricePerDay,
        pricePerHour: pricePerHour ?? null,
        imageKey:     imageKey     ?? null,
        images:       images       ?? [],
        locationId,
      },
      include: { location: true },
    });

    res.status(201).json(car);
  } catch (error) {
    console.error('[createCar]', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
};

/* ─── PUT /api/cars/:id (Admin) ──────────────────────────────────────────────── */
export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // [FIX M-06] Only include fields explicitly provided — never pass undefined to Prisma
    const { 
      name, type, fuel, transmission, seating, mileage,
      pricePerDay, pricePerHour, imageKey, images, availability, locationId 
    } = req.body;
    const data: Record<string, unknown> = {};
    if (name         !== undefined) data['name']         = name;
    if (type         !== undefined) data['type']         = type;
    if (fuel         !== undefined) data['fuel']         = fuel;
    if (transmission !== undefined) data['transmission'] = transmission;
    if (seating      !== undefined) data['seating']      = seating;
    if (mileage      !== undefined) data['mileage']      = mileage;
    if (pricePerDay  !== undefined) data['pricePerDay']  = Number(pricePerDay);
    if (pricePerHour !== undefined) data['pricePerHour'] = Number(pricePerHour);
    if (imageKey     !== undefined) data['imageKey']     = imageKey;
    if (images       !== undefined) data['images']       = images;
    if (availability !== undefined) data['availability'] = availability;
    if (locationId   !== undefined) data['locationId']   = locationId;

    const car = await prisma.car.update({
      where:   { id: id as string },
      data,
      include: { location: true },
    });

    res.json(car);
  } catch (error) {
    console.error('[updateCar]', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
};

/* ─── DELETE /api/cars/:id (Admin) ──────────────────────────────────────────── */
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // [FIX M-05] Check for existing bookings before deleting
    const bookingCount = await prisma.booking.count({ where: { carId: id as string } });
    if (bookingCount > 0) {
      res.status(400).json({
        error: `Cannot delete car — it has ${bookingCount} associated booking(s). Cancel them first.`,
      });
      return;
    }

    await prisma.car.delete({ where: { id: id as string } });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('[deleteCar]', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
};
