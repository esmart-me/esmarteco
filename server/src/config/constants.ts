export const APP_CONFIG = {
  COMPANY_NAME: 'E Smart Electronics LLC',
  TRADE_LICENSE: 'CN-2849102',
  TRN: '100482910400003', // Official UAE Tax Registration Number format
  ADDRESS_LINE_1: 'Hamdan Bin Mohammed St, Al Danah',
  CITY: 'Abu Dhabi',
  EMIRATE: 'Abu Dhabi',
  COUNTRY: 'United Arab Emirates',
  PHONE: '+971 2 642 8990',
  MOBILE_WHATSAPP: '+971 50 892 4118',
  EMAIL: 'support@esmartelectronics.ae',
  SALES_EMAIL: 'sales@esmartelectronics.ae',
  WORKING_HOURS: 'Saturday - Thursday: 9:00 AM - 10:00 PM | Friday: 2:00 PM - 10:00 PM',
  
  // UAE VAT rate (5%)
  VAT_RATE: 0.05,
  
  // Free delivery threshold in AED
  FREE_DELIVERY_THRESHOLD: 250,
  STANDARD_DELIVERY_FEE: 15,
  EXPRESS_DELIVERY_FEE: 25,
  
  JWT_SECRET: process.env.JWT_SECRET || 'esmart-uae-super-secure-key-2026',
  PORT: process.env.PORT || 5000,
};

export const UAE_EMIRATES = [
  { id: 'abu-dhabi', name: 'Abu Dhabi', deliveryFee: 15, expressFee: 25, estimatedDays: '1-2 Days' },
  { id: 'dubai', name: 'Dubai', deliveryFee: 15, expressFee: 25, estimatedDays: '1-2 Days' },
  { id: 'sharjah', name: 'Sharjah', deliveryFee: 18, expressFee: 28, estimatedDays: '1-2 Days' },
  { id: 'ajman', name: 'Ajman', deliveryFee: 18, expressFee: 28, estimatedDays: '2-3 Days' },
  { id: 'ras-al-khaimah', name: 'Ras Al Khaimah', deliveryFee: 20, expressFee: 30, estimatedDays: '2-3 Days' },
  { id: 'fujairah', name: 'Fujairah', deliveryFee: 20, expressFee: 30, estimatedDays: '2-3 Days' },
  { id: 'umm-al-quwain', name: 'Umm Al Quwain', deliveryFee: 20, expressFee: 30, estimatedDays: '2-3 Days' },
];
