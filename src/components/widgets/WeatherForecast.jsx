// src/components/widgets/WeatherForecast.jsx
// { forecast: [{ date, high, low, condition, precip_chance }] }

import WidgetShell from '../WidgetShell'

export default function WeatherForecast({ data, loading, error, config, title, selected }) {
  const days = data?.forecast?.slice(0, config?.days ?? 5) ?? []

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      {days.length > 0 && (
        <div className="forecast">
          <div className="forecast-rows">
            {days.map((d) => (
              <div key={d.date} className="forecast-row">
                <span className="forecast-day">{d.date}</span>
                <span className="forecast-condition">{d.condition}</span>
                <span className="forecast-precip">{d.precip_chance}%</span>
                <span className="forecast-range">
                  {Math.round(d.low)}° - {Math.round(d.high)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </WidgetShell>
  )
}