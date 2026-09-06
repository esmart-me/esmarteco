import React, { useState } from 'react';
import { Mail, Check, Bell } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-card">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-amber-300">
            <Bell className="w-3.5 h-3.5" />
            <span>Stay Ahead on UAE Electronics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Get AED 50 OFF Your First Order
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Subscribe to the E Smart Electronics newsletter for exclusive Abu Dhabi tech launch announcements, weekly secret promo codes, and flash sale notifications.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto">
              <Check className="w-4 h-4" />
              <span>Thank you! Use coupon code <strong>WELCOME50</strong> at checkout for AED 50 OFF!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-12 pl-10 pr-4 text-xs bg-white/10 border border-white/20 rounded-2xl focus:bg-white focus:text-slate-900 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button
                type="submit"
                className="h-12 px-6 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex-shrink-0"
              >
                Subscribe Now
              </button>
            </form>
          )}
          <p className="text-[10px] text-slate-400 pt-1">
            We respect your privacy. Unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
};
