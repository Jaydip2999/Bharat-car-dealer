import React from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  FileCheck, 
  RotateCcw, 
  Star, 
  MapPin, 
  PhoneCall, 
  Building2,
  Clock,
  CarFront
} from 'lucide-react';
import { CITIES } from '../data/cars';

export const DealershipTrust: React.FC = () => {
  const inspectionPoints = [
    { title: 'Engine & Gearbox (60 Checks)', desc: 'Compression test, turbo boost pressure, oil leak detection, dual-clutch / automatic transmission scan.' },
    { title: 'Chassis & Frame Structural (45 Checks)', desc: 'Non-accidental ultrasound gauge audit, pillar integrity, floor pan rust-proofing, factory spot welds.' },
    { title: 'Suspension, Steering & Tyres (45 Checks)', desc: 'Shock absorber rebound, tie-rod play, brake disc thickness & laser tread measurement (minimum 80% life guaranteed).' },
    { title: 'Electricals & OBD-II Scanner (35 Checks)', desc: 'Full diagnostic trouble code (DTC) scan, alternator output, battery internal resistance, airbag sensors.' },
    { title: 'RTO & Legal Clearances (25 Checks)', desc: 'Zero traffic challans, single owner pedigree, clean hypothecation clearance, and genuine odometer certificate.' }
  ];

  const customerReviews = [
    {
      name: 'Aditya Deshmukh',
      city: 'Mumbai',
      car: 'Tata Nexon Fearless Plus (DCA)',
      comment: 'Bought my Nexon through Bharat Wheels Mumbai hub. The 210-point inspection was totally genuine—they showed me the paint thickness meter on the spot. RC transfer arrived on my DigiLocker within 12 days!',
      rating: 5
    },
    {
      name: 'Simran Kaur',
      city: 'Delhi NCR',
      car: 'Honda City ZX Hybrid',
      comment: 'Getting 26+ km/l in Delhi traffic! Doorstep test drive came right on time to my Gurgaon office. The auto loan approval with SBI took less than 20 minutes with zero hidden fees.',
      rating: 5
    },
    {
      name: 'Karthik Raman',
      city: 'Bengaluru',
      car: 'Tata Tiago EV Tech LUX',
      comment: 'My first EV purchase and Bharat Wheels made it seamless. Battery health was certified at 99.4%. Saved over ₹3 Lakh compared to showroom new without compromising peace of mind.',
      rating: 5
    }
  ];

  return (
    <section id="inspection-section" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 210-Point Inspection Detailed Architecture */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Industry-Leading Certification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Bharat Wheels 210-Point Quality Guarantee
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Only 1 in 10 cars evaluated makes it to our inventory. No accidental cars, no odometer tampering, and no water-damaged vehicles. Guaranteed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inspectionPoints.map((pt, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{pt.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            ))}

            {/* 6th Card: The Guarantee */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 text-white border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Unconditional Backing
                </span>
                <h3 className="font-bold text-base mt-1 text-white">
                  7-Day 100% Refund Policy
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Drive the car for 7 days or up to 500 km. If you don&apos;t absolutely love it, return it for a full, no-questions-asked refund.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-300">Engine &amp; Gearbox Warranty:</span>
                <span className="font-bold text-amber-400">12 Months Covered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Testimonials */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Loved by Over 25,000+ Indian Car Owners
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Read real experiences from car enthusiasts and families who bought their dream vehicle with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: rev.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{rev.name}</h4>
                    <span className="text-[11px] text-slate-500">{rev.city}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded bg-white text-slate-700 border border-slate-200">
                    {rev.car}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Showroom Hubs & Location Directory */}
        <div id="locations-section" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Pan-India Experience Centers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Visit Our State-of-the-Art Mega Hubs
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Experience test drives on private test tracks, inspect cars under high-intensity inspection bays, and enjoy our premium lounge while our finance experts process your paperwork.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {CITIES.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/90 p-6 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">24x7 National Concierge</h4>
                  <p className="text-xs text-slate-400">Speak directly with a Senior Vehicle Specialist</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">All-India Toll-Free</span>
                  <span className="text-base font-extrabold text-amber-400">1800-209-8800</span>
                </div>
                <a
                  href="tel:18002098800"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-xs"
                >
                  Call Now
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Open 7 Days (9:30 AM - 8:00 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>24x7 RSA Roadside Assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
