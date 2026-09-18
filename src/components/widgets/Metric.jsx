// src/components/widgets/Metric.jsx
// Generic multi-field metric card, good for HA sensor data.
// { fields: { temperature: { value: 72, unit: '°F' }, humidity: { value: 45, unit: '%' } } }
// config.fields controls which fields to display and in what order.

import WidgetShell from '../WidgetShell'

export default function Metric({ data, loading, error, config, title, selected }) {
  const fields = config?.fields ?? []
  const fieldData = data?.fields ?? {}

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      <div className="metric-grid">
        {fields.map((key) => {
          const f = fieldData[key]
          return (
            <div key={key} className="metric-item">
              <div className="metric-label">{key.replace(/_/g, ' ')}</div>
              <div className="metric-value">
                {f ? `${f.value}${f.unit}` : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </WidgetShell>
  )
}