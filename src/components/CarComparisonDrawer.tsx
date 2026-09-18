import React, { useState } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  Trash2, 
  Check, 
  Star, 
  Gauge, 
  Fuel, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Car } from '../types';
import { CarIllustration } from './CarIllustration';

interface Props {
  comparedCars: Car[];
  onRemoveCar: (carId: string) => void;
  onClearAll: () => void;
  onBookTestDrive: (car: Car) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const CarComparisonDrawer: React.FC<Props> = ({
  comparedCars,
  onRemoveCar,
  onClearAll,
  onBookTestDrive,
  isOpen,
  onToggleOpen
}) => {
  if (comparedCars.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-300 shadow-2xl transition-all duration-300">
      {/* Drawer Bar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Compare Vehicles ({comparedCars.length}/3)</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {comparedCars.map((car) => (
              <span
                key={car.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span className="font-semibold">{car.brand} {car.model}</span>
                <span className="text-slate-400 font-mono text-[10px]">₹{car.priceInLakhs}L</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCar(car.id);
                  }}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comparedCars.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 font-medium transition"
            >
              Clear All
            </button>
          )}

          <button
            onClick={onToggleOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
          >
            <span>{isOpen ? 'Minimize Table' : 'Compare Side-by-Side'}</span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Side-by-Side Comparison Matrix */}
      {isOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-slate-200 bg-slate-50/60 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse bg-white rounded-xl shadow-xs overflow-hidden">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70">
                  <th className="p-3 w-1/4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    Vehicle Parameter
                  </th>
                  {comparedCars.map((car) => (
                    <th key={car.id} className="p-3 w-1/4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">
                            {car.year} {car.brand} {car.model}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {car.variant}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveCar(car.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Remove car"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Empty slot placeholder if less than 3 */}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <th key={idx} className="p-3 w-1/4 text-center border-l border-dashed border-slate-200 text-slate-400 font-normal">
                      <span className="text-[11px]">+ Add car to compare</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* Visual Silhouettes */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Car Profile</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3">
                      <CarIllustration car={car} className="w-full h-24 rounded-lg" />
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Price */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Agreed Price</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{car.priceInLakhs.toFixed(2)} Lakh
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Estimated Monthly EMI */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Estimated Monthly EMI</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 font-bold text-amber-600">
                      ₹{car.estimatedEmi.toLocaleString('en-IN')}/mo
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Body Type */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Body Style</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 font-medium text-slate-800">
                      {car.bodyType}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Fuel Type */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Fuel Type</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 font-medium text-slate-800">
                      {car.fuelType}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Transmission */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Transmission</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 font-medium text-slate-800">
                      {car.transmission}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* ARAI Mileage */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">ARAI Mileage / Range</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 font-bold text-emerald-700">
                      {car.mileageArai}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Engine Power */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Engine / Power Output</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 text-slate-700">
                      {car.enginePower}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Safety Rating */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Safety Certification</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {car.safetyRating}-Star ({car.brand === 'Tata' || car.brand === 'Mahindra' ? 'BNCAP' : 'GNCAP'})
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Boot Space */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Boot Space</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 text-slate-700">
                      {car.bootSpace}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* 210-Point Inspection Score */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">210-Pt Inspection</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3 font-bold text-emerald-600">
                      {car.inspectionScore}/100 Certified
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>

                {/* Action CTA */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">Action</td>
                  {comparedCars.map((car) => (
                    <td key={car.id} className="p-3">
                      <button
                        onClick={() => {
                          onBookTestDrive(car);
                          onToggleOpen();
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition shadow-xs"
                      >
                        Book Test Drive
                      </button>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                    <td key={idx} className="p-3 text-center text-slate-300">-</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
