-- ====================================================================
-- E SMART ELECTRONICS LLC - COMPREHENSIVE SUPABASE DATABASE SCHEMA
-- Abu Dhabi, United Arab Emirates
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enumerations
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('active', 'inactive', 'draft', 'out_of_stock');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
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
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('card', 'apple_pay', 'google_pay', 'cod', 'tabby', 'tamara');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE admin_role_type AS ENUM (
    'SUPER_ADMIN',
    'PRODUCT_MANAGER',
    'ORDER_MANAGER',
    'MARKETING_MANAGER',
    'CUSTOMER_SUPPORT'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'hidden');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 4. PROFILES & CUSTOMERS (Separated from Auth Secrets)
-- ====================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  account_status TEXT NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 5. ADMIN ROLES & ADMIN USERS
-- ====================================================================

CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name admin_role_type UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role admin_role_type NOT NULL DEFAULT 'CUSTOMER_SUPPORT',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 6. CATALOG: CATEGORIES & BRANDS
-- ====================================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 7. PRODUCTS, IMAGES & VARIANTS
-- ====================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  description TEXT,
  short_description TEXT,
  original_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  sale_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_percentage INTEGER GENERATED ALWAYS AS (
    CASE WHEN original_price > sale_price AND original_price > 0
      THEN ROUND(((original_price - sale_price) / original_price) * 100)::integer
      ELSE 0
    END
  ) STORED,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 3,
  warranty TEXT NOT NULL DEFAULT '1 Year Official UAE Warranty',
  whats_in_box TEXT[] DEFAULT '{}',
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_weekly_offer BOOLEAN NOT NULL DEFAULT false,
  is_flash_sale BOOLEAN NOT NULL DEFAULT false,
  status product_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  storage TEXT,
  ram TEXT,
  size TEXT,
  price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  sku TEXT UNIQUE NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 8. INVENTORY & TRANSACTIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  low_stock_threshold INTEGER NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL, -- 'purchase', 'order_deduction', 'manual_adjustment', 'restock', 'refund'
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 9. CUSTOMER ADDRESSES & WISHLISTS
-- ====================================================================

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  apartment_villa TEXT NOT NULL,
  street TEXT NOT NULL,
  area TEXT,
  city TEXT NOT NULL DEFAULT 'Abu Dhabi',
  emirate TEXT NOT NULL DEFAULT 'Abu Dhabi',
  country TEXT NOT NULL DEFAULT 'United Arab Emirates',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wishlist_id, product_id)
);

-- ====================================================================
-- 10. ORDERS, ITEMS & PAYMENTS (UAE 5% VAT & Tax Invoice Compliant)
-- ====================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- ESM-2026-XXXX
  invoice_number TEXT UNIQUE NOT NULL, -- INV-UAE-2026-XXXX
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  coupon_code TEXT,
  vat_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.05, -- UAE VAT 5%
  vat_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  delivery_type TEXT NOT NULL DEFAULT 'standard',
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_method payment_method NOT NULL DEFAULT 'card',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  order_status order_status NOT NULL DEFAULT 'PENDING',
  tracking_number TEXT,
  carrier TEXT DEFAULT 'E Smart Express Courier UAE',
  special_instructions TEXT,
  tabby_installment JSONB,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  brand TEXT,
  sku TEXT,
  variant_name TEXT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway_reference TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  payment_method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 11. REVIEWS (Moderated)
-- ====================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  image_url TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  status review_status NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 12. PROMOTIONS: COUPONS, OFFERS, FLASH SALES, BANNERS
-- ====================================================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  max_discount NUMERIC(10, 2),
  expiry_date TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER NOT NULL DEFAULT 500,
  times_used INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  discount_applied NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  offer_price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2) NOT NULL,
  discount_percent INTEGER NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  stock_limit INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flash_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flash_price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2) NOT NULL,
  discount_percent INTEGER NOT NULL,
  total_stock INTEGER NOT NULL DEFAULT 15,
  remaining_stock INTEGER NOT NULL DEFAULT 4,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  offer_text TEXT,
  badge TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '/shop',
  banner_type TEXT NOT NULL DEFAULT 'hero' CHECK (banner_type IN ('hero', 'promo_mid', 'promo_small')),
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb
);

-- ====================================================================
-- 13. ANALYTICS, LOGS, NOTIFICATIONS & SETTINGS
-- ====================================================================

