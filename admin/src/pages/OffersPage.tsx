import React, { useState } from 'react';
import { Flame, Clock, CheckCircle2, Plus } from 'lucide-react';
import { formatAED } from '../lib/utils.js';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState([
    {
      id: 'wo-1',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      original_price: 1499,
      offer_price: 1149,
      discount: '23% OFF',
      expires: '2026-09-12T23:59:59Z',
      active: true
    },
    {
      id: 'wo-2',
      title: 'Apple iPhone 16 Pro Max 256GB Desert Titanium',
      original_price: 5099,
      offer_price: 4799,
      discount: '6% OFF',
      expires: '2026-09-12T23:59:59Z',
      active: true
    }
  ]);

  const toggleStatus = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Weekly Deals & Offers Manager</h2>
          <p className="text-xs text-slate-500">Configure homepage featured weekly deals with live countdown timers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Offer Product</th>
              <th className="py-3.5 px-4">Deal Price (AED)</th>
              <th className="py-3.5 px-4">Discount</th>
              <th className="py-3.5 px-4">Expiry Date</th>
              <th className="py-3.5 px-5 text-right">Status Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {offers.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-900">{o.title}</td>
                <td className="py-3.5 px-4 font-black text-slate-900">{formatAED(o.offer_price)}</td>
                <td className="py-3.5 px-4 font-bold text-brand-700">{o.discount}</td>
                <td className="py-3.5 px-4 text-slate-500">{new Date(o.expires).toLocaleDateString('en-AE')}</td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => toggleStatus(o.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      o.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {o.active ? 'ACTIVE ON STOREFRONT' : 'PAUSED'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
