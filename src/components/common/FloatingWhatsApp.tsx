import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2">
      {showTooltip && (
        <div className="relative bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-dropdown border border-slate-100 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">Need help shopping?</span>
            <span className="text-[11px] text-slate-500">Chat with Abu Dhabi store team</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45" />
        </div>
      )}

      <a
        href="https://wa.me/971508924118?text=Hello%20E%20Smart%20Electronics,%20I%20have%20an%20inquiry%20about%20a%20product"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
      </a>
    </div>
  );
};
