import React from 'react';
import { formatAED } from '../../lib/utils.js';

export const TabbyWidget: React.FC<{ price: number; className?: string }> = ({ price, className }) => {
  const installment = Number((price / 4).toFixed(2));

  return (
    <div className={`p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between gap-3 text-xs ${className || ''}`}>
      <div className="flex items-center gap-2.5">
        <span className="px-2 py-0.5 rounded bg-[#3EEDB4] text-slate-950 font-black text-[11px] tracking-tight">
          tabby
        </span>
        <span className="text-slate-700">
          Pay 4 interest-free payments of <span className="font-bold text-slate-900">{formatAED(installment)}</span>. No late fees.
        </span>
      </div>
      <span className="text-[10px] text-emerald-800 font-semibold underline cursor-pointer hover:text-emerald-950 flex-shrink-0">
        Learn more
      </span>
    </div>
  );
};
