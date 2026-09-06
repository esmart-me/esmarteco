import React, { useState } from 'react';
import { History, ShieldCheck, UserCheck } from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const [logs] = useState([
    { id: '1', admin: 'SUPER_ADMIN', action: 'UPDATE_STOCK', details: 'Replenished iPhone 16 Pro Max to 18 units', timestamp: new Date().toISOString() },
    { id: '2', admin: 'ORDER_MANAGER', action: 'UPDATE_ORDER_STATUS', details: 'Order ESM-2026-9038 updated to SHIPPED', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: '3', admin: 'PRODUCT_MANAGER', action: 'CREATE_OFFER', details: 'Activated Weekly Deal for Sony WH-1000XM5', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', admin: 'SUPER_ADMIN', action: 'PRICE_UPDATE', details: 'Reduced MacBook Pro sale price to AED 12,899', timestamp: new Date(Date.now() - 14400000).toISOString() }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Admin Activity & Audit Trail</h2>
        <p className="text-xs text-slate-500">Immutable chronological log of all merchant modifications and inventory audits</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Admin Operator</th>
              <th className="py-3.5 px-4">Action Type</th>
              <th className="py-3.5 px-4">Audit Details</th>
              <th className="py-3.5 px-5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-900">{l.admin}</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                    {l.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700">{l.details}</td>
                <td className="py-3.5 px-5 text-right text-slate-500 font-mono">
                  {new Date(l.timestamp).toLocaleTimeString('en-AE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
