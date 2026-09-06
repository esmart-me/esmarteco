-- ====================================================================
-- E SMART ELECTRONICS LLC - INITIAL SEED DATA FOR SUPABASE
-- Abu Dhabi, United Arab Emirates
-- ====================================================================

-- 1. Admin Roles
INSERT INTO admin_roles (role_name, description, permissions)
VALUES
  ('SUPER_ADMIN', 'Full system access and administrator management', '["all"]'::jsonb),
  ('PRODUCT_MANAGER', 'Manage products, categories, brands, and inventory', '["products", "categories", "brands", "inventory"]'::jsonb),
  ('ORDER_MANAGER', 'Manage orders, fulfillment, payments, and delivery', '["orders", "payments", "delivery"]'::jsonb),
  ('MARKETING_MANAGER', 'Manage banners, weekly offers, flash sales, and coupons', '["banners", "offers", "flash_sales", "coupons"]'::jsonb),
  ('CUSTOMER_SUPPORT', 'Customer inquiries, reviews, and order tracking', '["customers", "reviews", "orders_read"]'::jsonb)
ON CONFLICT (role_name) DO NOTHING;

-- 2. Delivery Settings for All 7 Emirates
INSERT INTO delivery_settings (emirate_name, standard_delivery_fee, express_delivery_fee, free_delivery_threshold, estimated_days)
VALUES
  ('Abu Dhabi', 15.00, 25.00, 250.00, '1-2 Days'),
  ('Dubai', 15.00, 25.00, 250.00, '1-2 Days'),
  ('Sharjah', 18.00, 28.00, 250.00, '1-2 Days'),
  ('Ajman', 18.00, 28.00, 250.00, '2-3 Days'),
  ('Ras Al Khaimah', 20.00, 30.00, 250.00, '2-3 Days'),
  ('Fujairah', 20.00, 30.00, 250.00, '2-3 Days'),
  ('Umm Al Quwain', 20.00, 30.00, 250.00, '2-3 Days')
ON CONFLICT (emirate_name) DO NOTHING;

