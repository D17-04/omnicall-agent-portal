import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, Headphones } from 'lucide-react';
import { useCallCenter } from '../context/CallCenterContext';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useCallCenter();
  const [email, setEmail] = useState('alex.rivera@omnicall.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email || 'alex.rivera@omnicall.io');
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('alex.rivera@omnicall.io');
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xl ring-8 ring-teal-500/20">
            <PhoneCall className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          OmniCall Agent Portal
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-400">
          Enterprise Telephony & Customer Service Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          <div className="mb-6 p-3 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-800">
              <span className="font-semibold block text-teal-900">Take-Home Demo Authentication</span>
              Any credentials work. Click &quot;One-Click Agent Sign In&quot; to test immediately.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="agent-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Agent Email / Work ID
              </label>
              <div className="mt-1 relative">
                <input
                  id="agent-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@company.com"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="agent-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="agent-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <input
                  id="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="remember-me" className="text-slate-600 font-medium">
                  Remember station
                </label>
              </div>
              <span className="text-teal-700 font-semibold cursor-pointer hover:underline">
                Role: Agent Tier 1
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md"
              isLoading={isLoading}
            >
              Sign In to Agent Console
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full text-xs font-bold text-slate-800"
              icon={<Headphones className="w-4 h-4 text-teal-600" />}
              onClick={handleQuickDemoLogin}
            >
              One-Click Demo Agent Sign In
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          OmniCall Unified Contact Center v3.8 • WebRTC Enabled
        </p>
      </div>
    </div>
  );
};
