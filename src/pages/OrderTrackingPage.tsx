import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { Order, OrderStatus } from '../types/index.js';
import { formatAED } from '../lib/utils.js';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal.js';

const ORDER_STEPS: OrderStatus[] = [
  'Order Received',
  'Payment Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const OrderTrackingPage: React.FC = () => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const location = useLocation();

  const [inputQuery, setInputQuery] = useState(paramOrderNumber || '');
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (paramOrderNumber && !order) {
      handleSearch(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleSearch = async (orderNo: string) => {
    if (!orderNo.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await apiRequest(`/orders/track/${encodeURIComponent(orderNo.trim())}`);
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setOrder(null);
        setErrorMsg(res.message || `No order found for reference "${orderNo}".`);
      }
    } catch (err) {
      setErrorMsg('Error tracking order.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase">UAE DELIVERY RADAR</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Track Your Electronics Order
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your E Smart Electronics order number (e.g. ESM-2026-8921) to track dispatch across the UAE.
          </p>
        </div>

        {/* Search input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(inputQuery);
          }}
          className="max-w-md mx-auto flex gap-2 mb-10"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value.toUpperCase())}
              placeholder="Enter Order Number (e.g. ESM-2026-8921)"
              required
              className="w-full h-12 pl-10 pr-4 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-600 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-6 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-2xl transition-colors shadow-sm"
          >
            {isLoading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-semibold max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details & Progress Timeline */}
        {order && (
          <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-brand-700 font-mono">{order.orderNumber}</span>
                  <span className="px-2.5 py-0.5 bg-brand-100 text-brand-800 rounded-full text-[10px] font-black uppercase">
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Ordered on {order.createdAt.split('T')[0]} • UAE Express Carrier: {order.carrier || 'E Smart Delivery'}
                </p>
                {order.trackingNumber && (
                  <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                    Courier Airway Bill: <strong>{order.trackingNumber}</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <FileText className="w-4 h-4 text-brand-700" />
                  <span>View Official UAE Tax Invoice</span>
                </button>
              </div>
            </div>

            {/* 10-Status Lifecycle Step Timeline */}
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-6">Delivery Progress</h3>
              <div className="relative">
                <div className="hidden sm:grid grid-cols-7 gap-2 text-center relative z-10">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                            isDone
                              ? 'bg-brand-700 text-white ring-4 ring-brand-100 shadow-sm'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] leading-tight font-bold ${
                            isCurrent ? 'text-brand-700' : isDone ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar line connecting dots */}
                <div className="hidden sm:block absolute top-4 left-8 right-8 h-0.5 bg-slate-200 -z-0">
                  <div
                    className="bg-brand-600 h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, (currentStepIdx / (ORDER_STEPS.length - 1)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Status History Notes Log */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800">Dispatch Log:</h4>
                  <div className="space-y-1.5 text-slate-600">
                    {order.statusHistory.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-mono text-[10px] mt-0.5">
                          {item.timestamp.split('T')[0]} {item.timestamp.split('T')[1]?.substring(0, 5)}
                        </span>
                        <span className="font-bold text-slate-800">{item.status}:</span>
                        <span>{item.note || 'Status updated'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Items Ordered */}
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                Items in This Package ({order.items.length})
              </h3>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage} alt="" className="w-12 h-12 object-contain mix-blend-multiply flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.productTitle}</p>
                        <p className="text-[11px] text-slate-400">
                          Brand: {item.brand} • SKU: {item.sku} {item.variantName ? `• ${item.variantName}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{formatAED(item.totalPrice)}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Delivery Destination
                </span>
                <p className="font-bold text-slate-900">
                  {order.shippingAddress.emirate}, United Arab Emirates
                </p>
                <p className="text-slate-600">{order.shippingAddress.area || order.shippingAddress.city}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Payment Summary
                </span>
                <p className="font-bold text-slate-900">
                  Total: {formatAED(order.total)} (Includes 5% UAE VAT)
                </p>
                <p className="text-emerald-700 font-semibold uppercase">
                  Method: {order.paymentMethod} • Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Printable Tax Invoice Modal */}
        <TaxInvoiceModal order={order} onClose={() => setIsInvoiceOpen(false)} />
      </div>
    </div>
  );
};
