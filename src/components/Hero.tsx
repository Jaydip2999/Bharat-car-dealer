import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  RotateCcw, 
  FileCheck2, 
  Clock, 
  Sparkles,
  Zap,
  Gauge
} from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectQuickFilter: (type: string, value: any) => void;
  activeFilterChip: string;
}

export const Hero: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  onSelectQuickFilter,
  activeFilterChip
}) => {
  return (
    <section id="hero-section" className="relative bg-slate-900 text-white overflow-hidden py-12 md:py-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-amber-400 font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>India&apos;s Verified Pre-Owned &amp; New Dealership Network</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Drive Home With Complete Trust.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Zero Compromises.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore 100% verified cars with 210-point mechanical inspection, clean RTO paperwork, and direct doorstep test drives across major Indian cities.
          </p>

          {/* Big Search Input */}
          <div className="relative max-w-2xl mx-auto mb-5">
            <div className="relative flex items-center shadow-xl rounded-2xl bg-white p-1">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                id="hero-car-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search model, brand, segment (e.g. Nexon, Creta, Hybrid, Thar)..."
                className="w-full pl-11 pr-14 py-3 sm:py-3.5 rounded-xl bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Segment Filter Chips - Horizontal Scroll on Mobile */}
          <div className="flex items-center justify-start sm:justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none px-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 hidden sm:inline mr-1">
              Popular:
            </span>
            
            <button
              onClick={() => onSelectQuickFilter('all', null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilterChip === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              All Inventory
            </button>

            <button
              onClick={() => onSelectQuickFilter('suv', 'SUV')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilterChip === 'suv'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              SUVs &amp; Compacts
            </button>

            <button
              onClick={() => onSelectQuickFilter('budget', 12)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilterChip === 'budget'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              Under ₹12 Lakh
            </button>

            <button
              onClick={() => onSelectQuickFilter('eco', ['Electric', 'CNG', 'Hybrid'])}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilterChip === 'eco'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                EV &amp; Hybrid / CNG
              </span>
            </button>

            <button
              onClick={() => onSelectQuickFilter('automatic', 'Automatic')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilterChip === 'automatic'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                Automatics
              </span>
            </button>

            <button
              onClick={() => onSelectQuickFilter('offroad', '4x4')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilterChip === 'offroad'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              4x4 / Lifestyle
            </button>
          </div>
        </div>

        {/* Dealership 4 Core Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto pt-4 border-t border-slate-800/80">
          <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">210-Pt Inspection</h4>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5 hidden sm:block">
                Engine, transmission, brakes &amp; structural test.
              </p>
              <span className="text-[10px] text-amber-400 font-medium sm:hidden">Certified Pass</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">1-Year Warranty</h4>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5 hidden sm:block">
                Pan-India coverage on engine &amp; mechanicals.
              </p>
              <span className="text-[10px] text-emerald-400 font-medium sm:hidden">Pan-India Cover</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">7-Day Money Back</h4>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5 hidden sm:block">
                100% money refund if not completely satisfied.
              </p>
              <span className="text-[10px] text-sky-400 font-medium sm:hidden">100% Refund</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Free RTO Transfer</h4>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5 hidden sm:block">
                Zero hassle ownership transfer guaranteed.
              </p>
              <span className="text-[10px] text-purple-400 font-medium sm:hidden">Zero Transfer Fee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
