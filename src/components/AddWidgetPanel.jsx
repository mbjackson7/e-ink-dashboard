// src/components/AddWidgetPanel.jsx
// Slide-in panel for adding widgets in edit mode.
// Shows all catalog entries; clicking one adds it immediately (still needs save).

import { useState } from 'react'
import { WIDGET_CATALOG } from '../lib/widgetCatalog'

export default function AddWidgetPanel({ onAdd, onClose }) {
  const [customTitle, setCustomTitle] = useState('')
  const [selected, setSelected] = useState(null)

  function handleAdd() {
    if (!selected) return
    onAdd(selected, customTitle.trim() || null)
    setCustomTitle('')
    setSelected(null)
    onClose()
  }

  return (
    <div className="awp-backdrop" onClick={onClose}>
      <div className="awp-panel" onClick={(e) => e.stopPropagation()}>
        <div className="awp-header">
          <span className="awp-title">add widget</span>
          <button className="awp-close" onClick={onClose}>✕</button>
        </div>

        <div className="awp-list">
          {WIDGET_CATALOG.map((entry) => (
            <button
              key={entry.type}
              className={`awp-item ${selected?.type === entry.type ? 'awp-item--selected' : ''}`}
              onClick={() => setSelected(entry)}
            >
              <span className="awp-item-label">{entry.label}</span>
              <span className="awp-item-source">{entry.dataSource}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="awp-footer">
            <input
              className="awp-title-input"
              type="text"
              placeholder={`Title (default: ${selected.label})`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <button className="awp-add-btn" onClick={handleAdd}>
              add {selected.label.toLowerCase()} ↓
            </button>
          </div>
        )}
      </div>
    </div>
  )
}