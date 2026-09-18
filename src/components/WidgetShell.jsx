// src/components/WidgetShell.jsx
// Wraps every widget. The remove button lives inside the title bar so it
// doesn't affect the outer div that react-grid-layout uses for drag measurement.

import { useKiosk } from '../lib/KioskContext'

export default function WidgetShell({ title, loading, error, onRemove, children, selected }) {
  const isKiosk = useKiosk()

  console.log('WidgetShell render', { title, loading, error, selected })

  return (
    <div className={`widget-shell ${selected ? 'widget-shell--selected' : ''} ${!isKiosk ? 'widget-shell--edit' : ''}`}>
      <div className="widget-body">
        {loading ? (
          <div className="widget-state">loading</div>
        ) : error ? (
          <div className="widget-state error">{error}</div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}