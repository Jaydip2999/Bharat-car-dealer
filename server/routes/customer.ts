import { Router } from 'express';
import { dbService } from '../db.js';
import { rateLimitPublicForms } from '../middleware/auth.js';

export const customerRouter = Router();

// Apply public form rate limiting across all lead endpoints
customerRouter.use(rateLimitPublicForms);

// Helper for Indian phone number validation
function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  // Remove spaces, hyphens, parentheses, and leading +91 or 0
  const cleaned = phone.replace(/[\s\-\(\)]/g, '').replace(/^(\+91|91|0)/, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

// Helper for email validation
function isValidEmail(email: string): boolean {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/test-drives - Book a test drive
customerRouter.post('/test-drives', async (req, res) => {
  try {
    const { carId, fullName, phone, email, city, address, mode, date, timeSlot } = req.body;

    if (!carId || !fullName || !phone || !date || !timeSlot) {
      res.status(400).json({
        success: false,
        error: 'Vehicle, full name, 10-digit phone number, date, and preferred time slot are required.'
      });
      return;
    }

    if (fullName.trim().length < 2 || fullName.trim().length > 80) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid full name (2 to 80 characters).'
      });
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit mobile number (e.g., 9876543210).'
      });
      return;
    }

    if (email && !isValidEmail(email.trim())) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
      return;
    }

    // Verify car exists and is not draft
    const car = await dbService.cars.findById(carId);
    if (!car || car.status === 'DRAFT') {
      res.status(404).json({
        success: false,
        error: 'Selected vehicle is not available for test drive.'
      });
      return;
    }

    const booking = await dbService.testDrives.create({
      carId,
      fullName: fullName.trim().slice(0, 80),
      phone: phone.trim().slice(0, 15),
      email: email ? email.trim().slice(0, 100) : null,
      city: city ? city.trim().slice(0, 50) : (car.city || 'Hub'),
      address: address ? address.trim().slice(0, 250) : null,
      mode: mode === 'hub' ? 'hub' : 'doorstep',
      date: String(date).slice(0, 30),
      timeSlot: String(timeSlot).slice(0, 50),
      notes: `Booked via website for ${car.year} ${car.brand} ${car.model}`
    });

    res.status(201).json({
      success: true,
      message: 'Test drive booked successfully. A dealership representative will confirm shortly.',
      booking: {
        ...booking,
        carName: `${car.year} ${car.brand} ${car.model} ${car.variant}`
      }
    });
  } catch (err: any) {
    console.error('Error booking test drive:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to complete test drive booking.'
    });
  }
});

// POST /api/enquiries - General / car-specific enquiry
customerRouter.post('/enquiries', async (req, res) => {
  try {
    const { carId, name, phone, email, message, source } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({
        success: false,
        error: 'Name, phone number, and enquiry message are required.'
      });
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid name (2 to 80 characters).'
      });
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit mobile number.'
      });
      return;
    }

    if (email && !isValidEmail(email.trim())) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
      return;
    }

    if (carId) {
      const car = await dbService.cars.findById(carId);
      if (!car || car.status === 'DRAFT') {
        res.status(404).json({
          success: false,
          error: 'Selected vehicle is not found or is currently unavailable.'
        });
        return;
      }
    }

    const enquiry = await dbService.enquiries.create({
      carId: carId || null,
      name: name.trim().slice(0, 80),
      phone: phone.trim().slice(0, 15),
      email: email ? email.trim().slice(0, 100) : null,
      message: message.trim().slice(0, 1000),
      source: (source || 'website').slice(0, 50)
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our sales executive will call you within 30 minutes.',
      enquiry
    });
  } catch (err: any) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to submit your enquiry.'
    });
  }
});

// POST /api/sell-requests - Sell / evaluate your car
customerRouter.post('/sell-requests', async (req, res) => {
  try {
    const { name, phone, email, carBrand, carModel, year, kilometers, expectedPrice, city, message } = req.body;

    if (!name || !phone || !carBrand || !carModel || !year || !kilometers || !city) {
      res.status(400).json({
        success: false,
        error: 'Owner name, phone, car brand, model, year, kilometers, and city are required.'
      });
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid full name.'
      });
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit mobile number.'
      });
      return;
    }

    if (email && !isValidEmail(email.trim())) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
      return;
    }

    const parsedYear = parseInt(year, 10);
    const parsedKm = parseInt(kilometers, 10);
    const parsedPrice = expectedPrice !== undefined && expectedPrice !== null && expectedPrice !== '' 
      ? parseFloat(expectedPrice) 
      : null;

    if (parsedPrice !== null && (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 500)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid expected price in Lakhs (e.g. 5.5 for ₹5.50 Lakh).'
      });
      return;
    }

    if (isNaN(parsedYear) || parsedYear < 1990 || parsedYear > new Date().getFullYear() + 1) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid vehicle manufacturing year.'
      });
      return;
    }

    if (isNaN(parsedKm) || parsedKm < 0 || parsedKm > 1000000) {
      res.status(400).json({
        success: false,
        error: 'Please enter valid odometer reading in kilometers.'
      });
      return;
    }

    const request = await dbService.sellRequests.create({
      name: name.trim().slice(0, 80),
      phone: phone.trim().slice(0, 15),
      email: email ? email.trim().slice(0, 100) : null,
      carBrand: carBrand.trim().slice(0, 50),
      carModel: carModel.trim().slice(0, 50),
      year: parsedYear,
      kilometers: parsedKm,
      expectedPrice: parsedPrice,
      city: city.trim().slice(0, 50),
      message: message ? message.trim().slice(0, 1000) : null
    });

    res.status(201).json({
      success: true,
      message: 'Instant valuation request registered! Our doorstep evaluation engineer will contact you.',
      request
    });
  } catch (err: any) {
    console.error('Error submitting sell car request:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to register your car sale request.'
    });
  }
});
