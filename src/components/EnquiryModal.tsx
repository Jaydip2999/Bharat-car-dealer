import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Car } from '../types';
import { api } from '../services/api';

interface Props {
  car?: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<Props> = ({ car, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    car ? `Hi Bharat Wheels, I'm interested in the ${car.year} ${car.brand} ${car.model} ${car.variant} (Stock #${car.stockId || car.id}). Please share best deal, finance options, and availability.` : 'Hi Bharat Wheels, I would like more information on your certified cars and finance offers.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.submitEnquiry({
        carId: car?.id,
        name,
        phone,
        email: email || undefined,
        message,
        source: car ? `car_card_${car.brand}_${car.model}` : 'general_enquiry'
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedicated Relationship Manager</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {car ? `Enquire on ${car.brand} ${car.model}` : 'Contact Bharat Wheels'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {car && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                {car.imageUrl ? (
                  <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-white">BW</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 truncate">
                  {car.year} {car.brand} {car.model} {car.variant}
                </div>
                <div className="text-xs font-semibold text-amber-600">
                  ₹{car.priceInLakhs.toFixed(2)} Lakh • {car.city}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amit Kumar"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Enquiry / Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-75 text-amber-400 text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Enquiry...' : 'Request Instant Callback'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Privacy Protected • Average Callback Time: 15 Minutes</span>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Enquiry Received!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>! Our sales advisor will connect with you at <strong>+91 {phone}</strong> shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
