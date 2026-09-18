import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { AdminUser } from '../../types';

interface Props {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('admin@bharatwheels.in');
  const [password, setPassword] = useState('Admin@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const { user } = await api.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bharat Wheels Showroom</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Bharat Wheels Dealership Portal
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Secure staff access for inventory control, bookings & enquiries
          </p>
        </div>

        <div className="mt-8 bg-slate-900 border border-slate-800 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="admin@bharatwheels.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating Staff...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Preset Credentials Helper Card */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Default Seed Administrator Credentials:</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-200">admin@bharatwheels.in</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Password:</span>
              <span className="text-slate-200">Admin@123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
