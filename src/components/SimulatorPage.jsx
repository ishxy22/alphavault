import React, { useState, useMemo } from 'react';
import { Zap, Sun, CloudRain, Cloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { simulateScenario, knapsackOptimize } from '../utils/knapsack';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0';

const SCENARIOS = [
  { id: 'bull', label: 'Bull Market', icon: Sun, color: 'var(--green)', desc: 'Market boom — returns up by 30%', multiplier: 1.3 },
  { id: 'neutral', label: 'Neutral', icon: Cloud, color: 'var(--blue)', desc: 'Normal market — as expected', multiplier: 1.0 },
  { id: 'bear', label: 'Bear Market', icon: CloudRain, color: 'var(--red)', desc: 'Market crash — returns down by 30%', multiplier: 0.7 },
];

export default function SimulatorPage({ stocks, budget, maxRiskScore }) {
  const [activeScenario, setActiveScenario] = useState('neutral');
  const [customBudget, setCustomBudget] = useState('');
  const [customRisk, setCustomRisk] = useState(maxRiskScore || 5);
  const [compareMode, setCompareMode] = useState(false);

  const effBudget = parseFloat(customBudget) || budget || 500000;
  const effRisk = customRisk;

  const simulatedStocks = useMemo(() => simulateScenario({ stocks, scenario: activeScenario }), [stocks, activeScenario]);

  const baseResult = useMemo(() => knapsackOptimize({ stocks, budget: effBudget, maxRiskScore: effRisk }), [stocks, effBudget, effRisk]);

  const simResult = useMemo(() => {
    const simmed = stocks.map(s => ({ ...s, expectedReturn: Math.round(s.expectedReturn * (SCENARIOS.find(x => x.id === activeScenario)?.multiplier || 1) * 10) / 10 }));
    return knapsackOptimize({ stocks: simmed, budget: effBudget, maxRiskScore: effRisk });
  }, [stocks, activeScenario, effBudget, effRisk]);

  const scenarioInfo = SCENARIOS.find(s => s.id === activeScenario);

  const comparisonData = compareMode
    ? SCENARIOS.map(sc => {
      const simmed = stocks.map(s => ({ ...s, expectedReturn: Math.round(s.expectedReturn * sc.multiplier * 10) / 10 }));
      const r = knapsackOptimize({ stocks: simmed, budget: effBudget, maxRiskScore: effRisk });
      return { scenario: sc.label, profit: Math.round(r.totalProfit), invested: Math.round(r.totalInvested) };
    })
    : [];

  if (!stocks?.length || !budget) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text3)' }}>
        <Zap size={48} color="var(--border2)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text2)', marginBottom: 8 }}>Calculate first</h2>
        <p style={{ fontSize: 14 }}>Create a portfolio with the calculator first, then test scenarios.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>What-If Simulator</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Test your portfolio in different market conditions</p>
      </div>

      {/* Scenario Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
        {SCENARIOS.map(sc => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              style={{
                background: activeScenario === sc.id ? `${sc.color}15` : 'var(--bg2)',
                border: `1px solid ${activeScenario === sc.id ? sc.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={24} color={activeScenario === sc.id ? sc.color : 'var(--text3)'} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: activeScenario === sc.id ? sc.color : 'var(--text)', marginBottom: 4 }}>
                {sc.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{sc.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Custom Params */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Custom Parameters (Optional)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="label">Budget Override (₹)</label>
            <input type="number" value={customBudget} onChange={e => setCustomBudget(e.target.value)} placeholder={`Default: ₹${fmt(budget)}`} />
          </div>
          <div>
            <label className="label">Risk Override: {customRisk}/10</label>
            <input type="range" min="1" max="10" value={customRisk} onChange={e => setCustomRisk(Number(e.target.value))} style={{ accentColor: scenarioInfo?.color }} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>BASE SCENARIO (Neutral)</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Expected Profit</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>₹{fmt(baseResult.totalProfit)}</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Return</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{baseResult.totalReturn?.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Stocks</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{baseResult.selectedStocks.length}</div>
            </div>
          </div>
        </div>

        <div style={{ background: `${scenarioInfo?.color}10`, border: `1px solid ${scenarioInfo?.color}40`, borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ fontSize: 11, color: scenarioInfo?.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            {scenarioInfo?.label.toUpperCase()} SCENARIO
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Expected Profit</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: scenarioInfo?.color }}>₹{fmt(simResult.totalProfit)}</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Return</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: scenarioInfo?.color }}>{simResult.totalReturn?.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Difference</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: simResult.totalProfit >= baseResult.totalProfit ? 'var(--green)' : 'var(--red)' }}>
                {simResult.totalProfit >= baseResult.totalProfit ? '+' : ''}₹{fmt(Math.abs(simResult.totalProfit - baseResult.totalProfit))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compare All Scenarios */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500 }}>All Scenarios Compare</h3>
          <button className={compareMode ? 'btn-primary' : 'btn-ghost'} onClick={() => setCompareMode(!compareMode)} style={{ fontSize: 12, padding: '6px 14px' }}>
            {compareMode ? 'Hide Chart' : 'Show Comparison Chart'}
          </button>
        </div>

        {compareMode && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="scenario" tick={{ fill: 'var(--text2)', fontSize: 12 }} />
              <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fill: 'var(--text3)', fontSize: 10 }} />
              <Tooltip formatter={(v, n) => [`₹${fmt(v)}`, n]} contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="profit" name="Est. Profit" fill="var(--green)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="invested" name="Invested" fill="var(--bg4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {!compareMode && (
          <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            Click "Show Comparison Chart" to see Bull vs Bear vs Neutral all at once.
          </div>
        )}
      </div>
    </div>
  );
}
