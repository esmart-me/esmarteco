import React, { useState } from 'react';
import { Zap, Clock } from 'lucide-react';
import { formatAED } from '../lib/utils.js';

export const FlashSalesPage: React.FC = () => {
  const [sales] = useState([
    {
      id: 'fs-1',
      title: 'Samsung Galaxy S25 Ultra 512GB - Titanium',
      flash_price: 4699,
      original_price: 5299,
      total_quota: 20,
      remaining_quota: 7,
      ends: '24 Hours Flash Window'
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Flash Sales & Limited Quotas</h2>
        <p className="text-xs text-slate-500">Manage high-urgency promotional deals and countdown stock allocations</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Flash Product</th>
              <th className="py-3.5 px-4">Flash Price (AED)</th>
              <th className="py-3.5 px-4">Allocated Stock</th>
              <th className="py-3.5 px-4">Remaining Units</th>
              <th className="py-3.5 px-5 text-right">Sale Window</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sales.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-900">{s.title}</td>
                <td className="py-3.5 px-4 font-black text-brand-700">{formatAED(s.flash_price)}</td>
                <td className="py-3.5 px-4 text-slate-700 font-semibold">{s.total_quota} Units</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded-full text-[11px]">
                    Only {s.remaining_quota} left
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right font-medium text-slate-600">{s.ends}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
