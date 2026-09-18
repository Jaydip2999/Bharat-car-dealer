import React, { useState, useEffect } from 'react';
import { 
  CarFront, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  Layers, 
  Menu, 
  X, 
  ShieldCheck, 
  Calculator,
  BadgeIndianRupee,
  Heart,
  ChevronDown,
  Check
} from 'lucide-react';
import { CITIES } from '../data/cars';

interface Props {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  bookmarkCount?: number;
  onOpenShortlist?: () => void;
}

export const Header: React.FC<Props> = ({
  selectedCity,
  onSelectCity,
  compareCount,
  onOpenCompare,
  onNavigate,
  onOpenAdmin,
  bookmarkCount = 0,
  onOpenShortlist
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Bar - Indian Dealership Assurances */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              FESTIVE UTSAV
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs">
              ₹25,000 Exchange Bonus &amp; Free 1-Year Pan-India RSA on all Certified Cars
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-300 text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              210-Pt Inspection
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline">7-Day Money Back</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <a 
              href="tel:18002098800" 
              className="flex items-center gap-1 text-amber-400 font-semibold hover:text-amber-300 transition"
            >
              <PhoneCall className="w-3 h-3" />
              1800-209-8800
            </a>
            {onOpenAdmin && (
              <>
                <span className="hidden md:inline text-slate-700">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 font-medium transition cursor-pointer"
                >
                  Dealer Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
            onClick={() => handleNavClick('hero-section')}
            id="brand-logo-btn"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md group-hover:bg-slate-800 transition">
              <CarFront className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                  BHARAT<span className="text-amber-500">WHEELS</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mb-1" title="Active Certified Hub Network" />
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hidden sm:block">
                Certified Automotive Marketplace
              </p>
            </div>
          </div>

          {/* City Selector (Desktop) */}
          <div className="relative hidden md:block">
            <button
              id="city-selector-btn"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Hub: <strong className="text-slate-900">{selectedCity}</strong></span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fadeIn">
                <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                  Select Regional Hub
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between ${
                        selectedCity === city
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {city}
                      </span>
                      {selectedCity === city && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => handleNavClick('inventory-section')} 
              className="hover:text-slate-900 transition flex items-center gap-1.5 py-1 hover:border-b-2 hover:border-amber-500"
            >
              Certified Cars
            </button>
            <button 
              onClick={() => handleNavClick('emi-calculator-section')} 
              className="hover:text-slate-900 transition flex items-center gap-1.5 py-1 hover:border-b-2 hover:border-amber-500"
            >
              <Calculator className="w-4 h-4 text-slate-400" />
              EMI Planner
            </button>
            <button 
              onClick={() => handleNavClick('sell-car-section')} 
              className="hover:text-slate-900 transition flex items-center gap-1.5 py-1 hover:border-b-2 hover:border-amber-500"
            >
              <BadgeIndianRupee className="w-4 h-4 text-emerald-600" />
              Sell Your Car
            </button>
            <button 
              onClick={() => handleNavClick('inspection-section')} 
              className="hover:text-slate-900 transition flex items-center gap-1.5 py-1 hover:border-b-2 hover:border-amber-500"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              210-Pt Guarantee
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shortlist Button (Desktop) */}
            {onOpenShortlist && (
              <button
                onClick={onOpenShortlist}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition"
                title="View Shortlisted Cars"
              >
                <Heart className={`w-3.5 h-3.5 ${bookmarkCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                <span className="hidden md:inline">Shortlist</span>
                {bookmarkCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full">
                    {bookmarkCount}
                  </span>
                )}
              </button>
            )}

            {/* Compare Button with Badge */}
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition"
              title="Compare Cars Side by Side"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-indigo-600 rounded-full">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Quick WhatsApp Chat */}
            <a
              id="header-whatsapp-btn"
              href="https://wa.me/919876543210?text=Hi%20Bharat%20Wheels,%20I%20am%20interested%20in%20exploring%20certified%20cars."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Menu Button (44px min touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay and Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[105px] z-50 flex flex-col">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs -z-10"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="bg-white border-b border-slate-200 px-5 pt-4 pb-6 space-y-4 shadow-2xl max-h-[calc(100vh-105px)] overflow-y-auto">
            {/* City Hub Switcher */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Current Hub Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 shadow-2xs focus:ring-1 focus:ring-amber-500"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c} Hub
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation Options with comfortable 44px+ touch targets */}
            <div className="space-y-1 text-sm font-semibold text-slate-800">
              <button
                onClick={() => handleNavClick('inventory-section')}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Browse Certified Cars</span>
                <span className="text-xs text-amber-600 font-bold">Explore →</span>
              </button>

              {onOpenShortlist && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShortlist();
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 ${bookmarkCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                    <span>My Shortlisted Cars</span>
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                    {bookmarkCount}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCompare();
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Compare Vehicles</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                  {compareCount}/3
                </span>
              </button>

              <button
                onClick={() => handleNavClick('emi-calculator-section')}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-slate-400" />
                  <span>Car Loan EMI Planner</span>
                </span>
              </button>

              <button
                onClick={() => handleNavClick('sell-car-section')}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BadgeIndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>Instant Resale Valuation</span>
                </span>
              </button>

              <button
                onClick={() => handleNavClick('inspection-section')}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>210-Point Quality Guarantee</span>
                </span>
              </button>
            </div>

            {/* Direct Contact CTAs */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
              <a
                href="tel:18002098800"
                className="min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                1800-209-8800
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Chat
              </a>
            </div>

            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold text-center hover:bg-slate-800 transition shadow-xs"
                >
                  Dealership Staff Portal &amp; Admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

