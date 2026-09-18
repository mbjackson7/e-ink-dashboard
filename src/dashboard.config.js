// dashboard.config.js
// Grid constants only. Widget definitions and layout positions live on the
// server in server/main.py (DEFAULT_WIDGETS) and persist to server/layout.json.
//
// To add or modify widgets, edit DEFAULT_WIDGETS in server/main.py,
// delete server/layout.json, and restart the server.
// Once UI-based widget management is added, this file won't need touching at all.

// Breakpoints match Tailwind's md/lg for convenience
export const BREAKPOINTS = { lg: 1200, md: 996, sm: 768 }
export const COLS        = { lg: 12,   md: 12,  sm: 12  }