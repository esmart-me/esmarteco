import React from 'react';
import { formatAED } from '../../lib/utils.js';

export const TamaraWidget: React.FC<{ price: number; className?: string }> = ({ price, className }) => {
  const installment = Number((price / 4).toFixed(2));

  return (
    <div className={`p-3 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-between gap-3 text-xs ${className || ''}`}>
      <div className="flex items-center gap-2.5">
        <span className="px-2 py-0.5 rounded bg-gradient-to-r from-orange-400 to-amber-400 text-slate-950 font-black text-[11px] tracking-tight">
          tamara
        </span>
        <span className="text-slate-700">
          Split in 4 payments of <span className="font-bold text-slate-900">{formatAED(installment)}</span>. Sharia-compliant.
        </span>
      </div>
      <span className="text-[10px] text-amber-800 font-semibold underline cursor-pointer hover:text-amber-950 flex-shrink-0">
        Details
      </span>
    </div>
  );
};
