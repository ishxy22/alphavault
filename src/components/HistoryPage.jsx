import React from 'react';
import { Clock, Trash2, TrendingUp, Eye } from 'lucide-react';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0';

export default function HistoryPage({ history, setHistory, onRestorePortfolio }) {
  if (!history?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text3)' }}>
        <Clock size={48} color="var(--border2)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text2)', marginBottom: 8 }}>No history found</h2>
        <p style={{ fontSize: 14 }}>Whenever you calculate, the history will be saved here.</p>
      </div>
    );
  }

  const handleDelete = (idx) => setHistory(history.filter((_, i) => i !== idx));
  const handleClearAll = () => setHistory([]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>Calculation History</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>{history.length} portfolios saved</p>
        </div>
        <button className="btn-danger" onClick={handleClearAll}>Clear All</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[...history].reverse().map((item, ridx) => {
          const idx = history.length - 1 - ridx;
          return (
            <div key={idx} className="card fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ background: 'var(--green-dim)', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
                    <TrendingUp size={16} color="var(--green)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {item.result.selectedStocks.length} stocks — ₹{fmt(item.result.totalInvested)} invested
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {new Date(item.timestamp).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Budget: </span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>₹{fmt(item.budget)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Risk: </span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.maxRiskScore}/10</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Profit: </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>₹{fmt(item.result.totalProfit)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Return: </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>{item.result.totalReturn?.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Diversification: </span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.result.diversificationScore}/100</span>
                  </div>
                </div>

                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {item.result.selectedStocks.map(s => (
                    <span key={s.id} className="tag tag-gray">{s.ticker}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                  onClick={() => onRestorePortfolio(item)}
                >
                  <Eye size={13} /> Restore
                </button>
                <button
                  className="btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => handleDelete(idx)}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
