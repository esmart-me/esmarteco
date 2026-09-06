export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'admin' | 'customer';
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string; // e.g. Home, Office
  fullName: string;
  phone: string;
  apartmentVilla: string;
  street: string;
  area: string;
  city: string;
  emirate: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  description: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  storage?: string;
  ram?: string;
  size?: string;
  priceAdjustment: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  sku: string;
  barcode: string;
  categorySlug: string;
  description: string;
  shortSpecs: string[];
  originalPrice: number;
  salePrice: number;
  costPrice: number;
  stock: number;
  stockAlertThreshold: number;
  rating: number;
  reviewCount: number;
  isWeeklyOffer: boolean;
  isFlashSale: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  warranty: string;
  whatsInBox: string[];
  images: string[];
  videoUrl?: string;
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface WeeklyOffer {
  id: string;
  productId: string;
  offerPrice: number;
  originalPrice: number;
  discountPercent: number;
  expiresAt: string; // ISO date
  stockQuantity: number;
  active: boolean;
}

export interface FlashSale {
  id: string;
  productId: string;
  flashPrice: number;
  originalPrice: number;
  discountPercent: number;
  totalStock: number;
  remainingStock: number;
  endsAt: string; // ISO date
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  offerText: string;
  badge: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  type: 'hero' | 'promo_mid' | 'promo_small';
  order: number;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  brand: string;
  model: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'Order Received'
  | 'Payment Pending'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'cod' | 'tabby' | 'tamara';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ESM-2026-8921
  invoiceNumber: string; // e.g. INV-UAE-2026-8921
  invoiceDate: string;
  customer: {
    userId?: string;
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    apartmentVilla: string;
    street: string;
    area: string;
    city: string;
    emirate: string;
    country: string;
    specialInstructions?: string;
  };
  items: OrderItem[];
  subtotal: number;
  vatRate: number; // 0.05
  vatAmount: number;
  deliveryFee: number;
  deliveryType: 'standard' | 'express';
  discountAmount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  tabbyInstallment?: {
    monthlyAmount: number;
    installments: number;
  };
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  categorySlug?: string;
  productId?: string;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}
