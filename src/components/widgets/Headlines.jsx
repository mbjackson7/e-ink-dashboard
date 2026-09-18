// src/components/widgets/Headlines.jsx
// { articles: [{ id, title, source, url }] }

import WidgetShell from '../WidgetShell'

export default function Headlines({ data, loading, error, config, title, selected }) {
  const articles = data?.articles?.slice(0, config?.maxItems ?? 5) ?? []

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      <div className="headlines">
        {articles.map((a, i) => (
          <div key={a.id ?? i} className="headline-item">
            <span className="headline-source">{a.source}</span>
            <span className="headline-title">{a.title}</span>
          </div>
        ))}
      </div>
    </WidgetShell>
  )
}