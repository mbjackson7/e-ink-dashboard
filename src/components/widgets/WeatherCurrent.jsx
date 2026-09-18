// src/components/widgets/WeatherCurrent.jsx
// { current: { temp, feels_like, condition, icon, humidity, wind_speed } }

import WidgetShell from '../WidgetShell'

export default function WeatherCurrent({ data, loading, error, config, title, selected }) {
  const c = data?.current

  return (
    <WidgetShell title={title} loading={loading} error={error} selected={selected}>
      {c && (
        <div className="weather-current">
          <div className="weather-temp">{Math.round(c.temp)}°</div>
          <div className="weather-condition">{c.condition}</div>
          <div className="weather-meta">
            <span>Feels {Math.round(c.feels_like)}°</span>
            <span>{c.humidity}% humidity</span>
            <span>{Math.round(c.wind_speed)} mph</span>
          </div>
        </div>
      )}
    </WidgetShell>
  )
}