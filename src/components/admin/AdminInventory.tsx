import React, { useState } from 'react';
import { 
  Car as CarIcon, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Car, CarStatus } from '../../types';

interface Props {
  cars: Car[];
  isLoading: boolean;
  onOpenAddCar: () => void;
  onEditCar: (car: Car) => void;
  onUpdateStatus: (carId: string, status: CarStatus) => void;
  onDeleteCar: (carId: string) => void;
  onRefresh: () => void;
}

export const AdminInventory: React.FC<Props> = ({
  cars,
  isLoading,
  onOpenAddCar,
  onEditCar,
  onUpdateStatus,
  onDeleteCar,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCars = cars.filter((car) => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.variant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.stockId && car.stockId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      car.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || car.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: CarStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">AVAILABLE</span>;
      case 'RESERVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">RESERVED</span>;
      case 'SOLD':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">SOLD</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300">DRAFT</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">ACTIVE</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand, model, variant, or stock ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="ALL">All Statuses ({cars.length})</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
            <option value="DRAFT">Drafts</option>
          </select>

          <button
            onClick={onOpenAddCar}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading vehicle stock from database...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No vehicles match your criteria</h4>
            <p className="text-xs text-slate-400">Try changing the status filter or search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                  <th className="py-3.5 px-4">Vehicle & Stock ID</th>
                  <th className="py-3.5 px-4">Specs & Fuel</th>
                  <th className="py-3.5 px-4">City Hub</th>
                  <th className="py-3.5 px-4">Resale Price</th>
                  <th className="py-3.5 px-4">Inspection</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCars.map((car) => {
                  const img = car.imageUrl || (car.images && car.images[0]?.imageUrl);
                  return (
                    <tr key={car.id} className="hover:bg-slate-50/80 transition">
                      {/* Vehicle & Stock */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                            {img ? (
                              <img src={img} alt={car.model} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-white">BW</div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {car.year} {car.brand} {car.model}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">
                              {car.variant} • {car.color}
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">
                              #{car.stockId || car.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Specs */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium">{car.fuelType} • {car.transmission}</div>
                        <div className="text-[11px] text-slate-400">{car.kilometers.toLocaleString('en-IN')} km • {car.ownership}</div>
                      </td>

                      {/* City */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{car.city}</div>
                        <div className="text-[10px] font-mono text-slate-400">{car.rto}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          ₹{car.priceInLakhs.toFixed(2)} Lakh
                        </div>
                        <div className="text-[11px] text-amber-600 font-semibold">
                          EMI: ₹{car.estimatedEmi.toLocaleString('en-IN')}/mo
                        </div>
                      </td>

                      {/* Inspection */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <span>{car.inspectionScore}/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {car.safetyRating}-Star GNCAP
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4">
                        <select
                          value={car.status || 'AVAILABLE'}
                          onChange={(e) => onUpdateStatus(car.id, e.target.value as CarStatus)}
                          className={`text-xs font-bold p-1.5 rounded-lg border cursor-pointer ${
                            car.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : car.status === 'RESERVED'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : car.status === 'SOLD'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="SOLD">SOLD</option>
                          <option value="DRAFT">DRAFT</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditCar(car)}
                            title="Edit Vehicle Specs"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteCar(car.id)}
                            title="Delete from Inventory"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
