// ============================================================
// SMART INVESTMENT CALCULATOR — KNAPSACK ALGORITHM ENGINE
// ============================================================

/**
 * 0/1 Knapsack DP Algorithm
 * Finds the optimal combination of stocks that:
 * 1. Fits within budget (weight = price)
 * 2. Maximizes expected profit (value = price * expectedReturn%)
 * 3. Stays within risk capacity
 */
export function knapsackOptimize({ stocks, budget, maxRiskScore, sectorLimit = 0.4 }) {
  // Filter stocks by risk tolerance
  const eligible = stocks.filter(s => s.riskScore <= maxRiskScore);

  if (eligible.length === 0 || budget <= 0) {
    return { selectedStocks: [], totalInvested: 0, totalProfit: 0, efficiency: 0 };
  }

  const n = eligible.length;
  // Scale budget to integer (in hundreds for performance)
  const scale = 100;
  const W = Math.floor(budget / scale);

  // DP table: dp[i][w] = max profit using first i stocks with budget w*scale
  // Use 1D rolling array for memory efficiency
  const dp = new Array(W + 1).fill(0);
  const chosen = Array.from({ length: n }, () => new Array(W + 1).fill(false));

  for (let i = 0; i < n; i++) {
    const stock = eligible[i];
    const weight = Math.floor(stock.price / scale);
    const value = Math.round((stock.price * stock.expectedReturn) / 100);

    if (weight === 0) continue;

    for (let w = W; w >= weight; w--) {
      const withStock = dp[w - weight] + value;
      if (withStock > dp[w]) {
        dp[w] = withStock;
        chosen[i][w] = true;
      }
    }
  }

  // Backtrack to find selected stocks
  let w = W;
  const selectedIndices = [];
  for (let i = n - 1; i >= 0; i--) {
    if (chosen[i][w]) {
      selectedIndices.push(i);
      w -= Math.floor(eligible[i].price / scale);
    }
  }

  let selected = selectedIndices.map(i => ({ ...eligible[i], quantity: 1 }));

  // Enforce sector diversification limit
  selected = enforceSectorLimit(selected, budget, sectorLimit);

  const totalInvested = selected.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const totalProfit = selected.reduce((sum, s) => sum + (s.price * s.expectedReturn / 100) * s.quantity, 0);
  const efficiency = budget > 0 ? (totalInvested / budget) * 100 : 0;

  return {
    selectedStocks: selected,
    totalInvested,
    totalProfit,
    totalReturn: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
    efficiency,
    budgetRemaining: budget - totalInvested,
    riskProfile: computePortfolioRisk(selected),
    sectorBreakdown: getSectorBreakdown(selected),
    diversificationScore: computeDiversificationScore(selected),
    alerts: generateAlerts(selected, budget),
  };
}

function enforceSectorLimit(stocks, budget, limitPct) {
  if (stocks.length === 0) return stocks;
  const sectorTotals = {};
  stocks.forEach(s => {
    sectorTotals[s.sector] = (sectorTotals[s.sector] || 0) + s.price * s.quantity;
  });
  return stocks.filter(s => {
    const pct = (s.price * s.quantity) / budget;
    return pct <= limitPct || Object.keys(sectorTotals).length <= 1;
  });
}

function computePortfolioRisk(stocks) {
  if (stocks.length === 0) return 0;
  const totalVal = stocks.reduce((sum, s) => sum + s.price * s.quantity, 0);
  if (totalVal === 0) return 0;
  const weightedRisk = stocks.reduce((sum, s) => sum + s.riskScore * (s.price * s.quantity / totalVal), 0);
  return Math.round(weightedRisk * 10) / 10;
}

function getSectorBreakdown(stocks) {
  const totalVal = stocks.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const sectors = {};
  stocks.forEach(s => {
    const val = s.price * s.quantity;
    sectors[s.sector] = (sectors[s.sector] || 0) + val;
  });
  return Object.entries(sectors).map(([name, value]) => ({
    name,
    value: Math.round(value),
    pct: totalVal > 0 ? Math.round((value / totalVal) * 100) : 0,
  }));
}

