import React, { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [trn, setTrn] = useState('100482910400003');
  const [vatRate, setVatRate] = useState('5');
  const [freeThreshold, setFreeThreshold] = useState('250');
  const [expressFee, setExpressFee] = useState('35');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">UAE Store & Tax Compliance Settings</h2>
        <p className="text-xs text-slate-500">Configure Federal Tax Authority TRN, VAT rate, and Emirates shipping fees</p>
      </div>

      {saved && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>UAE store parameters updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Federal Tax Authority (FTA) TRN
          </label>
          <input
            type="text"
            value={trn}
            onChange={(e) => setTrn(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Standard UAE VAT (%)
            </label>
            <input
              type="number"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Free Delivery Threshold (AED)
            </label>
            <input
              type="number"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Express Same-Day Abu Dhabi & Dubai Delivery (AED)
          </label>
          <input
            type="number"
            value={expressFee}
            onChange={(e) => setExpressFee(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Save UAE Tax & Delivery Settings
          </button>
        </div>
      </form>
    </div>
  );
};
