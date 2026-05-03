import React from 'react'
import { BOOK_CONDITIONS, CONDITION_LABELS } from '../../utils/constants'
import { SlidersHorizontal, Trash2 } from 'lucide-react'

export default function FilterPanel({ filters, setFilters }) {
  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      condition: null,
      sort: 'id,desc',
      minPrice: '',
      maxPrice: ''
    })
  }

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 24, padding: 24, position: 'sticky', top: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <SlidersHorizontal size={20} color="var(--accent)" /> Filters
        </h3>
        <button onClick={clearFilters} className="btn-ghost" style={{ padding: 8, borderRadius: 8 }} title="Clear All">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Location */}
      <div className="filter-group" style={{ marginBottom: 28 }}>
        <div className="filter-title">LOCATION</div>
        <input
          className="input"
          placeholder="City or area"
          value={filters.location}
          onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
        />
      </div>

      {/* Condition */}
      <div className="filter-group" style={{ marginBottom: 28 }}>
        <div className="filter-title">CONDITION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>

          {/* "All" option */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, condition: null }))}
            style={{
              padding: '10px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600,
              border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
              borderColor: filters.condition === null ? 'var(--accent)' : 'var(--border)',
              background: filters.condition === null ? 'rgba(0,229,255,0.1)' : 'var(--panel-strong)',
              color: filters.condition === null ? 'var(--accent)' : 'var(--text)'
            }}
          >
            All
          </button>

          {BOOK_CONDITIONS.map(item => (
            <button
              key={item}
              onClick={() => setFilters(prev => ({ ...prev, condition: item }))}
              style={{
                padding: '10px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600,
                border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                borderColor: filters.condition === item ? 'var(--accent)' : 'var(--border)',
                background: filters.condition === item ? 'rgba(0,229,255,0.1)' : 'var(--panel-strong)',
                color: filters.condition === item ? 'var(--accent)' : 'var(--text)'
              }}
            >
              {CONDITION_LABELS[item] || item}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group" style={{ marginBottom: 28 }}>
        <div className="filter-title">PRICE RANGE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.85rem' }}>₹</span>
            <input
              className="input"
              type="number"
              style={{ paddingLeft: 28, height: 44, borderRadius: 12 }}
              placeholder="Min"
              value={filters.minPrice}
              onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            />
          </div>
          <div style={{ width: 12, height: 1, background: 'var(--border)' }} />
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.85rem' }}>₹</span>
            <input
              className="input"
              type="number"
              style={{ paddingLeft: 28, height: 44, borderRadius: 12 }}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <button
        className="btn"
        style={{ width: '100%', padding: 14, borderRadius: 12, fontWeight: 700 }}
        onClick={() => setFilters(prev => ({ ...prev }))}
      >
        Apply Filters
      </button>
    </div>
  )
}