-- 3. Categories (16 Core Categories)
INSERT INTO categories (id, name, slug, icon, image_url, description, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Smartphones', 'smartphones', 'Smartphone', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80', 'Flagship & 5G smartphones from Apple, Samsung, Xiaomi & more', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Tablets', 'tablets', 'Tablet', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80', 'Apple iPads, Samsung Galaxy Tabs & high-performance Android tablets', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Laptops', 'laptops', 'Laptop', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', 'MacBooks, gaming laptops, ultrabooks & professional workstations', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Smartwatches', 'smartwatches', 'Watch', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80', 'Apple Watch, Samsung Galaxy Watch & fitness wearables', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Headphones', 'headphones', 'Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 'Over-ear noise cancelling headphones by Sony, Bose & Apple', 5),
  ('c1000000-0000-0000-0000-000000000006', 'TWS Earbuds', 'tws-earbuds', 'Earbuds', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', 'AirPods Pro, Galaxy Buds, Sony WF series wireless earbuds', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Speakers', 'speakers', 'Speaker', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80', 'Marshall, JBL, Bose bluetooth & home party speakers', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Power Banks', 'power-banks', 'BatteryCharging', 'https://images.unsplash.com/photo-1609592424368-80945cbba743?w=600&auto=format&fit=crop&q=80', 'Fast-charging portable chargers & laptop high-wattage powerbanks', 8),
  ('c1000000-0000-0000-0000-000000000009', 'Chargers', 'chargers', 'Zap', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', 'GaN fast wall chargers, MagSafe & multi-port charging hubs', 9),
  ('c1000000-0000-0000-0000-000000000010', 'Cables', 'cables', 'Cable', 'https://images.unsplash.com/photo-1558383331-f520f2888351?w=600&auto=format&fit=crop&q=80', 'Braided USB-C, Thunderbolt 4, HDMI 2.1 & Lightning cables', 10),
  ('c1000000-0000-0000-0000-000000000011', 'Mobile Accessories', 'mobile-accessories', 'SmartphoneNfc', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80', 'Cases, screen protectors, car mounts & MagSafe wallets', 11),
  ('c1000000-0000-0000-0000-000000000012', 'Computer Accessories', 'computer-accessories', 'Mouse', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80', 'Keyboards, mice, USB docks, monitors & webcams', 12),
  ('c1000000-0000-0000-0000-000000000013', 'Gaming', 'gaming', 'Gamepad2', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80', 'PlayStation 5, Xbox Series X, Nintendo Switch & controllers', 13),
  ('c1000000-0000-0000-0000-000000000014', 'Smart Devices', 'smart-devices', 'Cpu', 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80', 'Smart home hubs, security cameras, smart plugs & lighting', 14),
  ('c1000000-0000-0000-0000-000000000015', 'Multimedia', 'multimedia', 'Tv', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80', 'Apple TV 4K, smart streaming sticks, projectors & audio DACs', 15),
  ('c1000000-0000-0000-0000-000000000016', 'Other Electronics', 'other-electronics', 'Radio', 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80', 'Drones, action cameras, digital voice recorders & electronic tools', 16)
ON CONFLICT (slug) DO NOTHING;

-- 4. Brands
INSERT INTO brands (id, name, slug, logo_url, is_featured)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', true),
  ('b1000000-0000-0000-0000-000000000002', 'Samsung', 'samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', true),
  ('b1000000-0000-0000-0000-000000000003', 'Sony', 'sony', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000004', 'Dell', 'dell', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg', true),
  ('b1000000-0000-0000-0000-000000000005', 'Anker', 'anker', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Anker_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000006', 'Bose', 'bose', 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bose_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000007', 'Marshall', 'marshall', 'https://upload.wikimedia.org/wikipedia/commons/9/91/Marshall_Amps_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000008', 'Lenovo', 'lenovo', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg', true),
  ('b1000000-0000-0000-0000-000000000009', 'PlayStation', 'playstation', 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000010', 'DJI', 'dji', 'https://upload.wikimedia.org/wikipedia/commons/a/af/DJI_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000011', 'JBL', 'jbl', 'https://upload.wikimedia.org/wikipedia/commons/2/23/JBL_logo.svg', true),
  ('b1000000-0000-0000-0000-000000000012', 'Belkin', 'belkin', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Belkin_logo.svg', true)
ON CONFLICT (slug) DO NOTHING;

-- 5. Products
INSERT INTO products (
  id, name, slug, brand_id, category_id, sku, barcode, description, short_description,
  original_price, sale_price, cost_price, stock_quantity, low_stock_threshold, warranty,
  whats_in_box, specifications, is_featured, is_best_seller, is_new_arrival, is_weekly_offer, is_flash_sale, status
)
VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'Apple iPhone 16 Pro Max 256GB - Desert Titanium',
  'apple-iphone-16-pro-max-256gb',
  'b1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'IPH16PM-256-DT',
  '195949038201',
  'iPhone 16 Pro Max features a strong and light titanium design with larger 6.9-inch Super Retina XDR display. Powered by the A18 Pro chip, Apple Intelligence, and a 48MP Fusion camera with 5x optical zoom.',
  '6.9" Super Retina XDR OLED 120Hz, A18 Pro, 48MP 5x Zoom, Titanium',
  5099.00, 4799.00, 4400.00, 14, 3, '1 Year Official Apple UAE Warranty',
  ARRAY['iPhone 16 Pro Max', 'USB-C Charge Cable (1 m)', 'Documentation'],
  '{"Display": "6.9-inch Super Retina XDR OLED 120Hz", "Processor": "Apple A18 Pro Bionic", "RAM": "8GB Unified", "Storage": "256GB NVMe", "Battery": "4685 mAh", "OS": "iOS 18"}'::jsonb,
  true, true, true, true, false, 'active'
),
(
  'p1000000-0000-0000-0000-000000000002',
  'Samsung Galaxy S25 Ultra 5G 512GB - Titanium Gray',
  'samsung-galaxy-s25-ultra-512gb',
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000001',
  'SM-S938B-512-TG',
  '880609482910',
  'Galaxy S25 Ultra with Galaxy AI, Titanium frame, integrated S Pen stylus, revolutionary 200MP camera system, and Snapdragon 8 Elite for Galaxy.',
  '6.8" Dynamic AMOLED 2X, Snapdragon 8 Elite, 200MP Quad Cam, S Pen',
  4949.00, 4499.00, 4100.00, 4, 2, '1 Year Samsung Gulf Official Warranty',
  ARRAY['Galaxy S25 Ultra', 'S Pen', 'USB-C Cable', 'Ejection Pin', 'Quick Guide'],
  '{"Display": "6.8-inch Dynamic AMOLED 2X 120Hz", "Processor": "Snapdragon 8 Elite", "RAM": "12GB LPDDR5X", "Storage": "512GB UFS 4.0", "Battery": "5000 mAh 45W", "OS": "Android 15"}'::jsonb,
  true, true, true, false, true, 'active'
),
(
  'p1000000-0000-0000-0000-000000000003',
  'Apple MacBook Pro 14" (M4 Pro, 24GB RAM, 512GB SSD) - Space Black',
  'apple-macbook-pro-14-m4-pro',
  'b1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000003',
  'MBP14-M4P-24-512',
  '195949281903',
  'Supercharged by M4 Pro, offering blistering performance for engineers, creatives, and power users. Liquid Retina XDR display with up to 1600 nits peak brightness.',
  '14.2" Liquid Retina XDR, M4 Pro 12-core CPU, 24GB Unified RAM, 512GB SSD',
  8499.00, 7999.00, 7300.00, 6, 2, '1 Year Apple UAE Official Warranty',
  ARRAY['14-inch MacBook Pro', '70W USB-C Power Adapter', 'USB-C to MagSafe 3 Cable (2 m)'],
  '{"Display": "14.2-inch Liquid Retina XDR 120Hz", "Processor": "Apple M4 Pro 12-core", "RAM": "24GB Unified", "Storage": "512GB SSD", "Ports": "3x Thunderbolt 5, HDMI, SDXC", "OS": "macOS Sequoia"}'::jsonb,
  true, true, true, true, false, 'active'
),
(
  'p1000000-0000-0000-0000-000000000004',
  'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Silver',
  'sony-wh-1000xm5-wireless-headphones',
  'b1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000005',
  'SONY-WH1000XM5-SLV',
  '4548736132580',
  'Industry-leading noise cancellation with two processors and eight microphones. Exceptional sound quality with newly developed 30mm driver and LDAC high-resolution audio.',
  'Industry-leading Active Noise Cancellation, 30 hrs battery, LDAC audio',
  1499.00, 1199.00, 950.00, 18, 4, '1 Year Sony UAE Warranty',
  ARRAY['Sony WH-1000XM5 Headphones', 'Collapsible Case', '3.5mm Cable', 'USB Cable'],
  '{"Type": "Over-ear Closed Dynamic", "Driver": "30mm Carbon Fiber", "Battery": "30 hrs (NC ON)", "Bluetooth": "Version 5.2 LDAC", "Weight": "250g"}'::jsonb,
  true, true, false, false, true, 'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Product Images
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85', true, 1),
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1695048065059-d4bf453bc326?w=800&auto=format&fit=crop&q=85', false, 2),
  ('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=85', true, 1),
  ('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85', true, 1),
  ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=85', true, 1)
ON CONFLICT DO NOTHING;

-- 7. Initial Inventory
INSERT INTO inventory (product_id, quantity_on_hand, quantity_reserved, low_stock_threshold)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 14, 0, 3),
  ('p1000000-0000-0000-0000-000000000002', 4, 0, 2),
  ('p1000000-0000-0000-0000-000000000003', 6, 0, 2),
  ('p1000000-0000-0000-0000-000000000004', 18, 0, 4)
ON CONFLICT (product_id) DO UPDATE SET quantity_on_hand = EXCLUDED.quantity_on_hand;

-- 8. Homepage Banners
INSERT INTO homepage_banners (title, subtitle, offer_text, badge, image_url, cta_text, cta_link, banner_type, display_order, is_active)
VALUES
(
  'Titanium. So Strong. So Light. So Pro.',
  'iPhone 16 Pro Max in Desert Titanium with Apple Intelligence',
  'Special Abu Dhabi Launch Offer: AED 4,799',
  'NEW ARRIVAL',
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop&q=90',
  'Shop iPhone 16 Pro Max',
  '/product/apple-iphone-16-pro-max-256gb',
  'hero',
  1,
  true
),
(
  'Galaxy AI Unleashed - S25 Ultra 5G',
  'Next-Gen Performance with Snapdragon 8 Elite & 200MP Quad Camera',
  'Instant AED 450 OFF + Free 45W Charger',
  'EXCLUSIVE DEAL',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1600&auto=format&fit=crop&q=90',
  'Explore Samsung Flagship',
  '/product/samsung-galaxy-s25-ultra-512gb',
  'hero',
  2,
  true
),
(
  'Sony Audio Superfest in Abu Dhabi',
  'WH-1000XM5 Noise Cancelling Headphones at unbeatable UAE pricing',
  'Save AED 300 Today • Fast Delivery Across All 7 Emirates',
  'LIMITED TIME',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=90',
  'Grab Deal Now',
  '/product/sony-wh-1000xm5-wireless-headphones',
  'promo_mid',
  1,
  true
)
ON CONFLICT DO NOTHING;

-- 9. Weekly Offers
INSERT INTO offers (product_id, offer_price, original_price, discount_percent, end_date, stock_limit, is_active)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 4799.00, 5099.00, 6, NOW() + INTERVAL '7 days', 14, true),
  ('p1000000-0000-0000-0000-000000000003', 7999.00, 8499.00, 6, NOW() + INTERVAL '7 days', 6, true)
ON CONFLICT DO NOTHING;

-- 10. Flash Sales
INSERT INTO flash_sales (product_id, flash_price, original_price, discount_percent, total_stock, remaining_stock, end_time, is_active)
VALUES
  ('p1000000-0000-0000-0000-000000000002', 4499.00, 4949.00, 9, 15, 4, NOW() + INTERVAL '48 hours', true),
  ('p1000000-0000-0000-0000-000000000004', 1199.00, 1499.00, 20, 25, 5, NOW() + INTERVAL '48 hours', true)
ON CONFLICT DO NOTHING;

-- 11. Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit, times_used, is_active)
VALUES
  ('ES10', 'percentage', 10.00, 200.00, 200.00, NOW() + INTERVAL '1 year', 500, 42, true),
  ('WELCOME50', 'fixed', 50.00, 500.00, NULL, NOW() + INTERVAL '1 year', 1000, 110, true),
  ('ABUDHABI', 'fixed', 30.00, 300.00, NULL, NOW() + INTERVAL '1 year', 200, 19, true)
ON CONFLICT (code) DO NOTHING;
