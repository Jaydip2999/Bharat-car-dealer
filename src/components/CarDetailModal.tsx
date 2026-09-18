import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Gauge, 
  Fuel, 
  MapPin, 
  Award, 
  PhoneCall, 
  MessageCircle,
  Calendar,
  Layers,
  Wrench,
  Zap,
  Info
} from 'lucide-react';
import { Car } from '../types';
import { CarIllustration } from './CarIllustration';

interface Props {
  car: Car | null;
  onClose: () => void;
  onBookTestDrive: (car: Car) => void;
  onSelectForEmi: (car: Car) => void;
  onEnquire?: (car: Car) => void;
}

export const CarDetailModal: React.FC<Props> = ({
  car,
  onClose,
  onBookTestDrive,
  onSelectForEmi,
  onEnquire
}) => {
  if (!car) return null;

  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [imgError, setImgError] = React.useState(false);

  const images = car.images && car.images.length > 0 
    ? car.images 
    : (car.imageUrl ? [{ imageUrl: car.imageUrl, altText: `${car.brand} ${car.model}`, isPrimary: true, sortOrder: 0 }] : []);

  const currentImage = images[activeImgIdx]?.imageUrl || car.imageUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        id="car-details-modal"
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/30">
                210-Point Certified
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Inspection Score: <strong className="text-emerald-600">{car.inspectionScore}/100</strong>
              </span>
              {car.stockId && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-200 text-slate-700">
                  Stock #{car.stockId}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {car.year} {car.brand} {car.model}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {car.variant} • {car.color}
            </p>
          </div>

          <button
            id="close-car-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Banner with Real Photo Gallery and Quick Financials */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <div className="md:col-span-6 space-y-2">
              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-16/10">
                {currentImage && !imgError ? (
                  <img
                    src={currentImage}
                    alt={images[activeImgIdx]?.altText || `${car.brand} ${car.model}`}
                    className="w-full h-full object-cover object-center"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <CarIllustration car={car} className="w-full h-full" />
                )}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[11px] font-medium backdrop-blur-xs">
                  {images.length > 0 ? `${activeImgIdx + 1} / ${images.length} Photos` : 'Studio Illustration'}
                </div>
              </div>

              {/* Thumbnails strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImgIdx(idx);
                        setImgError(false);
                      }}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                        activeImgIdx === idx ? 'border-amber-500 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt={img.altText || `View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Agreed Price
                </span>
                <div className="text-3xl font-extrabold text-slate-900">
                  ₹{car.priceInLakhs.toFixed(2)} Lakh
                </div>
                <div className="text-sm font-semibold text-amber-600 mt-0.5">
                  Estimated EMI: ₹{car.estimatedEmi.toLocaleString('en-IN')}/month
                </div>
              </div>

              {/* RTO & Verification Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">RTO Registration</span>
                  <span className="font-mono font-bold text-slate-800">{car.rto}</span>
                  <span className="text-slate-500 block text-[11px]">{car.city}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ownership &amp; Year</span>
                  <span className="font-bold text-slate-800">{car.ownership}</span>
                  <span className="text-slate-500 block text-[11px]">Manufactured {car.year}</span>
                </div>
              </div>

              {/* Insurance & Warranty Note */}
              <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{car.insurance}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{car.warranty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 210-Point Inspection Detailed Report */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Bharat Wheels 210-Point Certification Summary
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Engine &amp; Gearbox Transmission</span>
                </div>
                <p className="text-xs text-slate-700">
                  {car.inspectionHighlights.engineTransmission}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Chassis, Frame &amp; Non-Accidental Guarantee</span>
                </div>
                <p className="text-xs text-slate-700">
                  {car.inspectionHighlights.chassisFrame}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tyres, Suspension &amp; Brakes</span>
                </div>
                <p className="text-xs text-slate-700">
                  {car.inspectionHighlights.tyresBrakes}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>OBD-II Diagnostics &amp; Battery Health</span>
                </div>
                <p className="text-xs text-slate-700">
                  {car.inspectionHighlights.electricalsBattery}
                </p>
              </div>
            </div>

            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                RTO Clear Status: <strong>{car.inspectionHighlights.rtoPaperwork}</strong>
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                100% Verified
              </span>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-600" />
              Technical Specifications &amp; ARAI Performance
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Engine &amp; Power</span>
                <span className="font-semibold text-slate-800">{car.enginePower}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Certified Mileage / Range</span>
                <span className="font-bold text-emerald-700">{car.mileageArai}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Transmission</span>
                <span className="font-semibold text-slate-800">{car.transmission}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Safety Rating</span>
                <span className="font-bold text-amber-600">
                  {car.safetyRating}-Star ({car.brand === 'Tata' || car.brand === 'Mahindra' ? 'Bharat NCAP' : 'Global NCAP'})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Luggage Boot Space</span>
                <span className="font-semibold text-slate-800">{car.bootSpace}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Ground Clearance</span>
                <span className="font-semibold text-slate-800">{car.groundClearance}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Body Type</span>
                <span className="font-semibold text-slate-800">{car.bodyType}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Odometer Verified</span>
                <span className="font-semibold text-slate-800">{car.kilometers.toLocaleString('en-IN')} km</span>
              </div>
            </div>
          </div>

          {/* Key Features Pill Tags */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2.5">
              Factory Installed Features &amp; Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onSelectForEmi(car);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-2xs"
          >
            Calculate Loan EMI for this Car
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {onEnquire && (
              <button
                onClick={() => {
                  onEnquire(car);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enquire / Callback</span>
              </button>
            )}

            <a
              href={`https://wa.me/919876543210?text=Hi%20Bharat%20Wheels,%20I%20am%20interested%20in%20the%20${encodeURIComponent(
                car.year + ' ' + car.brand + ' ' + car.model + ' (' + car.rto + ')'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onBookTestDrive(car);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-extrabold transition shadow-md cursor-pointer"
            >
              Book Test Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
