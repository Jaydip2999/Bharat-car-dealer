import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { INITIAL_CARS, INITIAL_ADMIN, SeedCar } from './seedData.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

export interface StoredCar extends SeedCar {
  createdAt: string;
  updatedAt: string;
}

export interface StoredAdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface StoredTestDrive {
  id: string;
  carId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  city: string;
  address?: string | null;
  mode: string;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredEnquiry {
  id: string;
  carId?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'RESOLVED' | 'CLOSED';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSellRequest {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  carBrand: string;
  carModel: string;
  year: number;
  kilometers: number;
  expectedPrice?: number | null;
  city: string;
  message?: string | null;
  notes?: string | null;
  status: 'NEW' | 'CONTACTED' | 'INSPECTION_SCHEDULED' | 'VALUATION_DONE' | 'PURCHASED' | 'CLOSED' | 'PENDING' | 'EVALUATED' | 'OFFER_MADE' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

interface LocalStore {
  adminUsers: StoredAdminUser[];
  cars: StoredCar[];
  testDrives: StoredTestDrive[];
  enquiries: StoredEnquiry[];
  sellRequests: StoredSellRequest[];
}

const STORE_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(STORE_DIR, 'store.json');

let isPostgresConnected = false;
let localStore: LocalStore = {
  adminUsers: [],
  cars: [],
  testDrives: [],
  enquiries: [],
  sellRequests: []
};

function ensureStoreLoaded() {
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      localStore = JSON.parse(data);
    } else {
      seedLocalStore();
    }
  } catch (err) {
    seedLocalStore();
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    // Atomic file write via temporary file + atomic rename
    const tempFile = path.join(STORE_DIR, `store.json.tmp.${Date.now()}`);
    fs.writeFileSync(tempFile, JSON.stringify(localStore, null, 2), 'utf-8');
    fs.renameSync(tempFile, STORE_FILE);
  } catch (err) {
    console.error('Failed to save local store:', err);
  }
}

function seedLocalStore() {
  const now = new Date().toISOString();
  localStore = {
    adminUsers: [
      {
        id: 'admin-01',
        name: INITIAL_ADMIN.name,
        email: INITIAL_ADMIN.email,
        passwordHash: INITIAL_ADMIN.passwordHash,
        role: INITIAL_ADMIN.role,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null
      }
    ],
    cars: INITIAL_CARS.map(c => ({
      ...c,
      createdAt: now,
      updatedAt: now
    })),
    testDrives: [],
    enquiries: [],
    sellRequests: []
  };
  saveStore();
}

export async function initDatabase() {
  ensureStoreLoaded();

  try {
    // Attempt connecting to PostgreSQL via Prisma
    await prisma.$connect();
    isPostgresConnected = true;
    console.log('✅ Connected to PostgreSQL database via Prisma');

    // Auto-seed if database is empty
    const carCount = await prisma.car.count();
    if (carCount === 0) {
      console.log('🌱 Seeding initial inventory into PostgreSQL database...');
      for (const car of INITIAL_CARS) {
        await prisma.car.create({
          data: {
            id: car.id,
            stockId: car.stockId,
            brand: car.brand,
            model: car.model,
            variant: car.variant,
            bodyType: car.bodyType,
            year: car.year,
            kilometers: car.kilometers,
            fuelType: car.fuelType,
            transmission: car.transmission,
            price: car.price,
            estimatedEmi: car.estimatedEmi,
            city: car.city,
            rto: car.rto,
            ownership: car.ownership,
            insurance: car.insurance,
            safetyRating: car.safetyRating,
            mileage: car.mileage,
            enginePower: car.enginePower,
            bootSpace: car.bootSpace,
            groundClearance: car.groundClearance,
            inspectionScore: car.inspectionScore,
            certified: car.certified,
            warranty: car.warranty,
            color: car.color,
            tag: car.tag,
            description: car.description,
            status: car.status as any,
            featured: car.featured,
            features: {
              create: car.features.map(f => ({ feature: f }))
            },
            images: {
              create: car.images.map(img => ({
                imageUrl: img.imageUrl,
                altText: img.altText,
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder
              }))
            }
          }
        });
      }

      // Seed Admin
      const adminExists = await prisma.adminUser.findUnique({
        where: { email: INITIAL_ADMIN.email }
      });
      if (!adminExists) {
        await prisma.adminUser.create({
          data: {
            name: INITIAL_ADMIN.name,
            email: INITIAL_ADMIN.email,
            passwordHash: INITIAL_ADMIN.passwordHash,
            role: INITIAL_ADMIN.role
          }
        });
      }
      console.log('✅ PostgreSQL seeding completed successfully');
    }
  } catch (err: any) {
    isPostgresConnected = false;
    console.warn(`ℹ️  PostgreSQL not reachable at ${process.env.DATABASE_URL || 'default URL'}. Operating in local persistent store mode.`);
  }
}

// Unified Database Service Layer
export const dbService = {
  isPostgres() {
    return isPostgresConnected;
  },

  cars: {
    async findMany(filter?: {
      brand?: string;
      model?: string;
      bodyType?: string;
      fuelType?: string;
      transmission?: string;
      city?: string;
      maxBudget?: number;
      minPrice?: number;
      maxPrice?: number;
      minYear?: number;
      maxYear?: number;
      maxKm?: number;
      ownership?: string;
      certified?: boolean;
      status?: string;
      excludeDraft?: boolean;
      searchQuery?: string;
      featured?: boolean;
      sortBy?: string;
    }) {
      if (isPostgresConnected) {
        try {
          const where: any = {};
          if (filter?.status && filter.status !== 'ALL') {
            where.status = filter.status;
          } else if (filter?.excludeDraft) {
            where.status = { not: 'DRAFT' };
          }
          if (filter?.featured !== undefined) where.featured = filter.featured;
          if (filter?.certified !== undefined) where.certified = filter.certified;
          if (filter?.brand && filter.brand !== 'All') where.brand = { equals: filter.brand, mode: 'insensitive' };
          if (filter?.model && filter.model !== 'All') where.model = { contains: filter.model, mode: 'insensitive' };
          if (filter?.bodyType && filter.bodyType !== 'All') where.bodyType = filter.bodyType;
          if (filter?.city && filter.city !== 'All') where.city = { contains: filter.city, mode: 'insensitive' };
          if (filter?.ownership) where.ownership = filter.ownership;

          // Fuel type handling including Eco
          if (filter?.fuelType && filter.fuelType !== 'All') {
            if (filter.fuelType === 'Eco') {
              where.fuelType = { in: ['Electric', 'CNG', 'Hybrid'] };
            } else {
              where.fuelType = filter.fuelType;
            }
          }

          // Transmission handling
          if (filter?.transmission && filter.transmission !== 'All') {
            if (filter.transmission === 'Automatic') {
              where.transmission = { in: ['Automatic', 'DCT/DCA', 'AMT', 'e-CVT'] };
            } else {
              where.transmission = filter.transmission;
            }
          }

          // Price range
          const effectiveMaxPrice = filter?.maxPrice || filter?.maxBudget;
          if (filter?.minPrice !== undefined || effectiveMaxPrice !== undefined) {
            where.price = {};
            if (filter?.minPrice !== undefined) where.price.gte = filter.minPrice;
            if (effectiveMaxPrice !== undefined) where.price.lte = effectiveMaxPrice;
          }

          // Year range
          if (filter?.minYear !== undefined || filter?.maxYear !== undefined) {
            where.year = {};
            if (filter?.minYear !== undefined) where.year.gte = filter.minYear;
            if (filter?.maxYear !== undefined) where.year.lte = filter.maxYear;
          }

          // Max KM
          if (filter?.maxKm !== undefined) {
            where.kilometers = { lte: filter.maxKm };
          }

          // Search query matching
          if (filter?.searchQuery && filter.searchQuery.trim()) {
            const q = filter.searchQuery.trim();
            where.OR = [
              { brand: { contains: q, mode: 'insensitive' } },
              { model: { contains: q, mode: 'insensitive' } },
              { variant: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } },
              { rto: { contains: q, mode: 'insensitive' } },
              { fuelType: { contains: q, mode: 'insensitive' } },
              { stockId: { contains: q, mode: 'insensitive' } },
              { tag: { contains: q, mode: 'insensitive' } }
            ];
          }

          let orderBy: any = { createdAt: 'desc' };
          if (filter?.sortBy === 'price_asc') orderBy = { price: 'asc' };
          if (filter?.sortBy === 'price_desc') orderBy = { price: 'desc' };
          if (filter?.sortBy === 'km_asc') orderBy = { kilometers: 'asc' };
          if (filter?.sortBy === 'year_desc') orderBy = { year: 'desc' };
          if (filter?.sortBy === 'score_desc') orderBy = { inspectionScore: 'desc' };

          const cars = await prisma.car.findMany({
            where,
            orderBy,
            include: {
              images: { orderBy: { sortOrder: 'asc' } },
              features: true
            }
          });

          return cars.map(c => ({
            ...c,
            features: c.features.map(f => f.feature),
            images: c.images.map(img => ({
              id: img.id,
              imageUrl: img.imageUrl,
              altText: img.altText,
              isPrimary: img.isPrimary,
              sortOrder: img.sortOrder
            }))
          }));
        } catch (e) {
          console.error('Prisma query failed, falling back to local store:', e);
        }
      }

      // Fallback local query
      ensureStoreLoaded();
      let results = [...localStore.cars];

      if (filter?.status && filter.status !== 'ALL') {
        results = results.filter(c => c.status === filter.status);
      } else if (filter?.excludeDraft) {
        results = results.filter(c => c.status !== 'DRAFT');
      }
      if (filter?.featured !== undefined) {
        results = results.filter(c => c.featured === filter.featured);
      }
      if (filter?.certified !== undefined) {
        results = results.filter(c => c.certified === filter.certified);
      }
      if (filter?.brand && filter.brand !== 'All') {
        results = results.filter(c => c.brand.toLowerCase() === filter.brand!.toLowerCase());
      }
      if (filter?.model && filter.model !== 'All') {
        results = results.filter(c => c.model.toLowerCase().includes(filter.model!.toLowerCase()));
      }
      if (filter?.bodyType && filter.bodyType !== 'All') {
        results = results.filter(c => c.bodyType.toLowerCase() === filter.bodyType!.toLowerCase());
      }
      if (filter?.city && filter.city !== 'All') {
        results = results.filter(c => c.city.toLowerCase().includes(filter.city!.toLowerCase()));
      }
      if (filter?.ownership) {
        results = results.filter(c => c.ownership === filter.ownership);
      }

      // Fuel filter
      if (filter?.fuelType && filter.fuelType !== 'All') {
        if (filter.fuelType === 'Eco') {
          results = results.filter(c => ['Electric', 'CNG', 'Hybrid'].includes(c.fuelType));
        } else {
          results = results.filter(c => c.fuelType.toLowerCase() === filter.fuelType!.toLowerCase());
        }
      }

      // Transmission filter
      if (filter?.transmission && filter.transmission !== 'All') {
        if (filter.transmission === 'Automatic') {
          results = results.filter(c => c.transmission !== 'Manual');
        } else {
          results = results.filter(c => c.transmission.toLowerCase() === filter.transmission!.toLowerCase());
        }
      }

      // Price filter
      const effectiveMax = filter?.maxPrice || filter?.maxBudget;
      if (filter?.minPrice !== undefined) {
        results = results.filter(c => c.price >= filter.minPrice!);
      }
      if (effectiveMax !== undefined) {
        results = results.filter(c => c.price <= effectiveMax);
      }

      // Year filter
      if (filter?.minYear !== undefined) {
        results = results.filter(c => c.year >= filter.minYear!);
      }
      if (filter?.maxYear !== undefined) {
        results = results.filter(c => c.year <= filter.maxYear!);
      }

      // Max KM
      if (filter?.maxKm !== undefined) {
        results = results.filter(c => c.kilometers <= filter.maxKm!);
      }

      // Search query
      if (filter?.searchQuery && filter.searchQuery.trim()) {
        const q = filter.searchQuery.trim().toLowerCase();
        results = results.filter(c => 
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.variant.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.rto.toLowerCase().includes(q) ||
          c.fuelType.toLowerCase().includes(q) ||
          (c.stockId && c.stockId.toLowerCase().includes(q)) ||
          (c.tag && c.tag.toLowerCase().includes(q))
        );
      }

      if (filter?.sortBy === 'price_asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (filter?.sortBy === 'price_desc') {
        results.sort((a, b) => b.price - a.price);
      } else if (filter?.sortBy === 'km_asc') {
        results.sort((a, b) => a.kilometers - b.kilometers);
      } else if (filter?.sortBy === 'year_desc') {
        results.sort((a, b) => b.year - a.year);
      } else if (filter?.sortBy === 'score_desc') {
        results.sort((a, b) => b.inspectionScore - a.inspectionScore);
      }

      return results;
    },

    async findById(id: string) {
      if (isPostgresConnected) {
        try {
          const car = await prisma.car.findUnique({
            where: { id },
            include: {
              images: { orderBy: { sortOrder: 'asc' } },
              features: true
            }
          });
          if (car) {
            return {
              ...car,
              features: car.features.map(f => f.feature),
              images: car.images
            };
          }
        } catch (e) {
          console.error('Prisma findById failed:', e);
        }
      }

      ensureStoreLoaded();
      return localStore.cars.find(c => c.id === id) || null;
    },

    async create(data: Omit<StoredCar, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
      const now = new Date().toISOString();
      const id = data.id || `car-${Date.now()}`;

      if (isPostgresConnected) {
        try {
          const created = await prisma.car.create({
            data: {
              id,
              stockId: data.stockId,
              brand: data.brand,
              model: data.model,
              variant: data.variant,
              bodyType: data.bodyType,
              year: data.year,
              kilometers: data.kilometers,
              fuelType: data.fuelType,
              transmission: data.transmission,
              price: data.price,
              estimatedEmi: data.estimatedEmi,
              city: data.city,
              rto: data.rto,
              ownership: data.ownership,
              insurance: data.insurance,
              safetyRating: data.safetyRating,
              mileage: data.mileage,
              enginePower: data.enginePower,
              bootSpace: data.bootSpace,
              groundClearance: data.groundClearance,
              inspectionScore: data.inspectionScore,
              certified: data.certified,
              warranty: data.warranty,
              color: data.color,
              tag: data.tag,
              description: data.description || '',
              status: data.status as any,
              featured: data.featured,
              features: {
                create: (data.features || []).map(f => ({ feature: f }))
              },
              images: {
                create: (data.images || []).map(img => ({
                  imageUrl: img.imageUrl,
                  altText: img.altText || '',
                  isPrimary: img.isPrimary || false,
                  sortOrder: img.sortOrder || 0
                }))
              }
            },
            include: {
              images: true,
              features: true
            }
          });

          return {
            ...created,
            features: created.features.map(f => f.feature),
            images: created.images
          };
        } catch (e) {
          console.error('Prisma create car failed:', e);
        }
      }

      ensureStoreLoaded();
      const newCar: StoredCar = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now
      };
      localStore.cars.unshift(newCar);
      saveStore();
      return newCar;
    },

