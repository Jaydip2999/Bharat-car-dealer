import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Heart, 
  CarFront, 
  ArrowUpDown,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Car, FilterState } from './types';
import { INDIAN_CARS } from './data/cars';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CarCard } from './components/CarCard';
import { CarDetailModal } from './components/CarDetailModal';
import { CarDetailPage } from './components/CarDetailPage';
import { TestDriveModal } from './components/TestDriveModal';
import { EmiCalculator } from './components/EmiCalculator';
import { SellCarValuation } from './components/SellCarValuation';
import { CarComparisonDrawer } from './components/CarComparisonDrawer';
import { DealershipTrust } from './components/DealershipTrust';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { api } from './services/api';
import { DEALERSHIP_CONFIG, formatWhatsAppLink } from './config/dealership';

export default function App() {
  // Navigation / URL Route state
  const parseCurrentRoute = () => {
    if (typeof window === 'undefined') return { isAdmin: false, carId: null };
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const isAdmin = pathname.startsWith('/admin') || hash === '#admin';
    let carId: string | null = null;
    if (pathname.startsWith('/cars/')) {
      carId = pathname.replace('/cars/', '').split('/')[0] || null;
    }
    return { isAdmin, carId };
  };

  const [isAdminView, setIsAdminView] = useState<boolean>(() => parseCurrentRoute().isAdmin);
  const [activeCarDetailId, setActiveCarDetailId] = useState<string | null>(() => parseCurrentRoute().carId);

  // Dealership Live Inventory State
  const [inventoryCars, setInventoryCars] = useState<Car[]>(INDIAN_CARS);
  const [totalCarsCount, setTotalCarsCount] = useState<number>(INDIAN_CARS.length);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingCars, setIsLoadingCars] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Dealership Location State
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('All');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(35); // in Lakhs
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('featured');
  const [activeFilterChip, setActiveFilterChip] = useState<string>('all');
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState<boolean>(false);

  // Comparison & Persistent Bookmark State
  const [comparedCars, setComparedCars] = useState<Car[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('bharat_wheels_shortlist');
      return stored ? JSON.parse(stored) : ['bw-1', 'bw-3'];
    } catch {
      return ['bw-1', 'bw-3'];
    }
  });

  // Recently Viewed Cars
  const [recentlyViewedCars, setRecentlyViewedCars] = useState<Car[]>([]);

  // Active Modals
  const [selectedCarForQuickDetails, setSelectedCarForQuickDetails] = useState<Car | null>(null);
  const [selectedCarForTestDrive, setSelectedCarForTestDrive] = useState<Car | null>(null);
  const [presetEmiCar, setPresetEmiCar] = useState<{ price: number; name: string } | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCarForEnquiry, setSelectedCarForEnquiry] = useState<Car | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Persist shortlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bharat_wheels_shortlist', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const { isAdmin, carId } = parseCurrentRoute();
      setIsAdminView(isAdmin);
      setActiveCarDetailId(carId);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch Live Inventory from Server with real Backend Filters
  const fetchInventory = useCallback(async () => {
    setIsLoadingCars(true);
    setFetchError(null);
    try {
      const response = await api.getInventory({
        searchQuery: debouncedSearch.trim() || undefined,
        bodyType: selectedBodyType !== 'All' ? selectedBodyType : undefined,
        fuelType: selectedFuelType !== 'All' ? selectedFuelType : undefined,
        transmission: selectedTransmission !== 'All' ? selectedTransmission : undefined,
        city: selectedCity !== 'All Cities' && selectedCity !== 'All' ? selectedCity : undefined,
        maxBudget: maxBudget < 35 ? maxBudget : undefined,
        sortBy,
        page: currentPage,
        limit: 12
      });

      setInventoryCars(response.cars);
      setTotalCarsCount(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.warn('Backend inventory fetch issue, falling back:', err);
      setFetchError(err.message || 'Unable to connect to inventory service.');
    } finally {
      setIsLoadingCars(false);
    }
  }, [debouncedSearch, selectedBodyType, selectedFuelType, selectedTransmission, selectedCity, maxBudget, sortBy, currentPage]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Load recently viewed cars from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bharat_wheels_recent_views');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (Array.isArray(ids) && ids.length > 0) {
          Promise.all(ids.slice(0, 4).map(id => api.getCarById(id).catch(() => null)))
            .then(results => {
              const valid = results.filter((c): c is Car => c !== null);
              setRecentlyViewedCars(valid);
            });
        }
      }
    } catch {
      // ignore
    }
  }, [activeCarDetailId]);

  // Navigation handlers
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
    setActiveCarDetailId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
    setActiveCarDetailId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCar = (carId: string) => {
    window.history.pushState({}, '', `/cars/${carId}`);
    setActiveCarDetailId(carId);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Segment Chip Filter Handler
  const handleSelectQuickFilter = (type: string) => {
    setActiveFilterChip(type);
    setShowOnlyShortlisted(false);
    setCurrentPage(1);

    if (type === 'all') {
      setSelectedBodyType('All');
      setSelectedFuelType('All');
      setSelectedTransmission('All');
      setMaxBudget(35);
      setSearchQuery('');
    } else if (type === 'suv') {
      setSelectedBodyType('SUV');
      setSelectedFuelType('All');
      setSelectedTransmission('All');
      setMaxBudget(35);
    } else if (type === 'budget') {
      setSelectedBodyType('All');
      setSelectedFuelType('All');
      setSelectedTransmission('All');
      setMaxBudget(12);
    } else if (type === 'eco') {
      setSelectedBodyType('All');
      setSelectedFuelType('Eco');
      setSelectedTransmission('All');
      setMaxBudget(35);
    } else if (type === 'automatic') {
      setSelectedBodyType('All');
      setSelectedFuelType('All');
      setSelectedTransmission('Automatic');
      setMaxBudget(35);
    } else if (type === 'offroad') {
      setSelectedBodyType('4x4');
      setSelectedFuelType('All');
      setSelectedTransmission('All');
      setMaxBudget(35);
    }

    const el = document.getElementById('inventory-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedBodyType('All');
    setSelectedFuelType('All');
    setSelectedTransmission('All');
    setSelectedCity('All Cities');
    setMaxBudget(35);
    setSearchQuery('');
    setDebouncedSearch('');
    setActiveFilterChip('all');
    setShowOnlyShortlisted(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (carId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  // Toggle Compare
  const handleToggleCompare = (car: Car) => {
    setComparedCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) {
        return prev.filter((c) => c.id !== car.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 vehicles side by side. Please remove one first.');
        return prev;
      }
      return [...prev, car];
    });
  };

  // Navigate to sections
  const handleNavigate = (sectionId: string) => {
    if (activeCarDetailId || isAdminView) {
      navigateToStore();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCarForEmi = (car: Car) => {
    setPresetEmiCar({
      price: car.priceInLakhs,
      name: `${car.year} ${car.brand} ${car.model}`
    });
    handleNavigate('emi-calculator-section');
  };

  // Cars to display (filtered by shortlisted if toggle enabled)
  const displayedCars = showOnlyShortlisted
    ? inventoryCars.filter((c) => bookmarkedIds.includes(c.id))
    : inventoryCars;

  // View: Admin Portal
  if (isAdminView) {
    return <AdminPanel onBackToStore={navigateToStore} />;
  }

  // View: Dedicated Car Detail Page
  if (activeCarDetailId) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header
          selectedCity={selectedCity}
          onSelectCity={(city) => {
            setSelectedCity(city);
            navigateToStore();
          }}
          compareCount={comparedCars.length}
          onOpenCompare={() => setIsCompareOpen(true)}
          onNavigate={handleNavigate}
          onOpenAdmin={navigateToAdmin}
        />

        <CarDetailPage
          carId={activeCarDetailId}
          onBack={navigateToStore}
          onBookTestDrive={setSelectedCarForTestDrive}
          onEnquire={(car) => {
            setSelectedCarForEnquiry(car);
            setIsEnquiryOpen(true);
          }}
          onSelectCar={navigateToCar}
          isBookmarked={bookmarkedIds.includes(activeCarDetailId)}
          onToggleBookmark={handleToggleBookmark}
          isCompared={comparedCars.some((c) => c.id === activeCarDetailId)}
          onToggleCompare={handleToggleCompare}
        />

        <DealershipTrust />
        <Footer onOpenAdmin={navigateToAdmin} />

        {/* Floating WhatsApp & Callback Buttons */}
        <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
          <button
            onClick={() => {
              setSelectedCarForEnquiry(null);
              setIsEnquiryOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-xs font-bold"
            title="Ask / Enquire"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ask / Enquire</span>
          </button>

          <a
            id="floating-whatsapp-trigger"
            href={formatWhatsAppLink('Hello Bharat Wheels, I need information regarding a vehicle on your website.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl transition-all duration-200 hover:scale-105"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="hidden sm:inline text-xs font-bold pr-1">Chat with Dealer</span>
          </a>
        </div>

        {/* Modals for Detail Page */}
        <TestDriveModal
          car={selectedCarForTestDrive}
          onClose={() => setSelectedCarForTestDrive(null)}
          defaultCity={selectedCity}
        />

        <EnquiryModal
          isOpen={isEnquiryOpen}
          car={selectedCarForEnquiry}
          onClose={() => {
            setIsEnquiryOpen(false);
            setSelectedCarForEnquiry(null);
          }}
        />

        <CarComparisonDrawer
          comparedCars={comparedCars}
          onRemoveCar={(carId) => setComparedCars((prev) => prev.filter((c) => c.id !== carId))}
          onClearAll={() => setComparedCars([])}
          onBookTestDrive={setSelectedCarForTestDrive}
          isOpen={isCompareOpen}
          onToggleOpen={() => setIsCompareOpen(!isCompareOpen)}
        />
      </div>
    );
  }

  // View: Main Dealership Portal
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setCurrentPage(1);
        }}
        compareCount={comparedCars.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onNavigate={handleNavigate}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Hero Section with Quick Segment Filters */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectQuickFilter={handleSelectQuickFilter}
        activeFilterChip={activeFilterChip}
      />

      {/* Main Inventory Hub Section */}
      <main id="inventory-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Inventory Header & Sorting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Certified Pre-Owned &amp; New Inventory
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {totalCarsCount} Total Vehicles
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              210-point certified inspection, verified RTO ownership papers, 7-day money back &amp; pan-India warranty
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Shortlist Filter Toggle */}
            <button
              onClick={() => setShowOnlyShortlisted(!showOnlyShortlisted)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                showOnlyShortlisted
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyShortlisted ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
              <span>Shortlisted ({bookmarkedIds.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                id="inventory-sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Hub Deals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="km_asc">Odometer: Lowest KM</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="score_desc">Inspection Score: Highest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Refine Inventory Filters</span>
            </div>

            {(selectedBodyType !== 'All' ||
              selectedFuelType !== 'All' ||
              selectedTransmission !== 'All' ||
              selectedCity !== 'All Cities' ||
              maxBudget < 35 ||
              searchQuery ||
              showOnlyShortlisted) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Body Type */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Body Silhouette
              </label>
              <select
                id="filter-bodytype-select"
                value={selectedBodyType}
                onChange={(e) => {
                  setSelectedBodyType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
              >
                <option value="All">All Body Types</option>
                <option value="SUV">Compact &amp; Mid SUV</option>
                <option value="Sedan">Sedan (Executive &amp; Family)</option>
                <option value="Hatchback">Hatchback &amp; City Compact</option>
                <option value="MUV">MUV (7-Seater Family)</option>
                <option value="4x4">4x4 Offroad Enthusiast</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Fuel Mechanism
              </label>
              <select
                id="filter-fuel-select"
                value={selectedFuelType}
                onChange={(e) => {
                  setSelectedFuelType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
              >
                <option value="All">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">Factory Fitted CNG</option>
                <option value="Electric">Electric Vehicle (EV)</option>
                <option value="Hybrid">Strong Hybrid (e:HEV)</option>
                <option value="Eco">Eco Green (EV, CNG, Hybrid)</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Transmission Mode
              </label>
              <select
                id="filter-transmission-select"
                value={selectedTransmission}
                onChange={(e) => {
                  setSelectedTransmission(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
              >
                <option value="All">All Transmissions</option>
                <option value="Manual">Manual Transmission</option>
                <option value="Automatic">Automatic (AT / DCA / e-CVT / AMT)</option>
                <option value="DCT/DCA">Dual Clutch (DCT/DCA)</option>
                <option value="AMT">Automated Manual (AMT/AGS)</option>
              </select>
            </div>

            {/* Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Max Budget
                </label>
                <span className="text-xs font-extrabold text-amber-600">
                  {maxBudget >= 35 ? 'Above ₹30 Lakh' : `Up to ₹${maxBudget.toFixed(1)} Lakh`}
                </span>
              </div>
              <input
                id="filter-budget-slider"
                type="range"
                min="8"
                max="35"
                step="1"
                value={maxBudget}
                onChange={(e) => {
                  setMaxBudget(parseFloat(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹8 Lakh</span>
                <span>₹20 Lakh</span>
                <span>₹35+ Lakh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{fetchError} Showing certified vehicles from backup catalog.</span>
            </div>
            <button
              onClick={fetchInventory}
              className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 font-bold text-amber-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoadingCars ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="w-full h-44 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="h-7 bg-slate-100 rounded" />
                  <div className="h-7 bg-slate-100 rounded" />
                  <div className="h-7 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedCars.length > 0 ? (
          <>
            {/* Cars Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isCompared={comparedCars.some((c) => c.id === car.id)}
                  onToggleCompare={handleToggleCompare}
                  isBookmarked={bookmarkedIds.includes(car.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectCarDetails={() => navigateToCar(car.id)}
                  onBookTestDrive={setSelectedCarForTestDrive}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-medium">
                  Showing Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({totalCarsCount} total certified vehicles)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      const el = document.getElementById('inventory-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => {
                        setCurrentPage(pg);
                        const el = document.getElementById('inventory-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                        currentPage === pg
                          ? 'bg-slate-900 text-amber-400 shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      const el = document.getElementById('inventory-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty Search State */
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <CarFront className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                No matching vehicles found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find any certified car matching your current filter criteria. Try adjusting your budget or clearing filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="py-2.5 px-5 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs transition hover:bg-slate-800 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Recently Viewed Strip */}
        {recentlyViewedCars.length > 0 && !showOnlyShortlisted && (
          <div className="pt-8 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Recently Viewed by You</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentlyViewedCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => navigateToCar(car.id)}
                  className="bg-white rounded-xl border border-slate-200 p-2.5 hover:shadow-md transition cursor-pointer flex items-center gap-2.5 group"
                >
                  <div className="w-14 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={car.imageUrl}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-[11px] font-semibold text-amber-600">
                      ₹{car.price} Lakh
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Auto Loan EMI Calculator Section */}
      <EmiCalculator
        presetCarPrice={presetEmiCar?.price}
        carName={presetEmiCar?.name}
      />

      {/* Sell Your Car Section */}
      <SellCarValuation />

      {/* Dealership Guarantees, 210-pt Inspection & Showrooms */}
      <DealershipTrust />

      {/* Footer */}
      <Footer onOpenAdmin={navigateToAdmin} />

      {/* Floating Action Buttons: Call, Enquiry & WhatsApp */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        <button
          onClick={() => {
            setSelectedCarForEnquiry(null);
            setIsEnquiryOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-xs font-bold"
          title="Send Dealership Enquiry"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Ask / Enquire</span>
        </button>

        <a
          id="floating-whatsapp-trigger"
          href={formatWhatsAppLink('Hello Bharat Wheels, I am looking for a certified car.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl transition-all duration-200 hover:scale-105"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline text-xs font-bold pr-1">Chat with Dealer</span>
        </a>
      </div>

      {/* Car Comparison Drawer */}
      <CarComparisonDrawer
        comparedCars={comparedCars}
        onRemoveCar={(carId) =>
          setComparedCars((prev) => prev.filter((c) => c.id !== carId))
        }
        onClearAll={() => setComparedCars([])}
        onBookTestDrive={setSelectedCarForTestDrive}
        isOpen={isCompareOpen}
        onToggleOpen={() => setIsCompareOpen(!isCompareOpen)}
      />

      {/* Quick Inspection Modal */}
      <CarDetailModal
        car={selectedCarForQuickDetails}
        onClose={() => setSelectedCarForQuickDetails(null)}
        onBookTestDrive={setSelectedCarForTestDrive}
        onSelectForEmi={handleSelectCarForEmi}
        onEnquire={(car) => {
          setSelectedCarForEnquiry(car);
          setIsEnquiryOpen(true);
        }}
      />

      {/* Test Drive Booking Modal */}
      <TestDriveModal
        car={selectedCarForTestDrive}
        onClose={() => setSelectedCarForTestDrive(null)}
        defaultCity={selectedCity}
      />

      {/* Quick Enquiry / Callback Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        car={selectedCarForEnquiry}
        onClose={() => {
          setIsEnquiryOpen(false);
          setSelectedCarForEnquiry(null);
        }}
      />
    </div>
  );
}
