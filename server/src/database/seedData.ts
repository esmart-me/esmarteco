import { Category, Brand, Product, Banner, WeeklyOffer, FlashSale, Coupon, Review, Order } from '../types/index.js';
import bcrypt from 'bcryptjs';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'smartphones',
    name: 'Smartphones',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    description: 'Flagship & 5G smartphones from Apple, Samsung, Xiaomi & more'
  },
  {
    id: 'cat-2',
    slug: 'tablets',
    name: 'Tablets',
    icon: 'Tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    description: 'Apple iPads, Samsung Galaxy Tabs & high-performance Android tablets'
  },
  {
    id: 'cat-3',
    slug: 'laptops',
    name: 'Laptops',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'MacBooks, gaming laptops, ultrabooks & professional workstations'
  },
  {
    id: 'cat-4',
    slug: 'smartwatches',
    name: 'Smartwatches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    description: 'Apple Watch, Samsung Galaxy Watch & fitness wearables'
  },
  {
    id: 'cat-5',
    slug: 'headphones',
    name: 'Headphones',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Over-ear noise cancelling headphones by Sony, Bose & Apple'
  },
  {
    id: 'cat-6',
    slug: 'tws-earbuds',
    name: 'TWS Earbuds',
    icon: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'AirPods Pro, Galaxy Buds, Sony WF series wireless earbuds'
  },
  {
    id: 'cat-7',
    slug: 'speakers',
    name: 'Speakers',
    icon: 'Speaker',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    description: 'Marshall, JBL, Bose bluetooth & home party speakers'
  },
  {
    id: 'cat-8',
    slug: 'power-banks',
    name: 'Power Banks',
    icon: 'BatteryCharging',
    image: 'https://images.unsplash.com/photo-1609592424368-80945cbba743?w=600&auto=format&fit=crop&q=80',
    description: 'Fast-charging portable chargers & laptop high-wattage powerbanks'
  },
  {
    id: 'cat-9',
    slug: 'chargers',
    name: 'Chargers',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    description: 'GaN fast wall chargers, MagSafe & multi-port charging hubs'
  },
  {
    id: 'cat-10',
    slug: 'cables',
    name: 'Cables',
    icon: 'Cable',
    image: 'https://images.unsplash.com/photo-1558383331-f520f2888351?w=600&auto=format&fit=crop&q=80',
    description: 'Braided USB-C, Thunderbolt 4, HDMI 2.1 & Lightning cables'
  },
  {
    id: 'cat-11',
    slug: 'mobile-accessories',
    name: 'Mobile Accessories',
    icon: 'SmartphoneNfc',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80',
    description: 'Cases, screen protectors, car mounts & MagSafe wallets'
  },
  {
    id: 'cat-12',
    slug: 'computer-accessories',
    name: 'Computer Accessories',
    icon: 'Mouse',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    description: 'Keyboards, mice, USB docks, monitors & webcams'
  },
  {
    id: 'cat-13',
    slug: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    description: 'PlayStation 5, Xbox Series X, Nintendo Switch & controllers'
  },
  {
    id: 'cat-14',
    slug: 'smart-devices',
    name: 'Smart Devices',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    description: 'Smart home hubs, security cameras, smart plugs & lighting'
  },
  {
    id: 'cat-15',
    slug: 'multimedia',
    name: 'Multimedia',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    description: 'Apple TV 4K, smart streaming sticks, projectors & audio DACs'
  },
  {
    id: 'cat-16',
    slug: 'other-electronics',
    name: 'Other Electronics',
    icon: 'Radio',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80',
    description: 'Drones, action cameras, digital voice recorders & electronic tools'
  }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b-apple', slug: 'apple', name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', featured: true },
  { id: 'b-samsung', slug: 'samsung', name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', featured: true },
  { id: 'b-sony', slug: 'sony', name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', featured: true },
  { id: 'b-dell', slug: 'dell', name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg', featured: true },
  { id: 'b-anker', slug: 'anker', name: 'Anker', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Anker_logo.svg', featured: true },
  { id: 'b-bose', slug: 'bose', name: 'Bose', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bose_logo.svg', featured: true },
  { id: 'b-marshall', slug: 'marshall', name: 'Marshall', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Marshall_Amps_logo.svg', featured: true },
  { id: 'b-lenovo', slug: 'lenovo', name: 'Lenovo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg', featured: true },
  { id: 'b-playstation', slug: 'playstation', name: 'PlayStation', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg', featured: true },
  { id: 'b-dji', slug: 'dji', name: 'DJI', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/DJI_logo.svg', featured: true },
  { id: 'b-jbl', slug: 'jbl', name: 'JBL', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/JBL_logo.svg', featured: true },
  { id: 'b-belkin', slug: 'belkin', name: 'Belkin', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Belkin_logo.svg', featured: true }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'apple-iphone-16-pro-max-256gb',
    title: 'Apple iPhone 16 Pro Max 256GB - Desert Titanium',
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    sku: 'IPH16PM-256-DT',
    barcode: '195949038201',
    categorySlug: 'smartphones',
    description: 'iPhone 16 Pro Max features a strong and light titanium design with larger 6.9-inch Super Retina XDR display. Powered by the A18 Pro chip, Apple Intelligence, and a 48MP Fusion camera with 5x optical zoom.',
    shortSpecs: [
      '6.9" Super Retina XDR OLED 120Hz',
      'Apple A18 Pro Bionic (3nm)',
      '48MP + 48MP Ultra Wide + 12MP 5x Zoom',
      'All-day battery life (up to 33 hrs video)'
    ],
    originalPrice: 5099,
    salePrice: 4799,
    costPrice: 4400,
    stock: 14,
    stockAlertThreshold: 3,
    rating: 4.9,
    reviewCount: 128,
    isWeeklyOffer: true,
    isFlashSale: false,
    isFeatured: true,
    isNew: true,
    isBestseller: true,
    warranty: '1 Year Apple Official UAE Warranty',
    whatsInBox: ['iPhone 16 Pro Max', 'USB-C Charge Cable (1 m)', 'Documentation'],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1695048065059-d4bf453bc326?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Display': '6.9-inch Super Retina XDR OLED, ProMotion 120Hz',
      'Processor': 'Apple A18 Pro 6-core CPU',
      'RAM': '8 GB Unified Memory',
      'Storage': '256 GB NVMe',
      'Rear Camera': '48MP Main + 48MP Ultra-wide + 12MP 5x Telephoto',
      'Front Camera': '12MP TrueDepth with autofocus',
      'Battery': '4685 mAh with MagSafe 25W wireless charging',
      'OS': 'iOS 18',
      'SIM': 'Dual SIM (nano-SIM and eSIM)',
      'Water Resistance': 'IP68 (up to 6m for 30 mins)'
    },
    variants: [
      { id: 'v-1', name: 'Desert Titanium 256GB', color: 'Desert Titanium', storage: '256GB', priceAdjustment: 0, sku: 'IPH16PM-256-DT', stock: 5 },
      { id: 'v-2', name: 'Natural Titanium 256GB', color: 'Natural Titanium', storage: '256GB', priceAdjustment: 0, sku: 'IPH16PM-256-NT', stock: 4 },
      { id: 'v-3', name: 'Black Titanium 512GB', color: 'Black Titanium', storage: '512GB', priceAdjustment: 750, sku: 'IPH16PM-512-BT', stock: 3 },
      { id: 'v-4', name: 'White Titanium 1TB', color: 'White Titanium', storage: '1TB', priceAdjustment: 1550, sku: 'IPH16PM-1TB-WT', stock: 2 }
    ],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    slug: 'samsung-galaxy-s25-ultra-512gb',
    title: 'Samsung Galaxy S25 Ultra 5G 512GB - Titanium Gray',
    brand: 'Samsung',
    model: 'Galaxy S25 Ultra',
    sku: 'SM-S938B-512-TG',
    barcode: '880609482910',
    categorySlug: 'smartphones',
    description: 'Galaxy S25 Ultra with Galaxy AI, Titanium frame, integrated S Pen stylus, revolutionary 200MP camera system, and Snapdragon 8 Elite for Galaxy.',
    shortSpecs: [
      '6.8" Dynamic AMOLED 2X 120Hz 2600 nits',
      'Snapdragon 8 Elite for Galaxy',
      '200MP Quad Camera with 100x Space Zoom',
      'Built-in S Pen & 5000 mAh Battery'
    ],
    originalPrice: 4949,
    salePrice: 4499,
    costPrice: 4100,
    stock: 9,
    stockAlertThreshold: 2,
    rating: 4.8,
    reviewCount: 94,
    isWeeklyOffer: false,
    isFlashSale: true,
    isFeatured: true,
    isNew: true,
    isBestseller: true,
    warranty: '1 Year Samsung Gulf Official Warranty',
    whatsInBox: ['Galaxy S25 Ultra', 'S Pen', 'USB-C to USB-C Data Cable', 'Ejection Pin', 'Quick Start Guide'],
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X, 3120 x 1440, 1-120Hz',
      'Processor': 'Qualcomm Snapdragon 8 Elite (3nm)',
      'RAM': '12 GB LPDDR5X',
      'Storage': '512 GB UFS 4.0',
      'Rear Camera': '200MP Wide + 50MP Periscope 5x + 50MP Ultra-wide + 10MP 3x',
      'Front Camera': '12MP Dual Pixel AF',
      'Battery': '5000 mAh with 45W Fast Charging',
      'Stylus': 'Embedded Bluetooth S Pen',
      'OS': 'Android 15 with One UI 7'
    },
    variants: [
      { id: 'v-5', name: 'Titanium Gray 512GB', color: 'Titanium Gray', storage: '512GB', priceAdjustment: 0, sku: 'SM-S938B-512-TG', stock: 4 },
      { id: 'v-6', name: 'Titanium Black 512GB', color: 'Titanium Black', storage: '512GB', priceAdjustment: 0, sku: 'SM-S938B-512-TB', stock: 5 }
    ],
    createdAt: '2026-01-12T11:00:00Z'
  },
  {
    id: 'prod-3',
    slug: 'apple-macbook-pro-14-m4-pro',
    title: 'Apple MacBook Pro 14" (M4 Pro, 24GB RAM, 512GB SSD) - Space Black',
    brand: 'Apple',
    model: 'MacBook Pro 14 M4 Pro',
    sku: 'MBP14-M4P-24-512',
    barcode: '195949281903',
    categorySlug: 'laptops',
    description: 'Supercharged by M4 Pro, offering blistering performance for engineers, creatives, and power users. Liquid Retina XDR display with up to 1600 nits peak brightness.',
    shortSpecs: [
      '14.2" Liquid Retina XDR Display 120Hz',
      'Apple M4 Pro chip (12-core CPU, 16-core GPU)',
      '24GB Unified Memory | 512GB SSD',
      'Up to 22 hours battery life'
    ],
    originalPrice: 8499,
    salePrice: 7999,
    costPrice: 7300,
    stock: 6,
    stockAlertThreshold: 2,
    rating: 5.0,
    reviewCount: 42,
    isWeeklyOffer: true,
    isFlashSale: false,
    isFeatured: true,
    isNew: true,
    isBestseller: true,
    warranty: '1 Year Apple UAE Official Warranty',
    whatsInBox: ['14-inch MacBook Pro', '70W USB-C Power Adapter', 'USB-C to MagSafe 3 Cable (2 m)'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Display': '14.2-inch Liquid Retina XDR, 3024 x 1964, ProMotion',
      'Processor': 'Apple M4 Pro 12-core CPU',
      'GPU': '16-core GPU with hardware ray tracing',
      'RAM': '24 GB Unified Memory',
      'Storage': '512 GB Superfast SSD',
      'Ports': '3x Thunderbolt 5, HDMI, SDXC card slot, MagSafe 3',
      'Battery': '72.4 Wh Lithium-polymer',
      'Keyboard': 'Magic Keyboard with Touch ID & Ambient Light Sensor'
    },
    createdAt: '2026-01-05T09:00:00Z'
  },
  {
    id: 'prod-4',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Silver',
    brand: 'Sony',
    model: 'WH-1000XM5',
    sku: 'SONY-WH1000XM5-SLV',
    barcode: '4548736132580',
    categorySlug: 'headphones',
    description: 'Industry-leading noise cancellation with two processors and eight microphones. Exceptional sound quality with newly developed 30mm driver and LDAC high-resolution audio.',
    shortSpecs: [
      'Industry-leading active noise cancellation',
      '30 hours battery life with quick charge',
      'Ultra-comfortable lightweight design',
      'Crystal clear hands-free calls with 4 beamforming mics'
    ],
    originalPrice: 1499,
    salePrice: 1199,
    costPrice: 950,
    stock: 18,
    stockAlertThreshold: 4,
    rating: 4.9,
    reviewCount: 215,
    isWeeklyOffer: false,
    isFlashSale: true,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    warranty: '1 Year Sony UAE Warranty',
    whatsInBox: ['Sony WH-1000XM5 Headphones', 'Collapsible Carrying Case', '3.5mm Audio Cable (1.2m)', 'USB Charging Cable'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Type': 'Over-ear Closed Dynamic',
      'Driver Unit': '30mm Carbon fiber composite dome',
      'Frequency Response': '4 Hz - 40,000 Hz',
      'Bluetooth': 'Version 5.2 (LDAC, AAC, SBC)',
      'Battery Life': 'Max 30 hrs (NC ON), Max 40 hrs (NC OFF)',
      'Weight': '250 grams',
      'Multipoint Connection': 'Connect two devices simultaneously'
    },
    variants: [
      { id: 'v-7', name: 'Platinum Silver', color: 'Silver', priceAdjustment: 0, sku: 'SONY-WH1000XM5-SLV', stock: 10 },
      { id: 'v-8', name: 'Midnight Black', color: 'Black', priceAdjustment: 0, sku: 'SONY-WH1000XM5-BLK', stock: 8 }
    ],
    createdAt: '2026-01-08T12:00:00Z'
  },
  {
    id: 'prod-5',
    slug: 'apple-watch-ultra-2-gps-cellular-49mm',
    title: 'Apple Watch Ultra 2 (GPS + Cellular 49mm) Titanium Case - Ocean Band',
    brand: 'Apple',
    model: 'Apple Watch Ultra 2',
    sku: 'AWU2-49-OCEAN-BLU',
    barcode: '195949019283',
    categorySlug: 'smartwatches',
    description: 'The most rugged and capable Apple Watch. Aerospace-grade 49mm titanium case, precision dual-frequency GPS, up to 36 hours normal battery life, and 3000-nit display.',
    shortSpecs: [
      '49mm Aerospace Titanium Case',
      'Brightest 3000 nits Always-On Retina OLED',
      'S9 SiP with Double Tap gesture',
      '100m Water resistant & EN13319 dive certified'
    ],
    originalPrice: 3299,
    salePrice: 2999,
    costPrice: 2600,
    stock: 8,
    stockAlertThreshold: 2,
    rating: 4.9,
    reviewCount: 88,
    isWeeklyOffer: true,
    isFlashSale: false,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    warranty: '1 Year Apple Official UAE Warranty',
    whatsInBox: ['Titanium Case', 'Band', 'Apple Watch Magnetic Fast Charger to USB-C Cable (1m)'],
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Case Size': '49mm Titanium',
      'Display': 'Always-On Retina display, up to 3000 nits',
      'Chipset': 'Apple S9 SiP 64-bit dual-core',
      'Battery': 'Up to 36 hours (up to 72 hours in Low Power Mode)',
      'Water Resistance': '100m / 10 ATM with depth gauge',
      'Sensors': 'Blood Oxygen, ECG, Temperature sensing, Dual Siren (86dB)'
    },
    createdAt: '2026-01-14T15:00:00Z'
  },
  {
    id: 'prod-6',
    slug: 'sony-playstation-5-pro-console-2tb',
    title: 'Sony PlayStation 5 Pro Console 2TB SSD (UAE Official Version)',
    brand: 'PlayStation',
    model: 'PS5 Pro',
    sku: 'PS5-PRO-2TB-UAE',
    barcode: '711719582910',
    categorySlug: 'gaming',
    description: 'Experience witness gaming at unprecedented fidelity. PlayStation Spectral Super Resolution (PSSR), advanced ray tracing, and 60FPS fidelity mode for 4K displays.',
    shortSpecs: [
      'Massive 2TB High-Speed Custom NVMe SSD',
      'PlayStation Spectral Super Resolution (AI Upscaling)',
      'Upgraded GPU with 67% more Compute Units',
      'Advanced Ray Tracing & DualSense Controller included'
    ],
    originalPrice: 3399,
    salePrice: 3199,
    costPrice: 2850,
    stock: 5,
    stockAlertThreshold: 2,
    rating: 4.8,
    reviewCount: 67,
    isWeeklyOffer: false,
    isFlashSale: true,
    isFeatured: true,
    isNew: true,
    isBestseller: true,
    warranty: '2 Years Jumbo / Sony UAE Official Warranty',
    whatsInBox: ['PS5 Pro Console 2TB', 'DualSense Wireless Controller', 'HDMI Cable', 'AC Power Cord', 'USB Cable', 'Printed Materials', 'ASTRO’s PLAYROOM (Pre-installed)'],
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'CPU': 'x86-64-AMD Ryzen Zen 2, 8 cores / 16 threads',
      'GPU': 'AMD Radeon RDNA-based graphics engine with AI Tensor Cores',
      'Storage': '2TB Custom NVMe SSD (5.5GB/s raw read bandwidth)',
      'Video Output': 'Support of 4K 120Hz TVs, 8K TVs, VRR (HDMI 2.1)',
      'Audio': 'Tempest 3D AudioTech',
      'Networking': 'Wi-Fi 7 (IEEE 802.11be), Gigabit Ethernet'
    },
    createdAt: '2026-01-18T16:00:00Z'
  },
  {
    id: 'prod-7',
    slug: 'anker-prime-27650mah-power-bank-250w',
    title: 'Anker Prime 27,650mAh Power Bank (250W Multi-device Fast Charger)',
    brand: 'Anker',
    model: 'Anker 737 / Prime 250W',
    sku: 'ANK-A1340-BLK',
    barcode: '194644141289',
    categorySlug: 'power-banks',
    description: 'Anker flagship power bank capable of 250W multi-device fast output. Can fast charge a MacBook Pro 16" to 50% in just 28 minutes. Features smart digital display and app control.',
    shortSpecs: [
      '27,650mAh Airline-approved Capacity',
      '250W Total Blazing Output (140W max single port)',
      'Smart Digital LCD Display with live wattage',
      'Fast 170W recharge input'
    ],
    originalPrice: 649,
    salePrice: 499,
    costPrice: 380,
    stock: 25,
    stockAlertThreshold: 5,
    rating: 4.9,
    reviewCount: 156,
    isWeeklyOffer: false,
    isFlashSale: false,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    warranty: '2 Years Anker UAE Official Warranty',
    whatsInBox: ['Anker Prime 27,650mAh Power Bank', '0.6m 140W USB-C to USB-C Cable', 'Travel Pouch', 'Welcome Guide'],
    images: [
      'https://images.unsplash.com/photo-1609592424368-80945cbba743?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Battery Capacity': '27,650 mAh / 99.54Wh',
      'Ports': '2x USB-C + 1x USB-A',
      'Max Output': '250W Combined',
      'Single USB-C Output': 'Up to 140W (PD 3.1)',
      'Dimensions': '161.7 × 57 × 49.7 mm',
      'Weight': '665 grams'
    },
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'prod-8',
    slug: 'marshall-stanmore-iii-bluetooth-speaker',
    title: 'Marshall Stanmore III Bluetooth Home Speaker - Vintage Black',
    brand: 'Marshall',
    model: 'Stanmore III',
    sku: 'MARSH-STAN3-BLK',
    barcode: '7340055385626',
    categorySlug: 'speakers',
    description: 'Stanmore III re-engineered with a wider soundstage than its predecessor, delivering home-shaking Marshall signature sound. Bluetooth 5.2, 3.5mm aux and RCA inputs.',
    shortSpecs: [
      '80W Class D amplification with booming bass',
      'Wider soundstage with angled tweeters',
      'Iconic vintage brass & leatherette aesthetic',
      'Bluetooth 5.2 LE Audio-ready + RCA + 3.5mm Aux'
    ],
    originalPrice: 1599,
    salePrice: 1299,
    costPrice: 980,
    stock: 11,
    stockAlertThreshold: 3,
    rating: 4.8,
    reviewCount: 78,
    isWeeklyOffer: true,
    isFlashSale: false,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    warranty: '1 Year UAE Official Warranty',
    whatsInBox: ['Stanmore III Speaker', 'Mains Lead', 'Quick Start Guide', 'Safety Instructions'],
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Amplifiers': 'One 50 Watt Class D amplifier for woofer, two 15 Watt Class D for tweeters',
      'Frequency Range': '45–20,000 Hz',
      'Max SPL': '97 dB @ 1 m',
      'Wireless Connectivity': 'Bluetooth 5.2',
      'Wired Inputs': '3.5 mm Input, RCA input',
      'Dimensions': '350 x 203 x 188 mm',
      'Weight': '4.25 kg'
    },
    createdAt: '2026-01-22T14:00:00Z'
  },
  {
    id: 'prod-9',
    slug: 'apple-ipad-pro-13-m4-oled-256gb',
    title: 'Apple iPad Pro 13" (M4, Ultra Retina XDR OLED, 256GB Wi-Fi) - Space Black',
    brand: 'Apple',
    model: 'iPad Pro 13 M4',
    sku: 'IPAD13-M4-256-SB',
    barcode: '195949312019',
    categorySlug: 'tablets',
    description: 'Impossibly thin design with groundbreaking Tandem OLED display. The breakthrough Apple M4 chip delivers extraordinary performance and AI computing capabilities.',
    shortSpecs: [
      '13" Tandem OLED Ultra Retina XDR 120Hz',
      'Apple M4 chip with 10-core GPU',
      'Just 5.1mm ultra-thin lightweight chassis',
      'Apple Pencil Pro & Magic Keyboard support'
    ],
    originalPrice: 5299,
    salePrice: 4899,
    costPrice: 4400,
    stock: 7,
    stockAlertThreshold: 2,
    rating: 4.9,
    reviewCount: 51,
    isWeeklyOffer: false,
    isFlashSale: false,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    warranty: '1 Year Apple Official UAE Warranty',
    whatsInBox: ['13-inch iPad Pro', 'USB-C Charge Cable (1 m)', '20W USB-C Power Adapter'],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Display': '13.0-inch Tandem OLED Ultra Retina XDR, 2752 x 2064, ProMotion',
      'Processor': 'Apple M4 chip (9-core CPU, 10-core GPU, 16-core Neural Engine)',
      'RAM': '8 GB Unified Memory',
      'Storage': '256 GB',
      'Camera': '12MP Wide back camera with LiDAR scanner, 12MP Landscape Ultra Wide front',
      'Thickness': '5.1 mm',
      'Weight': '579 grams'
    },
    createdAt: '2026-01-25T11:00:00Z'
  },
  {
    id: 'prod-10',
    slug: 'apple-airpods-pro-2-usb-c',
    title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    sku: 'MTJV3ZE/A',
    barcode: '195949052696',
    categorySlug: 'tws-earbuds',
    description: 'Up to 2x more Active Noise Cancellation, Transparency mode, Adaptive Audio, Personalized Spatial Audio with dynamic head tracking, and USB-C MagSafe case with Precision Finding.',
    shortSpecs: [
      'Apple H2 chip with up to 2x more noise reduction',
      'Adaptive Audio & Personalized Spatial Audio',
      'Up to 6 hours listening (30 hrs with MagSafe case)',
      'IP54 dust, sweat, and water resistant'
    ],
    originalPrice: 949,
    salePrice: 799,
    costPrice: 680,
    stock: 22,
    stockAlertThreshold: 5,
    rating: 4.9,
    reviewCount: 310,
    isWeeklyOffer: false,
    isFlashSale: true,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    warranty: '1 Year Apple Official UAE Warranty',
    whatsInBox: ['AirPods Pro (2nd Gen)', 'MagSafe Charging Case (USB-C) with speaker and lanyard loop', 'Silicone ear tips (four sizes: XS, S, M, L)', 'USB-C Charge Cable'],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Chip': 'Apple H2 headphone chip, Apple U1 chip in case',
      'Audio Technology': 'Custom high-excursion Apple driver, Custom high dynamic range amplifier',
      'Battery': 'Up to 6 hours listening time on single charge',
      'Connectivity': 'Bluetooth 5.3',
      'Charging Case': 'Works with MagSafe, Apple Watch charger, Qi chargers, USB-C'
    },
    createdAt: '2026-01-26T12:00:00Z'
  },
  {
    id: 'prod-11',
    slug: 'belkin-boostcharge-pro-3-in-1-wireless-magsafe-charger',
    title: 'Belkin BoostCharge Pro 3-in-1 Wireless MagSafe Charging Stand 15W',
    brand: 'Belkin',
    model: 'WIZ017vfBK',
    sku: 'BELK-3IN1-MAG-BLK',
    barcode: '745883832910',
    categorySlug: 'chargers',
    description: 'Fast wireless charging for iPhone 16/15/14 series (15W), Apple Watch Ultra, and AirPods simultaneously with modern architectural stainless steel design.',
    shortSpecs: [
      'Official Apple Made for MagSafe 15W fast charge',
      'Charges iPhone, Apple Watch and AirPods at once',
      'Fast charging support for Apple Watch Series 7/8/9/Ultra',
      'StandBy mode compatible landscape orientation'
    ],
    originalPrice: 599,
    salePrice: 479,
    costPrice: 350,
    stock: 15,
    stockAlertThreshold: 3,
    rating: 4.8,
    reviewCount: 45,
    isWeeklyOffer: false,
    isFlashSale: false,
    isFeatured: true,
    isNew: false,
    isBestseller: false,
    warranty: '2 Years Belkin UAE Official Warranty',
    whatsInBox: ['Belkin 3-in-1 Wireless Charger', 'AC Power Adapter', 'User Manual'],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Compatibility': 'iPhone 12 through iPhone 16 series, Apple Watch all series, AirPods with wireless case',
      'Power Output': '15W MagSafe + 5W Watch + 5W AirPods',
      'Material': 'Premium stainless steel arms, soft-touch base'
    },
    createdAt: '2026-01-28T09:00:00Z'
  },
  {
    id: 'prod-12',
    slug: 'dji-mini-4-pro-drone-fly-more-combo-plus',
    title: 'DJI Mini 4 Pro Drone Fly More Combo Plus (DJI RC 2 Controller)',
    brand: 'DJI',
    model: 'Mini 4 Pro Fly More Plus',
    sku: 'DJI-M4P-FMC-PLUS',
    barcode: '6941565968291',
    categorySlug: 'other-electronics',
    description: 'Under 249g ultra-compact drone with Omnidirectional Obstacle Sensing, 4K/60fps HDR True Vertical Shooting, 20km FHD Video Transmission, and up to 45 mins flight time per battery.',
    shortSpecs: [
      'Lightweight sub-249g (No UAE GCAA permit required for hobbyists)',
      'Omnidirectional active obstacle sensing',
      '4K/60fps HDR & True Vertical social media shooting',
      'Includes DJI RC 2 with built-in 5.5" FHD screen & 3 Plus batteries'
    ],
    originalPrice: 4399,
    salePrice: 3999,
    costPrice: 3400,
    stock: 4,
    stockAlertThreshold: 1,
    rating: 4.9,
    reviewCount: 39,
    isWeeklyOffer: true,
    isFlashSale: false,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    warranty: '1 Year DJI UAE Official Warranty',
    whatsInBox: ['DJI Mini 4 Pro', 'DJI RC 2 Controller', '3x Intelligent Flight Battery Plus', 'Two-Way Charging Hub', 'Shoulder Bag', 'Spare Propellers (Pair x3)', 'Screwdriver & Screws'],
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=85'
    ],
    specifications: {
      'Takeoff Weight': '249 g',
      'Max Flight Time': '45 mins (with Intelligent Flight Battery Plus)',
      'Camera Sensor': '1/1.3-inch CMOS, f/1.7 aperture, 48MP',
      'Video Resolution': '4K HDR up to 60fps, 4K/100fps slow motion',
      'Transmission': 'DJI O4 up to 20 km distance'
    },
    createdAt: '2026-02-01T10:00:00Z'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Titanium. So Strong. So Light. So Pro.',
    subtitle: 'iPhone 16 Pro Max in Desert Titanium with Apple Intelligence',
    offerText: 'Special Abu Dhabi Launch Offer: AED 4,799',
    badge: 'NEW ARRIVAL',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop&q=90',
    ctaText: 'Shop iPhone 16 Pro Max',
    ctaLink: '/product/apple-iphone-16-pro-max-256gb',
    type: 'hero',
    order: 1,
    active: true
  },
  {
    id: 'ban-2',
    title: 'Galaxy AI Unleashed - S25 Ultra 5G',
    subtitle: 'Next-Gen Performance with Snapdragon 8 Elite & 200MP Quad Camera',
    offerText: 'Instant AED 450 OFF + Free 45W Charger',
    badge: 'EXCLUSIVE DEAL',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1600&auto=format&fit=crop&q=90',
    ctaText: 'Explore Samsung Flagship',
    ctaLink: '/product/samsung-galaxy-s25-ultra-512gb',
    type: 'hero',
    order: 2,
    active: true
  },
  {
    id: 'ban-3',
    title: 'M4 Pro MacBook Pro 14"',
    subtitle: 'Extreme Speed, 24GB Unified Memory, up to 22h Battery Life',
    offerText: 'Starting from AED 7,999 or Pay in 4 with Tabby',
    badge: 'PRO WORKSTATION',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=90',
    ctaText: 'Shop MacBook Pro',
    ctaLink: '/product/apple-macbook-pro-14-m4-pro',
    type: 'hero',
    order: 3,
    active: true
  },
  {
    id: 'ban-4',
    title: 'Sony Audio Superfest in Abu Dhabi',
    subtitle: 'WH-1000XM5 Noise Cancelling Headphones at unbeatable UAE pricing',
    offerText: 'Save AED 300 Today • Fast Delivery Across All 7 Emirates',
    badge: 'LIMITED TIME',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=90',
    ctaText: 'Grab Deal Now',
    ctaLink: '/product/sony-wh-1000xm5-wireless-headphones',
    type: 'promo_mid',
    order: 1,
    active: true
  }
];

