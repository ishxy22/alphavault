import React, { useState } from 'react';
import { Calculator, Sliders, ChevronRight, Info } from 'lucide-react';
import RiskQuiz from './RiskQuiz';
import { RISK_LABELS } from '../data/stocks';

export default function CalculatorPage({ onCalculate, lastResult }) {
  const [budget, setBudget] = useState('');
  const [riskCapacity, setRiskCapacity] = useState(5);
  const [sectorLimit, setSectorLimit] = useState(40);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const handleQuizComplete = (score) => {
    setRiskCapacity(score);
    setQuizDone(true);
    setShowQuiz(false);
  };

  const handleCalculate = () => {
    const b = parseFloat(budget);
    if (!b || b <= 0) return;
    onCalculate({ budget: b, maxRiskScore: riskCapacity, sectorLimit: sectorLimit / 100 });
  };

  const formatBudget = (val) => {
    const n = parseFloat(val);
    if (!n) return '';
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
  };

  const riskColors = [null, '#60a5fa', '#60a5fa', '#34d399', '#34d399', '#fbbf24', '#fbbf24', '#f97316', '#f97316', '#f87171', '#ef4444'];

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div className="fade-up" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Calculator size={20} color="var(--green)" />
          <span style={{ fontSize: 12, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
            Knapsack Optimizer
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1.15, marginBottom: 12 }}>
          Maximum returns,<br />
          <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>minimum emotion.</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 520 }}>
          Enter your budget and risk tolerance — the algorithm will check thousands of combinations to give you the perfect portfolio.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Budget Input */}
        <div className="card fade-up-1" style={{ gridColumn: '1 / -1' }}>
          <label className="label">Investment Budget</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 18, color: 'var(--green)', fontWeight: 500,
            }}>₹</span>
            <input
              type="number"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              placeholder="e.g. 500000"
              style={{ paddingLeft: 32, fontSize: 22, height: 56, fontVariantNumeric: 'tabular-nums' }}
            />
            {budget && (
              <span style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 13, color: 'var(--green)', fontWeight: 500,
              }}>
                {formatBudget(budget)}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {[50000, 100000, 500000, 1000000, 5000000].map(amt => (
              <button key={amt} className="btn-ghost"
                style={{ fontSize: 12, padding: '5px 12px' }}
                onClick={() => setBudget(String(amt))}>
                {formatBudget(String(amt))}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Capacity */}
        <div className="card fade-up-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <label className="label">Risk Capacity</label>
            {!quizDone && (
              <button
                className="btn-ghost"
                style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => setShowQuiz(!showQuiz)}
              >
                Take Quiz
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: riskColors[riskCapacity] || 'var(--text)' }}>
              {riskCapacity}
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: riskColors[riskCapacity] || 'var(--text)' }}>
                {RISK_LABELS[riskCapacity]}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>out of 10</div>
            </div>
          </div>

          <input
            type="range" min="1" max="10" step="1"
            value={riskCapacity}
            onChange={e => { setRiskCapacity(Number(e.target.value)); setQuizDone(false); }}
            style={{ width: '100%', accentColor: riskColors[riskCapacity] || 'var(--green)', marginBottom: 8 }}
          />

          <div className="risk-meter">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="risk-block" style={{
                background: i < riskCapacity ? (riskColors[i + 1] || 'var(--green)') : 'var(--bg4)',
              }} />
            ))}
          </div>

          {quizDone && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--green)' }}>
              ✓ Set via Quiz — Score {riskCapacity}/10
            </div>
          )}
        </div>

        {/* Sector Limit */}
        <div className="card fade-up-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <label className="label" style={{ margin: 0 }}>Sector Concentration Limit</label>
            <Info size={13} color="var(--text3)" className="tooltip" data-tip="Maximum % a single sector can take" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--purple)' }}>
              {sectorLimit}
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--purple)' }}>%</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>per sector max</div>
            </div>
          </div>

          <input
            type="range" min="20" max="100" step="5"
            value={sectorLimit}
            onChange={e => setSectorLimit(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--purple)' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
            <span>20% (Strict)</span>
            <span>100% (No limit)</span>
          </div>
        </div>
      </div>

      {/* Risk Quiz */}
      {showQuiz && (
        <div style={{ marginBottom: 20 }}>
          <RiskQuiz onComplete={handleQuizComplete} />
        </div>
      )}

      {/* Calculate Button */}
      <div className="fade-up-4" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          className="btn-primary"
          onClick={handleCalculate}
          disabled={!budget || parseFloat(budget) <= 0}
          style={{
            flex: 1, height: 52, fontSize: 16,
            opacity: (!budget || parseFloat(budget) <= 0) ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Sliders size={18} />
          Calculate Optimal Portfolio
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Last result hint */}
      {lastResult && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--green-dim)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,230,118,0.2)' }}>
          <span style={{ fontSize: 13, color: 'var(--green)' }}>
            ✓ Last result: {lastResult.selectedStocks.length} stocks, ₹{lastResult.totalProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })} expected profit — View on Portfolio tab
          </span>
        </div>
      )}
    </div>
  );
}