    async update(id: string, data: Partial<StoredCar>) {
      const now = new Date().toISOString();

      if (isPostgresConnected) {
        try {
          const updateData: any = { ...data };
          delete updateData.id;
          delete updateData.createdAt;
          delete updateData.images;
          delete updateData.features;

          if (data.features) {
            await prisma.carFeature.deleteMany({ where: { carId: id } });
            await prisma.carFeature.createMany({
              data: data.features.map(f => ({ carId: id, feature: f }))
            });
          }

          if (data.images) {
            await prisma.carImage.deleteMany({ where: { carId: id } });
            await prisma.carImage.createMany({
              data: data.images.map(img => ({
                carId: id,
                imageUrl: img.imageUrl,
                altText: img.altText || '',
                isPrimary: img.isPrimary || false,
                sortOrder: img.sortOrder || 0
              }))
            });
          }

          const updated = await prisma.car.update({
            where: { id },
            data: updateData,
            include: {
              images: true,
              features: true
            }
          });

          return {
            ...updated,
            features: updated.features.map(f => f.feature),
            images: updated.images
          };
        } catch (e) {
          console.error('Prisma update car failed:', e);
        }
      }

      ensureStoreLoaded();
      const index = localStore.cars.findIndex(c => c.id === id);
      if (index === -1) return null;

      localStore.cars[index] = {
        ...localStore.cars[index],
        ...data,
        updatedAt: now
      };
      saveStore();
      return localStore.cars[index];
    },

