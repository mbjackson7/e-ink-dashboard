// src/hooks/useDashboardData.js
// Fetches all unique data sources in parallel, given a widget list.
// Called with the widgets array from useLayout once it resolves.

import { useState, useEffect } from 'react'

export function useDashboardData(widgets) {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!widgets || widgets.length === 0) return

    // no nulls
    const sources = [...new Set(widgets.map((w) => w.config.dataSource ?? null).filter((s) => s))]
    console.log("WIDGETS GETTING DATA")
    console.log(widgets)
    console.log(sources)


    const fetchAll = async () => {
      const results = await Promise.allSettled(
        sources.map(async (source) => {
          console.log(`FETCHING ${source}…`)
          const res = await fetch(source)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          // return json if json, else raw response
          const respType = res.headers.get('content-type')
          if (respType && respType.includes('application/json')) {
            return { source, json: await res.json() }
          } else if (respType && (respType.includes('text/html') || respType.includes('text/plain'))) {
            return { source, json: await res.text() }
          } else {
            throw new Error(`Unsupported content type: ${respType}`)
          }
        })
      )

      const newData = {}
      const newErrors = {}
      results.forEach((result, i) => {
        const source = sources[i]
        if (result.status === 'fulfilled') {
          newData[source] = result.value.json
        } else {
          newErrors[source] = result.reason.message
        }
      })

      setData(newData)
      setErrors(newErrors)
      setLoading(false)
      console.log("DASHBOARD DATA DONE LOADING")
    }

    fetchAll()
  }, [widgets])

  return { data, errors, loading }
}