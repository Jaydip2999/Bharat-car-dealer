import React from 'react';
import { 
  Fuel, 
  Gauge, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Heart, 
  Check, 
  Plus, 
  Calendar,
  Sparkles,
  Zap,
  Leaf
} from 'lucide-react';
import { Car } from '../types';
import { CarIllustration } from './CarIllustration';

interface Props {
  car: Car;
  isCompared: boolean;
  onToggleCompare: (car: Car) => void;
  isBookmarked: boolean;
  onToggleBookmark: (carId: string) => void;
  onSelectCarDetails: (car: Car) => void;
  onBookTestDrive: (car: Car) => void;
}

export const CarCard: React.FC<Props> = ({
  car,
  isCompared,
  onToggleCompare,
  isBookmarked,
  onToggleBookmark,
  onSelectCarDetails,
  onBookTestDrive
}) => {
  const getFuelBadge = (fuel: string) => {
    switch (fuel) {
      case 'Electric':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Zap className="w-3 h-3 text-emerald-600" />
            Electric
          </span>
        );
      case 'CNG':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
            <Leaf className="w-3 h-3 text-teal-600" />
            Factory CNG
          </span>
        );
      case 'Hybrid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Sparkles className="w-3 h-3 text-cyan-600" />
            Strong Hybrid
          </span>
        );
      case 'Diesel':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <Fuel className="w-3 h-3 text-amber-600" />
            Diesel
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Fuel className="w-3 h-3 text-slate-500" />
            Petrol
          </span>
        );
    }
  };

  const [imgError, setImgError] = React.useState(false);
  const primaryImage = car.imageUrl || (car.images && car.images.length > 0 ? car.images[0].imageUrl : null);

  return (
    <div 
      id={`car-card-${car.id}`}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Top Banner & Badges */}
      <div className="relative overflow-hidden">
        {/* Real Car Photo with Illustration Fallback */}
        {primaryImage && !imgError ? (
          <div className="relative w-full h-44 sm:h-48 bg-slate-900 overflow-hidden">
            <img
              src={primaryImage}
              alt={`${car.year} ${car.brand} ${car.model}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 text-[11px] font-medium text-white/90 drop-shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Verified Photos • Stock #{car.stockId || car.id.substring(0, 8)}
            </div>
          </div>
        ) : (
          <CarIllustration car={car} className="w-full h-44 sm:h-48" />
        )}

        {/* Highlight Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/90 text-amber-400 backdrop-blur-xs shadow-xs">
            <Sparkles className="w-3 h-3" />
            {car.tag}
          </span>
          {car.safetyRating === 5 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-700/90 text-white backdrop-blur-xs">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              5-Star Safety
            </span>
          )}
        </div>

        {/* Top Right Action: Bookmark & Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(car.id);
            }}
            className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full backdrop-blur-xs transition shadow-md cursor-pointer ${
              isBookmarked
                ? 'bg-rose-500 text-white'
                : 'bg-white/95 text-slate-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={isBookmarked ? 'Remove from Shortlist' : 'Add to Shortlist'}
            aria-label="Bookmark car"
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(car);
            }}
            className={`min-h-[36px] sm:min-h-[32px] px-3 py-1.5 rounded-xl text-[11px] font-bold backdrop-blur-xs transition shadow-md flex items-center gap-1.5 cursor-pointer ${
              isCompared
                ? 'bg-indigo-600 text-white'
                : 'bg-white/95 text-slate-800 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
            title="Compare with other cars"
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isCompared ? 'Added' : 'Compare'}</span>
          </button>
        </div>

        {/* RTO Tag at bottom right of image */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-white backdrop-blur-xs shadow-2xs border border-white/20">
            <MapPin className="w-3 h-3 text-amber-400" />
            {car.rto} • {car.city}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Variant */}
          <div 
            className="mb-2 cursor-pointer"
            onClick={() => onSelectCarDetails(car)}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-amber-600 transition">
                {car.year} {car.brand} {car.model}
              </h3>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 font-medium mt-0.5">
              {car.variant}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold">{car.kilometers.toLocaleString('en-IN')} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              {getFuelBadge(car.fuelType)}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{car.ownership}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <span>{car.transmission}</span>
            </div>
          </div>

          {/* Inspection Trust Strip */}
          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 mb-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-950">
                210-Pt Score: <strong className="text-emerald-700">{car.inspectionScore}/100</strong>
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold">
              Certified Clean
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-end justify-between mb-3.5">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Total All-Inclusive
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ₹{car.priceInLakhs.toFixed(2)} Lakh
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-medium block">Starting EMI</span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-600">
                ₹{car.estimatedEmi.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectCarDetails(car)}
              className="w-full min-h-[42px] py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Inspection Report
            </button>
            <button
              onClick={() => onBookTestDrive(car)}
              className="w-full min-h-[42px] py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Book Test Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
