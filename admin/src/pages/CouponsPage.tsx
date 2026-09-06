import React, { useState } from 'react';
import { Percent, Plus, Tag } from 'lucide-react';
import { formatAED } from '../lib/utils.js';

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'ESMART50', discount: 'AED 50 OFF', minOrder: 500, used: 48, active: true },
    { id: '2', code: 'RAMADAN10', discount: '10% OFF', minOrder: 1000, used: 112, active: true },
    { id: '3', code: 'WELCOME100', discount: 'AED 100 OFF', minOrder: 1500, used: 29, active: true }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Discount Coupons & Promo Codes</h2>
          <p className="text-xs text-slate-500">Configure percentage or fixed UAE Dirham checkout promo codes</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Promo Code</th>
              <th className="py-3.5 px-4">Discount Value</th>
              <th className="py-3.5 px-4">Minimum Order</th>
              <th className="py-3.5 px-4">Times Redeemed</th>
              <th className="py-3.5 px-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5">
                  <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    {c.code}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{c.discount}</td>
                <td className="py-3.5 px-4 text-slate-600">{formatAED(c.minOrder)}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">{c.used} Shoppers</td>
                <td className="py-3.5 px-5 text-right">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
