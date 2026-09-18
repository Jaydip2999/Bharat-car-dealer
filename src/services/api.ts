import { Car, DashboardStats, TestDriveItem, EnquiryItem, SellRequestItem, AdminUser } from '../types';

const TOKEN_KEY = 'bharat_wheels_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Convert backend response car format to frontend Car format
export function normalizeCar(raw: any): Car {
  const priceInLakhs = raw.priceInLakhs !== undefined ? raw.priceInLakhs : (raw.price || 0);
  const primaryImage = raw.images && raw.images.length > 0
    ? (raw.images.find((img: any) => img.isPrimary) || raw.images[0]).imageUrl
    : raw.imageUrl;

  return {
    id: raw.id,
    stockId: raw.stockId || `BW-${raw.id}`,
    brand: raw.brand,
    model: raw.model,
    variant: raw.variant,
    bodyType: raw.bodyType,
    year: raw.year,
    kilometers: raw.kilometers,
    fuelType: raw.fuelType,
    transmission: raw.transmission,
    priceInLakhs,
    price: priceInLakhs,
    estimatedEmi: raw.estimatedEmi || Math.round(priceInLakhs * 100000 * 0.016),
    rto: raw.rto || 'DL-01',
    city: raw.city,
    ownership: raw.ownership || '1st Owner',
    insurance: raw.insurance || 'Comprehensive Valid Insurance',
    safetyRating: raw.safetyRating || 5,
    mileageArai: raw.mileageArai || raw.mileage || '17.0 km/l',
    mileage: raw.mileage || raw.mileageArai || '17.0 km/l',
    enginePower: raw.enginePower || '1.5L Engine',
    bootSpace: raw.bootSpace || '400 Litres',
    groundClearance: raw.groundClearance || '190 mm',
    inspectionScore: raw.inspectionScore || 98,
    certified: raw.certified !== false,
    warranty: raw.warranty || '1-Year Comprehensive Pan-India Warranty',
    color: raw.color || 'Pearl White',
    colorHex: raw.colorHex || '#475569',
    secondaryHex: raw.secondaryHex || '#0f172a',
    tag: raw.tag || 'Certified Selection',
    description: raw.description || '',
    status: raw.status || 'AVAILABLE',
    featured: Boolean(raw.featured),
    features: Array.isArray(raw.features) ? raw.features : [],
    images: Array.isArray(raw.images) ? raw.images : [],
    imageUrl: primaryImage,
    inspectionHighlights: raw.inspectionHighlights || {
      engineTransmission: 'Sealed & Factory Tuned Powertrain Tested',
      chassisFrame: 'Certified Non-Accidental Structural Integrity',
      tyresBrakes: '85%+ Remaining Tread on Tested Disc Brakes',
      electricalsBattery: 'Complete Electronic Diagnostics Healthy',
      rtoPaperwork: 'Single Owner, Clean RC with Fast-Track NOC'
    }
  };
}

export interface InventoryResponse {
  cars: Car[];
  count: number;
  total: number;
  page: number;
  totalPages: number;
}

