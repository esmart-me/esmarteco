import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem } from '../types/index.js';
import { apiRequest } from '../lib/api.js';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  vatRate: number;
  vatAmount: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  selectedEmirate: string;
  deliveryType: 'standard' | 'express';
  couponCode: string;
  couponMessage: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  setSelectedEmirate: (emirate: string) => void;
  setDeliveryType: (type: 'standard' | 'express') => void;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 250;
const VAT_RATE = 0.05; // 5% UAE VAT

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('esmart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmirate, setSelectedEmirate] = useState('Abu Dhabi');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('esmart_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Error saving cart to storage:', err);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCart(prev => {
      const price = variant ? product.salePrice + variant.priceAdjustment : product.salePrice;
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(newQty, product.stock)
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: Math.min(quantity, product.stock),
            selectedVariant: variant,
            unitPrice: price
          }
        ];
      }
    });

    // Open slide-over drawer to confirm
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.selectedVariant?.id === variantId)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.selectedVariant?.id === variantId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
  };

  const applyCoupon = async (code: string) => {
    if (!code) return { success: false, message: 'Please enter a coupon code' };
    const currentSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const res = await apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal: currentSubtotal })
    });

    if (res.success && (res as any).discountAmount) {
      setCouponCode((res as any).code || code);
      setDiscount((res as any).discountAmount);
      setCouponMessage((res as any).message || 'Coupon applied!');
      return { success: true, message: (res as any).message || 'Coupon applied!' };
    } else {
      return { success: false, message: res.message || 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
  };

  // Calculations
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const isFreeDelivery = subtotalAfterDiscount >= FREE_DELIVERY_THRESHOLD && deliveryType !== 'express';
  
  let deliveryFee = 0;
  if (subtotal > 0) {
    if (deliveryType === 'express') {
      deliveryFee = 25;
    } else {
      deliveryFee = isFreeDelivery ? 0 : 15;
    }
  }

  const vatAmount = Number((subtotalAfterDiscount * VAT_RATE).toFixed(2));
  const total = Number((subtotalAfterDiscount + vatAmount + deliveryFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        vatRate: VAT_RATE,
        vatAmount,
        deliveryFee,
        total,
        isFreeDelivery,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        selectedEmirate,
        deliveryType,
        couponCode,
        couponMessage,
        isDrawerOpen,
        setIsDrawerOpen,
        setSelectedEmirate,
        setDeliveryType,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