export function computeDiversificationScore(stocks) {
  if (stocks.length === 0) return 0;
  const totalVal = stocks.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const sectors = new Set(stocks.map(s => s.sector)).size;
  const maxSectorPct = Math.max(...Object.values(
    stocks.reduce((acc, s) => {
      acc[s.sector] = (acc[s.sector] || 0) + s.price * s.quantity;
      return acc;
    }, {})
  ).map(v => v / totalVal));

  let score = 50;
  score += Math.min(sectors * 8, 30);
  score -= Math.max(0, (maxSectorPct - 0.4) * 100);
  score += Math.min(stocks.length * 3, 20);
  return Math.min(100, Math.max(0, Math.round(score)));
}

function generateAlerts(stocks, budget) {
  const alerts = [];
  const totalVal = stocks.reduce((sum, s) => sum + s.price * s.quantity, 0);

  stocks.forEach(s => {
    const pct = (s.price * s.quantity) / totalVal;
    if (pct > 0.5) alerts.push({ type: "warning", msg: `${s.ticker} is ${Math.round(pct * 100)}% of your portfolio — concentration risk!` });
  });

  const sectors = {};
  stocks.forEach(s => { sectors[s.sector] = (sectors[s.sector] || 0) + s.price * s.quantity; });
  Object.entries(sectors).forEach(([sec, val]) => {
    if (val / totalVal > 0.6) alerts.push({ type: "warning", msg: `${sec} sector has ${Math.round(val / totalVal * 100)}% allocated — diversify further!` });
  });

  if (budget - totalVal > budget * 0.3) alerts.push({ type: "info", msg: `${Math.round((budget - totalVal) / budget * 100)}% of the budget is unused — increase risk capacity or reduce budget.` });

  return alerts;
}

// ============================================================
// REBALANCING ENGINE
// ============================================================
export function rebalancePortfolio({ currentPortfolio, updatedStocks, budget, maxRiskScore }) {
  const newResult = knapsackOptimize({ stocks: updatedStocks, budget, maxRiskScore });
  const newSelected = newResult.selectedStocks;

  const currentMap = {};
  currentPortfolio.forEach(s => { currentMap[s.id] = s; });

  const newMap = {};
  newSelected.forEach(s => { newMap[s.id] = s; });

  const sell = [];
  const buy = [];
  const hold = [];

  currentPortfolio.forEach(s => {
    if (!newMap[s.id]) sell.push({ ...s, reason: "No longer optimal after price change" });
    else hold.push(s);
  });

  newSelected.forEach(s => {
    if (!currentMap[s.id]) buy.push({ ...s, reason: "New optimal pick after rebalance" });
  });

  return { sell, buy, hold, newPortfolio: newResult };
}

// ============================================================
// SCENARIO SIMULATOR
// ============================================================
export function simulateScenario({ stocks, scenario }) {
  const multipliers = { bull: 1.3, bear: 0.7, neutral: 1.0 };
  const m = multipliers[scenario] || 1;
  return stocks.map(s => ({
    ...s,
    simulatedReturn: Math.round(s.expectedReturn * m * 10) / 10,
    simulatedProfit: Math.round(s.price * s.expectedReturn * m / 100),
  }));
}

// ============================================================
// PROJECTION ENGINE
// ============================================================
export function projectGrowth({ totalInvested, annualReturn, years }) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    data.push({
      year: `Y${y}`,
      value: Math.round(totalInvested * Math.pow(1 + annualReturn / 100, y)),
    });
  }
  return data;
}

// ============================================================
// BRUTE FORCE (for small sets — compare display)
// ============================================================
export function bruteForceBestReturn(stocks, budget, maxRisk) {
  const eligible = stocks.filter(s => s.riskScore <= maxRisk && s.price <= budget);
  if (eligible.length === 0) return null;
  let best = eligible[0];
  eligible.forEach(s => { if (s.expectedReturn > best.expectedReturn) best = s; });
  return best;
}
