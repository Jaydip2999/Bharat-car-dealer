import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp
} from 'lucide-react';
import { BANK_PARTNERS } from '../data/cars';

interface Props {
  presetCarPrice?: number;
  carName?: string;
}

export const EmiCalculator: React.FC<Props> = ({
  presetCarPrice,
  carName
}) => {
  // Price in Lakhs (e.g. 15.00)
  const [carPriceLakh, setCarPriceLakh] = useState<number>(presetCarPrice || 14.0);
  // Down payment percentage (e.g. 20%)
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  // Interest rate per annum (e.g. 8.85%)
  const [interestRate, setInterestRate] = useState<number>(8.85);
  // Tenure in years (e.g. 5)
  const [tenureYears, setTenureYears] = useState<number>(5);

  const [loanApplied, setLoanApplied] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Calculations in Indian Rupees
  const carPriceRupees = carPriceLakh * 100000;
  const downPaymentRupees = (carPriceRupees * downPaymentPercent) / 100;
  const principalRupees = carPriceRupees - downPaymentRupees;
  const tenureMonths = tenureYears * 12;

  const { monthlyEmi, totalInterest, totalPayment } = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    if (monthlyRate === 0) {
      const emi = principalRupees / tenureMonths;
      return {
        monthlyEmi: Math.round(emi),
        totalInterest: 0,
        totalPayment: Math.round(principalRupees)
      };
    }

    const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
    const emi = (principalRupees * monthlyRate * compoundFactor) / (compoundFactor - 1);
    const totalPay = emi * tenureMonths;
    const interest = totalPay - principalRupees;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(interest),
      totalPayment: Math.round(totalPay)
    };
  }, [principalRupees, interestRate, tenureMonths]);

  const handleApplyFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;
    setLoanApplied(true);
  };

  return (
    <section id="emi-calculator-section" className="py-14 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold mb-3 border border-slate-700">
            <Calculator className="w-3.5 h-3.5" />
            <span>Transparent Indian Auto Finance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Car Loan EMI Calculator
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Calculate your exact monthly EMI with India&apos;s leading lending banks. Get instant pre-approved loans with up to 90% on-road funding.
          </p>
          {carName && (
            <div className="mt-3 inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-md border border-amber-500/40">
              Configuring for: {carName} (₹{carPriceLakh.toFixed(2)} Lakh)
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Sliders Column */}
          <div className="lg:col-span-7 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-6">
            {/* Slider 1: Car Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Vehicle Agreed Price
                </label>
                <span className="text-base font-extrabold text-amber-400">
                  ₹{carPriceLakh.toFixed(2)} Lakh{' '}
                  <span className="text-xs font-normal text-slate-400">
                    (₹{carPriceRupees.toLocaleString('en-IN')})
                  </span>
                </span>
              </div>
              <input
                id="emi-car-price-slider"
                type="range"
                min="3.00"
                max="45.00"
                step="0.25"
                value={carPriceLakh}
                onChange={(e) => setCarPriceLakh(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹3.0 Lakh</span>
                <span>₹20.0 Lakh</span>
                <span>₹45.0 Lakh</span>
              </div>
            </div>

            {/* Slider 2: Down Payment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customer Down Payment ({downPaymentPercent}%)
                </label>
                <span className="text-sm font-bold text-white">
                  ₹{downPaymentRupees.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                id="emi-downpayment-slider"
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10% (Min)</span>
                <span>30%</span>
                <span>60% (Max)</span>
              </div>
            </div>

            {/* Slider 3: Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Interest Rate (p.a.)
                </label>
                <span className="text-sm font-bold text-emerald-400">
                  {interestRate.toFixed(2)}% p.a.
                </span>
              </div>
              <input
                id="emi-rate-slider"
                type="range"
                min="7.5"
                max="13.5"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>7.50%</span>
                <span>9.50%</span>
                <span>13.50%</span>
              </div>
            </div>

            {/* Slider 4: Loan Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Loan Tenure
                </label>
                <span className="text-sm font-bold text-white">
                  {tenureYears} Years ({tenureMonths} Months)
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTenureYears(yr)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      tenureYears === yr
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {yr}Y
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Rates Comparison Strip */}
            <div className="pt-2 border-t border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Instant Bank Partner Offers (Click to apply rate):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BANK_PARTNERS.map((bank) => {
                  const rateNum = parseFloat(bank.rate);
                  const isSelected = Math.abs(interestRate - rateNum) < 0.05;
                  return (
                    <button
                      key={bank.name}
                      type="button"
                      onClick={() => {
                        setInterestRate(rateNum);
                        setSelectedBank(bank.name);
                      }}
                      className={`p-2 rounded-xl text-left border transition ${
                        isSelected
                          ? 'bg-slate-700 border-amber-400 text-white ring-1 ring-amber-400'
                          : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{bank.name}</span>
                        <span className="text-xs font-extrabold text-amber-400">{bank.rate}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                        {bank.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results & Quick Pre-Approval Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Calculated Monthly EMI
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                ₹{monthlyEmi.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-300 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Based on loan principal of ₹{principalRupees.toLocaleString('en-IN')} @ {interestRate}% for {tenureYears} years
              </p>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Principal Loan Amount:</span>
                <span className="font-bold text-white">₹{principalRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Interest Payable:</span>
                <span className="font-bold text-amber-400">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Down Payment Upfront:</span>
                <span className="font-bold text-white">₹{downPaymentRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-200">Total Financial Outlay:</span>
                <span className="font-black text-white">₹{(totalPayment + downPaymentRupees).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Instant In-Principle Loan Pre-Approval Form */}
            {!loanApplied ? (
              <form onSubmit={handleApplyFinance} className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Get Instant In-Principle Approval ({selectedBank})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:ring-1 focus:ring-amber-400"
                  />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="10-digit Mobile No."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Apply Pre-Approved Loan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-400 text-center block">
                  Zero impact on CIBIL score • Instant SMS approval in 10 minutes
                </span>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pre-Approved Loan Offer Generated!</span>
                </div>
                <p className="text-slate-300">
                  Congratulations <strong>{applicantName}</strong>! In-principle approval for <strong>₹{principalRupees.toLocaleString('en-IN')}</strong> with {selectedBank} @ {interestRate}% has been dispatched to <strong>+91 {applicantPhone}</strong>.
                </p>
                <div className="text-[11px] font-mono text-emerald-300">
                  Ref ID: BW-FIN-{Math.floor(1000 + Math.random() * 9000)}
                </div>
                <button
                  onClick={() => setLoanApplied(false)}
                  className="text-xs text-amber-400 underline pt-1 font-semibold"
                >
                  Recalculate or Change Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
