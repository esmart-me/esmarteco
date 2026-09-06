import React, { useState } from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader.js';

export const HomepageCMSPage: React.FC = () => {
  const [banners, setBanners] = useState([
    {
      id: 'b1',
      title: 'Next-Gen Flagship Smartphones in Abu Dhabi',
      subtitle: 'Experience titanium perfection with official UAE warranty',
      badge: 'OFFICIAL UAE WARRANTY',
      order: 1,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop&q=85',
      active: true
    },
    {
      id: 'b2',
      title: 'Workstation Laptops & M3 MacBook Pro',
      subtitle: 'Engineered for extreme performance. Fast delivery across 7 Emirates',
      badge: 'SAME-DAY DISPATCH',
      order: 2,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=85',
      active: true
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Homepage CMS & Promotional Banners</h2>
        <p className="text-xs text-slate-500">Directly control hero slides, marketing badges and promo banners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="h-44 w-full relative">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Slide #{b.order}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                {b.badge}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
              <p className="text-xs text-slate-500">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
