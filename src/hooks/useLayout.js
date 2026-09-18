// src/hooks/useLayout.js
// Manages widget list + layout positions, both sourced from GET /api/layout.
// Exposes addWidget and removeWidget so the UI can mutate state locally
// before saving — same pattern as drag/resize.

import { useState, useEffect, useRef, useCallback } from 'react'

export function useLayout(layoutName = "default") {
  const [widgets, setWidgets] = useState(null)
  const [layouts, setLayoutsRaw] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState('idle')
  const savedTimer = useRef(null)

  useEffect(() => {
    fetch(`/api/layout?name=${encodeURIComponent(layoutName)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(({ widgets, layouts }) => {
        setWidgets(widgets)
        setLayoutsRaw(layouts)
      })
      .catch((e) => console.error('Failed to load layout:', e))
  }, [layoutName])

  const markDirty = () => {
    setDirty(true)
    setSaveState('idle')
  }

  const setLayouts = useCallback((newLayouts) => {
    setLayoutsRaw(newLayouts)
    markDirty()
  }, [])

  // Add a widget from the catalog. Placed at x:0 below existing content.
  const addWidget = useCallback((catalogEntry, title, config = {}) => {
    const id = `${catalogEntry.type.toLowerCase()}-${Date.now()}`
    const newWidget = {
      id,
      type:       catalogEntry.type,
      title:      title || catalogEntry.label,
      config:     { ...catalogEntry.defaultConfig, ...config },
    }

    setWidgets((prev) => [...(prev ?? []), newWidget])

    setLayoutsRaw((prev) => {
      const next = { ...prev }
      for (const bp of ['lg', 'md', 'sm']) {
        // Place below the lowest existing item in this breakpoint
        const existingItems = prev?.[bp] ?? []
        const maxY = existingItems.reduce(
          (m, item) => Math.max(m, item.y + item.h), 0
        )
        next[bp] = [
          ...existingItems,
          {
            i:    id,
            x:    0,
            y:    maxY,
            w:    catalogEntry.defaultSize[bp].w,
            h:    catalogEntry.defaultSize[bp].h,
            minW: 2,
            minH: 1,
          },
        ]
      }
      return next
    })

    markDirty()
    return id
  }, [])

  // Remove a widget by id from both widget list and all layout breakpoints
  const removeWidget = useCallback((id) => {
    setWidgets((prev) => (prev ?? []).filter((w) => w.id !== id))
    setLayoutsRaw((prev) => {
      const next = {}
      for (const bp of Object.keys(prev ?? {})) {
        next[bp] = prev[bp].filter((item) => item.i !== id)
      }
      return next
    })
    markDirty()
  }, [])

  const save = useCallback(async (currentLayouts, currentWidgets, name = "default") => {
    setSaveState('saving')
    try {
      const res = await fetch(`/api/layout?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets: currentWidgets, layouts: currentLayouts }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setDirty(false)
      setSaveState('saved')
      clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
    }
  }, [])

  const updateWidget = useCallback((id, updates) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
    markDirty()
  }, [])

  return { widgets, layouts, setLayouts, addWidget, removeWidget, save, saveState, dirty, updateWidget }
}