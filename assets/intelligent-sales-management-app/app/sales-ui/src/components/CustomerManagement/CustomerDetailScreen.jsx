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
  return <span style={{ background: c.bg, color: c.text, padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>{label || status}</span>;
}

export default function CustomerDetailScreen({ customerId, onBack, onSelectOrder }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCustomerDetail(customerId);
      setDetail(data);
      setAiInsights(data.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { load(); }, [load]);

  const refreshInsights = async () => {
    setAiInsightsLoading(true);
    try {
      const result = await api.sendMessage(
        `Perform a detailed analysis of customer ${customerId}. Include purchase patterns, credit risk assessment, relationship health, and top 3 actionable recommendations.`,
        `insight-${Date.now()}`
      );
      setAiInsights(result.response);
    } catch (err) {
      setAiInsights(`Error loading insights: ${err.message}`);
    } finally {
      setAiInsightsLoading(false);
    }
  };

  const tabs = ['orders', 'insights', 'recommendations'];

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#6a6d70' }}>⟳ Loading customer…</div>;
  if (error) return <div style={{ padding: '2rem' }}><div style={{ background: '#ffd5d5', borderRadius: '8px', padding: '1rem', color: '#BB0000' }}>⚠️ {error}</div></div>;
  if (!detail) return null;

  const { customer, recentOrders, riskScore, riskLevel } = detail;
  const creditUsagePct = customer.creditLimit > 0 ? Math.round((customer.creditExposure / customer.creditLimit) * 100) : 0;
  const riskColor = riskLevel === 'High' ? '#BB0000' : riskLevel === 'Medium' ? '#e9730c' : '#107e3e';

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0070f2', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}>
        ← Back to Customers
      </button>

      {/* Customer Header Card */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#32363a' }}>{customer.name}</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#6a6d70', fontSize: '0.875rem' }}>
              {customer.id} · {customer.industry} · {customer.segment}
            </p>
          </div>
          <span style={{ background: riskColor + '20', color: riskColor, padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.875rem' }}>
            {riskLevel} Risk · {riskScore}%
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Credit Limit</div>
            <div style={{ fontWeight: '600' }}>${fmt(customer.creditLimit)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Credit Exposure</div>
            <div style={{ fontWeight: '600', color: creditUsagePct > 90 ? '#BB0000' : '#32363a' }}>${fmt(customer.creditExposure)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Total Order Value</div>
            <div style={{ fontWeight: '600', color: '#107e3e' }}>${fmt(customer.totalOrderValue)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8a8d90' }}>Total Orders</div>
            <div style={{ fontWeight: '600' }}>{customer.orderCount}</div>
          </div>
        </div>

        {/* Credit Usage Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8a8d90', marginBottom: '4px' }}>
            <span>Credit Utilization</span><span>{creditUsagePct}%</span>
          </div>
          <div style={{ height: '8px', background: '#e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(creditUsagePct, 100)}%`, background: creditUsagePct > 90 ? '#BB0000' : creditUsagePct > 70 ? '#e9730c' : '#107e3e', borderRadius: '4px', transition: 'width 0.6s' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e5e5e5', marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              background: 'none', border: 'none', padding: '0.75rem 1.25rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeTab === t ? '700' : '400',
              color: activeTab === t ? '#0070f2' : '#6a6d70', borderBottom: activeTab === t ? '3px solid #0070f2' : '3px solid transparent', marginBottom: '-2px', textTransform: 'capitalize'
            }}>
            {t === 'orders' ? '📦 Orders' : t === 'insights' ? '🤖 AI Insights' : '🎯 Recommendations'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f5f6f7', borderBottom: '2px solid #e5e5e5' }}>
                {['Order ID', 'Date', 'Status', 'Total Value', 'Delivery Date', 'Flags'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#6a6d70', fontWeight: '600', fontSize: '0.8rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map(o => (
                <tr key={o.id} onClick={() => onSelectOrder(o.id)}
                  style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e8f4ff'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '0.75rem 1rem', color: '#0070f2', fontWeight: '500' }}>{o.id}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{o.salesOrderDate}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={o.status} label={o.statusDescription} /></td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#107e3e' }}>${fmt(o.totalValue)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{o.requestedDeliveryDate}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {o.overdue && <span style={{ color: '#BB0000', fontSize: '0.75rem' }}>⏰ {o.daysOverdue}d overdue </span>}
                    {o.creditBlocked && <span style={{ color: '#e9730c', fontSize: '0.75rem' }}>🚫 Credit Block</span>}
                  </td>
                </tr>
              ))}
              {(recentOrders || []).length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#8a8d90' }}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'insights' && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: '600' }}>🤖 AI Customer Analysis</div>
            <button onClick={refreshInsights} disabled={aiInsightsLoading}
              style={{ background: '#0070f2', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.8rem' }}>
              {aiInsightsLoading ? '⟳ Analyzing…' : '🔄 Re-analyze'}
            </button>
          </div>
          {aiInsights ? (
            <div style={{ lineHeight: '1.7', color: '#32363a', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{aiInsights}</div>
          ) : (
            <div style={{ color: '#8a8d90', textAlign: 'center', padding: '2rem' }}>No insights available. Click Re-analyze to generate.</div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight: '600', marginBottom: '1rem' }}>🎯 Customer-Level Recommendations</div>
          <div style={{ color: '#8a8d90', fontSize: '0.875rem' }}>
            Recommendations for {customer.name}:
            <ul style={{ marginTop: '0.5rem' }}>
              {riskLevel === 'High' && <li>🔴 <strong>Credit Review Needed</strong> — Schedule an immediate credit review meeting</li>}
              {customer.orderCount > 10 && <li>🟢 <strong>Volume Agreement</strong> — Propose a volume discount framework</li>}
              <li>🟠 <strong>Regular Check-in</strong> — Schedule quarterly business review</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
