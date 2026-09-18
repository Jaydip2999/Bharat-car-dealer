import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Scale,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Car } from '../types';
import { api } from '../services/api';
import { DEALERSHIP_CONFIG, formatWhatsAppLink } from '../config/dealership';

interface CarDetailPageProps {
  carId: string;
  onBack: () => void;
  onBookTestDrive: (car: Car) => void;
  onEnquire: (car: Car) => void;
  onSelectCar: (carId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (carId: string) => void;
  isCompared: boolean;
  onToggleCompare: (car: Car) => void;
}

export const CarDetailPage: React.FC<CarDetailPageProps> = ({
  carId,
  onBack,
  onBookTestDrive,
  onEnquire,
  onSelectCar,
  isBookmarked,
  onToggleBookmark,
  isCompared,
  onToggleCompare
}) => {
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // EMI Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadCarData() {
      try {
        const data = await api.getCarById(carId);
        if (!isMounted) return;
        setCar(data);
        setActiveImageIndex(0);

        // Update document title and SEO meta
        const pageTitle = `${data.year} ${data.brand} ${data.model} ${data.variant} for Sale - ₹${data.price} Lakh | Bharat Wheels`;
        document.title = pageTitle;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            `Buy certified pre-owned ${data.year} ${data.brand} ${data.model} in ${data.city}. ${data.kilometers.toLocaleString('en-IN')} km, ${data.fuelType}, inspection score ${data.inspectionScore}/100 with 1-Year Pan-India Warranty.`
          );
        }

        // Record in recently viewed
        try {
          const recentKey = 'bharat_wheels_recent_views';
          const stored = localStorage.getItem(recentKey);
          let recents: string[] = stored ? JSON.parse(stored) : [];
          recents = [carId, ...recents.filter((id) => id !== carId)].slice(0, 8);
          localStorage.setItem(recentKey, JSON.stringify(recents));
        } catch {
          // ignore storage error
        }

        // Fetch similar cars
        const similar = await api.getSimilarCars(carId);
        if (isMounted) {
          setSimilarCars(similar);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'Unable to retrieve vehicle information');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCarData();

