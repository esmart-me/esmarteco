export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER' | 'MARKETING_MANAGER' | 'CUSTOMER_SUPPORT';
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  category_id?: string;
  brand_id?: string;
  original_price: number;
  sale_price: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  warranty: string;
  description: string;
  is_featured: boolean;
  is_weekly_offer: boolean;
  is_flash_sale: boolean;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  images: string[];
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  subtotal: number;
  vat_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_number?: string;
  carrier?: string;
  invoice_number?: string;
  invoice_date?: string;
  items?: any[];
  created_at: string;
}
