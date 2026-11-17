'use strict';

/**
 * Sample Data Provider
 * Provides realistic sample data for development and testing.
 * All items are clearly marked isSampleData: true.
 * Toggle via USE_SAMPLE_DATA environment variable.
 */

const CUSTOMERS = [
  { id: 'C001', name: 'Acme Corporation', industry: 'Technology', segment: 'Enterprise', creditLimit: 500000, creditExposure: 320000, currency: 'USD', orderCount: 12, totalOrderValue: 487500 },
  { id: 'C002', name: 'Global Dynamics', industry: 'Manufacturing', segment: 'Enterprise', creditLimit: 750000, creditExposure: 680000, currency: 'USD', orderCount: 18, totalOrderValue: 923000 },
  { id: 'C003', name: 'Sunrise Retail', industry: 'Retail', segment: 'Mid-Market', creditLimit: 200000, creditExposure: 195000, currency: 'USD', orderCount: 7, totalOrderValue: 145000 },
  { id: 'C004', name: 'TechNova Solutions', industry: 'Technology', segment: 'Mid-Market', creditLimit: 300000, creditExposure: 120000, currency: 'USD', orderCount: 9, totalOrderValue: 278000 },
  { id: 'C005', name: 'Premier Industries', industry: 'Manufacturing', segment: 'Enterprise', creditLimit: 1000000, creditExposure: 450000, currency: 'USD', orderCount: 24, totalOrderValue: 1560000 },
  { id: 'C006', name: 'Nordic Traders', industry: 'Retail', segment: 'SME', creditLimit: 80000, creditExposure: 78500, currency: 'USD', orderCount: 4, totalOrderValue: 62000 },
  { id: 'C007', name: 'Atlas Logistics', industry: 'Logistics', segment: 'Mid-Market', creditLimit: 250000, creditExposure: 90000, currency: 'USD', orderCount: 11, totalOrderValue: 334000 },
  { id: 'C008', name: 'Quantum Energy', industry: 'Energy', segment: 'Enterprise', creditLimit: 600000, creditExposure: 510000, currency: 'USD', orderCount: 15, totalOrderValue: 892000 },
  { id: 'C009', name: 'BrightPath Media', industry: 'Media', segment: 'SME', creditLimit: 50000, creditExposure: 12000, currency: 'USD', orderCount: 3, totalOrderValue: 28000 },
  { id: 'C010', name: 'Meridian Financial', industry: 'Finance', segment: 'Enterprise', creditLimit: 400000, creditExposure: 240000, currency: 'USD', orderCount: 8, totalOrderValue: 312000 }
];

const today = new Date();
const daysAgo = (n) => new Date(today - n * 86400000).toISOString().slice(0, 10);
const daysAhead = (n) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

