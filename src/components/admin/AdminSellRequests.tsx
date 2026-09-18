import React, { useState } from 'react';
import { 
  BadgeIndianRupee, 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  CheckCircle2, 
  MessageCircle,
  FileText,
  Save
} from 'lucide-react';
import { SellRequestItem } from '../../types';

interface Props {
  requests: SellRequestItem[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status?: string, notes?: string | null) => void;
  onRefresh: () => void;
}

export const AdminSellRequests: React.FC<Props> = ({
  requests,
  isLoading,
  onUpdateStatus,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      `${r.carBrand} ${r.carModel}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartEditingNotes = (request: SellRequestItem) => {
    setEditingNotesId(request.id);
    setTempNotes(request.notes || '');
  };

  const handleSaveNotes = (id: string, currentStatus: string) => {
    onUpdateStatus(id, currentStatus, tempNotes.trim());
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by owner, phone, car, or valuation notes..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
        >
          <option value="ALL">All Statuses ({requests.length})</option>
          <option value="PENDING">Pending</option>
          <option value="INSPECTION_SCHEDULED">Inspection Scheduled</option>
          <option value="EVALUATED">Evaluated</option>
          <option value="OFFER_MADE">Offer Made</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading valuation requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <BadgeIndianRupee className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No sell car requests found</h4>
            <p className="text-xs text-slate-400">Doorstep car seller valuation leads will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((req) => (
              <div key={req.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">{req.name}</span>
                    <span className="text-slate-400">•</span>
                    <a href={`tel:${req.phone}`} className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{req.phone}</span>
                    </a>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.city}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {req.year} {req.carBrand} {req.carModel}
                    </span>
                    <span className="text-slate-500 font-normal">
                      • {req.kilometers.toLocaleString('en-IN')} km
                    </span>
                    {req.expectedPrice && (
                      <span className="text-emerald-700 font-extrabold">
                        • Expected: ₹{req.expectedPrice.toFixed(2)} Lakh
                      </span>
                    )}
                  </div>

                  {req.message && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {req.message}
                    </div>
                  )}

                  {/* Staff Internal Valuation Notes */}
                  <div className="pt-1.5">
                    {editingNotesId === req.id ? (
                      <div className="space-y-1.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <label className="block text-[11px] font-bold text-amber-900">
                          Dealership Valuation & Assessment Note
                        </label>
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="e.g. Inspector assessed vehicle condition, counter-offered ₹6.20L..."
                          rows={2}
                          className="w-full p-2 bg-white rounded-lg border border-amber-300 text-xs text-slate-900 focus:outline-hidden"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-600 hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(req.id, req.status)}
                            className="px-3 py-1 rounded-md text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 transition"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        {req.notes ? (
                          <div className="flex-1 text-[11px] text-slate-700 bg-amber-50/50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                            <strong className="text-amber-900 mr-1">Staff Note:</strong>
                            <span>{req.notes}</span>
                          </div>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleStartEditingNotes(req)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 shrink-0 px-2 py-1 rounded-md hover:bg-amber-50 transition"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{req.notes ? 'Edit Note' : '+ Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <select
                    value={req.status}
                    onChange={(e) => onUpdateStatus(req.id, e.target.value, req.notes)}
                    className="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="INSPECTION_SCHEDULED">INSPECTION_SCHEDULED</option>
                    <option value="EVALUATED">EVALUATED</option>
                    <option value="OFFER_MADE">OFFER_MADE</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>

                  <a
                    href={`https://wa.me/91${req.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.name)},%20this%20is%20Bharat%20Wheels%20regarding%20your%20${encodeURIComponent(req.carBrand)}%20${encodeURIComponent(req.carModel)}%20valuation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition"
                    title="WhatsApp seller"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
