# AlphaVault — Smart Investment Calculator

A professional React-based investment portfolio optimizer powered by the **0/1 Knapsack Algorithm**.

## Features

- **Knapsack Optimizer** — Budget + Risk dual constraints, sector diversification limits
- **Risk Quiz** — 5-question quiz to auto-determine your risk profile
- **Stock Manager** — Add/edit/delete stocks, CSV import
- **Portfolio Dashboard** — Pie chart, Bar chart, Risk-Return scatter, Growth projection
- **Rebalancer** — Update stock prices, get Buy/Sell/Hold recommendations
- **What-If Simulator** — Bull, Bear, Neutral market scenario analysis
- **History Tracker** — All calculations saved, restore any past portfolio
- **PDF Export** — Download full portfolio report

## Tech Stack

- **React 18** + **Vite**
- **Recharts** — Charts (Pie, Bar, Line, Scatter)
- **Lucide React** — Icons
- **jsPDF + AutoTable** — PDF generation
- **LocalStorage** — No backend needed, all data persists locally

## Setup & Run

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

## How to Use

1. **Calculator Tab** → Budget enter karo, risk slider set karo (ya quiz lo), Calculate dabao
2. **Portfolio Tab** → Results, charts, PDF download
3. **Stock Manager** → Apne stocks add/edit karo, CSV import karo
4. **Rebalancer** → Prices update karo, rebalancing recommendations dekho
5. **Simulator** → Bull/Bear/Neutral scenarios test karo
6. **History** → Past portfolios dekho aur restore karo

## CSV Import Format

```
name,ticker,price,expectedReturn,riskScore,sector,marketCap
Infosys,INFY,1620,18.2,3,Technology,Large
```

## Algorithm

Uses **0/1 Knapsack Dynamic Programming** (O(n·W) time complexity):
- Weight = Stock price
- Value = Expected annual profit (price × return%)
- Capacity = Budget
- Additional constraints: Risk score filter, sector concentration limit
