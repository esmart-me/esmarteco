import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Header } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp.js';

import { HomePage } from './pages/HomePage.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderTrackingPage } from './pages/OrderTrackingPage.js';
import { AccountPage } from './pages/AccountPage.js';
import { ComparePage } from './pages/ComparePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky Header */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1 bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Floating UAE WhatsApp Customer Support */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer />
    </div>
  );
};