const ORDERS = [
  { id: 'SO-10001', customer: 'C001', customerName: 'Acme Corporation', status: 'Open', statusDescription: 'Open', totalValue: 45000, currency: 'USD', salesOrderDate: daysAgo(15), requestedDeliveryDate: daysAhead(10), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10002', customer: 'C002', customerName: 'Global Dynamics', status: 'InProcess', statusDescription: 'In Process', totalValue: 128000, currency: 'USD', salesOrderDate: daysAgo(8), requestedDeliveryDate: daysAhead(5), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10003', customer: 'C003', customerName: 'Sunrise Retail', status: 'CreditBlock', statusDescription: 'Credit Blocked', totalValue: 38500, currency: 'USD', salesOrderDate: daysAgo(20), requestedDeliveryDate: daysAgo(5), overdue: true, daysOverdue: 5, creditBlocked: true },
  { id: 'SO-10004', customer: 'C004', customerName: 'TechNova Solutions', status: 'Open', statusDescription: 'Open', totalValue: 72000, currency: 'USD', salesOrderDate: daysAgo(5), requestedDeliveryDate: daysAhead(20), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10005', customer: 'C005', customerName: 'Premier Industries', status: 'Completed', statusDescription: 'Completed', totalValue: 295000, currency: 'USD', salesOrderDate: daysAgo(45), requestedDeliveryDate: daysAgo(15), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10006', customer: 'C006', customerName: 'Nordic Traders', status: 'Overdue', statusDescription: 'Overdue', totalValue: 18000, currency: 'USD', salesOrderDate: daysAgo(40), requestedDeliveryDate: daysAgo(10), overdue: true, daysOverdue: 10, creditBlocked: false },
  { id: 'SO-10007', customer: 'C007', customerName: 'Atlas Logistics', status: 'Open', statusDescription: 'Open', totalValue: 88500, currency: 'USD', salesOrderDate: daysAgo(3), requestedDeliveryDate: daysAhead(30), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10008', customer: 'C008', customerName: 'Quantum Energy', status: 'InProcess', statusDescription: 'In Process', totalValue: 210000, currency: 'USD', salesOrderDate: daysAgo(12), requestedDeliveryDate: daysAhead(8), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10009', customer: 'C001', customerName: 'Acme Corporation', status: 'Open', statusDescription: 'Open', totalValue: 33000, currency: 'USD', salesOrderDate: daysAgo(2), requestedDeliveryDate: daysAhead(25), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10010', customer: 'C002', customerName: 'Global Dynamics', status: 'CreditBlock', statusDescription: 'Credit Blocked', totalValue: 67000, currency: 'USD', salesOrderDate: daysAgo(18), requestedDeliveryDate: daysAgo(3), overdue: true, daysOverdue: 3, creditBlocked: true },
  { id: 'SO-10011', customer: 'C005', customerName: 'Premier Industries', status: 'Open', statusDescription: 'Open', totalValue: 445000, currency: 'USD', salesOrderDate: daysAgo(1), requestedDeliveryDate: daysAhead(45), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10012', customer: 'C010', customerName: 'Meridian Financial', status: 'InProcess', statusDescription: 'In Process', totalValue: 95000, currency: 'USD', salesOrderDate: daysAgo(7), requestedDeliveryDate: daysAhead(14), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10013', customer: 'C009', customerName: 'BrightPath Media', status: 'Open', statusDescription: 'Open', totalValue: 12000, currency: 'USD', salesOrderDate: daysAgo(4), requestedDeliveryDate: daysAhead(21), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10014', customer: 'C008', customerName: 'Quantum Energy', status: 'Overdue', statusDescription: 'Overdue', totalValue: 178000, currency: 'USD', salesOrderDate: daysAgo(55), requestedDeliveryDate: daysAgo(25), overdue: true, daysOverdue: 25, creditBlocked: false },
  { id: 'SO-10015', customer: 'C004', customerName: 'TechNova Solutions', status: 'Completed', statusDescription: 'Completed', totalValue: 56000, currency: 'USD', salesOrderDate: daysAgo(60), requestedDeliveryDate: daysAgo(30), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10016', customer: 'C003', customerName: 'Sunrise Retail', status: 'Open', statusDescription: 'Open', totalValue: 22500, currency: 'USD', salesOrderDate: daysAgo(6), requestedDeliveryDate: daysAhead(15), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10017', customer: 'C007', customerName: 'Atlas Logistics', status: 'InProcess', statusDescription: 'In Process', totalValue: 115000, currency: 'USD', salesOrderDate: daysAgo(9), requestedDeliveryDate: daysAhead(6), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10018', customer: 'C010', customerName: 'Meridian Financial', status: 'Open', statusDescription: 'Open', totalValue: 48000, currency: 'USD', salesOrderDate: daysAgo(11), requestedDeliveryDate: daysAhead(18), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10019', customer: 'C006', customerName: 'Nordic Traders', status: 'CreditBlock', statusDescription: 'Credit Blocked', totalValue: 15500, currency: 'USD', salesOrderDate: daysAgo(25), requestedDeliveryDate: daysAgo(8), overdue: true, daysOverdue: 8, creditBlocked: true },
  { id: 'SO-10020', customer: 'C005', customerName: 'Premier Industries', status: 'InProcess', statusDescription: 'In Process', totalValue: 380000, currency: 'USD', salesOrderDate: daysAgo(14), requestedDeliveryDate: daysAhead(7), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10021', customer: 'C001', customerName: 'Acme Corporation', status: 'Completed', statusDescription: 'Completed', totalValue: 89000, currency: 'USD', salesOrderDate: daysAgo(90), requestedDeliveryDate: daysAgo(60), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10022', customer: 'C002', customerName: 'Global Dynamics', status: 'Open', statusDescription: 'Open', totalValue: 142000, currency: 'USD', salesOrderDate: daysAgo(10), requestedDeliveryDate: daysAhead(20), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10023', customer: 'C008', customerName: 'Quantum Energy', status: 'Open', statusDescription: 'Open', totalValue: 265000, currency: 'USD', salesOrderDate: daysAgo(16), requestedDeliveryDate: daysAhead(12), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10024', customer: 'C007', customerName: 'Atlas Logistics', status: 'Completed', statusDescription: 'Completed', totalValue: 74000, currency: 'USD', salesOrderDate: daysAgo(75), requestedDeliveryDate: daysAgo(45), overdue: false, daysOverdue: 0, creditBlocked: false },
  { id: 'SO-10025', customer: 'C004', customerName: 'TechNova Solutions', status: 'Open', statusDescription: 'Open', totalValue: 95500, currency: 'USD', salesOrderDate: daysAgo(13), requestedDeliveryDate: daysAhead(17), overdue: false, daysOverdue: 0, creditBlocked: false }
];

const LINE_ITEMS = {
  'SO-10001': [
    { itemNumber: '10', material: 'MAT-001', description: 'Enterprise Software License', quantity: 5, unit: 'EA', unitPrice: 6000, totalPrice: 30000, currency: 'USD' },
    { itemNumber: '20', material: 'MAT-002', description: 'Implementation Services', quantity: 1, unit: 'SVC', unitPrice: 15000, totalPrice: 15000, currency: 'USD' }
  ],
  'SO-10002': [
    { itemNumber: '10', material: 'MAT-010', description: 'Industrial Pump Assembly', quantity: 10, unit: 'EA', unitPrice: 8500, totalPrice: 85000, currency: 'USD' },
    { itemNumber: '20', material: 'MAT-011', description: 'Spare Parts Kit', quantity: 25, unit: 'EA', unitPrice: 1720, totalPrice: 43000, currency: 'USD' }
  ]
};

const TREND_DATA = (() => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    months.push({
      month: label,
      orderCount: Math.floor(Math.random() * 15) + 8,
      totalValue: Math.floor(Math.random() * 800000) + 400000,
      avgValue: Math.floor(Math.random() * 40000) + 30000
    });
  }
  return months;
})();

