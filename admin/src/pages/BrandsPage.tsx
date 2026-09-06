import React, { useState } from 'react';
import { Award } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const [brands] = useState([
    { id: '1', name: 'Apple', slug: 'apple', featured: true, count: 24 },
    { id: '2', name: 'Samsung', slug: 'samsung', featured: true, count: 19 },
    { id: '3', name: 'Sony', slug: 'sony', featured: true, count: 11 },
    { id: '4', name: 'Dell', slug: 'dell', featured: false, count: 6 },
    { id: '5', name: 'Anker', slug: 'anker', featured: true, count: 14 }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Brand Partners & Manufacturers</h2>
        <p className="text-xs text-slate-500">Official UAE authorized brands and storefront slider logos</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Brand Name</th>
              <th className="py-3.5 px-4">Brand Slug</th>
              <th className="py-3.5 px-4">Featured in Carousel</th>
              <th className="py-3.5 px-5 text-right">Catalog Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-900">{b.name}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{b.slug}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.featured ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.featured ? 'FEATURED' : 'STANDARD'}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right font-black text-slate-900">{b.count} Items</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
