import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

const TABS = [
  { id: 'calculator', label: 'Calculator' },
  { id: 'stocks', label: 'Stock Manager' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'rebalance', label: 'Rebalancer' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'history', label: 'History' },
];

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, height: 60 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34,
              background: 'var(--green)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="#000" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                AlphaVault
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -2 }}>
                Smart Investing
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  color: activeTab === tab.id ? 'var(--text)' : 'var(--text2)',
                  background: activeTab === tab.id ? 'var(--bg3)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span className="ticker-dot" />
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>Live Calc</span>
          </div>
        </div>
      </div>
    </header>
  );
}
