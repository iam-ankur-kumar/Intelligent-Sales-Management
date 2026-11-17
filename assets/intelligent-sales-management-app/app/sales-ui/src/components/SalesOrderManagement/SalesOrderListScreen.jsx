import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api.js';

const fmt = (n) => n?.toLocaleString('en-US') ?? '—';

const STATUS_OPTIONS = ['All', 'Open', 'InProcess', 'Completed', 'CreditBlock', 'Overdue'];
const STATUS_LABELS = { All: 'All', Open: 'Open', InProcess: 'In Process', Completed: 'Completed', CreditBlock: 'Credit Blocked', Overdue: 'Overdue' };
const statusColors = {
  Open: { bg: '#dbeafe', text: '#1e40af' },
  InProcess: { bg: '#fff3cd', text: '#856404' },
  Completed: { bg: '#d4edda', text: '#155724' },
  CreditBlock: { bg: '#ffd5d5', text: '#BB0000' },
  Overdue: { bg: '#ffd5d5', text: '#BB0000' }
};

function StatusBadge({ status }) {
  const c = statusColors[status] || { bg: '#f0f0f0', text: '#6a6d70' };
  return <span style={{ background: c.bg, color: c.text, padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>{STATUS_LABELS[status] || status}</span>;
}

export default function SalesOrderListScreen({ onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [creditBlockedCount, setCreditBlockedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSalesOrders(customerFilter || undefined, statusFilter === 'All' ? undefined : statusFilter, 50);
      setOrders(data.orders || []);
      setTotalCount(data.totalCount || 0);
      setOverdueCount(data.overdueCount || 0);
      setCreditBlockedCount(data.creditBlockedCount || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, customerFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#32363a' }}>Sales Order Management</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#8a8d90' }}>{totalCount} orders</p>
        </div>
      </div>

      {/* Exception Banners */}
      {overdueCount > 0 && (
        <div style={{ background: '#ffd5d5', border: '1px solid #BB0000', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.5rem', color: '#BB0000', fontSize: '0.875rem' }}>
          ⏰ <strong>{overdueCount} order{overdueCount !== 1 ? 's' : ''}</strong> are overdue and require immediate attention.
        </div>
      )}
      {creditBlockedCount > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.5rem', color: '#856404', fontSize: '0.875rem' }}>
          🚫 <strong>{creditBlockedCount} order{creditBlockedCount !== 1 ? 's' : ''}</strong> are in credit block.
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '0.75rem', color: '#6a6d70', display: 'block', marginBottom: '4px' }}>Customer</label>
          <input
            type="text" placeholder="Filter by customer ID or name…" value={customerFilter}
            onChange={e => setCustomerFilter(e.target.value)}
            style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#6a6d70', display: 'block', marginBottom: '4px' }}>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: '#fff' }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={() => { setStatusFilter('All'); setCustomerFilter(''); }}
            style={{ background: '#f5f6f7', border: '1px solid #d9d9d9', borderRadius: '6px', padding: '0.5rem 0.9rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            ✕ Clear
          </button>
        </div>
      </div>

      {error && <div style={{ background: '#ffd5d5', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#BB0000' }}>⚠️ {error}</div>}

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6a6d70' }}>⟳ Loading orders…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f5f6f7', borderBottom: '2px solid #e5e5e5' }}>
                {['Order ID', 'Customer', 'Status', 'Total Value', 'Order Date', 'Delivery Date', 'Flags'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#6a6d70', fontWeight: '600', fontSize: '0.8rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id}
                  onClick={() => onSelectOrder(o.id)}
                  style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e8f4ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa'}
                >
                  <td style={{ padding: '0.75rem 1rem', color: '#0070f2', fontWeight: '500' }}>{o.id}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: '500' }}>{o.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#8a8d90' }}>{o.customer}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#107e3e' }}>${fmt(o.totalValue)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{o.salesOrderDate}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{o.requestedDeliveryDate}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {o.overdue && <span style={{ color: '#BB0000', fontSize: '0.72rem', marginRight: '4px' }}>⏰ {o.daysOverdue}d</span>}
                    {o.creditBlocked && <span style={{ color: '#e9730c', fontSize: '0.72rem' }}>🚫</span>}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#8a8d90' }}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
