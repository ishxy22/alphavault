import React, { useState } from 'react';
import { RefreshCw, TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react';
import { rebalancePortfolio } from '../utils/knapsack';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0';

export default function RebalancerPage({ currentPortfolio, stocks, budget, maxRiskScore, onRebalanceApply }) {
  const [modifiedPrices, setModifiedPrices] = useState({});
  const [rebalResult, setRebalResult] = useState(null);
  const [applied, setApplied] = useState(false);

  if (!currentPortfolio?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text3)' }}>
        <RefreshCw size={48} color="var(--border2)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text2)', marginBottom: 8 }}>No portfolio found</h2>
        <p style={{ fontSize: 14 }}>First, create a portfolio using the calculator..</p>
      </div>
    );
  }

  const handlePriceChange = (id, val) => {
    setModifiedPrices({ ...modifiedPrices, [id]: parseFloat(val) || 0 });
    setRebalResult(null);
    setApplied(false);
  };

  const handleRebalance = () => {
    const updatedStocks = stocks.map(s => ({
      ...s,
      price: modifiedPrices[s.id] !== undefined ? modifiedPrices[s.id] : s.price,
    }));
    const result = rebalancePortfolio({ currentPortfolio, updatedStocks, budget, maxRiskScore });
    setRebalResult(result);
  };

  const handleApply = () => {
    if (rebalResult) {
      onRebalanceApply(rebalResult.newPortfolio);
      setApplied(true);
    }
  };

  const anyChanged = Object.keys(modifiedPrices).length > 0;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>Portfolio Rebalancer</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>
          Update stock prices — the algorithm will tell you what to buy and what to sell.
        </p>
      </div>

      {/* Current portfolio with price edit */}
      <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 500 }}>Current Portfolio — Update Prices</h3>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Update the price for the stock that has changed.</p>
        </div>
        <div className="scrollable-x">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Original Price</th>
                <th style={{ textAlign: 'right', minWidth: 160 }}>New Price (edit)</th>
                <th style={{ textAlign: 'right' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {currentPortfolio.map(stock => {
                const newPrice = modifiedPrices[stock.id];
                const changed = newPrice !== undefined && newPrice !== stock.price;
                const changePct = changed ? ((newPrice - stock.price) / stock.price) * 100 : 0;
                return (
                  <tr key={stock.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{stock.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{stock.ticker}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>₹{fmt(stock.price)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        defaultValue={stock.price}
                        onChange={e => handlePriceChange(stock.id, e.target.value)}
                        style={{
                          width: 130, textAlign: 'right',
                          border: changed ? '1px solid var(--gold)' : '1px solid var(--border)',
                          boxShadow: changed ? '0 0 0 3px var(--gold-dim)' : 'none',
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {changed ? (
                        <span style={{ color: changePct > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          {changePct > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {changePct > 0 ? '+' : ''}{changePct.toFixed(1)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text3)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          <Minus size={12} /> No change
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleRebalance}
        disabled={!anyChanged}
        style={{ opacity: anyChanged ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}
      >
        <RefreshCw size={16} /> Calculate Rebalance
      </button>

      {/* Results */}
      {rebalResult && (
        <div className="fade-up">
          {/* Actions summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,77,106,0.2)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>SELL</div>
              {rebalResult.sell.length === 0
                ? <div style={{ fontSize: 14, color: 'var(--text3)' }}>Nothing to sell</div>
                : rebalResult.sell.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <TrendingDown size={14} color="var(--red)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{s.ticker}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.reason}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>HOLD</div>
              {rebalResult.hold.length === 0
                ? <div style={{ fontSize: 14, color: 'var(--text3)' }}>Nothing to hold</div>
                : rebalResult.hold.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Minus size={14} color="var(--text3)" />
                    <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>{s.ticker}</span>
                  </div>
                ))}
            </div>

            <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>BUY</div>
              {rebalResult.buy.length === 0
                ? <div style={{ fontSize: 14, color: 'var(--text3)' }}>Nothing new to buy</div>
                : rebalResult.buy.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <TrendingUp size={14} color="var(--green)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{s.ticker}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.reason}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* New vs Old Profit */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Portfolio Change Summary</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>OLD PROFIT</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text2)' }}>
                  ₹{fmt(currentPortfolio.reduce((s, x) => s + x.price * x.expectedReturn / 100, 0))}
                </div>
              </div>
              <ArrowRight size={24} color="var(--text3)" />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 4 }}>NEW PROFIT</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--green)' }}>
                  ₹{fmt(rebalResult.newPortfolio.totalProfit)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handleApply} disabled={applied} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: applied ? 0.5 : 1 }}>
              {applied ? '✓ Applied!' : 'Apply New Portfolio →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
