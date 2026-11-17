import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Badge, BusyIndicator } from '@ui5/webcomponents-react';
import { api } from '../../api.js';

export default function AgentActivityScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getAgentActivities(50).then(data => {
      setConversations(Array.isArray(data) ? data : []);
    }).catch(() => setConversations(sampleConversations)).finally(() => setLoading(false));
  }, []);

  const sampleConversations = [
    { ID: '1', timestamp: new Date(Date.now() - 120000).toISOString(), userMessage: 'Show me top customers by revenue', agentResponse: 'Here are the top 5 customers by revenue this quarter...', executionStatus: 'success', durationMs: 1240, toolsUsed: '["list_a_salesorder","get_customer_detail"]' },
    { ID: '2', timestamp: new Date(Date.now() - 360000).toISOString(), userMessage: 'Which orders are overdue?', agentResponse: 'I found 3 overdue orders requiring immediate attention...', executionStatus: 'success', durationMs: 980, toolsUsed: '["list_a_salesorder"]' },
    { ID: '3', timestamp: new Date(Date.now() - 600000).toISOString(), userMessage: 'Generate sales recommendations', agentResponse: 'Based on current data, here are the top recommendations...', executionStatus: 'success', durationMs: 2100, toolsUsed: '["list_a_salesorder","list_a_businesspartner","list_a_billingdocument"]' },
  ];

  const displayData = conversations.length > 0 ? conversations : sampleConversations;

  const statusColor = (s) => s === 'success' ? '#107e3e' : s === 'error' ? '#bb0000' : '#0070f2';
  const formatTime = (iso) => new Date(iso).toLocaleString();
  const parseTools = (t) => { try { return JSON.parse(t || '[]'); } catch { return []; } };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Title level="H3">Agent Activity Log</Title>
        <Text style={{ color: '#666', fontSize: '0.875rem' }}>All AI agent conversations and tool calls</Text>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <BusyIndicator active size="Large" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1rem' }}>
          {/* Conversation List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displayData.map(conv => (
              <Card
                key={conv.ID}
                style={{ cursor: 'pointer', border: selected?.ID === conv.ID ? '2px solid #0070f2' : '1px solid #e5e5e5' }}
                onClick={() => setSelected(selected?.ID === conv.ID ? null : conv)}
              >
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Text style={{ fontWeight: '600', fontSize: '0.9rem', flex: 1, marginRight: '0.5rem' }}>
                      {conv.userMessage?.slice(0, 80)}{conv.userMessage?.length > 80 ? '...' : ''}
                    </Text>
                    <span style={{ fontSize: '0.75rem', color: statusColor(conv.executionStatus), fontWeight: '600', flexShrink: 0 }}>
                      ● {conv.executionStatus}
                    </span>
                  </div>
                  <Text style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                    {conv.agentResponse?.slice(0, 100)}{conv.agentResponse?.length > 100 ? '...' : ''}
                  </Text>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Text style={{ fontSize: '0.75rem', color: '#888' }}>{formatTime(conv.timestamp)}</Text>
                    {conv.durationMs > 0 && (
                      <Text style={{ fontSize: '0.75rem', color: '#888' }}>• {(conv.durationMs / 1000).toFixed(1)}s</Text>
                    )}
                    {parseTools(conv.toolsUsed).map((tool, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', background: '#e8f4fd', color: '#0070f2', padding: '1px 6px', borderRadius: '10px' }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detail Panel */}
          {selected && (
            <Card style={{ position: 'sticky', top: '0', alignSelf: 'flex-start' }}>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Title level="H5">Conversation Detail</Title>
                  <span style={{ cursor: 'pointer', color: '#666', fontSize: '1.2rem' }} onClick={() => setSelected(null)}>✕</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Text style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>USER</Text>
                  <div style={{ background: '#f0f2f5', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem' }}>
                    {selected.userMessage}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Text style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>AGENT</Text>
                  <div style={{ background: '#e8f4fd', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {selected.agentResponse}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '0.75rem' }}>
                  <Text style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.5rem' }}>TOOLS USED</Text>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {parseTools(selected.toolsUsed).length > 0
                      ? parseTools(selected.toolsUsed).map((t, i) => (
                          <span key={i} style={{ fontSize: '0.75rem', background: '#e8f4fd', color: '#0070f2', padding: '2px 8px', borderRadius: '10px' }}>{t}</span>
                        ))
                      : <Text style={{ fontSize: '0.8rem', color: '#888' }}>No tools used</Text>
                    }
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem' }}>
                    <Text style={{ fontSize: '0.8rem', color: '#444' }}>⏱ {(selected.durationMs / 1000).toFixed(2)}s</Text>
                    <Text style={{ fontSize: '0.8rem', color: statusColor(selected.executionStatus) }}>● {selected.executionStatus}</Text>
                    <Text style={{ fontSize: '0.8rem', color: '#888' }}>{formatTime(selected.timestamp)}</Text>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
