import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, CheckCircle2, ArrowUpDown, RefreshCw } from 'lucide-react';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { formatAED } from '../lib/utils.js';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filterLowOnly, setFilterLowOnly] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchInventory = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabaseAdmin.from('products').select('*').order('stock_quantity', { ascending: true });
        if (data) {
          setProducts(data);
          return;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    setProducts([
      { id: '1', name: 'Sony WH-1000XM5 Wireless Headphones', sku: 'SNY-WH-001', stock_quantity: 2, low_stock_threshold: 5, sale_price: 1149 },
      { id: '2', name: 'Apple MacBook Pro 16" M3 Max', sku: 'MBP-16-M3', stock_quantity: 4, low_stock_threshold: 5, sale_price: 12899 },
      { id: '3', name: 'Samsung Galaxy S25 Ultra 512GB', sku: 'SAM-S25U', stock_quantity: 8, low_stock_threshold: 5, sale_price: 4949 },
      { id: '4', name: 'Apple iPhone 16 Pro Max 256GB', sku: 'IPH-16PM', stock_quantity: 18, low_stock_threshold: 5, sale_price: 4799 },
      { id: '5', name: 'Anker 737 Power Bank (PowerCore 24K)', sku: 'ANK-737', stock_quantity: 25, low_stock_threshold: 10, sale_price: 449 }
    ]);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    if (isSupabaseConfigured && id.length === 36) {
      await supabaseAdmin.from('products').update({ stock_quantity: newStock }).eq('id', id);
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: newStock } : p));
    triggerToast(`Inventory replenished to ${newStock} units`);
  };

  const list = filterLowOnly
    ? products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 5))
    : products;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory Stock Radar</h2>
          <p className="text-xs text-slate-500">Live warehouse monitoring, safety thresholds and batch restocking</p>
        </div>

        <button
          onClick={() => setFilterLowOnly(!filterLowOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
            filterLowOnly
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{filterLowOnly ? 'Showing Low Stock Only' : 'Filter Low Stock'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-5">Product SKU & Title</th>
              <th className="py-3.5 px-4">Threshold</th>
              <th className="py-3.5 px-4">Available Units</th>
              <th className="py-3.5 px-4">Inventory Status</th>
              <th className="py-3.5 px-5 text-right">Instant Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {list.map((item) => {
              const isLow = item.stock_quantity <= (item.low_stock_threshold || 5);
              return (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.sku}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">{item.low_stock_threshold || 5} units</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{item.stock_quantity}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isLow ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {isLow ? 'CRITICAL LOW STOCK' : 'HEALTHY'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => handleUpdateStock(item.id, item.stock_quantity + 10)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                    >
                      +10 Units
                    </button>
                    <button
                      onClick={() => handleUpdateStock(item.id, item.stock_quantity + 50)}
                      className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg text-xs"
                    >
                      +50 Batch
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