// ── Public API ──────────────────────────────────────────────────────────────

function getDashboardKPIs() {
  const openOrders = ORDERS.filter(o => o.status === 'Open' || o.status === 'InProcess');
  const overdueOrders = ORDERS.filter(o => o.overdue);
  const creditBlocked = ORDERS.filter(o => o.creditBlocked);
  const topCustomers = [...CUSTOMERS]
    .sort((a, b) => b.totalOrderValue - a.totalOrderValue)
    .slice(0, 5)
    .map(c => ({ id: c.id, name: c.name, orderValue: c.totalOrderValue }));

  return {
    totalOrders: ORDERS.length,
    openOrders: openOrders.length,
    totalOpenValue: openOrders.reduce((s, o) => s + o.totalValue, 0),
    currency: 'USD',
    customerCount: CUSTOMERS.length,
    overdueOrders: overdueOrders.length,
    creditBlockedOrders: creditBlocked.length,
    topCustomers,
    trendData: TREND_DATA,
    isSampleData: true
  };
}

function getCustomers(search, top = 50) {
  let result = CUSTOMERS;
  if (search) {
    const q = search.toLowerCase();
    result = CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }
  return {
    customers: result.slice(0, top),
    totalCount: result.length,
    isSampleData: true
  };
}

function getCustomerDetail(customerId) {
  const customer = CUSTOMERS.find(c => c.id === customerId) || CUSTOMERS[0];
  const recentOrders = ORDERS.filter(o => o.customer === customer.id).slice(0, 10);
  const creditRatio = customer.creditExposure / customer.creditLimit;
  const riskScore = Math.round(creditRatio * 100);
  const riskLevel = riskScore > 90 ? 'High' : riskScore > 70 ? 'Medium' : 'Low';

  return {
    customer,
    recentOrders,
    riskScore,
    riskLevel,
    insights: `[SAMPLE DATA] ${customer.name} is a ${customer.segment} customer in the ${customer.industry} sector. ` +
      `Credit utilization is ${riskScore}% (${riskLevel} risk). ` +
      `${recentOrders.filter(o => o.overdue).length} overdue order(s) detected. ` +
      `Recommendation: ${riskLevel === 'High' ? 'Schedule urgent review meeting.' : 'Monitor monthly.'}`,
    isSampleData: true
  };
}

function getSalesOrders(customerId, status, top = 50) {
  let result = ORDERS;
  if (customerId) result = result.filter(o => o.customer === customerId);
  if (status && status !== 'All') result = result.filter(o => o.status === status);
  const overdueCount = result.filter(o => o.overdue).length;
  const creditBlockedCount = result.filter(o => o.creditBlocked).length;
  return {
    orders: result.slice(0, top),
    totalCount: result.length,
    overdueCount,
    creditBlockedCount,
    isSampleData: true
  };
}

function getSalesOrderDetail(orderId) {
  const order = ORDERS.find(o => o.id === orderId) || ORDERS[0];
  const lineItems = LINE_ITEMS[order.id] || [
    { itemNumber: '10', material: 'MAT-SAMPLE', description: 'Sample Product', quantity: 1, unit: 'EA', unitPrice: order.totalValue, totalPrice: order.totalValue, currency: order.currency }
  ];
  return { order, lineItems, isSampleData: true };
}

