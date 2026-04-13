import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, Upload, Search } from 'lucide-react';
import { SECTORS, MARKET_CAPS, RISK_LABELS } from '../data/stocks';

export default function StockManager({ stocks, setStocks }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('All');
  const [form, setForm] = useState({ name: '', ticker: '', price: '', expectedReturn: '', riskScore: 5, sector: 'Technology', marketCap: 'Large' });

  const resetForm = () => setForm({ name: '', ticker: '', price: '', expectedReturn: '', riskScore: 5, sector: 'Technology', marketCap: 'Large' });

  const handleAdd = () => {
    if (!form.name || !form.ticker || !form.price || !form.expectedReturn) return;
    if (editingId !== null) {
      setStocks(stocks.map(s => s.id === editingId ? { ...s, ...form, price: parseFloat(form.price), expectedReturn: parseFloat(form.expectedReturn), riskScore: parseInt(form.riskScore) } : s));
      setEditingId(null);
    } else {
      setStocks([...stocks, { ...form, id: Date.now(), price: parseFloat(form.price), expectedReturn: parseFloat(form.expectedReturn), riskScore: parseInt(form.riskScore) }]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (stock) => {
    setForm({ ...stock, price: String(stock.price), expectedReturn: String(stock.expectedReturn) });
    setEditingId(stock.id);
    setShowForm(true);
  };

  const handleDelete = (id) => setStocks(stocks.filter(s => s.id !== id));

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').slice(1);
      const newStocks = lines.filter(l => l.trim()).map((line, i) => {
        const [name, ticker, price, expectedReturn, riskScore, sector, marketCap] = line.split(',');
        return { id: Date.now() + i, name: name?.trim(), ticker: ticker?.trim(), price: parseFloat(price), expectedReturn: parseFloat(expectedReturn), riskScore: parseInt(riskScore) || 5, sector: sector?.trim() || 'Other', marketCap: marketCap?.trim() || 'Mid' };
      }).filter(s => s.name && s.ticker && !isNaN(s.price));
      setStocks([...stocks, ...newStocks]);
    };
    reader.readAsText(file);
  };

  const riskColor = (r) => {
    if (r <= 2) return 'var(--blue)';
    if (r <= 4) return 'var(--green)';
    if (r <= 6) return 'var(--gold)';
    if (r <= 8) return '#f97316';
    return 'var(--red)';
  };

  const filtered = stocks
    .filter(s => filterSector === 'All' || s.sector === filterSector)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.ticker.toLowerCase().includes(search.toLowerCase()));

  const sectors = ['All', ...new Set(stocks.map(s => s.sector))];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>Stock Manager</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>{stocks.length} In the stocks database — modify, add, or delete.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <label className="btn-ghost" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text2)' }}>
            <Upload size={14} /> CSV Import
            <input type="file" accept=".csv" onChange={handleCSV} style={{ display: 'none' }} />
          </label>
          <button className="btn-primary" onClick={() => { resetForm(); setEditingId(null); setShowForm(!showForm); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15} /> Add Stock
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card-glow fade-up" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>{editingId ? 'Edit Stock' : 'Add New Stock'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div>
              <label className="label">Company Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Infosys" />
            </div>
            <div>
              <label className="label">Ticker Symbol</label>
              <input value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} placeholder="e.g. INFY" />
            </div>
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 1620" />
            </div>
            <div>
              <label className="label">Expected Return (%)</label>
              <input type="number" value={form.expectedReturn} onChange={e => setForm({ ...form, expectedReturn: e.target.value })} placeholder="e.g. 18.5" />
            </div>
            <div>
              <label className="label">Risk Score: {form.riskScore} — {RISK_LABELS[form.riskScore]}</label>
              <input type="range" min="1" max="10" value={form.riskScore} onChange={e => setForm({ ...form, riskScore: Number(e.target.value) })} style={{ accentColor: riskColor(form.riskScore) }} />
            </div>
            <div>
              <label className="label">Sector</label>
              <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Market Cap</label>
              <select value={form.marketCap} onChange={e => setForm({ ...form, marketCap: e.target.value })}>
                {MARKET_CAPS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={15} /> {editingId ? 'Update' : 'Add Stock'}
            </button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stocks..." style={{ paddingLeft: 34 }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {sectors.map(s => (
            <button key={s} onClick={() => setFilterSector(s)} className={filterSector === s ? 'btn-primary' : 'btn-ghost'}
              style={{ fontSize: 12, padding: '6px 12px' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* CSV hint */}
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
        CSV format: name, ticker, price, expectedReturn, riskScore, sector, marketCap
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="scrollable-x">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Sector</th>
                <th style={{ textAlign: 'right' }}>Price (₹)</th>
                <th style={{ textAlign: 'right' }}>Exp. Return</th>
                <th>Risk</th>
                <th>Cap</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(stock => (
                <tr key={stock.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{stock.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{stock.ticker}</div>
                  </td>
                  <td>
                    <span className="tag tag-gray">{stock.sector}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                    {stock.price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 500 }}>{stock.expectedReturn}%</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: riskColor(stock.riskScore) }} />
                      <span style={{ fontSize: 12, color: riskColor(stock.riskScore) }}>{stock.riskScore}/10</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag tag-gray">{stock.marketCap}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(stock)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', color: 'var(--text2)', cursor: 'pointer' }}>
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDelete(stock.id)} style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,77,106,0.2)', borderRadius: 6, padding: '5px 8px', color: 'var(--red)', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No stocks found</div>
          )}
        </div>
      </div>
    </div>
  );
}