// 7 days from today ISO string
const nextWeekDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const nextTwoDaysDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

export const INITIAL_WEEKLY_OFFERS: WeeklyOffer[] = [
  {
    id: 'wo-1',
    productId: 'prod-1',
    offerPrice: 4799,
    originalPrice: 5099,
    discountPercent: 6,
    expiresAt: nextWeekDate,
    stockQuantity: 14,
    active: true
  },
  {
    id: 'wo-2',
    productId: 'prod-3',
    offerPrice: 7999,
    originalPrice: 8499,
    discountPercent: 6,
    expiresAt: nextWeekDate,
    stockQuantity: 6,
    active: true
  },
  {
    id: 'wo-3',
    productId: 'prod-5',
    offerPrice: 2999,
    originalPrice: 3299,
    discountPercent: 9,
    expiresAt: nextWeekDate,
    stockQuantity: 8,
    active: true
  },
  {
    id: 'wo-4',
    productId: 'prod-8',
    offerPrice: 1299,
    originalPrice: 1599,
    discountPercent: 19,
    expiresAt: nextWeekDate,
    stockQuantity: 11,
    active: true
  }
];

export const INITIAL_FLASH_SALES: FlashSale[] = [
  {
    id: 'fs-1',
    productId: 'prod-2',
    flashPrice: 4499,
    originalPrice: 4949,
    discountPercent: 9,
    totalStock: 15,
    remainingStock: 4, // "Only 4 left" example requested
    endsAt: nextTwoDaysDate,
    active: true
  },
  {
    id: 'fs-2',
    productId: 'prod-4',
    flashPrice: 1199,
    originalPrice: 1499,
    discountPercent: 20,
    totalStock: 25,
    remainingStock: 5,
    endsAt: nextTwoDaysDate,
    active: true
  },
  {
    id: 'fs-3',
    productId: 'prod-6',
    flashPrice: 3199,
    originalPrice: 3399,
    discountPercent: 6,
    totalStock: 10,
    remainingStock: 2,
    endsAt: nextTwoDaysDate,
    active: true
  },
  {
    id: 'fs-4',
    productId: 'prod-10',
    flashPrice: 799,
    originalPrice: 949,
    discountPercent: 16,
    totalStock: 30,
    remainingStock: 7,
    endsAt: nextTwoDaysDate,
    active: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'ES10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 200,
    maxDiscount: 200,
    expiryDate: '2026-12-31T23:59:59Z',
    usageLimit: 500,
    timesUsed: 42,
    active: true
  },
  {
    id: 'c-2',
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 500,
    expiryDate: '2026-12-31T23:59:59Z',
    usageLimit: 1000,
    timesUsed: 110,
    active: true
  },
  {
    id: 'c-3',
    code: 'ABUDHABI',
    discountType: 'fixed',
    discountValue: 30,
    minOrderValue: 300,
    expiryDate: '2026-12-31T23:59:59Z',
    usageLimit: 200,
    timesUsed: 19,
    active: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Mohammed Al-Zaabi',
    userEmail: 'mohammed.z@example.ae',
    rating: 5,
    title: 'Best smartphone experience in the UAE',
    comment: 'Ordered in Abu Dhabi and received next day with genuine Apple warranty and official 5% VAT invoice. Desert Titanium finish is breathtaking.',
    isVerifiedPurchase: true,
    createdAt: '2026-02-10T14:30:00Z',
    status: 'approved'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@example.com',
    rating: 5,
    title: 'Camera zoom and battery life are unbeatable',
    comment: 'The 5x zoom is crisp and Apple Intelligence features make editing photos effortless. Excellent customer service from E Smart Electronics.',
    isVerifiedPurchase: true,
    createdAt: '2026-02-15T18:15:00Z',
    status: 'approved'
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    userName: 'Tariq Mansoor',
    userEmail: 'tariq.m@example.ae',
    rating: 5,
    title: 'Pure silence on Dubai-Abu Dhabi commute',
    comment: 'Noise cancellation is top notch. The silver finish is very elegant. Paid in 4 installments with Tabby, super smooth checkout!',
    isVerifiedPurchase: true,
    createdAt: '2026-02-18T10:00:00Z',
    status: 'approved'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ESM-2026-8921',
    invoiceNumber: 'INV-UAE-2026-8921',
    invoiceDate: '2026-02-28',
    customer: {
      userId: 'usr-customer-1',
      fullName: 'Rashid Al Nuaimi',
      email: 'customer@gmail.com',
      phone: '+971 50 123 4567'
    },
    shippingAddress: {
      apartmentVilla: 'Villa 14, Al Raha Gardens',
      street: 'Al Raha Blvd',
      area: 'Khalifa City',
      city: 'Abu Dhabi',
      emirate: 'Abu Dhabi',
      country: 'United Arab Emirates',
      specialInstructions: 'Please call on arrival at security gate.'
    },
    items: [
      {
        productId: 'prod-4',
        productTitle: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Silver',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=85',
        brand: 'Sony',
        model: 'WH-1000XM5',
        sku: 'SONY-WH1000XM5-SLV',
        unitPrice: 1199,
        quantity: 1,
        totalPrice: 1199
      },
      {
        productId: 'prod-7',
        productTitle: 'Anker Prime 27,650mAh Power Bank (250W Multi-device Fast Charger)',
        productImage: 'https://images.unsplash.com/photo-1609592424368-80945cbba743?w=800&auto=format&fit=crop&q=85',
        brand: 'Anker',
        model: 'Anker 737 / Prime 250W',
        sku: 'ANK-A1340-BLK',
        unitPrice: 499,
        quantity: 1,
        totalPrice: 499
      }
    ],
    subtotal: 1698,
    vatRate: 0.05,
    vatAmount: 84.90,
    deliveryFee: 0, // Above free delivery threshold (AED 250)
    deliveryType: 'standard',
    discountAmount: 100, // Coupon ES10
    couponCode: 'ES10',
    total: 1682.90,
    paymentMethod: 'card',
    paymentStatus: 'confirmed',
    orderStatus: 'Out for Delivery',
    trackingNumber: 'TRK-UAE-92841',
    carrier: 'E Smart Express Courier',
    statusHistory: [
      { status: 'Order Received', timestamp: '2026-02-28T09:12:00Z', note: 'Order placed via online store' },
      { status: 'Payment Confirmed', timestamp: '2026-02-28T09:15:00Z', note: 'Payment of AED 1,682.90 verified' },
      { status: 'Processing', timestamp: '2026-02-28T10:00:00Z', note: 'Warehouse picking started' },
      { status: 'Packed', timestamp: '2026-02-28T11:30:00Z', note: 'Securely packaged with seal #82910' },
      { status: 'Shipped', timestamp: '2026-02-28T13:00:00Z', note: 'Dispatched from Abu Dhabi Central Hub' },
      { status: 'Out for Delivery', timestamp: '2026-03-01T08:30:00Z', note: 'Courier out for delivery to Al Raha Gardens' }
    ],
    createdAt: '2026-02-28T09:12:00Z'
  }
];
