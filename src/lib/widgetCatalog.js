// src/lib/widgetCatalog.js
// Defines all available widget types for the Add Widget picker.
// - type must match a key in WIDGET_REGISTRY
// - defaultConfig is used when the widget is first added
// - if data is needed, the widget will look for it at data[config.dataSource], so that should be set to a unique value per widget type (e.g. an API endpoint)
// - defaultSize is the initial grid size (w x h) for each breakpoint

export const WIDGET_CATALOG = [
  {
    type: "WeatherCurrent",
    label: "Current Weather",
    defaultConfig: {
      dataSource: "/api/weather",
      units: "imperial",
    },
    defaultSize: {
      lg: { w: 3, h: 2 },
      md: { w: 4, h: 2 },
      sm: { w: 12, h: 2 },
    },
  },
  {
    type: "WeatherForecast",
    label: "5-Day Forecast",
    defaultConfig: {
      dataSource: "/api/weather",
      days: 5,
      units: "imperial",
    },
    defaultSize: {
      lg: { w: 4, h: 2 },
      md: { w: 8, h: 2 },
      sm: { w: 12, h: 2 },
    },
  },
  {
    type: "Agenda",
    label: "Calendar Agenda",
    defaultConfig: {
      dataSource: "/api/calendar",
      lookaheadDays: 3,
      maxItems: 8,
    },
    defaultSize: {
      lg: { w: 4, h: 4 },
      md: { w: 6, h: 4 },
      sm: { w: 12, h: 4 },
    },
  },
  {
    type: "Metric",
    label: "Metric / Sensor",
    defaultConfig: { 
      dataSource: "/api/climate",
      fields: ["temperature", "humidity"] 
    },
    defaultSize: { lg: { w: 2, h: 2 }, md: { w: 3, h: 2 }, sm: { w: 6, h: 2 } },
  },
  {
    type: "Headlines",
    label: "News Headlines",
    defaultConfig: {
      dataSource: "/api/news",
      maxItems: 5,
    },
    defaultSize: {
      lg: { w: 5, h: 2 },
      md: { w: 9, h: 2 },
      sm: { w: 12, h: 2 },
    },
  },
  {
    type: "ImageDisplay",
    label: "Image",
    defaultConfig: {
      src: "https://picsum.photos/1600",
      forceDynamic: false, // if true, appends a timestamp to the URL to force refresh (useful for local media endpoints)
      sendRatio: true, // if true, appends ?ratio=... to the URL so the backend can serve an image that best fits the widget's aspect ratio
    },
    defaultSize: {
      lg: { w: 4, h: 4 },
      md: { w: 6, h: 4 },
      sm: { w: 4, h: 2 },
    },
  },
  {
    type: "Markdown",
    label: "Markdown Text",
    defaultConfig: {
      markdown: "## Hello, World!\nThis is a **markdown** widget. You can use it to display *formatted* text, lists, links, and more.",
      dataSource: null, // no external data needed by default, but can be set to something like "http://localhost:8000/api/markdown" if you want to fetch markdown content from an API
    },
    defaultSize: {
      lg: { w: 4, h: 3 },
      md: { w: 6, h: 3 },
      sm: { w: 12, h: 3 },
    },
  },
  {
    type: "Html",
    label: "HTML Content",
    defaultConfig: {
      html: "<h2>Hello, World!</h2><p>This is an <strong>HTML</strong> widget. You can use it to display formatted content with custom styles.</p>",
      dataSource: null, // no external data needed by default, but can be set to something like "http://localhost:8000/api/html" if you want to fetch HTML content from an API
    },
    defaultSize: {
      lg: { w: 4, h: 3 },
      md: { w: 6, h: 3 },
      sm: { w: 12, h: 3 },
    },
  }
];
