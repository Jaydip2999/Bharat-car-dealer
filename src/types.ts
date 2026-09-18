export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MUV' | '4x4';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic' | 'DCT/DCA' | 'AMT' | 'e-CVT';
export type CarStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DRAFT';

export interface CarImage {
  id?: string;
  carId?: string;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface Car {
  id: string;
  stockId?: string;
  brand: string;
  model: string;
  variant: string;
  bodyType: BodyType;
  year: number;
  kilometers: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  priceInLakhs: number;
  price?: number; // Backend alias
  estimatedEmi: number;
  rto: string;
  city: string;
  ownership: '1st Owner' | '2nd Owner';
  insurance: string;
  safetyRating: number; // 4 or 5 stars
  mileageArai: string;
  mileage?: string;
  enginePower: string;
  bootSpace: string;
  groundClearance: string;
  inspectionScore: number; // 0 - 100
  certified: boolean;
  warranty: string;
  features: string[];
  color: string;
  colorHex?: string;
  secondaryHex?: string;
  tag: string;
  description?: string;
  status?: CarStatus;
  featured?: boolean;
  images?: CarImage[];
  imageUrl?: string;
  inspectionHighlights?: {
    engineTransmission: string;
    chassisFrame: string;
    tyresBrakes: string;
    electricalsBattery: string;
    rtoPaperwork: string;
  };
}

export interface FilterState {
  bodyType: string;
  fuelType: string;
  transmission: string;
  maxBudget: number;
  searchQuery: string;
  city: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'km_asc' | 'year_desc' | 'score_desc';
}

export interface TestDriveBooking {
  id?: string;
  carId: string;
  carName: string;
  mode: 'doorstep' | 'hub';
  date: string;
  timeSlot: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  bookingRef?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER';
}

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  reservedCars: number;
  soldCars: number;
  draftCars: number;
  pendingTestDrives: number;
  newEnquiries: number;
  pendingSellRequests: number;
  totalInventoryValueLakhs: number;
  databaseType: string;
  recentEnquiries?: EnquiryItem[];
  upcomingTestDrives?: TestDriveItem[];
  recentlyAddedCars?: Car[];
  recentlyUpdatedCars?: Car[];
}

export interface TestDriveItem {
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
  car?: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    stockId: string;
  } | null;
}

export interface EnquiryItem {
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
  car?: {
    id: string;
    brand: string;
    model: string;
    variant: string;
  } | null;
}

export interface SellRequestItem {
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
  status: 'NEW' | 'CONTACTED' | 'INSPECTION_SCHEDULED' | 'VALUATION_DONE' | 'PURCHASED' | 'CLOSED' | 'PENDING' | 'EVALUATED' | 'OFFER_MADE' | 'ACCEPTED' | 'REJECTED';
  notes?: string | null;
  createdAt: string;
}
