import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CalculatorPage from './components/CalculatorPage';
import StockManager from './components/StockManager';
import PortfolioPage from './components/PortfolioPage';
import RebalancerPage from './components/RebalancerPage';
import SimulatorPage from './components/SimulatorPage';
import HistoryPage from './components/HistoryPage';
import { knapsackOptimize } from './utils/knapsack';
import { DEFAULT_STOCKS } from './data/stocks';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [stocks, setStocks] = useLocalStorage('alphavault-stocks', DEFAULT_STOCKS);
  const [portfolio, setPortfolio] = useLocalStorage('alphavault-portfolio', null);
  const [history, setHistory] = useLocalStorage('alphavault-history', []);
  const [lastParams, setLastParams] = useLocalStorage('alphavault-params', { budget: 0, maxRiskScore: 5 });
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = useCallback(async ({ budget, maxRiskScore, sectorLimit }) => {
    setCalculating(true);
    await new Promise(r => setTimeout(r, 400)); // Visual feedback delay
    const result = knapsackOptimize({ stocks, budget, maxRiskScore, sectorLimit });
    setPortfolio(result);
    setLastParams({ budget, maxRiskScore, sectorLimit });
    setHistory(prev => [...prev, { budget, maxRiskScore, result, timestamp: Date.now() }]);
    setCalculating(false);
    setActiveTab('portfolio');
  }, [stocks, setPortfolio, setLastParams, setHistory]);

  const handleRebalanceApply = useCallback((newResult) => {
    setPortfolio(newResult);
    setHistory(prev => [...prev, { ...lastParams, result: newResult, timestamp: Date.now(), isRebalance: true }]);
    setActiveTab('portfolio');
  }, [setPortfolio, lastParams, setHistory]);

  const handleRestorePortfolio = useCallback((item) => {
    setPortfolio(item.result);
    setLastParams({ budget: item.budget, maxRiskScore: item.maxRiskScore });
    setActiveTab('portfolio');
  }, [setPortfolio, setLastParams]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Calculating overlay */}
      {calculating && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--bg4)', borderTop: '3px solid var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text)' }}>Calculating optimal portfolio...</div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>Knapsack algorithm running on {stocks.length} stocks</div>
        </div>
      )}

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        {activeTab === 'calculator' && (
          <CalculatorPage onCalculate={handleCalculate} lastResult={portfolio} />
        )}
        {activeTab === 'stocks' && (
          <StockManager stocks={stocks} setStocks={setStocks} />
        )}
        {activeTab === 'portfolio' && (
          <PortfolioPage result={portfolio} budget={lastParams.budget} />
        )}
        {activeTab === 'rebalance' && (
          <RebalancerPage
            currentPortfolio={portfolio?.selectedStocks || []}
            stocks={stocks}
            budget={lastParams.budget}
            maxRiskScore={lastParams.maxRiskScore}
            onRebalanceApply={handleRebalanceApply}
          />
        )}
        {activeTab === 'simulator' && (
          <SimulatorPage
            stocks={stocks}
            budget={lastParams.budget}
            maxRiskScore={lastParams.maxRiskScore}
          />
        )}
        {activeTab === 'history' && (
          <HistoryPage
            history={history}
            setHistory={setHistory}
            onRestorePortfolio={handleRestorePortfolio}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', marginTop: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            AlphaVault — Smart Investment Calculator · Powered by 0/1 Knapsack Algorithm
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            ⚠ For educational purposes only. Not financial advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