function getRecommendations() {
  return {
    recommendations: [
      {
        id: 'REC-001', priority: 'High', category: 'AtRiskCustomer',
        referenceId: 'C003', referenceType: 'Customer',
        recommendation: '[SAMPLE] Sunrise Retail has reached 97.5% of their credit limit with 1 credit-blocked order. Initiate a credit review and payment plan discussion immediately.',
        status: 'New'
      },
      {
        id: 'REC-002', priority: 'High', category: 'OverdueOrder',
        referenceId: 'SO-10014', referenceType: 'SalesOrder',
        recommendation: '[SAMPLE] Order SO-10014 for Quantum Energy is 25 days overdue with a value of $178,000. Escalate to account manager for immediate follow-up.',
        status: 'New'
      },
      {
        id: 'REC-003', priority: 'Medium', category: 'UpsellOpportunity',
        referenceId: 'C005', referenceType: 'Customer',
        recommendation: '[SAMPLE] Premier Industries has placed 3 large orders this quarter totaling $1.12M. Consider proposing a volume discount framework agreement to secure next quarter\'s business.',
        status: 'New'
      }
    ],
    totalCount: 3,
    isSampleData: true
  };
}

function chatReply(message) {
  const msg = (message || '').toLowerCase();
  let response;
  let toolsUsed = [];

  if (msg.includes('dashboard') || msg.includes('kpi') || msg.includes('summary')) {
    const kpis = getDashboardKPIs();
    toolsUsed = ['getDashboardKPIs'];
    response = `**[SAMPLE DATA] Sales Dashboard Summary**\n\n` +
      `📦 **Total Orders:** ${kpis.totalOrders}\n` +
      `🔓 **Open Orders:** ${kpis.openOrders} (Value: $${kpis.totalOpenValue.toLocaleString()})\n` +
      `👥 **Active Customers:** ${kpis.customerCount}\n` +
      `⚠️ **Overdue Orders:** ${kpis.overdueOrders}\n` +
      `🚫 **Credit Blocked:** ${kpis.creditBlockedOrders}\n\n` +
      `**Top Customer:** ${kpis.topCustomers[0]?.name} ($${kpis.topCustomers[0]?.orderValue.toLocaleString()})`;
  } else if (msg.includes('customer') || msg.includes('client')) {
    toolsUsed = ['getCustomers'];
    response = `**[SAMPLE DATA] Customer Overview**\n\nYou have **10 active customers** across Technology, Manufacturing, Retail, Logistics, Energy, Media and Finance sectors.\n\n` +
      `🔴 **At Risk:** Sunrise Retail (97.5% credit utilization), Nordic Traders (98.1%)\n` +
      `⭐ **Top Customer:** Premier Industries ($1.56M total orders)\n\n` +
      `Would you like details on a specific customer?`;
  } else if (msg.includes('overdue') || msg.includes('exception') || msg.includes('blocked')) {
    toolsUsed = ['getSalesOrders'];
    const exOrders = ORDERS.filter(o => o.overdue || o.creditBlocked);
    response = `**[SAMPLE DATA] Order Exceptions**\n\nFound **${exOrders.length} orders** requiring attention:\n\n` +
      exOrders.map(o =>
        `• **${o.id}** — ${o.customerName}: $${o.totalValue.toLocaleString()} | ` +
        `${o.creditBlocked ? '🚫 Credit Blocked' : `⏰ ${o.daysOverdue} days overdue`}`
      ).join('\n');
  } else if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('insight')) {
    toolsUsed = ['generateRecommendations'];
    const recs = getRecommendations();
    response = `**[SAMPLE DATA] AI Sales Recommendations**\n\n` +
      recs.recommendations.map((r, i) =>
        `**${i + 1}. [${r.priority}] ${r.category}**\n${r.recommendation}`
      ).join('\n\n');
  } else {
    response = `**[SAMPLE DATA] AI Sales Assistant**\n\nHello! I'm your Intelligent Sales Assistant. I can help you with:\n\n` +
      `• 📊 **Sales Dashboard** — KPIs and trends\n` +
      `• 👥 **Customer Analysis** — risk assessment and insights\n` +
      `• 📦 **Order Management** — exceptions and status\n` +
      `• 🎯 **Recommendations** — AI-powered suggestions\n\n` +
      `Try asking: *"Show me the dashboard KPIs"* or *"Which orders are overdue?"*`;
  }

  return { response, toolsUsed };
}

module.exports = { getDashboardKPIs, getCustomers, getCustomerDetail, getSalesOrders, getSalesOrderDetail, getRecommendations, chatReply };
