import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Trust Banner in Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine UAE Stock</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic products with official UAE manufacturer warranty.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Express UAE Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fast delivery across Abu Dhabi, Dubai, and all 7 Emirates.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">7 days easy replacement for eligible electronics products.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Tabby & Tamara BNPL</h4>
              <p className="text-xs text-slate-400 mt-0.5">Split payments into 4 interest-free monthly installments.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-lg">
                E
              </div>
              <span className="text-xl font-black text-white tracking-tight">E SMART ELECTRONICS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              E Smart Electronics LLC is your premier retail and online electronics shopping destination in Abu Dhabi, United Arab Emirates. Specializing in authentic smartphones, premium audio, laptops, tablets, and smart gadgets.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Hamdan Bin Mohammed St, Al Danah, Abu Dhabi, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+971 2 642 8990 / WhatsApp: +971 50 892 4118</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>support@esmartelectronics.ae</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Sat - Thu: 9:00 AM - 10:00 PM | Fri: 2:00 PM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">All Electronics</Link></li>
              <li><Link to="/shop?weeklyOffer=true" className="hover:text-white transition-colors">Weekly Deals</Link></li>
              <li><Link to="/shop?flashSale=true" className="hover:text-white transition-colors">Flash Sales</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Top Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/shop?category=smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/shop?category=laptops" className="hover:text-white transition-colors">Laptops & MacBooks</Link></li>
              <li><Link to="/shop?category=tablets" className="hover:text-white transition-colors">Tablets & iPads</Link></li>
              <li><Link to="/shop?category=headphones" className="hover:text-white transition-colors">Headphones & Audio</Link></li>
              <li><Link to="/shop?category=gaming" className="hover:text-white transition-colors">Gaming & Consoles</Link></li>
              <li><Link to="/shop?category=power-banks" className="hover:text-white transition-colors">Power Banks & GaN Chargers</Link></li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Delivery Information (7 Emirates)</Link></li>
              <li><a href="#warranty" onClick={(e) => { e.preventDefault(); alert("All products sold by E Smart Electronics LLC carry 1 to 2 Years official manufacturer UAE warranty with authorized service centers in Abu Dhabi and Dubai."); }} className="hover:text-white transition-colors">Warranty Policy</a></li>
              <li><a href="#returns" onClick={(e) => { e.preventDefault(); alert("Easy 7-day returns for unopened or defective products accompanied by official UAE Tax Invoice."); }} className="hover:text-white transition-colors">Return & Refund Policy</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("We protect your privacy under UAE Federal Data Protection Regulations."); }} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms & conditions governed by UAE Commercial Transactions Law."); }} className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom UAE Tax & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} E Smart Electronics LLC. All Rights Reserved. Abu Dhabi, UAE.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Federal Tax Authority (FTA) Tax Registration Number (TRN): <span className="text-white font-mono font-bold">100482910400003</span> • Standard UAE VAT 5% applies.
            </p>
          </div>

          {/* Supported UAE Payment Gateways */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Accepted UAE Payments:</span>
            <span className="px-2.5 py-1 bg-slate-800 text-white font-bold text-[10px] rounded border border-slate-700">
              VISA
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-white font-bold text-[10px] rounded border border-slate-700">
              Mastercard
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-white font-bold text-[10px] rounded border border-slate-700">
               Pay
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-white font-bold text-[10px] rounded border border-slate-700">
              G Pay
            </span>
            <span className="px-2 py-1 bg-emerald-950 text-emerald-300 font-black text-[10px] rounded border border-emerald-800">
              tabby
            </span>
            <span className="px-2 py-1 bg-orange-950 text-orange-300 font-black text-[10px] rounded border border-orange-800">
              tamara
            </span>
            <span className="px-2 py-1 bg-slate-800 text-slate-300 font-medium text-[10px] rounded border border-slate-700">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
