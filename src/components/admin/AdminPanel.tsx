import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Car as CarIcon, 
  CalendarCheck, 
  MessageSquare, 
  BadgeIndianRupee, 
  LogOut, 
  ArrowLeft, 
  RefreshCw,
  Plus,
  User,
  Check
} from 'lucide-react';
import { AdminUser, DashboardStats, Car, TestDriveItem, EnquiryItem, SellRequestItem, CarStatus } from '../../types';
import { api } from '../../services/api';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminInventory } from './AdminInventory';
import { AdminTestDrives } from './AdminTestDrives';
import { AdminEnquiries } from './AdminEnquiries';
import { AdminSellRequests } from './AdminSellRequests';
import { CarFormModal } from './CarFormModal';

interface Props {
  onBackToStore: () => void;
}

type TabKey = 'dashboard' | 'inventory' | 'testDrives' | 'enquiries' | 'sellRequests';

export const AdminPanel: React.FC<Props> = ({ onBackToStore }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Parse subpath from window.location
  const getSubRouteInfo = (): { tab: TabKey; isNewCar: boolean; editCarId: string | null } => {
    if (typeof window === 'undefined') return { tab: 'dashboard', isNewCar: false, editCarId: null };
    const pathname = window.location.pathname;
    if (pathname === '/admin/cars/new') {
      return { tab: 'inventory', isNewCar: true, editCarId: null };
    }
    const editMatch = pathname.match(/^\/admin\/cars\/([^\/]+)\/edit$/);
    if (editMatch) {
      return { tab: 'inventory', isNewCar: false, editCarId: editMatch[1] };
    }
    if (pathname.startsWith('/admin/cars')) {
      return { tab: 'inventory', isNewCar: false, editCarId: null };
    }
    if (pathname.startsWith('/admin/test-drives')) {
      return { tab: 'testDrives', isNewCar: false, editCarId: null };
    }
    if (pathname.startsWith('/admin/enquiries')) {
      return { tab: 'enquiries', isNewCar: false, editCarId: null };
    }
    if (pathname.startsWith('/admin/sell-requests')) {
      return { tab: 'sellRequests', isNewCar: false, editCarId: null };
    }
    return { tab: 'dashboard', isNewCar: false, editCarId: null };
  };

  const initialRoute = getSubRouteInfo();
  const [activeTab, setActiveTab] = useState<TabKey>(initialRoute.tab);

  // Admin Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [sellRequests, setSellRequests] = useState<SellRequestItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Car Form Modal
  const [isCarModalOpen, setIsCarModalOpen] = useState(initialRoute.isNewCar || Boolean(initialRoute.editCarId));
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Check auth session on load
  useEffect(() => {
    checkAuth();
  }, []);

  // Synchronize route changes on popstate
  useEffect(() => {
    const handlePopState = () => {
      const route = getSubRouteInfo();
      setActiveTab(route.tab);
      if (route.isNewCar) {
        setEditingCar(null);
        setIsCarModalOpen(true);
      } else if (route.editCarId && cars.length > 0) {
        const found = cars.find((c) => c.id === route.editCarId);
        if (found) {
          setEditingCar(found);
          setIsCarModalOpen(true);
        }
      } else if (!route.isNewCar && !route.editCarId) {
        setIsCarModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [cars]);

  // If initial route was edit car and cars just loaded, find car
  useEffect(() => {
    if (initialRoute.editCarId && cars.length > 0 && !editingCar) {
      const found = cars.find((c) => c.id === initialRoute.editCarId);
      if (found) {
        setEditingCar(found);
        setIsCarModalOpen(true);
      }
    }
  }, [cars]);

  const navigateToTab = (tab: TabKey) => {
    setActiveTab(tab);
    let targetPath = '/admin';
    if (tab === 'inventory') targetPath = '/admin/cars';
    else if (tab === 'testDrives') targetPath = '/admin/test-drives';
    else if (tab === 'enquiries') targetPath = '/admin/enquiries';
    else if (tab === 'sellRequests') targetPath = '/admin/sell-requests';

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const checkAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        loadAllAdminData();
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [statsRes, carsRes, tdRes, enqRes, sellRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAdminCars(),
        api.getAdminTestDrives(),
        api.getAdminEnquiries(),
        api.getAdminSellRequests()
      ]);

      setStats(statsRes);
      setCars(carsRes);
      setTestDrives(tdRes);
      setEnquiries(enqRes);
      setSellRequests(sellRes);
    } catch (err: any) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  // Car operations
  const handleOpenAddCar = () => {
    setEditingCar(null);
    setIsCarModalOpen(true);
    window.history.pushState(null, '', '/admin/cars/new');
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsCarModalOpen(true);
    window.history.pushState(null, '', `/admin/cars/${car.id}/edit`);
  };

  const handleCloseCarModal = () => {
    setIsCarModalOpen(false);
    setEditingCar(null);
    if (window.location.pathname.startsWith('/admin/cars/')) {
      window.history.pushState(null, '', '/admin/cars');
    }
  };

  const handleSaveCar = async (carPayload: any) => {
    if (editingCar) {
      const updated = await api.updateAdminCar(editingCar.id, carPayload);
      setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast(`Updated ${updated.brand} ${updated.model} successfully`);
    } else {
      const created = await api.createAdminCar(carPayload);
      setCars((prev) => [created, ...prev]);
      showToast(`Added ${created.brand} ${created.model} to inventory`);
    }
    handleCloseCarModal();
    loadAllAdminData();
  };

  const handleUpdateCarStatus = async (carId: string, status: CarStatus) => {
    try {
      const updated = await api.updateAdminCarStatus(carId, status);
      setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, status: updated.status } : c)));
      showToast(`Vehicle status updated to ${status}`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from the inventory? This cannot be undone.')) {
      return;
    }
    try {
      await api.deleteAdminCar(carId);
      setCars((prev) => prev.filter((c) => c.id !== carId));
      showToast('Vehicle deleted from database');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  // Test drive operations
  const handleUpdateTestDriveStatus = async (id: string, status?: string, notes?: string | null) => {
    try {
      const updated = await api.updateTestDriveStatus(id, status, notes);
      setTestDrives((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      showToast(`Booking updated (${updated.status})`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update test drive');
    }
  };

  // Enquiry operations
  const handleUpdateEnquiryStatus = async (id: string, status?: string, notes?: string | null) => {
    try {
      const updated = await api.updateEnquiryStatus(id, status, notes);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
      showToast(`Enquiry updated (${updated.status})`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry');
    }
  };

  // Sell request operations
  const handleUpdateSellRequestStatus = async (id: string, status?: string, notes?: string | null) => {
    try {
      const updated = await api.updateSellRequestStatus(id, status, notes);
      setSellRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      showToast(`Sell request updated (${updated.status})`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update sell request');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Verifying dealership credentials...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(user) => { setCurrentUser(user); loadAllAdminData(); }} onBackToStore={onBackToStore} />;
  }

  const pendingTestDrivesCount = testDrives.filter(t => t.status === 'PENDING').length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'NEW').length;
  const pendingSellCount = sellRequests.filter(s => s.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 p-3.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and portal indicator */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
                BW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    Bharat Wheels
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Staff Portal
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Dealership Management System
                </div>
              </div>
            </div>

            {/* User details and exit button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToStore}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Visit Customer Showroom</span>
              </button>

              <button
                onClick={loadAllAdminData}
                disabled={isLoadingData}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Refresh live data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-amber-400' : ''}`} />
              </button>

              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">{currentUser.role}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                title="Sign out of portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            <button
              onClick={() => navigateToTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigateToTab('inventory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CarIcon className="w-3.5 h-3.5" />
              <span>Vehicles Stock ({cars.length})</span>
            </button>

            <button
              onClick={() => navigateToTab('testDrives')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'testDrives'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Test Drives</span>
              {pendingTestDrivesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                  {pendingTestDrivesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateToTab('enquiries')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enquiries</span>
              {newEnquiriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-purple-500 text-white">
                  {newEnquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateToTab('sellRequests')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'sellRequests'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BadgeIndianRupee className="w-3.5 h-3.5" />
              <span>Sell Valuations</span>
              {pendingSellCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                  {pendingSellCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            onNavigateTab={navigateToTab}
            onOpenAddCar={handleOpenAddCar}
            recentTestDrives={testDrives}
            recentEnquiries={enquiries}
          />
        )}

        {activeTab === 'inventory' && (
          <AdminInventory
            cars={cars}
            isLoading={isLoadingData}
            onOpenAddCar={handleOpenAddCar}
            onEditCar={handleEditCar}
            onUpdateStatus={handleUpdateCarStatus}
            onDeleteCar={handleDeleteCar}
            onRefresh={loadAllAdminData}
          />
        )}

        {activeTab === 'testDrives' && (
          <AdminTestDrives
            bookings={testDrives}
            isLoading={isLoadingData}
            onUpdateStatus={handleUpdateTestDriveStatus}
            onRefresh={loadAllAdminData}
          />
        )}

        {activeTab === 'enquiries' && (
          <AdminEnquiries
            enquiries={enquiries}
            isLoading={isLoadingData}
            onUpdateStatus={handleUpdateEnquiryStatus}
            onRefresh={loadAllAdminData}
          />
        )}

        {activeTab === 'sellRequests' && (
          <AdminSellRequests
            requests={sellRequests}
            isLoading={isLoadingData}
            onUpdateStatus={handleUpdateSellRequestStatus}
            onRefresh={loadAllAdminData}
          />
        )}
      </main>

      {/* Car Add / Edit Modal */}
      <CarFormModal
        isOpen={isCarModalOpen}
        carToEdit={editingCar}
        onClose={handleCloseCarModal}
        onSave={handleSaveCar}
      />
    </div>
  );
};
