// src/components/widgets/Agenda.jsx
// { events: [{ id, title, start, end, allDay, calendar }] }

import WidgetShell from '../WidgetShell'

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatDate(iso) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function Agenda({ data, loading, error, config, title, selected }) {
  const events = data?.events?.slice(0, config?.maxItems ?? 8) ?? []

  // Group by date label
  const grouped = events.reduce((acc, e) => {
    const label = formatDate(e.start)
    if (!acc[label]) acc[label] = []
    acc[label].push(e)
    return acc
  }, {})

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      <div className="agenda">
        {Object.entries(grouped).map(([label, evts]) => (
          <div key={label} className="agenda-group">
            <div className="agenda-date">{label}</div>
            {evts.map((e) => (
              <div key={e.id} className="agenda-event">
                <span className="agenda-time">
                  {e.allDay ? 'All day' : formatTime(e.start)}
                </span>
                <span className="agenda-title">{e.title}</span>
              </div>
            ))}
          </div>
        ))}
        {events.length === 0 && (
          <div className="agenda-empty">No upcoming events</div>
        )}
      </div>
    </WidgetShell>
  )
}