import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api.js';

const fmt = (n) => n?.toLocaleString('en-US') ?? '—';
const statusColors = {
  Open: { bg: '#dbeafe', text: '#1e40af' },
  InProcess: { bg: '#fff3cd', text: '#856404' },
  Completed: { bg: '#d4edda', text: '#155724' },
  CreditBlock: { bg: '#ffd5d5', text: '#BB0000' },
  Overdue: { bg: '#ffd5d5', text: '#BB0000' }
};

function StatusBadge({ status, label }) {
  const c = statusColors[status] || { bg: '#f0f0f0', text: '#6a6d70' };
  return <span style={{ background: c.bg, color: c.text, padding: '3px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>{label || status}</span>;
}

function StatusTimeline({ status }) {
  const steps = ['Open', 'InProcess', 'Completed'];
  const stepLabels = { Open: 'Created', InProcess: 'In Delivery', Completed: 'Billed' };
  const currentIdx = steps.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '1rem 0' }}>
      {steps.map((s, i) => {
        const done = i <= currentIdx && status !== 'CreditBlock' && status !== 'Overdue';
        const active = i === currentIdx;
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#0070f2' : '#e5e5e5', color: done ? '#fff' : '#8a8d90', fontWeight: '700', fontSize: '0.85rem'
              }}>{done ? '✓' : i + 1}</div>
              <span style={{ fontSize: '0.7rem', color: done ? '#0070f2' : '#8a8d90', fontWeight: done ? '600' : '400' }}>{stepLabels[s]}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '3px', background: i < currentIdx && done ? '#0070f2' : '#e5e5e5', margin: '0 4px', marginBottom: '18px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function SalesOrderDetailScreen({ orderId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investigationLoading, setInvestigationLoading] = useState(false);
  const [investigation, setInvestigation] = useState(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSalesOrderDetail(orderId);
      setDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { load(); }, [load]);

  const investigate = async () => {
    setInvestigationLoading(true);
    try {
      const result = await api.sendMessage(
        `Investigate sales order ${orderId}. Identify any issues, risks, or actions needed. Check delivery status, credit blocks, and provide recommendations.`,
        `investigate-${Date.now()}`
      );
      setInvestigation(result.response);
    } catch (err) {
      setInvestigation(`Investigation error: ${err.message}`);
    } finally {
      setInvestigationLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#6a6d70' }}>⟳ Loading order details…</div>;
  if (error) return <div style={{ padding: '2rem' }}><div style={{ background: '#ffd5d5', borderRadius: '8px', padding: '1rem', color: '#BB0000' }}>⚠️ {error}</div></div>;
  if (!detail) return null;

  const { order, lineItems } = detail;
  const totalLineValue = (lineItems || []).reduce((s, li) => s + (li.totalPrice || 0), 0);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0070f2', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}>
        ← Back to Orders
      </button>

      {/* Order Header */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#32363a' }}>{order.id}</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#6a6d70', fontSize: '0.875rem' }}>{order.customerName} · {order.customer}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <StatusBadge status={order.status} label={order.statusDescription} />
            <button onClick={investigate} disabled={investigationLoading}
              style={{ background: '#0070f2', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
              {investigationLoading ? '⟳ Investigating…' : '🔍 Investigate Order'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div><div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Order Date</div><div style={{ fontWeight: '600' }}>{order.salesOrderDate}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Delivery Date</div><div style={{ fontWeight: '600' }}>{order.requestedDeliveryDate}</div></div>
          <div><div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Total Value</div><div style={{ fontWeight: '700', color: '#107e3e', fontSize: '1.1rem' }}>${fmt(order.totalValue)} {order.currency}</div></div>
        </div>

        {/* Status Timeline */}
        <StatusTimeline status={order.status} />

        {/* Alerts */}
        {order.creditBlocked && (
          <div style={{ background: '#ffd5d5', border: '1px solid #BB0000', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '0.5rem', color: '#BB0000', fontSize: '0.875rem' }}>
            🚫 <strong>Credit Block Active</strong> — This order is on credit hold. Contact the credit manager to release.
          </div>
        )}
        {order.overdue && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '0.5rem', color: '#856404', fontSize: '0.875rem' }}>
            ⏰ <strong>Overdue by {order.daysOverdue} day{order.daysOverdue !== 1 ? 's' : ''}</strong> — Delivery date has passed. Immediate follow-up required.
          </div>
        )}
      </div>

      {/* Line Items */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e5e5', fontWeight: '600', fontSize: '0.95rem' }}>📋 Order Line Items</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f5f6f7', borderBottom: '2px solid #e5e5e5' }}>
              {['Item', 'Material', 'Description', 'Qty', 'Unit', 'Unit Price', 'Total Price'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#6a6d70', fontWeight: '600', fontSize: '0.8rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(lineItems || []).map((li, i) => (
              <tr key={li.itemNumber} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{li.itemNumber}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#0070f2', fontWeight: '500' }}>{li.material}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{li.description}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{fmt(li.quantity)}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{li.unit}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${fmt(li.unitPrice)}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: '#107e3e' }}>${fmt(li.totalPrice)}</td>
              </tr>
            ))}
            {(lineItems || []).length > 1 && (
              <tr style={{ borderTop: '2px solid #e5e5e5', background: '#f5f6f7' }}>
                <td colSpan={5} />
                <td style={{ padding: '0.75rem 1rem', fontWeight: '700', textAlign: 'right' }}>Total:</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#107e3e', textAlign: 'right' }}>${fmt(totalLineValue)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Investigation Result */}
      {investigation && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight: '600', marginBottom: '0.75rem' }}>🔍 AI Investigation Result</div>
          <div style={{ lineHeight: '1.7', color: '#32363a', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{investigation}</div>
        </div>
      )}
    </div>
  );
}
