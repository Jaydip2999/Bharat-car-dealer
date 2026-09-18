import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Home, 
  Building2, 
  ShieldCheck,
  Sparkles,
  Share2
} from 'lucide-react';
import { Car as CarType, TestDriveBooking } from '../types';
import { CarIllustration } from './CarIllustration';
import { api } from '../services/api';

interface Props {
  car: CarType | null;
  onClose: () => void;
  defaultCity: string;
}

export const TestDriveModal: React.FC<Props> = ({
  car,
  onClose,
  defaultCity
}) => {
  const [mode, setMode] = useState<'doorstep' | 'hub'>('doorstep');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(defaultCity || 'Delhi NCR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [confirmedBooking, setConfirmedBooking] = useState<{
    refId: string;
    manager: string;
    managerPhone: string;
  } | null>(null);

  if (!car) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.submitTestDrive({
        carId: car.id,
        fullName,
        phone,
        email: email || undefined,
        city,
        address: mode === 'doorstep' ? address : undefined,
        mode,
        date,
        timeSlot
      });

      const refId = response.booking?.id || `BW-TD-${Math.floor(1000 + Math.random() * 9000)}`;
      const managers = [
        { name: 'Vikram Sharma', phone: '+91 98765-43210' },
        { name: 'Priya Mukherjee', phone: '+91 98112-33445' },
        { name: 'Arjun Deshmukh', phone: '+91 98201-98201' },
        { name: 'Rajesh Iyer', phone: '+91 98450-11223' }
      ];
      const assigned = managers[Math.floor(Math.random() * managers.length)];

      setConfirmedBooking({
        refId,
        manager: assigned.name,
        managerPhone: assigned.phone
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to schedule booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        id="test-drive-modal"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complimentary Doorstep / Showroom Experience</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Book a Test Drive
            </h2>
          </div>

          <button
            id="close-test-drive-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          {/* Selected Car Highlight Bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-6">
            <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
              {car.imageUrl || (car.images && car.images[0]?.imageUrl) ? (
                <img
                  src={car.imageUrl || car.images![0].imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CarIllustration car={car} className="w-full h-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm truncate">
                  {car.year} {car.brand} {car.model}
                </h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {car.rto}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{car.variant}</p>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                ₹{car.priceInLakhs.toFixed(2)} Lakh • {car.fuelType} • {car.transmission}
              </div>
            </div>
          </div>

          {submitError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {submitError}
            </div>
          )}

          {!confirmedBooking ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mode Toggle: Doorstep vs Hub */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Choose Test Drive Experience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('doorstep')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      mode === 'doorstep'
                        ? 'border-amber-500 bg-amber-50/50 text-slate-950 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Home className={`w-4 h-4 mt-0.5 ${mode === 'doorstep' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Free Doorstep Delivery</span>
                      <span className="text-[11px] text-slate-500 block">We bring the car to your home/office</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('hub')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      mode === 'hub'
                        ? 'border-amber-500 bg-amber-50/50 text-slate-950 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 mt-0.5 ${mode === 'hub' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">Visit Dealership Hub</span>
                      <span className="text-[11px] text-slate-500 block">Meet RM &amp; inspect on hydraulic ramp</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Time Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                    <option value="12:00 PM - 02:00 PM">Afternoon (12:00 PM - 02:00 PM)</option>
                    <option value="02:00 PM - 04:00 PM">Late Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 06:30 PM">Evening (04:00 PM - 06:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Malhotra"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Indian Mobile Number (+91)</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile (e.g. 9820198201)"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Address / Location */}
              {mode === 'doorstep' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Doorstep Delivery Address / Landmark
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Office No., Street, Landmark, Pincode"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    Hub Location for {car.city}:
                  </span>
                  <span>
                    Bharat Wheels Experience Centre, Landmark Tech Park, Near Metro Station, {car.city}. Open 9:30 AM - 8:00 PM.
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                id="confirm-test-drive-btn"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-75 text-amber-400 text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Securing Your Slot...</span>
                ) : (
                  <span>Confirm Free Test Drive Booking</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Booking Charges • Sanitized Vehicle • Valid Indian Driving Licence Required</span>
              </div>
            </form>
          ) : (
            /* Booking Confirmation Screen */
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Test Drive Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your booking for <strong>{car.brand} {car.model}</strong> on <strong>{date} ({timeSlot})</strong> is locked.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{confirmedBooking.refId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-semibold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-semibold text-slate-800">+91 {phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Assigned Relationship Manager:</span>
                  <span className="font-bold text-amber-700">{confirmedBooking.manager}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Manager Contact:</span>
                  <span className="font-mono text-slate-800">{confirmedBooking.managerPhone}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {mode === 'doorstep' ? `Doorstep Delivery (${address})` : `Showroom Visit (${car.city} Hub)`}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3 max-w-md mx-auto">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Bharat%20Wheels,%20my%20test%20drive%20booking%20ref%20is%20${confirmedBooking.refId}%20for%20${car.brand}%20${car.model}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Receive Details on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