CREATE TABLE IF NOT EXISTS website_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'search', 'add_to_cart', 'begin_checkout', 'purchase'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  page_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL, -- 'Product Added', 'Price Changed', 'Stock Changed', 'Order Updated', 'Banner Updated', 'Admin Login'
  record_type TEXT NOT NULL, -- 'product', 'order', 'offer', 'banner', 'coupon'
  record_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'order',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emirate_name TEXT UNIQUE NOT NULL,
  standard_delivery_fee NUMERIC(6, 2) NOT NULL DEFAULT 15.00,
  express_delivery_fee NUMERIC(6, 2) NOT NULL DEFAULT 25.00,
  free_delivery_threshold NUMERIC(6, 2) NOT NULL DEFAULT 250.00,
  estimated_days TEXT NOT NULL DEFAULT '1-2 Days',
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ====================================================================
-- 14. PERFORMANCE INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_weekly ON products(is_weekly_offer) WHERE is_weekly_offer = true;
CREATE INDEX IF NOT EXISTS idx_products_flash ON products(is_flash_sale) WHERE is_flash_sale = true;
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_website_events_type ON website_events(event_type);
CREATE INDEX IF NOT EXISTS idx_website_events_created ON website_events(created_at);

-- ====================================================================
-- 15. UPDATED_AT TRIGGERS
-- ====================================================================

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_homepage_banners_updated_at ON homepage_banners;
CREATE TRIGGER trg_homepage_banners_updated_at BEFORE UPDATE ON homepage_banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view & update only their own profile
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Customers: Customers view own profile; Admins view all
CREATE POLICY "Customers view self" ON customers FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Customers update self" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage customers" ON customers FOR ALL USING (is_admin());

-- Products, Images, Categories, Brands: Public can read active items; Admins can do everything
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active' OR is_admin());
CREATE POLICY "Admins manage products" ON products FOR ALL USING (is_admin());

CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admins manage product images" ON product_images FOR ALL USING (is_admin());

CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Public can view active brands" ON brands FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage brands" ON brands FOR ALL USING (is_admin());

CREATE POLICY "Public can view active offers" ON offers FOR SELECT USING (is_active = true AND end_date > NOW() OR is_admin());
CREATE POLICY "Admins manage offers" ON offers FOR ALL USING (is_admin());

CREATE POLICY "Public can view active flash sales" ON flash_sales FOR SELECT USING (is_active = true AND end_time > NOW() OR is_admin());
CREATE POLICY "Admins manage flash sales" ON flash_sales FOR ALL USING (is_admin());

CREATE POLICY "Public can view active banners" ON homepage_banners FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage banners" ON homepage_banners FOR ALL USING (is_admin());

CREATE POLICY "Public can view delivery settings" ON delivery_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage delivery settings" ON delivery_settings FOR ALL USING (is_admin());

-- Addresses: Users can manage their own addresses
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Wishlists: Users manage their own wishlists
CREATE POLICY "Users manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage own wishlist items" ON wishlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid()) OR is_admin()
);

-- Orders: Users view their own orders; Admins manage all orders
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id OR is_admin());
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage orders" ON orders FOR ALL USING (is_admin());

CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage order items" ON order_items FOR ALL USING (is_admin());

-- Reviews: Public reads approved reviews; authenticated users create; admins moderate
CREATE POLICY "Public reads approved reviews" ON reviews FOR SELECT USING (status = 'approved' OR is_admin());
CREATE POLICY "Auth users insert review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON reviews FOR ALL USING (is_admin());

-- Coupons: Public reads active coupons; Admins manage coupons
CREATE POLICY "Public reads active coupons" ON coupons FOR SELECT USING (is_active = true AND expiry_date > NOW() OR is_admin());
CREATE POLICY "Admins manage coupons" ON coupons FOR ALL USING (is_admin());

-- Inventory & Logs: Admins only
CREATE POLICY "Admins manage inventory" ON inventory FOR ALL USING (is_admin());
CREATE POLICY "Admins manage inventory transactions" ON inventory_transactions FOR ALL USING (is_admin());
CREATE POLICY "Admins view activity logs" ON admin_activity_logs FOR ALL USING (is_admin());
CREATE POLICY "Admins manage admin users" ON admin_users FOR ALL USING (is_admin());
