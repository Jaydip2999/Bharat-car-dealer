import { Router } from 'express';
import { dbService } from '../db.js';

export const carsRouter = Router();

// GET /api/cars/featured - Top certified featured cars
carsRouter.get('/featured', async (req, res) => {
  try {
    const cars = await dbService.cars.findMany({
      status: 'AVAILABLE',
      featured: true
    });
    res.json({
      success: true,
      cars
    });
  } catch (err: any) {
    console.error('Error fetching featured cars:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve featured cars'
    });
  }
});

// GET /api/cars - Customer car inventory with filtering and sorting
carsRouter.get('/', async (req, res) => {
  try {
    const {
      brand,
      model,
      bodyType,
      fuelType,
      transmission,
      city,
      status,
      maxBudget,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxKm,
      ownership,
      certified,
      searchQuery,
      sortBy,
      page = '1',
      limit = '18'
    } = req.query;

    const parsedMaxBudget = maxBudget ? parseFloat(maxBudget as string) : undefined;
    const parsedMinPrice = minPrice ? parseFloat(minPrice as string) : undefined;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice as string) : undefined;
    const parsedMinYear = minYear ? parseInt(minYear as string, 10) : undefined;
    const parsedMaxYear = maxYear ? parseInt(maxYear as string, 10) : undefined;
    const parsedMaxKm = maxKm ? parseInt(maxKm as string, 10) : undefined;
    const parsedCertified = certified !== undefined ? certified === 'true' : undefined;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 18));

    // Never show DRAFT cars to public customer requests
    const safeStatus = (status && status !== 'ALL' && status !== 'DRAFT') 
      ? (status as string) 
      : undefined;

    const allMatching = await dbService.cars.findMany({
      status: safeStatus,
      excludeDraft: true,
      brand: brand ? (brand as string) : undefined,
      model: model ? (model as string) : undefined,
      bodyType: bodyType ? (bodyType as string) : undefined,
      fuelType: fuelType ? (fuelType as string) : undefined,
      transmission: transmission ? (transmission as string) : undefined,
      city: city ? (city as string) : undefined,
      maxBudget: parsedMaxBudget,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      minYear: parsedMinYear,
      maxYear: parsedMaxYear,
      maxKm: parsedMaxKm,
      ownership: ownership ? (ownership as string) : undefined,
      certified: parsedCertified,
      searchQuery: searchQuery ? (searchQuery as string) : undefined,
      sortBy: sortBy ? (sortBy as string) : undefined
    });

    const total = allMatching.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCars = allMatching.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: paginatedCars.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      cars: paginatedCars
    });
  } catch (err: any) {
    console.error('Error fetching cars:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve car inventory'
    });
  }
});

// GET /api/cars/:id/similar - Similar cars recommendation
carsRouter.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const car = await dbService.cars.findById(id);

    if (!car || car.status === 'DRAFT') {
      res.status(404).json({ success: false, error: 'Vehicle not found or unavailable' });
      return;
    }

    // Find cars with same body type or same brand or close price, excluding current car
    const allAvailable = await dbService.cars.findMany({ status: 'AVAILABLE' });
    const similar = allAvailable
      .filter(c => c.id !== id)
      .map(c => {
        let score = 0;
        if (c.bodyType === car.bodyType) score += 4;
        if (c.brand === car.brand) score += 3;
        if (c.fuelType === car.fuelType) score += 2;
        const priceDiff = Math.abs(c.price - car.price);
        if (priceDiff <= 5) score += 2;
        return { car: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.car);

    res.json({
      success: true,
      cars: similar
    });
  } catch (err: any) {
    console.error('Error fetching similar cars:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve similar cars'
    });
  }
});

// GET /api/cars/:id - Single car details
carsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const car = await dbService.cars.findById(id);

    if (!car || car.status === 'DRAFT') {
      res.status(404).json({
        success: false,
        error: `Vehicle with ID '${id}' is not currently available or published`
      });
      return;
    }

    res.json({
      success: true,
      car
    });
  } catch (err: any) {
    console.error('Error fetching car by id:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve car details'
    });
  }
});
