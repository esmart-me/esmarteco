import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext.js';
import { AdminLayout } from './components/AdminLayout.js';

import { LoginPage } from './pages/LoginPage.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { ProductsPage } from './pages/ProductsPage.js';
import { CategoriesPage } from './pages/CategoriesPage.js';
import { BrandsPage } from './pages/BrandsPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { CustomersPage } from './pages/CustomersPage.js';
import { OffersPage } from './pages/OffersPage.js';
import { FlashSalesPage } from './pages/FlashSalesPage.js';
import { CouponsPage } from './pages/CouponsPage.js';
import { HomepageCMSPage } from './pages/HomepageCMSPage.js';
import { ActivityLogsPage } from './pages/ActivityLogsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brands"
        element={
          <ProtectedRoute>
            <BrandsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <OffersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flash-sales"
        element={
          <ProtectedRoute>
            <FlashSalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coupons"
        element={
          <ProtectedRoute>
            <CouponsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners"
        element={
          <ProtectedRoute>
            <HomepageCMSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <ActivityLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
