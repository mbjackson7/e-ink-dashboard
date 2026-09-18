// src/components/widgets/Html.jsx
// Render HTML content from a data source or static config.
// Expects HTML content in either config.html or data.html.

import WidgetShell from '../WidgetShell'

export default function Html({ data, loading, error, config, title, selected }) {
  const rawHTML = config?.html ?? data ?? "No HTML content"

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      <div className="html-content" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ zIndex: 0, position: 'absolute', inset: 0 }} />
        <div dangerouslySetInnerHTML={{ __html: rawHTML }} style={{ zIndex: -1 }} />
      </div>
    </WidgetShell>
  )
}