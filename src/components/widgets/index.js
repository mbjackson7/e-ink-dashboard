// src/components/widgets/index.js
// Add new widget types here. The key must match the `type` field in dashboard.config.js.

import WeatherCurrent from './WeatherCurrent'
import WeatherForecast from './WeatherForecast'
import Agenda from './Agenda'
import Metric from './Metric'
import Headlines from './Headlines'
import ImageDisplay from './ImageDisplay'
import Markdown from './Markdown'
import Html from './Html'

export const WIDGET_REGISTRY = {
  WeatherCurrent,
  WeatherForecast,
  Agenda,
  Metric,
  Headlines,
  ImageDisplay,
  Markdown,
  Html,
}