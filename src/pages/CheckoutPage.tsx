import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import { formatAED } from '../lib/utils.js';
import { PaymentMethod } from '../types/index.js';

const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain'
];

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    vatAmount,
    deliveryFee,
    total,
    deliveryType,
    setDeliveryType,
    selectedEmirate,
    setSelectedEmirate,
    couponCode,
    clearCart
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [apartmentVilla, setApartmentVilla] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Abu Dhabi');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2028');
  const [cvv, setCvv] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please provide your full name, email, and mobile phone number.');
      return;
    }

    if (!apartmentVilla.trim() || !street.trim()) {
      setErrorMessage('Please provide your complete UAE delivery address (Villa/Apartment and Street).');
      return;
    }

    if (paymentMethod === 'card') {
      const plainCard = cardNumber.replace(/\s/g, '');
      if (plainCard.length < 15) {
        setErrorMessage('Please enter a valid 16-digit credit/debit card number.');
        return;
      }
      if (cvv.length < 3) {
        setErrorMessage('Please enter a valid 3-digit or 4-digit CVV security code.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName,
          email,
          phone
        },
        shippingAddress: {
          apartmentVilla,
          street,
          area,
          city: city || selectedEmirate,
          emirate: selectedEmirate,
          country: 'United Arab Emirates',
          specialInstructions
        },
        items: cart.map(item => ({
          productId: item.product.id,
          productTitle: item.product.title,
          variantId: item.selectedVariant?.id,
          quantity: item.quantity
        })),
        deliveryType,
        couponCode: couponCode || undefined,
        paymentMethod,
        paymentDetails:
          paymentMethod === 'card'
            ? {
                cardNumber,
                cardHolder: cardHolder || fullName,
                expiryMonth,
                expiryYear,
                cvv
              }
            : undefined
      };

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      if (res.success && res.order) {
        clearCart();
        navigate(`/order-confirmation/${res.order.orderNumber}`, {
          state: { order: res.order }
        });
      } else {
        setErrorMessage(res.message || 'Payment processing failed. Please verify your details.');
      }
    } catch (err: any) {
      setErrorMessage('Error submitting order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/cart" className="hover:text-slate-700">Cart</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">UAE Express Checkout</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
          Checkout & UAE Delivery
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Details & Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Customer Information */}
            <div className="bg-slate-50/70 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">1</span>
                  <span>Customer Contact Details</span>
                </h2>
                {!user && (
                  <span className="text-xs text-slate-500 font-medium">
                    (Guest Checkout enabled)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Mansoor Al Ketbi"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone (UAE +971) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    placeholder="+971 50 123 4567"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Email Address (For Tax Invoice & Tracking) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@domain.ae"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. UAE Delivery Address */}
            <div className="bg-slate-50/70 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">2</span>
                  <span>UAE Delivery Destination</span>
                </h2>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <Truck className="w-4 h-4" />
                  <span>All 7 Emirates Covered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emirate *</label>
                  <select
                    value={selectedEmirate}
                    onChange={e => {
                      setSelectedEmirate(e.target.value);
                      setCity(e.target.value);
                    }}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600 font-medium"
                  >
                    {UAE_EMIRATES.map(em => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Area *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="e.g. Al Danah / Khalifa City / Downtown"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apartment / Villa Number *</label>
                  <input
                    type="text"
                    value={apartmentVilla}
                    onChange={e => setApartmentVilla(e.target.value)}
                    required
                    placeholder="e.g. Flat 402 or Villa 15"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Street / Building Name *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    required
                    placeholder="e.g. Hamdan Street, Tower B"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Special Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Leave with building security, call upon arrival"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="pt-2">
                <label className="block font-bold text-slate-700 text-xs mb-2">Delivery Speed:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setDeliveryType('standard')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryType === 'standard'
                        ? 'border-brand-700 bg-brand-50/50 ring-2 ring-brand-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="delivery_type"
                        checked={deliveryType === 'standard'}
                        onChange={() => setDeliveryType('standard')}
                        className="text-brand-700"
                      />
                      <div>
                        <p className="font-bold text-slate-900">Standard UAE Delivery</p>
                        <p className="text-[11px] text-slate-500">1-2 Business Days</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {subtotal >= 250 ? <span className="text-emerald-600">FREE</span> : 'AED 15'}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryType('express')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryType === 'express'
                        ? 'border-brand-700 bg-brand-50/50 ring-2 ring-brand-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="delivery_type"
                        checked={deliveryType === 'express'}
                        onChange={() => setDeliveryType('express')}
                        className="text-brand-700"
                      />
                      <div>
                        <p className="font-bold text-slate-900">Express Priority Delivery</p>
                        <p className="text-[11px] text-slate-500">Same Day / Next Morning</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">AED 25</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. UAE Payment System */}
            <div className="bg-slate-50/70 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs">3</span>
                  <span>UAE Payment Gateway</span>
                </h2>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Method Radio Options */}
              <div className="space-y-3">
                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer block transition-all ${
                    paymentMethod === 'card'
                      ? 'border-brand-700 bg-white ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-brand-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
                        <p className="text-[11px] text-slate-500">Visa, Mastercard (3D Secure UAE Auth)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded">VISA</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded">Mastercard</span>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-150">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Card Number *</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 1234 5678 9010"
                          maxLength={19}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm tracking-widest outline-none focus:border-brand-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Cardholder Name *</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={e => setCardHolder(e.target.value)}
                          placeholder="Name on card"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={expiryMonth}
                              onChange={e => setExpiryMonth(e.target.value.slice(0, 2))}
                              placeholder="MM"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center outline-none"
                            />
                            <input
                              type="text"
                              value={expiryYear}
                              onChange={e => setExpiryYear(e.target.value.slice(0, 4))}
                              placeholder="YYYY"
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">CVV / CVC *</label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={e => setCvv(e.target.value.slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Tabby (Pay in 4) */}
                <label
                  onClick={() => setPaymentMethod('tabby')}
                  className={`p-4 rounded-2xl border cursor-pointer block transition-all ${
                    paymentMethod === 'tabby'
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'tabby'}
                        onChange={() => setPaymentMethod('tabby')}
                        className="text-emerald-600"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Pay in 4 installments with Tabby</p>
                        <p className="text-[11px] text-slate-500">
                          4 interest-free payments of <strong>{formatAED(total / 4)}/mo</strong>. No fees.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#3EEDB4] text-slate-950 font-black text-xs rounded-lg">
                      tabby
                    </span>
                  </div>
                </label>

                {/* Tamara */}
                <label
                  onClick={() => setPaymentMethod('tamara')}
                  className={`p-4 rounded-2xl border cursor-pointer block transition-all ${
                    paymentMethod === 'tamara'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'tamara'}
                        onChange={() => setPaymentMethod('tamara')}
                        className="text-orange-600"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Pay later or in installments with Tamara</p>
                        <p className="text-[11px] text-slate-500">
                          Split in 4 payments of <strong>{formatAED(total / 4)}/mo</strong>. Sharia compliant.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-orange-400 to-amber-400 text-slate-950 font-black text-xs rounded-lg">
                      tamara
                    </span>
                  </div>
                </label>

                {/* Apple Pay / Google Pay */}
                <label
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-4 rounded-2xl border cursor-pointer block transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'apple_pay'}
                        onChange={() => setPaymentMethod('apple_pay')}
                        className="text-slate-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Apple Pay / Google Pay</p>
                        <p className="text-[11px] text-slate-500">Biometric 1-touch mobile payment</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-slate-900"> Pay / G Pay</span>
                  </div>
                </label>

                {/* Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer block transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-700 bg-brand-50/50 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-brand-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-slate-500">Pay cash or card to courier upon receipt</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      UAE Dirhams Only
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Place Order Button */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <h3 className="text-base font-black text-slate-900">Order Summary ({cart.length} items)</h3>

              {/* Mini items preview */}
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-200/60 pr-1">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.selectedVariant?.id || 'base'}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.product.images[0]} alt="" className="w-10 h-10 object-contain mix-blend-multiply flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                        <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 flex-shrink-0">{formatAED(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold text-slate-900">{formatAED(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({couponCode}):</span>
                    <span className="font-bold">-{formatAED(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>UAE Delivery ({deliveryType}):</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatAED(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-900 pt-1 border-t border-slate-200">
                  <span>UAE VAT (5% FTA Standard):</span>
                  <span className="font-bold">{formatAED(vatAmount)}</span>
                </div>

                <div className="flex justify-between text-lg font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-brand-700">{formatAED(total)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-brand-700 hover:bg-brand-800 text-white font-black rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Place Order & Pay {formatAED(total)}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-500 text-center space-y-1 pt-1">
                <p>Official 5% UAE VAT Tax Invoice issued instantly.</p>
                <p>By placing order you agree to E Smart Electronics LLC terms.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
