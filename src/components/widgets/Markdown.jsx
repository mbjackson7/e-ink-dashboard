// src/components/widgets/Markdown.jsx
// Render markdown text from a data source or static config.
// Expects markdown content in either config.markdown or data.markdown.

import ReactMarkdown from 'react-markdown'
import WidgetShell from '../WidgetShell'

export default function Markdown({ data, loading, error, config, title, selected }) {
  const rawMarkdown = config?.markdown ?? data?.markdown ?? "No markdown content"
  // Convert literal \n back to actual newlines for rendering
  const markdown = rawMarkdown.replace(/\\n/g, '\n')

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      <div className="markdown-content" style={{ padding: '1rem', overflow: 'auto' }}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </WidgetShell>
  )
}