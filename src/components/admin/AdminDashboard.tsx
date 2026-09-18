import React from 'react';
import { 
  Car, 
  CalendarCheck, 
  MessageSquare, 
  BadgeIndianRupee, 
  CheckCircle2, 
  Clock, 
  Database, 
  Layers, 
  Plus, 
  ArrowUpRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { DashboardStats, TestDriveItem, EnquiryItem } from '../../types';

interface Props {
  stats: DashboardStats | null;
  onNavigateTab: (tab: 'inventory' | 'testDrives' | 'enquiries' | 'sellRequests') => void;
  onOpenAddCar: () => void;
  recentTestDrives: TestDriveItem[];
  recentEnquiries: EnquiryItem[];
}

export const AdminDashboard: React.FC<Props> = ({
  stats,
  onNavigateTab,
  onOpenAddCar,
  recentTestDrives,
  recentEnquiries
}) => {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading dealership analytics...</p>
      </div>
    );
  }

  const formatLakhsToCrores = (lakhs: number) => {
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} Lakh`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Bharat Wheels Dealership Operations • Live Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Inventory & Dealership Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Managing certified vehicles across Delhi NCR, Mumbai, Bengaluru, Hyderabad, and Pune.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddCar}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inventory */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats.totalCars}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
            <span className="text-emerald-600 font-bold">{stats.availableCars} Available</span>
            <span>•</span>
            <span>{stats.reservedCars} Reserved</span>
            <span>•</span>
            <span>{stats.soldCars} Sold</span>
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Stock Value</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BadgeIndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatLakhsToCrores(stats.totalInventoryValueLakhs)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Certified pre-owned retail valuation
          </div>
        </div>

        {/* Pending Test Drives */}
        <div 
          onClick={() => onNavigateTab('testDrives')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Test Drive Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
            <span>{stats.pendingTestDrives}</span>
            {stats.pendingTestDrives > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Action Required
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Doorstep & Showroom bookings
          </div>
        </div>

        {/* Customer Inquiries & Sell Requests */}
        <div 
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Customer Leads</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats.newEnquiries} Enquiries
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            + {stats.pendingSellRequests} doorstep valuation requests
          </div>
        </div>
      </div>

      {/* Database & Infrastructure Status Bar */}
      <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-500" />
          <span>Storage Engine: <strong>{stats.databaseType.toUpperCase()}</strong></span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            REST API Active & Connected
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Node.js Express + Prisma ORM
        </div>
      </div>

      {/* Two-Column Grid: Recent Test Drives & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Test Drives */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Test Drive Bookings</h3>
            </div>
            <button
              onClick={() => onNavigateTab('testDrives')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {recentTestDrives.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No test drives booked yet.</p>
            ) : (
              recentTestDrives.slice(0, 4).map((td) => (
                <div key={td.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{td.fullName}</div>
                    <div className="text-[11px] text-slate-500">
                      {td.car ? `${td.car.brand} ${td.car.model}` : 'Vehicle'} • {td.date} ({td.timeSlot})
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    td.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : td.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {td.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Customer Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Customer Leads & Inquiries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {recentEnquiries.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No enquiries submitted yet.</p>
            ) : (
              recentEnquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{enq.name}</span>
                      <span className="text-slate-400 text-[11px]">{enq.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      "{enq.message}"
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    enq.status === 'NEW'
                      ? 'bg-purple-100 text-purple-800'
                      : enq.status === 'CONTACTED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {enq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
