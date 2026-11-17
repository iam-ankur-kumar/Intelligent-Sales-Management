/**
 * API client for the CAP SalesService backend.
 * All calls go to /api/sales (proxied to CAP in dev, served directly in production).
 */

const BASE = '/api/sales';

async function callAction(action, params = {}) {
  const res = await fetch(`${BASE}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.value !== undefined ? data.value : data;
}

export const api = {
  getDashboardKPIs: () => callAction('getDashboardKPIs'),
  getCustomers: (search, top) => callAction('getCustomers', { search, top }),
  getCustomerDetail: (customerId) => callAction('getCustomerDetail', { customerId }),
  getSalesOrders: (customerId, status, top) => callAction('getSalesOrders', { customerId, status, top }),
  getSalesOrderDetail: (orderId) => callAction('getSalesOrderDetail', { orderId }),
  sendMessage: (message, sessionId) => callAction('sendMessage', { message, sessionId }),
  generateRecommendations: () => callAction('generateRecommendations'),

  getAgentActivities: async (top = 50) => {
    const res = await fetch(`${BASE}/AgentConversations?$orderby=timestamp desc&$top=${top}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.value || [];
  },

  getRecommendations: async () => {
    const res = await fetch(`${BASE}/SalesRecommendations?$orderby=timestamp desc`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.value || [];
  },

  updateRecommendation: async (id, status) => {
    const res = await fetch(`${BASE}/SalesRecommendations(${id})`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }
};
