import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../api.js';

const fmt = (n) => n?.toLocaleString('en-US') ?? '—';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CustomerListScreen({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 300);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCustomers(search || undefined, 50);
      setCustomers(data.customers || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    const header = 'ID,Name,Industry,Segment,Credit Limit,Credit Exposure,Currency,Orders,Total Value\n';
    const rows = customers.map(c =>
      `"${c.id}","${c.name}","${c.industry}","${c.segment}",${c.creditLimit},${c.creditExposure},${c.currency},${c.orderCount},${c.totalOrderValue}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'customers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const riskBadge = (c) => {
    const ratio = c.creditLimit > 0 ? c.creditExposure / c.creditLimit : 0;
    if (ratio > 0.9) return <span style={{ background: '#ffd5d5', color: '#BB0000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '600' }}>High Risk</span>;
    if (ratio > 0.7) return <span style={{ background: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '600' }}>Medium Risk</span>;
    return <span style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '600' }}>Low Risk</span>;
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#32363a' }}>Customer Management</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#8a8d90' }}>{totalCount} customers found</p>
        </div>
        <button onClick={exportCSV} style={{ background: '#f5f6f7', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          ⬇ Export CSV
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <input
          type="text"
          placeholder="🔍  Search by name, ID, or industry…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
        />
      </div>

      {error && <div style={{ background: '#ffd5d5', border: '1px solid #BB0000', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#BB0000' }}>⚠️ {error}</div>}

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6a6d70' }}>⟳ Loading customers…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f5f6f7', borderBottom: '2px solid #e5e5e5' }}>
                {['Customer ID', 'Name', 'Industry', 'Segment', 'Credit Limit', 'Orders', 'Total Value', 'Risk'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#6a6d70', fontWeight: '600', fontSize: '0.8rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id}
                  onClick={() => onSelectCustomer(c.id)}
                  style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e8f4ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa'}
                >
                  <td style={{ padding: '0.75rem 1rem', color: '#0070f2', fontWeight: '500' }}>{c.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{c.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{c.industry}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#6a6d70' }}>{c.segment}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#32363a' }}>${fmt(c.creditLimit)}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{c.orderCount}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#107e3e', fontWeight: '600' }}>${fmt(c.totalOrderValue)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{riskBadge(c)}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#8a8d90' }}>No customers found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
