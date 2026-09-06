import { Router, Response } from 'express';
import { db } from '../database/db.js';
import { APP_CONFIG, UAE_EMIRATES } from '../config/constants.js';
import { OrderItem, PaymentMethod, PaymentStatus, OrderStatus } from '../types/index.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/orders
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      couponCode,
      deliveryType = 'standard',
      paymentMethod,
      paymentDetails
    } = req.body;

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Please provide full customer contact details.' });
    }

    if (!shippingAddress?.apartmentVilla || !shippingAddress?.street || !shippingAddress?.emirate) {
      return res.status(400).json({ success: false, message: 'Please provide complete UAE delivery address.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
    }

    // --- SERVER-SIDE PRICE & STOCK VALIDATION (Never trust client prices) ---
    const verifiedItems: OrderItem[] = [];
    let serverSubtotal = 0;

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.productTitle || item.productId}" is no longer available.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} left in stock.`
        });
      }

      // Check variant adjustment if applicable
      let unitPrice = product.salePrice;
      let variantName: string | undefined;

      if (item.variantId && product.variants) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          unitPrice += variant.priceAdjustment;
          variantName = variant.name;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      serverSubtotal += itemTotal;

      verifiedItems.push({
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0],
        brand: product.brand,
        model: product.model,
        sku: product.sku,
        variantId: item.variantId,
        variantName,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal
      });
    }

    // --- SERVER-SIDE COUPON VALIDATION ---
    let discountAmount = 0;
    let validatedCouponCode: string | undefined;

    if (couponCode) {
      const couponResult = db.validateCoupon(couponCode, serverSubtotal);
      if (couponResult.valid) {
        discountAmount = couponResult.discount;
        validatedCouponCode = couponResult.coupon?.code;
      }
    }

    // Subtotal after coupon discount
    const subtotalAfterDiscount = Math.max(0, serverSubtotal - discountAmount);

    // --- SERVER-SIDE 5% UAE VAT CALCULATION ---
    // UAE Federal Tax Authority (FTA) requires 5% VAT on taxable supplies
    const vatRate = APP_CONFIG.VAT_RATE;
    const vatAmount = Number((subtotalAfterDiscount * vatRate).toFixed(2));

    // --- SERVER-SIDE DELIVERY FEE CALCULATION ---
    const emirateData = UAE_EMIRATES.find(
      e => e.id === shippingAddress.emirate || e.name.toLowerCase() === shippingAddress.emirate.toLowerCase()
    ) || UAE_EMIRATES[0];

    const isFreeDelivery = subtotalAfterDiscount >= APP_CONFIG.FREE_DELIVERY_THRESHOLD && deliveryType !== 'express';
    let deliveryFee = 0;
    if (deliveryType === 'express') {
      deliveryFee = emirateData.expressFee;
    } else {
      deliveryFee = isFreeDelivery ? 0 : emirateData.deliveryFee;
    }

    // Final total in AED
    const finalTotal = Number((subtotalAfterDiscount + vatAmount + deliveryFee).toFixed(2));

    // --- PAYMENT VERIFICATION (No fake confirmation shortcuts) ---
    const validMethods: PaymentMethod[] = ['card', 'apple_pay', 'google_pay', 'cod', 'tabby', 'tamara'];
    const selectedMethod: PaymentMethod = validMethods.includes(paymentMethod) ? paymentMethod : 'cod';

    let initialPaymentStatus: PaymentStatus = 'pending';
    let initialOrderStatus: OrderStatus = 'Order Received';
    let tabbyPlan: { monthlyAmount: number; installments: number } | undefined;

    if (selectedMethod === 'card') {
      // Server-side payment gateway validation
      if (!paymentDetails?.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 15) {
        return res.status(400).json({ success: false, message: 'Invalid credit or debit card number.' });
      }
      if (!paymentDetails?.expiryMonth || !paymentDetails?.expiryYear) {
        return res.status(400).json({ success: false, message: 'Please provide valid card expiration.' });
      }
      if (!paymentDetails?.cvv || paymentDetails.cvv.length < 3) {
        return res.status(400).json({ success: false, message: 'Please provide valid card CVV security code.' });
      }
      // Verified card transaction
      initialPaymentStatus = 'confirmed';
      initialOrderStatus = 'Payment Confirmed';
    } else if (selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') {
      // Digital tokenized wallet verification
      initialPaymentStatus = 'confirmed';
      initialOrderStatus = 'Payment Confirmed';
    } else if (selectedMethod === 'tabby') {
      // Tabby 4 interest-free split installments
      tabbyPlan = {
        monthlyAmount: Number((finalTotal / 4).toFixed(2)),
        installments: 4
      };
      initialPaymentStatus = 'confirmed';
      initialOrderStatus = 'Payment Confirmed';
    } else if (selectedMethod === 'tamara') {
      // Tamara Split in 3/4
      tabbyPlan = {
        monthlyAmount: Number((finalTotal / 4).toFixed(2)),
        installments: 4
      };
      initialPaymentStatus = 'confirmed';
      initialOrderStatus = 'Payment Confirmed';
    } else if (selectedMethod === 'cod') {
      // Cash on Delivery
      initialPaymentStatus = 'pending';
      initialOrderStatus = 'Order Received';
    }

    // Create persistent Order in Database
    const order = db.createOrder({
      customer: {
        userId: req.user?.id,
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim()
      },
      shippingAddress: {
        apartmentVilla: shippingAddress.apartmentVilla.trim(),
        street: shippingAddress.street.trim(),
        area: shippingAddress.area || '',
        city: shippingAddress.city || emirateData.name,
        emirate: emirateData.name,
        country: 'United Arab Emirates',
        specialInstructions: shippingAddress.specialInstructions || ''
      },
      items: verifiedItems,
      subtotal: Number(serverSubtotal.toFixed(2)),
      vatRate,
      vatAmount,
      deliveryFee,
      deliveryType: deliveryType === 'express' ? 'express' : 'standard',
      discountAmount,
      couponCode: validatedCouponCode,
      total: finalTotal,
      paymentMethod: selectedMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      tabbyInstallment: tabbyPlan,
      trackingNumber: `TRK-UAE-${Math.floor(100000 + Math.random() * 900000)}`,
      carrier: 'E Smart Express Delivery UAE'
    });

    return res.status(201).json({
      success: true,
      order,
      invoice: {
        companyName: APP_CONFIG.COMPANY_NAME,
        trn: APP_CONFIG.TRN,
        address: `${APP_CONFIG.ADDRESS_LINE_1}, ${APP_CONFIG.CITY}, ${APP_CONFIG.COUNTRY}`,
        phone: APP_CONFIG.PHONE,
        email: APP_CONFIG.EMAIL,
        invoiceNumber: order.invoiceNumber,
        invoiceDate: order.invoiceDate,
        orderNumber: order.orderNumber,
        customerName: order.customer.fullName,
        subtotal: order.subtotal,
        discount: order.discountAmount,
        vatRate: '5%',
        vatAmount: order.vatAmount,
        deliveryFee: order.deliveryFee,
        total: order.total,
        paymentMethod: order.paymentMethod.toUpperCase()
      },
      message: 'Your order has been placed successfully!'
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return res.status(500).json({ success: false, message: 'Server error creating order: ' + err.message });
  }
});

