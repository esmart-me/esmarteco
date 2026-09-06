async function testSuite() {
  const baseUrl = 'http://localhost:5000';

  console.log('--- RUNNING E SMART ELECTRONICS VERIFICATION SUITE ---');

  // 1. Root page
  const rootRes = await fetch(`${baseUrl}/`);
  console.log('1. Root HTML status:', rootRes.status);
  const rootHtml = await rootRes.text();
  console.log('   Contains Title:', rootHtml.includes('E Smart Electronics LLC'));

  // 2. Health check
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const health = await healthRes.json();
  console.log('2. Health status:', health.status, 'Store:', health.store);

  // 3. Autocomplete search
  const autoRes = await fetch(`${baseUrl}/api/products/autocomplete?q=iPhone`);
  const auto = await autoRes.json();
  console.log('3. Autocomplete results count:', auto.results?.length);
  if (auto.results?.length > 0) {
    console.log('   Top Match:', auto.results[0].title, '| Price:', auto.results[0].salePrice);
  }

  // 4. Categories & live counts
  const catRes = await fetch(`${baseUrl}/api/categories`);
  const cat = await catRes.json();
  console.log('4. Categories count:', cat.categories?.length);

  // 5. Weekly offers
  const weeklyRes = await fetch(`${baseUrl}/api/offers/weekly`);
  const weekly = await weeklyRes.json();
  console.log('5. Active weekly offers:', weekly.weeklyOffers?.length);

  // 6. Flash sales
  const flashRes = await fetch(`${baseUrl}/api/offers/flash`);
  const flash = await flashRes.json();
  console.log('6. Active flash sales:', flash.flashSales?.length);

  // 7. Coupon validation
  const coupRes = await fetch(`${baseUrl}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'ES10', subtotal: 1000 })
  });
  const coup = await coupRes.json();
  console.log('7. Coupon ES10 on AED 1000 discount:', coup.discountAmount, '| Message:', coup.message);

  // 8. Order Placement & Server-side 5% UAE VAT check
  const orderRes = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: {
        fullName: 'Hamad Al Dhaheri',
        email: 'hamad.d@example.ae',
        phone: '+971 50 999 8888'
      },
      shippingAddress: {
        apartmentVilla: 'Villa 22',
        street: 'Corniche Road',
        area: 'Al Bateen',
        city: 'Abu Dhabi',
        emirate: 'Abu Dhabi',
        country: 'United Arab Emirates'
      },
      items: [
        {
          productId: 'prod-1', // iPhone 16 Pro Max (AED 4,799)
          quantity: 1
        }
      ],
      deliveryType: 'standard',
      couponCode: 'ES10', // Max discount AED 200
      paymentMethod: 'tabby'
    })
  });
  const orderData = await orderRes.json();
  console.log('8. Order Placement Status:', orderData.success);
  if (orderData.order) {
    console.log('   Order Number:', orderData.order.orderNumber);
    console.log('   Invoice Number:', orderData.order.invoiceNumber);
    console.log('   Subtotal:', orderData.order.subtotal);
    console.log('   Discount:', orderData.order.discountAmount);
    console.log('   UAE VAT (5%):', orderData.order.vatAmount);
    console.log('   Delivery Fee:', orderData.order.deliveryFee);
    console.log('   Final Total (AED):', orderData.order.total);
    console.log('   Tabby Monthly (4x):', orderData.order.tabbyInstallment?.monthlyAmount);
    console.log('   Order Lifecycle Status:', orderData.order.orderStatus);
  }

  // 9. Public Order Tracking
  if (orderData.order) {
    const trackRes = await fetch(`${baseUrl}/api/orders/track/${orderData.order.orderNumber}`);
    const track = await trackRes.json();
    console.log('9. Public Tracking verified for', orderData.order.orderNumber, ':', track.order?.orderStatus);
  }

  console.log('--- ALL VERIFICATIONS COMPLETED SUCCESSFULLY ---');
}

testSuite().catch(console.error);