export interface CarFilterParams {
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
  searchQuery?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const api = {
  // Public inventory - Paginated and filtered
  async getInventory(params?: CarFilterParams): Promise<InventoryResponse> {
    const query = new URLSearchParams();
    if (params?.brand && params.brand !== 'All') query.append('brand', params.brand);
    if (params?.model && params.model !== 'All') query.append('model', params.model);
    if (params?.bodyType && params.bodyType !== 'All') query.append('bodyType', params.bodyType);
    if (params?.fuelType && params.fuelType !== 'All') query.append('fuelType', params.fuelType);
    if (params?.transmission && params.transmission !== 'All') query.append('transmission', params.transmission);
    if (params?.city && params.city !== 'All Cities' && params.city !== 'All') query.append('city', params.city);
    if (params?.maxBudget) query.append('maxBudget', params.maxBudget.toString());
    if (params?.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params?.minYear) query.append('minYear', params.minYear.toString());
    if (params?.maxYear) query.append('maxYear', params.maxYear.toString());
    if (params?.maxKm) query.append('maxKm', params.maxKm.toString());
    if (params?.ownership) query.append('ownership', params.ownership);
    if (params?.certified !== undefined) query.append('certified', params.certified.toString());
    if (params?.searchQuery) query.append('searchQuery', params.searchQuery);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`/api/cars?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to load cars: ${res.statusText}`);
    }
    const data = await res.json();
    return {
      cars: (data.cars || []).map(normalizeCar),
      count: data.count || 0,
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1
    };
  },

  async getCars(params?: CarFilterParams): Promise<Car[]> {
    const resp = await this.getInventory(params);
    return resp.cars;
  },

  async getFeaturedCars(): Promise<Car[]> {
    const res = await fetch('/api/cars/featured');
    if (!res.ok) {
      throw new Error('Failed to load featured cars');
    }
    const data = await res.json();
    return (data.cars || []).map(normalizeCar);
  },

  async getCarById(id: string): Promise<Car> {
    const res = await fetch(`/api/cars/${id}`);
    if (!res.ok) {
      throw new Error('Car not found');
    }
    const data = await res.json();
    return normalizeCar(data.car);
  },

  async getSimilarCars(id: string): Promise<Car[]> {
    const res = await fetch(`/api/cars/${id}/similar`);
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return (data.cars || []).map(normalizeCar);
  },

  // Customer interactions
  async submitTestDrive(payload: {
    carId: string;
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address?: string;
    mode: 'doorstep' | 'hub';
    date: string;
    timeSlot: string;
  }) {
    const res = await fetch('/api/test-drives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to book test drive');
    }
    return data;
  },

  async submitEnquiry(payload: {
    carId?: string;
    name: string;
    phone: string;
    email?: string;
    message: string;
    source?: string;
  }) {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to submit enquiry');
    }
    return data;
  },

  async submitSellRequest(payload: {
    name: string;
    phone: string;
    email?: string;
    carBrand: string;
    carModel: string;
    year: number;
    kilometers: number;
    expectedPrice?: number;
    city: string;
    message?: string;
  }) {
    const res = await fetch('/api/sell-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to submit valuation request');
    }
    return data;
  },

  // Admin Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid credentials');
    }
    setStoredToken(data.token);
    return { token: data.token, user: data.user };
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        removeStoredToken();
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      removeStoredToken();
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  // Admin Dashboard & Management
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/admin/dashboard/stats', {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch dashboard stats');
    }
    return data.stats;
  },

  async getAdminCars(status?: string): Promise<Car[]> {
    const url = status ? `/api/admin/cars?status=${status}` : '/api/admin/cars';
    const res = await fetch(url, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load cars');
    }
    return (data.cars || []).map(normalizeCar);
  },

  async createAdminCar(payload: any): Promise<Car> {
    const res = await fetch('/api/admin/cars', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create car');
    }
    return normalizeCar(data.car);
  },

  async updateAdminCar(id: string, payload: any): Promise<Car> {
    const res = await fetch(`/api/admin/cars/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update car');
    }
    return normalizeCar(data.car);
  },

  async updateAdminCarStatus(id: string, status: string): Promise<Car> {
    const res = await fetch(`/api/admin/cars/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update car status');
    }
    return normalizeCar(data.car);
  },

  async deleteAdminCar(id: string): Promise<void> {
    const res = await fetch(`/api/admin/cars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete car');
    }
  },

  async getAdminTestDrives(): Promise<TestDriveItem[]> {
    const res = await fetch('/api/admin/test-drives', { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load test drives');
    }
    return data.bookings || [];
  },

  async updateTestDriveStatus(id: string, status?: string, notes?: string | null): Promise<TestDriveItem> {
    const res = await fetch(`/api/admin/test-drives/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update test drive status');
    }
    return data.booking;
  },

  async getAdminEnquiries(): Promise<EnquiryItem[]> {
    const res = await fetch('/api/admin/enquiries', { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load enquiries');
    }
    return data.enquiries || [];
  },

  async updateEnquiryStatus(id: string, status?: string, notes?: string | null): Promise<EnquiryItem> {
    const res = await fetch(`/api/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update enquiry status');
    }
    return data.enquiry;
  },

  async getAdminSellRequests(): Promise<SellRequestItem[]> {
    const res = await fetch('/api/admin/sell-requests', { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load sell requests');
    }
    return data.requests || [];
  },

  async updateSellRequestStatus(id: string, status?: string, notes?: string | null): Promise<SellRequestItem> {
    const res = await fetch(`/api/admin/sell-requests/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update sell request status');
    }
    return data.request;
  }
};
