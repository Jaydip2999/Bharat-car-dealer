import React from 'react';
import { CarFront, PhoneCall, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface Props {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <CarFront className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                BHARAT<span className="text-amber-500">WHEELS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bharat Wheels is India&apos;s certified pre-owned automotive ecosystem. Every vehicle undergoes our proprietary 210-point technical certification, includes a 1-year Pan-India warranty, 7-day money-back guarantee, and hassle-free RTO transfer.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Certified under Automotive Standards of India</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Vehicle Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#inventory-section" className="hover:text-amber-400 transition">Compact SUVs in India</a></li>
              <li><a href="#inventory-section" className="hover:text-amber-400 transition">Mid-Size &amp; 7-Seater MUVs</a></li>
              <li><a href="#inventory-section" className="hover:text-amber-400 transition">Sedans with ADAS &amp; Sunroof</a></li>
              <li><a href="#inventory-section" className="hover:text-amber-400 transition">Electric &amp; Hybrid Cars</a></li>
              <li><a href="#inventory-section" className="hover:text-amber-400 transition">Factory CNG Vehicles</a></li>
              <li><a href="#inventory-section" className="hover:text-amber-400 transition">4x4 Offroad Enthusiast Cars</a></li>
            </ul>
          </div>

          {/* Useful Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Customer Tools
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#emi-calculator-section" className="hover:text-amber-400 transition">Car Loan EMI Calculator</a></li>
              <li><a href="#sell-car-section" className="hover:text-amber-400 transition">Instant Resale Valuation</a></li>
              <li><a href="#inspection-section" className="hover:text-amber-400 transition">210-Point Inspection Guide</a></li>
              <li><a href="#locations-section" className="hover:text-amber-400 transition">Doorstep Test Drive Booking</a></li>
              <li><a href="#locations-section" className="hover:text-amber-400 transition">RTO RC Transfer Tracker</a></li>
              <li><a href="#locations-section" className="hover:text-amber-400 transition">Pan-India Mega Hubs</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Support &amp; Showrooms
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-white font-semibold">1800-209-8800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>support@bharatwheels.in</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Hubs across Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Gurugram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Bharat Wheels Automotive India Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms &amp; Conditions</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Certificate</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-amber-500 hover:text-amber-400 font-bold transition cursor-pointer"
                >
                  Dealership Admin Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
