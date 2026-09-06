import React, { useState } from 'react';
import { Users, Mail, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatAED } from '../lib/utils.js';

export const CustomersPage: React.FC = () => {
  const [customers] = useState([
    { id: '1', name: 'Rashid Al Nuaimi', email: 'rashid.nuaimi@example.ae', phone: '+971 50 123 4567', emirate: 'Abu Dhabi', totalOrders: 4, totalSpent: 12499, status: 'Active VIP' },
    { id: '2', name: 'Mariam Al Mansoori', email: 'mariam.m@example.ae', phone: '+971 55 987 6543', emirate: 'Dubai', totalOrders: 2, totalSpent: 3999, status: 'Active' },
    { id: '3', name: 'Sultan Al Qasimi', email: 'sultan.q@example.ae', phone: '+971 56 444 8899', emirate: 'Sharjah', totalOrders: 1, totalSpent: 5199, status: 'Active' },
    { id: '4', name: 'Fatima Al Zaabi', email: 'fatima.zaabi@example.ae', phone: '+971 52 333 1122', emirate: 'Ras Al Khaimah', totalOrders: 3, totalSpent: 7899, status: 'Active' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">UAE Customer Directory</h2>
        <p className="text-xs text-slate-500">Registered shoppers, Emirates shipping records and spending histories</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Customer Profile</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Primary Emirate</th>
              <th className="py-3.5 px-4">Orders Count</th>
              <th className="py-3.5 px-5 text-right">Lifetime Spend (AED)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5">
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.email}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{c.phone}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">{c.emirate}</td>
                <td className="py-3.5 px-4 font-bold text-brand-700">{c.totalOrders} Orders</td>
                <td className="py-3.5 px-5 text-right font-black text-slate-900">{formatAED(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
