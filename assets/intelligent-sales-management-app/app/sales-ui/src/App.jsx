import React, { useState, useEffect } from 'react';
import {
  ShellBar,
  ShellBarItem,
  SideNavigation,
  SideNavigationItem,
  MessageStrip
} from '@ui5/webcomponents-react';
import DashboardScreen from './components/Dashboard/DashboardScreen.jsx';
import CustomerListScreen from './components/CustomerManagement/CustomerListScreen.jsx';
import CustomerDetailScreen from './components/CustomerManagement/CustomerDetailScreen.jsx';
import SalesOrderListScreen from './components/SalesOrderManagement/SalesOrderListScreen.jsx';
import SalesOrderDetailScreen from './components/SalesOrderManagement/SalesOrderDetailScreen.jsx';
import AISalesAssistantScreen from './components/AISalesAssistant/AISalesAssistantScreen.jsx';
import AgentActivityScreen from './components/AgentActivity/AgentActivityScreen.jsx';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isSampleData, setIsSampleData] = useState(true);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);

  const navigate = (screen, params = {}) => {
    setActiveScreen(screen);
    if (params.customerId) setSelectedCustomerId(params.customerId);
    if (params.orderId) setSelectedOrderId(params.orderId);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen onNavigate={navigate} onSampleDataChange={setIsSampleData} />;
      case 'customers':
        return <CustomerListScreen onSelectCustomer={(id) => navigate('customer-detail', { customerId: id })} />;
      case 'customer-detail':
        return <CustomerDetailScreen customerId={selectedCustomerId} onBack={() => navigate('customers')} onSelectOrder={(id) => navigate('order-detail', { orderId: id })} />;
      case 'orders':
        return <SalesOrderListScreen onSelectOrder={(id) => navigate('order-detail', { orderId: id })} />;
      case 'order-detail':
        return <SalesOrderDetailScreen orderId={selectedOrderId} onBack={() => navigate('orders')} />;
      case 'assistant':
        return <AISalesAssistantScreen onSampleDataChange={setIsSampleData} />;
      case 'activity':
        return <AgentActivityScreen />;
      default:
        return <DashboardScreen onNavigate={navigate} onSampleDataChange={setIsSampleData} />;
    }
  };

  const navItems = [
    { key: 'dashboard', icon: 'home', text: 'Dashboard' },
    { key: 'customers', icon: 'customer', text: 'Customers' },
    { key: 'orders', icon: 'sales-order', text: 'Sales Orders' },
    { key: 'assistant', icon: 'ai', text: 'AI Assistant' },
    { key: 'activity', icon: 'history', text: 'Agent Activity' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'var(--sapFontFamily, "72", "72full", Arial, Helvetica, sans-serif)' }}>
      {/* Shell Bar */}
      <ShellBar
        primaryTitle="Intelligent Sales Management"
        secondaryTitle="SAP S/4HANA Cloud"
        logo={<img src="https://www.sap.com/dam/application/shared/logos/sap-logo-svg.svg" alt="SAP" style={{ height: '32px' }} onError={(e) => { e.target.style.display = 'none'; }} />}
        style={{ flexShrink: 0 }}
      />

      {/* Sample Data Banner */}
      {isSampleData && (
        <div style={{ padding: '0.25rem 1rem', background: '#fff3cd', borderBottom: '1px solid #ffc107' }}>
          <MessageStrip
            design="Warning"
            hideCloseButton
            style={{ margin: 0 }}
          >
            ⚠️ <strong>Displaying Sample Data</strong> — Connect to SAP S/4HANA Cloud Public Edition for live data. Set <code>USE_SAMPLE_DATA=false</code> in the agent environment to switch.
          </MessageStrip>
        </div>
      )}

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Side Navigation */}
        <div style={{ width: sideNavCollapsed ? '48px' : '220px', transition: 'width 0.2s', background: '#f5f6f7', borderRight: '1px solid #e5e5e5', flexShrink: 0, overflow: 'hidden' }}>
          <nav style={{ padding: '0.5rem 0' }}>
            {navItems.map(item => (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  background: activeScreen === item.key || (activeScreen === 'customer-detail' && item.key === 'customers') || (activeScreen === 'order-detail' && item.key === 'orders')
                    ? '#0070f2' : 'transparent',
                  color: activeScreen === item.key || (activeScreen === 'customer-detail' && item.key === 'customers') || (activeScreen === 'order-detail' && item.key === 'orders')
                    ? '#fff' : '#32363a',
                  borderRadius: '6px',
                  margin: '2px 8px',
                  fontWeight: activeScreen === item.key ? '600' : '400',
                  fontSize: '0.875rem',
                  transition: 'background 0.15s'
                }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
                  {item.icon === 'home' && '🏠'}
                  {item.icon === 'customer' && '👥'}
                  {item.icon === 'sales-order' && '📦'}
                  {item.icon === 'ai' && '🤖'}
                  {item.icon === 'history' && '📋'}
                </span>
                {!sideNavCollapsed && <span>{item.text}</span>}
              </div>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <main style={{ flex: 1, overflow: 'auto', background: '#f0f2f5' }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
