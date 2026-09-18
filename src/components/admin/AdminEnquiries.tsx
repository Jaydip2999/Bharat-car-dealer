import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Clock, Search, CheckCircle2, MessageCircle, FileText, Save, Check } from 'lucide-react';
import { EnquiryItem } from '../../types';

interface Props {
  enquiries: EnquiryItem[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status?: string, notes?: string | null) => void;
  onRefresh: () => void;
}

export const AdminEnquiries: React.FC<Props> = ({
  enquiries,
  isLoading,
  onUpdateStatus,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      e.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartEditingNotes = (enquiry: EnquiryItem) => {
    setEditingNotesId(enquiry.id);
    setTempNotes(enquiry.notes || '');
  };

  const handleSaveNotes = (id: string, currentStatus: string) => {
    onUpdateStatus(id, currentStatus, tempNotes.trim());
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search enquiries by customer, phone, or notes..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
        >
          <option value="ALL">All Statuses ({enquiries.length})</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="CONVERTED">Converted</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading customer queries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No customer enquiries found</h4>
            <p className="text-xs text-slate-400">Messages sent via website forms will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((enq) => (
              <div key={enq.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">{enq.name}</span>
                    <span className="text-slate-400">•</span>
                    <a href={`tel:${enq.phone}`} className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{enq.phone}</span>
                    </a>
                    {enq.email && (
                      <span className="text-xs text-slate-500 font-mono">({enq.email})</span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(enq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 italic">
                    "{enq.message}"
                  </div>

                  {enq.car && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      Vehicle Interested: <strong className="text-slate-700">{enq.car.brand} {enq.car.model} {enq.car.variant}</strong>
                    </div>
                  )}

                  {/* Staff Internal Follow-up Notes */}
                  <div className="pt-1">
                    {editingNotesId === enq.id ? (
                      <div className="space-y-1.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <label className="block text-[11px] font-bold text-amber-900">
                          Dealership Follow-up Notes (Internal)
                        </label>
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="e.g. Spoke on phone, customer seeking loan approval details..."
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
                            onClick={() => handleSaveNotes(enq.id, enq.status)}
                            className="px-3 py-1 rounded-md text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 transition"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        {enq.notes ? (
                          <div className="flex-1 text-[11px] text-slate-700 bg-amber-50/50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                            <strong className="text-amber-900 mr-1">Staff Note:</strong>
                            <span>{enq.notes}</span>
                          </div>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleStartEditingNotes(enq)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 shrink-0 px-2 py-1 rounded-md hover:bg-amber-50 transition"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{enq.notes ? 'Edit Note' : '+ Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <select
                    value={enq.status}
                    onChange={(e) => onUpdateStatus(enq.id, e.target.value, enq.notes)}
                    className={`text-xs font-bold p-2 rounded-xl border cursor-pointer ${
                      enq.status === 'NEW'
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : enq.status === 'CONTACTED'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : enq.status === 'FOLLOW_UP'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : enq.status === 'CONVERTED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="FOLLOW_UP">FOLLOW_UP</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>

                  <a
                    href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20thank%20you%20for%20contacting%20Bharat%20Wheels.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition"
                    title="WhatsApp customer"
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
