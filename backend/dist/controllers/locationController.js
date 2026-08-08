import prisma from '../prismaClient';
/* ─── GET /api/locations ─────────────────────────────────────────────────────── */
export const getLocations = async (_req, res) => {
    try {
        const locations = await prisma.location.findMany({ orderBy: { name: 'asc' } });
        res.json(locations);
    }
    catch (error) {
        console.error('[getLocations]', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};
/* ─── POST /api/locations (Admin) ───────────────────────────────────────────── */
export const createLocation = async (req, res) => {
    try {
        const { name, address, city } = req.body;
        const location = await prisma.location.create({ data: { name, address, city: city ?? '' } });
        res.status(201).json(location);
    }
    catch (error) {
        console.error('[createLocation]', error);
        res.status(500).json({ error: 'Failed to create location' });
    }
};
/* ─── PUT /api/locations/:id (Admin) ────────────────────────────────────────── */
export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, city } = req.body;
        const data = {};
        if (name !== undefined)
            data['name'] = name;
        if (address !== undefined)
            data['address'] = address;
        if (city !== undefined)
            data['city'] = city;
        const location = await prisma.location.update({ where: { id: id }, data });
        res.json(location);
    }
    catch (error) {
        console.error('[updateLocation]', error);
        res.status(500).json({ error: 'Failed to update location' });
    }
};
/* ─── DELETE /api/locations/:id (Admin) ─────────────────────────────────────── */
export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const carCount = await prisma.car.count({ where: { locationId: id } });
        if (carCount > 0) {
            res.status(400).json({ error: `Cannot delete — ${carCount} car(s) are linked to this location.` });
            return;
        }
        await prisma.location.delete({ where: { id: id } });
        res.json({ message: 'Location deleted successfully' });
    }
    catch (error) {
        console.error('[deleteLocation]', error);
        res.status(500).json({ error: 'Failed to delete location' });
    }
};
//# sourceMappingURL=locationController.js.map