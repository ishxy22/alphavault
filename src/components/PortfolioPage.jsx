import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import { TrendingUp, Target, Shield, AlertTriangle, Download, Award } from 'lucide-react';
import { projectGrowth, computeDiversificationScore } from '../utils/knapsack';

const CHART_COLORS = ['#00e676', '#60a5fa', '#a78bfa', '#f5c842', '#f97316', '#f87171', '#34d399', '#e879f9', '#38bdf8', '#fb7185'];

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0';

function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        {Icon && <Icon size={16} color={color || 'var(--text3)'} />}
      </div>
      <div style={{ fontSize: 26, fontWeight: 500, color: color || 'var(--text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 14, color: p.color || 'var(--text)', fontWeight: 500 }}>
          ₹{fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function PortfolioPage({ result, budget }) {
  const [projYears, setProjYears] = useState(5);

  if (!result || !result.selectedStocks?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text3)' }}>
        <TrendingUp size={48} color="var(--border2)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text2)', marginBottom: 8 }}>Portfolio is empty</h2>
        <p style={{ fontSize: 14 }}>Calculate using the calculator first; the results will appear here.</p>
      </div>
    );
  }

  const { selectedStocks, totalInvested, totalProfit, totalReturn, efficiency, budgetRemaining, riskProfile, sectorBreakdown, diversificationScore, alerts } = result;
  const projData = projectGrowth({ totalInvested, annualReturn: totalReturn || 15, years: projYears });

  const scatterData = selectedStocks.map(s => ({ x: s.riskScore, y: s.expectedReturn, name: s.ticker }));

  const handlePDFDownload = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('AlphaVault — Investment Report', 14, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 30);
      doc.text(`Budget: ₹${fmt(budget)} | Risk Profile: ${riskProfile}/10`, 14, 36);

      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Portfolio Summary', 14, 50);

      const summaryData = [
        ['Total Invested', `₹${fmt(totalInvested)}`],
        ['Expected Annual Profit', `₹${fmt(totalProfit)}`],
        ['Expected Return', `${totalReturn?.toFixed(1)}%`],
        ['Budget Used', `${efficiency?.toFixed(1)}%`],
        ['Budget Remaining', `₹${fmt(budgetRemaining)}`],
        ['Portfolio Risk Score', `${riskProfile}/10`],
        ['Diversification Score', `${diversificationScore}/100`],
      ];

      autoTable(doc, {
        startY: 54,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 80, 50] },
      });

      const tableData = selectedStocks.map(s => [
        s.name, s.ticker, s.sector,
        `₹${fmt(s.price)}`,
        `${s.expectedReturn}%`,
        `${s.riskScore}/10`,
        `₹${fmt(s.price * s.expectedReturn / 100)}`,
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14,
        head: [['Company', 'Ticker', 'Sector', 'Price', 'Return', 'Risk', 'Est. Profit']],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 80, 50] },
      });

      doc.save('AlphaVault-Portfolio-Report.pdf');
    } catch (e) {
      alert('PDF generation failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>Optimal Portfolio</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>
            {selectedStocks.length} Stocks selected — Knapsack algorithm result
          </p>
        </div>
        <button className="btn-ghost" onClick={handlePDFDownload} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Download size={14} /> PDF Download
        </button>
      </div>

      {/* Alerts */}
      {alerts?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              padding: '10px 14px', marginBottom: 8,
              background: a.type === 'warning' ? 'var(--gold-dim)' : 'var(--blue-dim)',
              border: `1px solid ${a.type === 'warning' ? 'rgba(245,200,66,0.25)' : 'rgba(96,165,250,0.25)'}`,
              borderRadius: 'var(--radius)', fontSize: 13,
              color: a.type === 'warning' ? 'var(--gold)' : 'var(--blue)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <AlertTriangle size={14} />
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid-4 fade-up" style={{ marginBottom: 24 }}>
        <StatCard label="Total Invested" value={`₹${fmt(totalInvested)}`} sub={`${efficiency?.toFixed(0)}% budget used`} color="var(--text)" icon={Target} />
        <StatCard label="Expected Profit" value={`₹${fmt(totalProfit)}`} sub="Annual estimated" color="var(--green)" icon={TrendingUp} />
        <StatCard label="Portfolio Return" value={`${totalReturn?.toFixed(1)}%`} sub="Weighted avg" color="var(--green)" icon={Award} />
        <StatCard label="Risk Score" value={`${riskProfile}/10`} sub="Portfolio avg" color={riskProfile <= 4 ? 'var(--green)' : riskProfile <= 7 ? 'var(--gold)' : 'var(--red)'} icon={Shield} />
      </div>

      {/* Diversification Score */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Diversification Score</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: diversificationScore >= 70 ? 'var(--green)' : diversificationScore >= 40 ? 'var(--gold)' : 'var(--red)' }}>
            {diversificationScore}/100
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${diversificationScore}%`,
            background: diversificationScore >= 70 ? 'var(--green)' : diversificationScore >= 40 ? 'var(--gold)' : 'var(--red)',
          }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>
          {diversificationScore >= 70 ? '✓ Well diversified portfolio' : diversificationScore >= 40 ? '⚠ Moderate diversification — Optimized' : '✗ Poorly diversified — More sectors needed'}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Sector Pie */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Sector Allocation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sectorBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                dataKey="value" nameKey="name" paddingAngle={2}>
                {sectorBreakdown?.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₹${fmt(v)}`, '']} contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {sectorBreakdown?.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                {s.name} {s.pct}%
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Return Scatter */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Risk vs Return</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" name="Risk" label={{ value: 'Risk Score', position: 'insideBottom', offset: -5, fill: 'var(--text3)', fontSize: 11 }} tick={{ fill: 'var(--text3)', fontSize: 11 }} domain={[0, 10]} />
              <YAxis dataKey="y" name="Return" label={{ value: 'Return %', angle: -90, position: 'insideLeft', fill: 'var(--text3)', fontSize: 11 }} tick={{ fill: 'var(--text3)', fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                  <div style={{ fontWeight: 500 }}>{d?.name}</div>
                  <div style={{ color: 'var(--text2)' }}>Risk: {d?.x} | Return: {d?.y}%</div>
                </div>;
              }} />
              <Scatter data={scatterData} fill="var(--green)" opacity={0.85} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Bar Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Investment vs Expected Profit per Stock</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={selectedStocks.map(s => ({ name: s.ticker, invested: s.price, profit: Math.round(s.price * s.expectedReturn / 100) }))} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="invested" fill="var(--bg4)" name="Invested" radius={[3, 3, 0, 0]} />
            <Bar dataKey="profit" fill="var(--green)" name="Est. Profit" radius={[3, 3, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Projection */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500 }}>Growth Projection</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 3, 5, 10].map(y => (
              <button key={y} onClick={() => setProjYears(y)}
                className={projYears === y ? 'btn-primary' : 'btn-ghost'}
                style={{ fontSize: 12, padding: '5px 12px' }}>
                {y}Y
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={projData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" tick={{ fill: 'var(--text3)', fontSize: 11 }} />
            <YAxis tickFormatter={v => `₹${v >= 100000 ? (v / 100000).toFixed(1) + 'L' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`} tick={{ fill: 'var(--text3)', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="var(--green)" strokeWidth={2} dot={{ fill: 'var(--green)', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>
          In {projYears} years: ₹{fmt(projData[projData.length - 1]?.value)} (at {totalReturn?.toFixed(1)}% annual return)
        </div>
      </div>

      {/* Stock Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Selected Stocks</h3>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>The algorithm chose this optimal combination.</p>
        </div>
        <div className="scrollable-x">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Sector</th>
                <th style={{ textAlign: 'right' }}>Price (₹)</th>
                <th style={{ textAlign: 'right' }}>Return %</th>
                <th style={{ textAlign: 'right' }}>Est. Profit (₹)</th>
                <th>Risk</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {selectedStocks.map(stock => {
                const weight = (stock.price / totalInvested) * 100;
                return (
                  <tr key={stock.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{stock.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{stock.ticker}</div>
                    </td>
                    <td><span className="tag tag-gray">{stock.sector}</span></td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(stock.price)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 500 }}>{stock.expectedReturn}%</td>
                    <td style={{ textAlign: 'right', color: 'var(--green)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(Math.round(stock.price * stock.expectedReturn / 100))}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: stock.riskScore <= 3 ? 'var(--blue)' : stock.riskScore <= 6 ? 'var(--gold)' : 'var(--red)' }} />
                        <span style={{ fontSize: 12 }}>{stock.riskScore}/10</span>
                      </div>
                    </td>
                    <td style={{ minWidth: 100 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ flex: 1, height: 3 }}>
                          <div className="progress-fill" style={{ width: `${weight}%` }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 32 }}>{weight.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>Total: {selectedStocks.length} stocks</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>Invested: <strong style={{ color: 'var(--text)' }}>₹{fmt(totalInvested)}</strong></span>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>Profit: <strong style={{ color: 'var(--green)' }}>₹{fmt(totalProfit)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
