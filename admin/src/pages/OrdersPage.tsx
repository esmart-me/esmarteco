import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Eye,
  X,
  Printer,
  ChevronDown
} from 'lucide-react';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { formatAED } from '../lib/utils.js';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  const ORDER_STATUSES = [
    'PENDING',
    'PAYMENT_PENDING',
    'PAYMENT_CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
  ];

  const fetchOrders = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setOrders(data);
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    // Default Seed / Mock orders
    setOrders([
      {
        id: 'ord-101',
        order_number: 'ESM-2026-9041',
        customer_name: 'Rashid Al Nuaimi',
        customer_email: 'rashid.nuaimi@example.ae',
        customer_phone: '+971 50 123 4567',
        shipping_address: {
          apartmentVilla: 'Villa 14',
          street: 'Al Saada Street',
          area: 'Al Mushrif',
          city: 'Abu Dhabi',
          emirate: 'Abu Dhabi'
        },
        subtotal: 4951.43,
        vat_amount: 247.57,
        delivery_fee: 0,
        total_amount: 5199,
        payment_method: 'Apple Pay',
        payment_status: 'confirmed',
        order_status: 'PROCESSING',
        tracking_number: 'TRK-AUH-99201',
        carrier: 'Fetchr Express UAE',
        invoice_number: 'INV-2026-0041',
        invoice_date: '2026-09-06',
        items: [
          {
            product_name: 'Apple iPhone 16 Pro Max 256GB - Desert Titanium',
            unit_price: 4799,
            quantity: 1,
            total_price: 4799
          },
          {
            product_name: 'Apple 20W USB-C Power Adapter (UAE 3-pin)',
            unit_price: 400,
            quantity: 1,
            total_price: 400
          }
        ],
        created_at: new Date().toISOString()
      },
      {
        id: 'ord-102',
        order_number: 'ESM-2026-9038',
        customer_name: 'Mariam Al Mansoori',
        customer_email: 'mariam.m@example.ae',
        customer_phone: '+971 55 987 6543',
        shipping_address: {
          apartmentVilla: 'Apt 1204',
          street: 'Downtown Boulevard',
          area: 'Downtown Dubai',
          city: 'Dubai',
          emirate: 'Dubai'
        },
        subtotal: 1427.62,
        vat_amount: 71.38,
        delivery_fee: 0,
        total_amount: 1499,
        payment_method: 'Credit Card',
        payment_status: 'confirmed',
        order_status: 'SHIPPED',
        tracking_number: 'TRK-DXB-55421',
        carrier: 'Aramex UAE',
        invoice_number: 'INV-2026-0038',
        invoice_date: '2026-09-05',
        items: [
          {
            product_name: 'Sony WH-1000XM5 Wireless Headphones - Black',
            unit_price: 1499,
            quantity: 1,
            total_price: 1499
          }
        ],
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (isSupabaseConfigured && orderId.length === 36) {
      await supabaseAdmin
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
    triggerToast(`Order status transitioned to "${newStatus}"`);
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Orders & Fulfillment Pipeline</h2>
          <p className="text-xs text-slate-500">
            UAE 7 Emirates fulfillment, 10-status order states, and FTA VAT Tax Invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            {ORDER_STATUSES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-5">Order #</th>
                <th className="py-3.5 px-4">Customer & Emirate</th>
                <th className="py-3.5 px-4">Amount (AED)</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-5 text-right">Tax Invoice & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-bold text-brand-700">{ord.order_number}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(ord.created_at).toLocaleDateString('en-AE')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{ord.customer_name}</div>
                    <div className="text-[11px] text-slate-500">
                      {ord.shipping_address?.emirate || 'Abu Dhabi'} • {ord.customer_phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{formatAED(ord.total_amount)}</div>
                    <div className="text-[10px] text-slate-400">VAT 5%: {formatAED(ord.vat_amount)}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">{ord.payment_method}</span>
                    <div className="text-[10px] text-emerald-600 font-semibold">{ord.payment_status}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.order_status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border focus:outline-none ${
                        ord.order_status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.order_status === 'SHIPPED'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {ORDER_STATUSES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setShowInvoiceModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Tax Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official UAE Tax Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-black text-sm">
                  E
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">E SMART ELECTRONICS LLC</h4>
                  <p className="text-[10px] text-slate-400">Abu Dhabi • United Arab Emirates</p>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tax Invoice Number</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrder.invoice_number || 'INV-2026-9041'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">FTA TRN</span>
                  <span className="font-mono font-bold text-slate-900">100482910400003</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-bold text-slate-900">{selectedOrder.invoice_date || '2026-09-06'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Customer & Delivery</span>
                <p className="font-bold text-slate-900">{selectedOrder.customer_name}</p>
                <p className="text-slate-600">{selectedOrder.shipping_address?.apartmentVilla}, {selectedOrder.shipping_address?.street}</p>
                <p className="text-slate-600">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.emirate}, UAE</p>
                <p className="text-slate-600">Phone: {selectedOrder.customer_phone}</p>
              </div>

              {/* Items */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="p-2">Item Description</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedOrder.items || []).map((itm: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 font-medium text-slate-800">{itm.product_name}</td>
                        <td className="p-2 text-center text-slate-600">{itm.quantity}</td>
                        <td className="p-2 text-right font-bold text-slate-900">{formatAED(itm.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financials with UAE 5% VAT breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Excluding VAT)</span>
                  <span>{formatAED(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UAE VAT (Standard 5%)</span>
                  <span>{formatAED(selectedOrder.vat_amount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Across Emirates</span>
                  <span>{selectedOrder.delivery_fee === 0 ? 'FREE' : formatAED(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total (AED)</span>
                  <span>{formatAED(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