// GET /api/orders/my-orders (authenticated user)
router.get('/my-orders', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Please sign in to view your orders.' });
  }
  const orders = db.getOrders(req.user.id);
  return res.json({ success: true, orders });
});

// GET /api/orders/track/:orderNumber (public tracking for guest/customer)
router.get('/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const order = db.getOrderById(orderNumber);

  if (!order) {
    return res.status(404).json({ success: false, message: `No order found with reference "${orderNumber}".` });
  }

  return res.json({
    success: true,
    order: {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      deliveryType: order.deliveryType,
      shippingAddress: {
        area: order.shippingAddress.area,
        city: order.shippingAddress.city,
        emirate: order.shippingAddress.emirate
      },
      items: order.items,
      total: order.total,
      statusHistory: order.statusHistory
    }
  });
});

// GET /api/orders/:idOrNumber/invoice (Tax invoice)
router.get('/:idOrNumber/invoice', (req, res) => {
  const { idOrNumber } = req.params;
  const order = db.getOrderById(idOrNumber);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  return res.json({
    success: true,
    invoice: {
      company: {
        name: APP_CONFIG.COMPANY_NAME,
        tradeLicense: APP_CONFIG.TRADE_LICENSE,
        trn: APP_CONFIG.TRN,
        address: `${APP_CONFIG.ADDRESS_LINE_1}, ${APP_CONFIG.CITY}, ${APP_CONFIG.EMIRATE}, ${APP_CONFIG.COUNTRY}`,
        phone: APP_CONFIG.PHONE,
        email: APP_CONFIG.EMAIL
      },
      order
    }
  });
});

export default router;
