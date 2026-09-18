import { Router } from 'express';
import { dbService } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const adminRouter = Router();

// Protect ALL admin routes with JWT Auth
adminRouter.use(requireAuth);

// GET /api/admin/dashboard/stats - Dealership KPIs & Inventory overview
adminRouter.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await dbService.getDashboardStats();
    res.json({
      success: true,
      stats
    });
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

// GET /api/admin/cars - List all cars with any status
adminRouter.get('/cars', async (req, res) => {
  try {
    const { status, brand, city, sortBy } = req.query;
    const cars = await dbService.cars.findMany({
      status: status ? (status as string) : undefined,
      brand: brand ? (brand as string) : undefined,
      city: city ? (city as string) : undefined,
      sortBy: sortBy ? (sortBy as string) : undefined
    });

    res.json({
      success: true,
      count: cars.length,
      cars
    });
  } catch (err: any) {
    console.error('Error fetching admin cars:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve inventory'
    });
  }
});

// POST /api/admin/cars - Create new vehicle
adminRouter.post('/cars', async (req, res) => {
  try {
    const body = req.body;

    if (!body.brand || !body.model || !body.variant || !body.price || !body.year) {
      res.status(400).json({
        success: false,
        error: 'Brand, model, variant, year, and price are required fields.'
      });
      return;
    }

    const year = parseInt(body.year, 10);
    const price = parseFloat(body.price);
    const kilometers = parseInt(body.kilometers || '0', 10);
    const estimatedEmi = parseInt(body.estimatedEmi || Math.round((price * 100000 * 0.016)).toString(), 10);

    const stockId = body.stockId || `BW-${year}-${body.brand.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

    const car = await dbService.cars.create({
      stockId,
      brand: body.brand.trim(),
      model: body.model.trim(),
      variant: body.variant.trim(),
      bodyType: body.bodyType || 'SUV',
      year,
      kilometers,
      fuelType: body.fuelType || 'Petrol',
      transmission: body.transmission || 'Manual',
      price,
      estimatedEmi,
      city: body.city || 'Delhi NCR',
      rto: body.rto || 'DL-01',
      ownership: body.ownership || '1st Owner',
      insurance: body.insurance || 'Valid Insurance',
      safetyRating: parseInt(body.safetyRating || '5', 10),
      mileage: body.mileage || '18.0 km/l',
      enginePower: body.enginePower || '1.5L Turbo',
      bootSpace: body.bootSpace || '400 Litres',
      groundClearance: body.groundClearance || '190 mm',
      inspectionScore: parseInt(body.inspectionScore || '98', 10),
      certified: body.certified !== false,
      warranty: body.warranty || '1-Year Comprehensive Pan-India Warranty',
      color: body.color || 'Pearl White',
      tag: body.tag || 'Certified Selection',
      description: body.description || '',
      status: body.status || 'AVAILABLE',
      featured: Boolean(body.featured),
      features: Array.isArray(body.features) ? body.features : [],
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : [
            {
              imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
              altText: `${body.brand} ${body.model}`,
              isPrimary: true,
              sortOrder: 0
            }
          ]
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added to inventory successfully',
      car
    });
  } catch (err: any) {
    console.error('Error creating car:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create car record'
    });
  }
});

// PUT /api/admin/cars/:id - Update vehicle details
adminRouter.put('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await dbService.cars.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Car not found'
      });
      return;
    }

    const updated = await dbService.cars.update(id, {
      ...body,
      price: body.price ? parseFloat(body.price) : existing.price,
      year: body.year ? parseInt(body.year, 10) : existing.year,
      kilometers: body.kilometers !== undefined ? parseInt(body.kilometers, 10) : existing.kilometers,
      estimatedEmi: body.estimatedEmi ? parseInt(body.estimatedEmi, 10) : existing.estimatedEmi,
      inspectionScore: body.inspectionScore ? parseInt(body.inspectionScore, 10) : existing.inspectionScore,
      safetyRating: body.safetyRating ? parseInt(body.safetyRating, 10) : existing.safetyRating
    });

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      car: updated
    });
  } catch (err: any) {
    console.error('Error updating car:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update vehicle record'
    });
  }
});

// PATCH /api/admin/cars/:id/status - Quick status toggle
adminRouter.patch('/cars/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let targetStatus = status;
    if (targetStatus === 'BOOKED') targetStatus = 'RESERVED';

    if (!['AVAILABLE', 'RESERVED', 'SOLD', 'DRAFT'].includes(targetStatus)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Must be AVAILABLE, RESERVED, SOLD, or DRAFT'
      });
      return;
    }

    const updated = await dbService.cars.updateStatus(id, targetStatus);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Car not found'
      });
      return;
    }

    res.json({
      success: true,
      message: `Car status updated to ${status}`,
      car: updated
    });
  } catch (err: any) {
    console.error('Error updating car status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
});

// DELETE /api/admin/cars/:id - Remove vehicle
adminRouter.delete('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dbService.cars.delete(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Car not found or could not be removed'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Car removed from inventory successfully'
    });
  } catch (err: any) {
    console.error('Error deleting car:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete car'
    });
  }
});

// GET /api/admin/test-drives - Manage test drive bookings
adminRouter.get('/test-drives', async (req, res) => {
  try {
    const bookings = await dbService.testDrives.findMany();
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err: any) {
    console.error('Error fetching test drives:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test drive bookings'
    });
  }
});

// PATCH /api/admin/test-drives/:id/status
adminRouter.patch('/test-drives/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (status && !['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid test drive status'
      });
      return;
    }

    const updated = await dbService.testDrives.updateStatus(id, status, notes);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Test drive booking not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Test drive updated successfully',
      booking: updated
    });
  } catch (err: any) {
    console.error('Error updating test drive status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update test drive status'
    });
  }
});

// GET /api/admin/enquiries - Manage customer queries
adminRouter.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await dbService.enquiries.findMany();
    res.json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (err: any) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enquiries'
    });
  }
});

// PATCH /api/admin/enquiries/:id/status
adminRouter.patch('/enquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowed = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'RESOLVED', 'CLOSED'];
    if (status && !allowed.includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid enquiry status'
      });
      return;
    }

    const updated = await dbService.enquiries.updateStatus(id, status, notes);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Enquiry not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      enquiry: updated
    });
  } catch (err: any) {
    console.error('Error updating enquiry status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update enquiry status'
    });
  }
});

// GET /api/admin/sell-requests - Manage sell car evaluations
adminRouter.get('/sell-requests', async (req, res) => {
  try {
    const requests = await dbService.sellRequests.findMany();
    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (err: any) {
    console.error('Error fetching sell requests:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sell car requests'
    });
  }
});

// PATCH /api/admin/sell-requests/:id/status
adminRouter.patch('/sell-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowed = ['NEW', 'CONTACTED', 'INSPECTION_SCHEDULED', 'VALUATION_DONE', 'PURCHASED', 'CLOSED', 'PENDING', 'EVALUATED', 'OFFER_MADE', 'ACCEPTED', 'REJECTED'];
    if (status && !allowed.includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid sell request status'
      });
      return;
    }

    const updated = await dbService.sellRequests.updateStatus(id, status, notes);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Sell car request not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Sell request updated successfully',
      request: updated
    });
  } catch (err: any) {
    console.error('Error updating sell request status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update sell request status'
    });
  }
});
