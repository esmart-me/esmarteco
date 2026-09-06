import React from 'react';
import { ShieldCheck, Award, Lock, Truck, RefreshCw, HeadphonesIcon } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-6 h-6 text-brand-700" />,
      title: '100% Genuine Products',
      description: 'Guaranteed original consumer electronics sourced directly from authorized UAE distributors.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Official UAE Warranty',
      description: '1 to 2 years manufacturer warranty with authorized service center support in Abu Dhabi & Dubai.'
    },
    {
      icon: <Lock className="w-6 h-6 text-indigo-600" />,
      title: 'Secure UAE Payments',
      description: '256-bit encrypted checkout supporting Visa, Mastercard, Apple Pay, Tabby, and Cash on Delivery.'
    },
    {
      icon: <Truck className="w-6 h-6 text-cyan-600" />,
      title: 'Fast UAE Delivery',
      description: 'Prompt delivery across all 7 Emirates: Abu Dhabi, Dubai, Sharjah, Ajman, RAK, Fujairah, and UAQ.'
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-amber-600" />,
      title: 'Easy 7-Day Returns',
      description: 'Simple, hassle-free returns or exchange policy for verified purchases.'
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-rose-600" />,
      title: 'Dedicated Customer Support',
      description: 'Expert guidance via WhatsApp, phone, or email to assist your technology purchase.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-10 border border-slate-100">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase">PEACE OF MIND</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Why Buy from E Smart Electronics?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Built on trust, speed, and genuine product authenticity for customers across the United Arab Emirates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-card transition-all"
            >
              <div className="p-3 bg-slate-50 rounded-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
