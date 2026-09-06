import React, { useState } from 'react';
import { Layers, Plus, Edit2 } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories] = useState([
    { id: '1', name: 'Smartphones & iPhones', slug: 'smartphones', icon: 'Smartphone', count: 18 },
    { id: '2', name: 'Laptops & MacBooks', slug: 'laptops', icon: 'Laptop', count: 12 },
    { id: '3', name: 'Tablets & iPads', slug: 'tablets', icon: 'Tablet', count: 9 },
    { id: '4', name: 'Audio & Headphones', slug: 'headphones', icon: 'Headphones', count: 15 },
    { id: '5', name: 'Gaming Consoles & Gear', slug: 'gaming', icon: 'Gamepad2', count: 8 },
    { id: '6', name: 'Power Banks & Chargers', slug: 'power-banks', icon: 'BatteryCharging', count: 14 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Electronics Categories</h2>
          <p className="text-xs text-slate-500">Organize store navigation taxonomy and storefront filter slugs</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Category Name</th>
              <th className="py-3.5 px-4">URL Slug</th>
              <th className="py-3.5 px-4">Icon Name</th>
              <th className="py-3.5 px-5 text-right">Live Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-bold text-slate-900">{c.name}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">/shop?category={c.slug}</td>
                <td className="py-3.5 px-4 text-brand-700 font-semibold">{c.icon}</td>
                <td className="py-3.5 px-5 text-right font-black text-slate-900">{c.count} Items</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
