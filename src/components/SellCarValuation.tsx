import React, { useState } from 'react';
import { 
  BadgeIndianRupee, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Calendar,
  Gauge,
  Car
} from 'lucide-react';
import { POPULAR_BRANDS } from '../data/cars';
import { api } from '../services/api';

export const SellCarValuation: React.FC = () => {
  const [brand, setBrand] = useState('Tata');
  const [model, setModel] = useState('Nexon');
  const [year, setYear] = useState('2022');
  const [fuel, setFuel] = useState('Petrol');
  const [kmBracket, setKmBracket] = useState('20000-40000');
  const [showValuation, setShowValuation] = useState(false);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerCity, setSellerCity] = useState('Delhi NCR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [refId, setRefId] = useState('');

  // Realistic Indian resale valuation model based on inputs
  const calculateValuation = () => {
    let basePrice = 10.0;
    if (brand === 'Toyota') basePrice = 18.0;
    else if (brand === 'Mahindra') basePrice = 14.5;
    else if (brand === 'Hyundai') basePrice = 12.0;
    else if (brand === 'Tata') basePrice = 11.0;
    else if (brand === 'Kia') basePrice = 13.0;
    else if (brand === 'Honda') basePrice = 11.5;
    else if (brand === 'Maruti Suzuki') basePrice = 8.5;

    // Year depreciation factor
    const age = 2026 - parseInt(year);
    const ageFactor = Math.max(0.45, 1 - age * 0.08);

    // Km factor
    let kmFactor = 1.0;
    if (kmBracket === 'under20000') kmFactor = 1.05;
    else if (kmBracket === '20000-40000') kmFactor = 0.96;
    else if (kmBracket === '40000-70000') kmFactor = 0.88;
    else kmFactor = 0.78;

    // Fuel factor
    let fuelFactor = 1.0;
    if (fuel === 'Diesel') fuelFactor = 1.04;
    else if (fuel === 'Electric') fuelFactor = 0.98;
    else if (fuel === 'CNG') fuelFactor = 1.02;

    const estimated = basePrice * ageFactor * kmFactor * fuelFactor;
    const low = Math.round(estimated * 0.94 * 100) / 100;
    const high = Math.round(estimated * 1.06 * 100) / 100;

    return { low, high };
  };

  const { low, high } = calculateValuation();

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValuation(true);
    setBookingConfirmed(false);
  };

  const handleBookInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const avgKm = kmBracket === 'under20000' ? 15000 : kmBracket === '20000-40000' ? 30000 : kmBracket === '40000-70000' ? 55000 : 85000;
      const res = await api.submitSellRequest({
        name: sellerName,
        phone: sellerPhone,
        carBrand: brand,
        carModel: model,
        year: parseInt(year, 10),
        kilometers: avgKm,
        expectedPrice: high,
        city: sellerCity,
        message: `Calculated valuation: ₹${low} - ₹${high} Lakh (${fuel}, ${kmBracket} km)`
      });

      setRefId(res.request?.id || `BW-INSP-${Math.floor(1000 + Math.random() * 9000)}`);
      setBookingConfirmed(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to schedule inspection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sell-car-section" className="py-14 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <BadgeIndianRupee className="w-3.5 h-3.5" />
            <span>Highest Price Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Sell Your Car in 3 Easy Steps
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Get an instant fair market valuation, schedule a free doorstep inspection, and receive instant payment directly in your bank account with zero RTO transfer hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Valuation Estimator Form */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Instant Market Valuation Calculator</h3>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Make / Brand</label>
                  <select
                    id="valuation-brand-select"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-amber-500"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Nexon, Creta, City"
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Reg. Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Fuel Type</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Odometer (KM)</label>
                  <select
                    value={kmBracket}
                    onChange={(e) => setKmBracket(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="under20000">&lt; 20,000 km</option>
                    <option value="20000-40000">20k - 40,000 km</option>
                    <option value="40000-70000">40k - 70,000 km</option>
                    <option value="above70000">70,000+ km</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                id="calculate-resale-btn"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Check Instant Fair Price Range</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Fair Market Value Result Card */}
            {showValuation && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-900 space-y-2 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      Estimated Bharat Wheels Offer
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                      ₹{low.toFixed(2)} - ₹{high.toFixed(2)} Lakh
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                    Live Indian Market Rate
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Valuation for <strong>{year} {brand} {model}</strong> ({fuel}, {kmBracket.replace('-', ' - ')} km). Actual price finalized post free 210-point doorstep evaluation.
                </p>
              </div>
            )}
          </div>

          {/* Book Doorstep Evaluation & Why Us */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Book Free Doorstep Car Inspection
              </h3>
              <p className="text-xs text-slate-500">
                Our certified automotive evaluation engineer will visit your home/office at your preferred time.
              </p>
            </div>

            {!bookingConfirmed ? (
              <form onSubmit={handleBookInspection} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. Rajesh Malhotra"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile (+91)</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City Hub</label>
                    <select
                      value={sellerCity}
                      onChange={(e) => setSellerCity(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Gurugram">Gurugram</option>
                    </select>
                  </div>
                </div>

                {submitError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Booking Inspection...' : 'Book Free Doorstep Inspection'}</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Doorstep Inspection Scheduled!</span>
                </div>
                <p className="text-slate-700">
                  Thank you, <strong>{sellerName}</strong>! Our inspection specialist in <strong>{sellerCity}</strong> will call you at <strong>+91 {sellerPhone}</strong> to confirm your slot today.
                </p>
                <div className="text-[11px] font-mono text-emerald-800">
                  Appointment Reference: {refId || `BW-INSP-${Math.floor(1000 + Math.random() * 9000)}`}
                </div>
              </div>
            )}

            {/* Trust Assurances */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Instant Transfer</span>
                <span className="text-[10px] text-slate-500">Money in bank in 30 mins</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Zero Fee RC Transfer</span>
                <span className="text-[10px] text-slate-500">Official RTO delivery receipt</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <Sparkles className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Doorstep Service</span>
                <span className="text-[10px] text-slate-500">No visiting showrooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
