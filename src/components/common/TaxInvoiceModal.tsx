import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types/index.js';
import { formatAED } from '../../lib/utils.js';

interface TaxInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-slate-100 p-6 sm:p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Actions (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Official UAE FTA Tax Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content */}
        <div id="tax-invoice-printable" className="pt-4 text-slate-800 text-xs">
          {/* Company Branding & UAE TRN */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white font-black text-base">
                  E
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-950">E SMART ELECTRONICS LLC</h1>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Hamdan Bin Mohammed St, Al Danah, Abu Dhabi, UAE</p>
              <p className="text-[11px] text-slate-500">Phone: +971 2 642 8990 | Email: support@esmartelectronics.ae</p>
              <div className="mt-2 inline-block bg-slate-100 px-2.5 py-1 rounded text-[11px] font-mono font-bold text-slate-900 border border-slate-200">
                TRN: 100482910400003 (UAE FTA)
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 font-extrabold text-sm rounded-lg uppercase tracking-wider mb-2">
                TAX INVOICE / فاتورة ضريبية
              </span>
              <p className="font-bold text-slate-900">Invoice No: <span className="font-mono">{order.invoiceNumber}</span></p>
              <p className="text-slate-600">Order Ref: <span className="font-mono">{order.orderNumber}</span></p>
              <p className="text-slate-600">Date: {order.invoiceDate || order.createdAt.split('T')[0]}</p>
              <p className="text-slate-600">Payment: <span className="font-bold uppercase text-slate-900">{order.paymentMethod}</span></p>
            </div>
          </div>

          {/* Customer & Delivery Address */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Billed & Shipped To:</h3>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{order.customer.fullName}</p>
              <p className="text-slate-600">{order.customer.phone}</p>
              <p className="text-slate-600">{order.customer.email}</p>
            </div>

            <div>
              <h3 className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Delivery Destination:</h3>
              <p className="text-slate-800 mt-0.5">{order.shippingAddress.apartmentVilla}, {order.shippingAddress.street}</p>
              <p className="text-slate-800">{order.shippingAddress.area}, {order.shippingAddress.city}</p>
              <p className="font-semibold text-slate-900">{order.shippingAddress.emirate}, United Arab Emirates</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price (AED)</th>
                  <th className="py-2 text-right">Total (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-2.5 pr-2">
                      <p className="font-bold text-slate-900">{item.productTitle}</p>
                      <p className="text-[10px] text-slate-400">
                        Brand: {item.brand} | SKU: {item.sku} {item.variantName ? `| ${item.variantName}` : ''}
                      </p>
                    </td>
                    <td className="py-2.5 text-center font-semibold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-medium">{formatAED(item.unitPrice).replace('AED ', '')}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">
                      {formatAED(item.totalPrice).replace('AED ', '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & VAT Breakdown */}
          <div className="mt-6 pt-4 border-t-2 border-slate-200 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Subtotal:</span>
                <span className="font-semibold">{formatAED(order.subtotal)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-semibold">-{formatAED(order.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>UAE Delivery ({order.deliveryType}):</span>
                <span className="font-semibold">{order.deliveryFee === 0 ? 'FREE' : formatAED(order.deliveryFee)}</span>
              </div>

              <div className="flex justify-between text-slate-900 font-medium pt-1 border-t border-slate-100">
                <span>UAE VAT (5% FTA Standard):</span>
                <span className="font-bold">{formatAED(order.vatAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-brand-700">{formatAED(order.total)}</span>
              </div>

              <div className="text-[10px] text-slate-400 text-right pt-1">
                Prices include 5% UAE Value Added Tax (VAT)
              </div>
            </div>
          </div>

          {/* Official Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>Thank you for shopping with E Smart Electronics LLC, Abu Dhabi.</p>
            <p>Customer Support: support@esmartelectronics.ae</p>
          </div>
        </div>
      </div>
    </div>
  );
};
