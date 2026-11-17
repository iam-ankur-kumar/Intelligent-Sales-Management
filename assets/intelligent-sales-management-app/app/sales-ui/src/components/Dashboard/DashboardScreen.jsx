import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardHeader, BusyIndicator, MessageStrip, Title, Text, ProgressIndicator } from '@ui5/webcomponents-react';
import { api } from '../../api.js';

const fmt = (n) => n?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? '—';
const fmtCurrency = (n, currency = 'USD') =>
  n != null ? `${currency} ${fmt(n)}` : '—';

function KPICard({ title, value, subtitle, color = '#0070f2', icon, alert }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', padding: '1.25rem', flex: '1 1 180px', minWidth: '160px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: alert ? '#BB0000' : '#32363a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#6a6d70', marginTop: '0.4rem' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: '#8a8d90', marginTop: '0.2rem' }}>{subtitle}</div>}
    </div>
  );
}

function TrendBar({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.totalValue));
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '1rem', color: '#32363a' }}>📈 6-Month Sales Trend</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
        {data.map((d, i) => {
          const pct = maxVal > 0 ? (d.totalValue / maxVal) * 100 : 0;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '0.65rem', color: '#6a6d70' }}>{fmt(d.totalValue / 1000)}K</div>
              <div style={{
                width: '100%', height: `${Math.max(pct, 4)}%`, background: '#0070f2',
                borderRadius: '4px 4px 0 0', transition: 'height 0.5s', cursor: 'pointer',
                opacity: 0.85
              }} title={`${d.month}: ${fmtCurrency(d.totalValue)}`} />
              <div style={{ fontSize: '0.65rem', color: '#8a8d90', textAlign: 'center' }}>{d.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopCustomersTable({ customers }) {
  if (!customers || customers.length === 0) return null;
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '1rem', color: '#32363a' }}>⭐ Top Customers by Order Value</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6a6d70', fontWeight: '600' }}>Rank</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6a6d70', fontWeight: '600' }}>Customer</th>
            <th style={{ textAlign: 'right', padding: '0.5rem', color: '#6a6d70', fontWeight: '600' }}>Order Value</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '0.6rem 0.5rem', color: '#6a6d70' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </td>
              <td style={{ padding: '0.6rem 0.5rem', fontWeight: '500' }}>{c.name}</td>
              <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#0070f2', fontWeight: '600' }}>
                ${fmt(c.orderValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardScreen({ onNavigate, onSampleDataChange }) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardKPIs();
      setKpis(data);
      setLastRefresh(new Date());
      if (onSampleDataChange) onSampleDataChange(data.isSampleData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onSampleDataChange]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#32363a' }}>Sales Dashboard</h1>
          {lastRefresh && <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#8a8d90' }}>Last updated: {lastRefresh.toLocaleTimeString()}</p>}
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{ background: '#0070f2', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}
        >
          {loading ? '⟳ Refreshing…' : '⟳ Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#ffd5d5', border: '1px solid #BB0000', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#BB0000' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && !kpis ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ textAlign: 'center', color: '#6a6d70' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⟳</div>
            <div>Loading dashboard data…</div>
          </div>
        </div>
      ) : kpis ? (
        <>
          {/* KPI Row 1 */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <KPICard title="Total Sales Orders" value={fmt(kpis.totalOrders)} icon="📦" color="#0070f2" />
            <KPICard title="Open Orders" value={fmt(kpis.openOrders)} subtitle={fmtCurrency(kpis.totalOpenValue, kpis.currency)} icon="🔓" color="#107e3e" />
            <KPICard title="Active Customers" value={fmt(kpis.customerCount)} icon="👥" color="#e9730c" />
            <KPICard title="Overdue Orders" value={fmt(kpis.overdueOrders)} icon="⏰" color="#BB0000" alert={kpis.overdueOrders > 0} />
            <KPICard title="Credit Blocked" value={fmt(kpis.creditBlockedOrders)} icon="🚫" color="#e9730c" alert={kpis.creditBlockedOrders > 0} />
          </div>

          {/* Trend + Top Customers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <TrendBar data={kpis.trendData} />
            <TopCustomersTable customers={kpis.topCustomers} />
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '1rem', color: '#32363a' }}>⚡ Quick Actions</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: '👥 View Customers', screen: 'customers' },
                { label: '📦 Sales Orders', screen: 'orders' },
                { label: '🤖 AI Assistant', screen: 'assistant' },
                { label: '📋 Agent Activity', screen: 'activity' }
              ].map(a => (
                <button key={a.screen} onClick={() => onNavigate(a.screen)}
                  style={{ background: '#f0f2f5', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', color: '#32363a' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