    return () => {
      isMounted = false;
      document.title = 'Bharat Wheels - Indian Car Dealership';
    };
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium text-sm">Loading vehicle certification dossier...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="text-slate-500 text-sm">
          {error || 'The vehicle you are looking for is no longer available or the link is invalid.'}
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm hover:bg-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Inventory
        </button>
      </div>
    );
  }

  const images = car.images && car.images.length > 0
    ? car.images.map(img => img.imageUrl)
    : [car.imageUrl];

  const currentImage = images[activeImageIndex] || car.imageUrl;

  // Calculate customized EMI
  const totalLoanAmount = (car.price * 100000) * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = loanTenureYears * 12;
  const calculatedEmi = Math.round(
    (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const hub = DEALERSHIP_CONFIG.hubs.find((h) => h.city.toLowerCase() === car.city.toLowerCase()) || DEALERSHIP_CONFIG.hubs[0];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.year} ${car.brand} ${car.model} - Bharat Wheels`,
          text: `Check out this certified ${car.year} ${car.brand} ${car.model} at Bharat Wheels for ₹${car.price} Lakh!`,
          url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappMessage = `Hello Bharat Wheels, I am interested in the ${car.year} ${car.brand} ${car.model} ${car.variant} (Stock: ${car.stockId}, Price: ₹${car.price} Lakh). Can you share more details and arrange a test drive?`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 md:pb-16">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 truncate">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-amber-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Inventory</span>
            </button>
            <span>/</span>
            <span className="text-slate-600">{car.brand}</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate">{car.model}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(car.id)}
              className={`p-2 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'Remove from Shortlist' : 'Add to Shortlist'}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onToggleCompare(car)}
              className={`p-2 rounded-lg border transition ${
                isCompared
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition relative"
              title="Share vehicle"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Top Header Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {car.tag || 'Certified Pre-Owned'}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-600">
                  ID: {car.stockId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  car.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : car.status === 'RESERVED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {car.status === 'AVAILABLE' ? '● In Stock' : car.status === 'RESERVED' ? '● Reserved' : '● Sold Out'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {car.year} {car.brand} {car.model} <span className="text-slate-600 font-normal">{car.variant}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span>Color: <strong className="text-slate-700">{car.color}</strong></span>
                <span>•</span>
                <span>RTO: <strong className="text-slate-700">{car.rto}</strong></span>
                <span>•</span>
                <span>Ownership: <strong className="text-slate-700">{car.ownership}</strong></span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {car.city} Hub
                </span>
              </p>
            </div>

            {/* Price & EMI block */}
            <div className="lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 flex lg:flex-col justify-between items-baseline lg:items-end">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Dealership Price
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  ₹{car.price} <span className="text-lg font-semibold text-slate-600">Lakh</span>
                </div>
              </div>
              <div className="mt-1">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <span>EMI from ₹{car.estimatedEmi.toLocaleString('en-IN')}/mo*</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery + Quick Specs + Primary CTAs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Visual & Thumbnail Strip (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm group">
              <img
                src={currentImage}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Badges on main image */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>210-Pt Certified ({car.inspectionScore}/100)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{car.safetyRating}-Star Safety</span>
                </div>
              </div>

              {/* Prev / Next controls if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition opacity-80 group-hover:opacity-100"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition opacity-80 group-hover:opacity-100"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/75 text-white text-xs font-mono">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-amber-500 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Dealership Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-900">210-Point Passed</div>
                <div className="text-[10px] text-slate-500">Engine & Bodywork</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-900">7-Day Money Back</div>
                <div className="text-[10px] text-slate-500">No questions asked</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <FileCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-900">Free RC Transfer</div>
                <div className="text-[10px] text-slate-500">Zero legal hassle</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                <Award className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-slate-900">1-Year Warranty</div>
                <div className="text-[10px] text-slate-500">Pan-India coverage</div>
              </div>
            </div>
          </div>

          {/* Right Action & Key Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Spec Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">
                Core Vehicle Parameters
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-lg bg-white text-slate-700 shadow-2xs">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Model Year</div>
                    <div className="text-sm font-bold text-slate-900">{car.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-lg bg-white text-slate-700 shadow-2xs">
                    <Gauge className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Odometer</div>
                    <div className="text-sm font-bold text-slate-900">{car.kilometers.toLocaleString('en-IN')} km</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-lg bg-white text-slate-700 shadow-2xs">
                    <Fuel className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Fuel Type</div>
                    <div className="text-sm font-bold text-slate-900">{car.fuelType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-lg bg-white text-slate-700 shadow-2xs">
                    <Settings className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Transmission</div>
                    <div className="text-sm font-bold text-slate-900">{car.transmission}</div>
                  </div>
                </div>
              </div>

              {/* Secondary specs */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">ARAI Mileage:</span>
                  <span className="font-semibold text-slate-800">{car.mileage}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Engine & Power:</span>
                  <span className="font-semibold text-slate-800">{car.enginePower}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Insurance Status:</span>
                  <span className="font-semibold text-emerald-700">{car.insurance}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Hub Location:</span>
                  <span className="font-semibold text-slate-800">{car.city} Experience Center</span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
              <button
                onClick={() => onBookTestDrive(car)}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4" /> Book Free Test Drive (Doorstep / Hub)
              </button>

              <button
                onClick={() => onEnquire(car)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" /> Request Instant Callback / Best Deal
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={formatWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Chat
                </a>

                <a
                  href={`tel:${DEALERSHIP_CONFIG.tollFree}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4 text-slate-600" /> Call {DEALERSHIP_CONFIG.tollFree}
                </a>
              </div>
            </div>

            {/* Showroom Visit Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" /> Available at {hub.name}
              </div>
              <p className="text-slate-600">{hub.address}</p>
              <div className="text-slate-500 pt-1">Timings: <strong>{hub.timings}</strong> (All 7 Days)</div>
            </div>
          </div>
        </div>

        {/* 210-Point Detailed Inspection & Technical Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Inspection Report (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  210-Point Bharat Wheels Inspection
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspected & signed off by certified master automobile engineers
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-600">{car.inspectionScore}/100</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Certification Rating</div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-800">1. Engine, Transmission & Diagnostics</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PASSED</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compression test within factory tolerances. Zero oil/coolant seepage detected. Smooth gear shifts with no clutch slippage. OBD-II ECU computer scan returned zero active DTC fault codes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-800">2. Structural Frame & Non-Accidental Guarantee</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PASSED</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chassis, A/B/C pillars, aprons, and floor pan verified intact with digital ultrasonic paint depth meter. 100% Non-accidental structural integrity guaranteed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-800">3. Suspension, Steering & Braking System</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PASSED</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Front and rear shock absorber bounce test cleared. Brake pads and discs show &gt;75% life remaining. Electronic power steering alignment tested on laser bench.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-800">4. Electricals, Battery & Air Conditioning</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PASSED</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Battery cranking voltage verified under load. Climate control AC cabin air vent temperature reached 7.8°C within 3 minutes. Power windows, infotainment touchscreen, and all lamps functional.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-800">5. RTO Paper Trail & Title Verification</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">VERIFIED</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engine and chassis numbers match national VAHAN registry records. Clear title with zero hypothecation encumbrances. Valid road tax and insurance.
                </p>
              </div>
            </div>

            {/* Features Checklist */}
            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Notable Equipment & Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {car.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="truncate font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive EMI Calculator for this specific car (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Custom Financing & EMI Planner</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate monthly installment for this {car.brand} {car.model}
              </p>
            </div>

            {/* Calculated EMI Display Card */}
            <div className="p-5 rounded-xl bg-slate-900 text-white text-center space-y-1">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">Estimated Monthly EMI</div>
              <div className="text-3xl font-extrabold text-white">
                ₹{calculatedEmi.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Loan Amount: ₹{(totalLoanAmount / 100000).toFixed(2)} Lakh | Tenure: {loanTenureYears} Years
              </div>
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Down Payment ({downPaymentPercent}%)</span>
                <span>₹{((car.price * 100000 * downPaymentPercent) / 10000000).toFixed(2)} Lakh</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Min)</span>
                <span>30%</span>
                <span>60% (Max)</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Loan Duration</span>
                <span>{loanTenureYears} Years ({loanTenureYears * 12} Months)</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Year</span>
                <span>4 Years</span>
                <span>7 Years</span>
              </div>
            </div>

            {/* Interest Rate Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Indicative Bank Interest Rate</span>
                <span>{interestRate}% p.a.</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[8.5, 9.0, 9.5, 10.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setInterestRate(rate)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      interestRate === rate
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Finance CTA */}
            <button
              onClick={() => onEnquire(car)}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              Apply for Pre-Approved Car Loan at {interestRate}%
            </button>
          </div>
        </div>

        {/* Similar Cars Recommendation */}
        {similarCars.length > 0 && (
          <div className="my-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Similar Certified Vehicles</h2>
                <p className="text-xs text-slate-500">Other options in the same segment and price range</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarCars.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCar(item.id)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={`${item.brand} ${item.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.year}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {item.brand} {item.model}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {item.kilometers.toLocaleString('en-IN')} km • {item.fuelType} • {item.city}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-base font-extrabold text-slate-900">₹{item.price} Lakh</span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Mobile Conversion Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total &amp; EMI</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">₹{car.price}L</span>
              <span className="text-[11px] font-bold text-amber-600">₹{calculatedEmi.toLocaleString('en-IN')}/m</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={formatWhatsAppLink(`Hi Bharat Wheels, I am interested in ${car.year} ${car.brand} ${car.model} (${car.stockId}). Please share inspection report and best price.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => onBookTestDrive(car)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-xs cursor-pointer"
            >
              Book Test Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
