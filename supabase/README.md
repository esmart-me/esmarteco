# E Smart Electronics LLC — Supabase Database & Backend Setup Guide
**Abu Dhabi, United Arab Emirates**

This guide provides direct instructions on linking your **Customer Website** (`src/`) and **Admin Dashboard** (`admin/`) to your Supabase cloud backend.

---

## 1. Create your Supabase Project
1. Visit [Supabase Dashboard](https://supabase.com/dashboard) and log in.
2. Click **New project**, choose an organization, and select the nearest region (e.g. **Middle East (UAE) / eu-central-1**).
3. Set your database password.

---

## 2. Execute the Database Schema & Seed Data
1. In your Supabase project dashboard, open the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Copy and paste the entire contents of [`supabase/schema.sql`](./schema.sql) and click **Run**.
   - This creates all 28 tables (`products`, `orders`, `profiles`, `customers`, `categories`, `brands`, `inventory`, `offers`, `flash_sales`, `coupons`, `homepage_banners`, etc.), custom enums, and Row Level Security (RLS) policies.
4. Open a second query tab, paste the contents of [`supabase/seed.sql`](./seed.sql), and click **Run**.
   - This populates 16 categories, official brands, flagship UAE products in AED, banners, weekly offers, and delivery settings.

---

## 3. Configure Supabase Storage Buckets
Ensure the following 4 public storage buckets are created in **Storage** -> **New bucket**:
- `product-images` (Public: Yes)
- `category-images` (Public: Yes)
- `brand-images` (Public: Yes)
- `homepage-banners` (Public: Yes)

---

## 4. Set Environment Variables
In your local root directory (`d:\esmart-web\`), copy `.env.example` to `.env`:
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Also copy the same `.env` into `admin/.env`.

---

## 5. Running the Two Applications

### Both Apps Concurrently:
```bash
npm run dev
```
- **Customer Storefront**: `http://localhost:5173`
- **Admin Dashboard**: `http://localhost:5174`

### Customer App Only:
```bash
npm run dev:customer
```

### Admin Dashboard Only:
```bash
npm run dev:admin
```