    async delete(id: string) {
      if (isPostgresConnected) {
        try {
          await prisma.car.delete({ where: { id } });
          return true;
        } catch (e) {
          console.error('Prisma delete car failed:', e);
        }
      }

      ensureStoreLoaded();
      const prevLength = localStore.cars.length;
      localStore.cars = localStore.cars.filter(c => c.id !== id);
      saveStore();
      return localStore.cars.length < prevLength;
    },

    async updateStatus(id: string, status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DRAFT') {
      return this.update(id, { status });
    }
  },

  adminUsers: {
    async findByEmail(email: string) {
      if (isPostgresConnected) {
        try {
          const user = await prisma.adminUser.findUnique({ where: { email } });
          if (user) return user;
        } catch (e) {
          console.error('Prisma find admin failed:', e);
        }
      }

      ensureStoreLoaded();
      return localStore.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    async findById(id: string) {
      if (isPostgresConnected) {
        try {
          const user = await prisma.adminUser.findUnique({ where: { id } });
          if (user) return user;
        } catch (e) {
          console.error('Prisma find admin by id failed:', e);
        }
      }

      ensureStoreLoaded();
      return localStore.adminUsers.find(u => u.id === id) || null;
    },

    async updateLastLogin(id: string) {
      const now = new Date().toISOString();
      if (isPostgresConnected) {
        try {
          await prisma.adminUser.update({
            where: { id },
            data: { lastLoginAt: new Date() }
          });
          return;
        } catch (e) {}
      }

      ensureStoreLoaded();
      const user = localStore.adminUsers.find(u => u.id === id);
      if (user) {
        user.lastLoginAt = now;
        saveStore();
      }
    }
  },

  testDrives: {
    async findMany() {
      if (isPostgresConnected) {
        try {
          return await prisma.testDriveBooking.findMany({
            orderBy: { createdAt: 'desc' },
            include: { car: { select: { id: true, brand: true, model: true, variant: true, stockId: true } } }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      return localStore.testDrives.map(td => {
        const car = localStore.cars.find(c => c.id === td.carId);
        return {
          ...td,
          car: car ? { id: car.id, brand: car.brand, model: car.model, variant: car.variant, stockId: car.stockId } : null
        };
      });
    },

    async create(data: Omit<StoredTestDrive, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      const now = new Date().toISOString();
      const id = `td-${Date.now()}`;

      if (isPostgresConnected) {
        try {
          return await prisma.testDriveBooking.create({
            data: {
              id,
              carId: data.carId,
              fullName: data.fullName,
              phone: data.phone,
              email: data.email || null,
              city: data.city,
              address: data.address || null,
              mode: data.mode,
              date: data.date,
              timeSlot: data.timeSlot,
              status: 'PENDING'
            }
          });
        } catch (e) {
          console.error('Prisma create test drive failed:', e);
        }
      }

      ensureStoreLoaded();
      const newBooking: StoredTestDrive = {
        ...data,
        id,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now
      };
      localStore.testDrives.unshift(newBooking);
      saveStore();
      return newBooking;
    },

    async updateStatus(id: string, status: StoredTestDrive['status'], notes?: string | null) {
      const now = new Date().toISOString();
      if (isPostgresConnected) {
        try {
          return await prisma.testDriveBooking.update({
            where: { id },
            data: {
              status,
              ...(notes !== undefined ? { notes } : {})
            }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      const booking = localStore.testDrives.find(t => t.id === id);
      if (booking) {
        booking.status = status;
        if (notes !== undefined) {
          booking.notes = notes;
        }
        booking.updatedAt = now;
        saveStore();
        return booking;
      }
      return null;
    }
  },

  enquiries: {
    async findMany() {
      if (isPostgresConnected) {
        try {
          return await prisma.enquiry.findMany({
            orderBy: { createdAt: 'desc' },
            include: { car: { select: { id: true, brand: true, model: true, variant: true } } }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      return localStore.enquiries.map(enq => {
        const car = enq.carId ? localStore.cars.find(c => c.id === enq.carId) : null;
        return {
          ...enq,
          car: car ? { id: car.id, brand: car.brand, model: car.model, variant: car.variant } : null
        };
      });
    },

    async create(data: Omit<StoredEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      const now = new Date().toISOString();
      const id = `enq-${Date.now()}`;

      if (isPostgresConnected) {
        try {
          return await prisma.enquiry.create({
            data: {
              id,
              carId: data.carId || null,
              name: data.name,
              phone: data.phone,
              email: data.email || null,
              message: data.message,
              source: data.source || 'website',
              status: 'NEW',
              notes: data.notes || null
            }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      const newEnquiry: StoredEnquiry = {
        ...data,
        id,
        status: 'NEW',
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now
      };
      localStore.enquiries.unshift(newEnquiry);
      saveStore();
      return newEnquiry;
    },

    async updateStatus(id: string, status: StoredEnquiry['status'], notes?: string | null) {
      const now = new Date().toISOString();
      if (isPostgresConnected) {
        try {
          return await prisma.enquiry.update({
            where: { id },
            data: {
              status,
              ...(notes !== undefined ? { notes } : {})
            }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      const enq = localStore.enquiries.find(e => e.id === id);
      if (enq) {
        enq.status = status;
        if (notes !== undefined) {
          enq.notes = notes;
        }
        enq.updatedAt = now;
        saveStore();
        return enq;
      }
      return null;
    }
  },

  sellRequests: {
    async findMany() {
      if (isPostgresConnected) {
        try {
          return await prisma.sellCarRequest.findMany({
            orderBy: { createdAt: 'desc' }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      return localStore.sellRequests;
    },

    async create(data: Omit<StoredSellRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      const now = new Date().toISOString();
      const id = `sell-${Date.now()}`;

      if (isPostgresConnected) {
        try {
          return await prisma.sellCarRequest.create({
            data: {
              id,
              name: data.name,
              phone: data.phone,
              email: data.email || null,
              carBrand: data.carBrand,
              carModel: data.carModel,
              year: data.year,
              kilometers: data.kilometers,
              expectedPrice: data.expectedPrice || null,
              city: data.city,
              message: data.message || null,
              notes: data.notes || null,
              status: 'PENDING'
            }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      const newRequest: StoredSellRequest = {
        ...data,
        id,
        status: 'PENDING',
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now
      };
      localStore.sellRequests.unshift(newRequest);
      saveStore();
      return newRequest;
    },

    async updateStatus(id: string, status: StoredSellRequest['status'], notes?: string | null) {
      const now = new Date().toISOString();
      if (isPostgresConnected) {
        try {
          return await prisma.sellCarRequest.update({
            where: { id },
            data: {
              status,
              ...(notes !== undefined ? { notes } : {})
            }
          });
        } catch (e) {}
      }

      ensureStoreLoaded();
      const req = localStore.sellRequests.find(r => r.id === id);
      if (req) {
        req.status = status;
        if (notes !== undefined) {
          req.notes = notes;
        }
        req.updatedAt = now;
        saveStore();
        return req;
      }
      return null;
    }
  },

  async getDashboardStats() {
    const cars = await this.cars.findMany();
    const testDrives = await this.testDrives.findMany();
    const enquiries = await this.enquiries.findMany();
    const sellRequests = await this.sellRequests.findMany();

    const totalCars = cars.length;
    const availableCars = cars.filter(c => c.status === 'AVAILABLE').length;
    const reservedCars = cars.filter(c => c.status === 'RESERVED').length;
    const soldCars = cars.filter(c => c.status === 'SOLD').length;
    const draftCars = cars.filter(c => c.status === 'DRAFT').length;
    const pendingTestDrives = testDrives.filter(t => t.status === 'PENDING').length;
    const newEnquiries = enquiries.filter(e => e.status === 'NEW').length;
    const pendingSellRequests = sellRequests.filter(s => s.status === 'PENDING' || s.status === 'NEW').length;

    const totalInventoryValueLakhs = cars
      .filter(c => c.status === 'AVAILABLE')
      .reduce((acc, c) => acc + (c.price || 0), 0);

    const recentEnquiries = enquiries.slice(0, 5);
    const upcomingTestDrives = testDrives.slice(0, 5);
    const recentlyAddedCars = [...cars].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5);
    const recentlyUpdatedCars = [...cars].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, 5);

    return {
      totalCars,
      availableCars,
      reservedCars,
      soldCars,
      draftCars,
      pendingTestDrives,
      newEnquiries,
      pendingSellRequests,
      totalInventoryValueLakhs: Math.round(totalInventoryValueLakhs * 100) / 100,
      databaseType: isPostgresConnected ? 'PostgreSQL (Prisma)' : 'Local Persistent Store',
      recentEnquiries,
      upcomingTestDrives,
      recentlyAddedCars,
      recentlyUpdatedCars
    };
  }
};
