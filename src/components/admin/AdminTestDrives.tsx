import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Phone, 
  MapPin, 
  Clock, 
  Home, 
  Building2, 
  User, 
  Search,
  CheckCircle2,
  XCircle,
  MessageCircle,
  FileText,
  Save
} from 'lucide-react';
import { TestDriveItem } from '../../types';

interface Props {
  bookings: TestDriveItem[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status?: string, notes?: string | null) => void;
  onRefresh: () => void;
}

export const AdminTestDrives: React.FC<Props> = ({
  bookings,
  isLoading,
  onUpdateStatus,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      (b.car && `${b.car.brand} ${b.car.model}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.notes && b.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartEditingNotes = (booking: TestDriveItem) => {
    setEditingNotesId(booking.id);
    setTempNotes(booking.notes || '');
  };

  const handleSaveNotes = (id: string, currentStatus: string) => {
    onUpdateStatus(id, currentStatus, tempNotes.trim());
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, phone, car, or notes..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
        >
          <option value="ALL">All Statuses ({bookings.length})</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No test drive bookings found</h4>
            <p className="text-xs text-slate-400">New customer bookings will appear here in real time</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">{item.fullName}</span>
                    <span className="text-slate-400">•</span>
                    <a
                      href={`tel:${item.phone}`}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </a>
                    {item.email && (
                      <span className="text-xs text-slate-500 font-mono">({item.email})</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.mode === 'doorstep' ? <Home className="w-3 h-3 text-amber-600" /> : <Building2 className="w-3 h-3 text-blue-600" />}
                      <span className="capitalize">{item.mode} Test Drive</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                      {item.car ? `${item.car.brand} ${item.car.model} ${item.car.variant}` : 'Selected Vehicle'}
                    </span>
                    {item.car?.stockId && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        Stock #{item.car.stockId}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Slot: <strong>{item.date}</strong> at {item.timeSlot}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.city} {item.address ? `(${item.address})` : ''}</span>
                    </span>
                  </div>

                  {/* Staff Internal Follow-up Notes */}
                  <div className="pt-1.5">
                    {editingNotesId === item.id ? (
                      <div className="space-y-1.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <label className="block text-[11px] font-bold text-amber-900">
                          Dealership Logistics & Customer Note
                        </label>
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="e.g. Driver assigned (Ramesh), confirmed customer residence location..."
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
                            onClick={() => handleSaveNotes(item.id, item.status)}
                            className="px-3 py-1 rounded-md text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 transition"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        {item.notes ? (
                          <div className="flex-1 text-[11px] text-slate-700 bg-amber-50/50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                            <strong className="text-amber-900 mr-1">Drive Note:</strong>
                            <span>{item.notes}</span>
                          </div>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleStartEditingNotes(item)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 shrink-0 px-2 py-1 rounded-md hover:bg-amber-50 transition"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{item.notes ? 'Edit Note' : '+ Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value, item.notes)}
                    className={`text-xs font-bold p-2 rounded-xl border cursor-pointer ${
                      item.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : item.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : item.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <a
                    href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.fullName)},%20this%20is%20Bharat%20Wheels%20regarding%20your%20test%20drive%20booking.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition"
                    title="Send WhatsApp confirmation"
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
