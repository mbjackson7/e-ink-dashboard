// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";

import { BREAKPOINTS, COLS } from "./dashboard.config";
import { WIDGET_REGISTRY } from "./components/widgets/index";
import { useDashboardData } from "./hooks/useDashboardData";
import { useLayout } from "./hooks/useLayout";
import { useKiosk } from "./lib/KioskContext";
import AddWidgetPanel from "./components/AddWidgetPanel";
import { WIDGET_CATALOG } from "./lib/widgetCatalog";

const ResponsiveGrid = WidthProvider(Responsive);

const SAVE_LABELS = {
  idle: "save layout",
  saving: "saving…",
  saved: "saved ✓",
  error: "error — retry",
};

export default function App() {
  const isKiosk = useKiosk();
  const [layoutName, setLayoutName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("layout") || "default";
  });
  const {
    widgets,
    layouts,
    setLayouts,
    addWidget,
    removeWidget,
    save,
    saveState,
    dirty,
    updateWidget,
  } = useLayout(layoutName);
  const { data, errors, loading } = useDashboardData(widgets);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [resolution, setResolution] = useState({ width: 480, height: 800 });
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [editingConfig, setEditingConfig] = useState({});
  // query param for layout name, default "default"

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedWidget) {
        removeWidget(selectedWidget);
        setSelectedWidget(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && selectedWidget) {
        const widget = widgets.find((w) => w.id === selectedWidget);
        if (widget) {
          const catalogEntry = WIDGET_CATALOG.find(
            (entry) => entry.type === widget.type,
          );
          if (catalogEntry) {
            addWidget(catalogEntry, widget.title + " (copy)", widget.config);
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedWidget, removeWidget]);

  if (layouts && !loading) {
    document.documentElement.setAttribute("data-ready", "true");
  }

  return (
    <div className={`dashboard ${isKiosk ? "kiosk" : "edit"}`}>
      {!isKiosk && (
        <header className="dashboard-header">
          <span className="dashboard-title">Dashboard</span>
          <div className="resolution-controls">
            <label>
              Width:{" "}
              <input
                type="number"
                value={resolution.width}
                onChange={(e) =>
                  setResolution((prev) => ({
                    ...prev,
                    width: parseInt(e.target.value) || 480,
                  }))
                }
              />{" "}
              px
            </label>
            <label>
              Height:{" "}
              <input
                type="number"
                value={resolution.height}
                onChange={(e) =>
                  setResolution((prev) => ({
                    ...prev,
                    height: parseInt(e.target.value) || 800,
                  }))
                }
              />{" "}
              px
            </label>
          </div>
          <span className="dashboard-hint">
            drag to rearrange · resize from corner
          </span>
          <div className="dashboard-actions">
            <button className="add-btn" onClick={() => setShowAddPanel(true)}>
              + add widget
            </button>
            <button
              className={`save-btn save-btn--${saveState} ${dirty ? "save-btn--dirty" : ""}`}
              onClick={() => save(layouts, widgets, layoutName)}
              disabled={saveState === "saving"}
            >
              {SAVE_LABELS[saveState]}
            </button>
            <button onClick={() => {
              const newLayoutName = prompt("Enter layout name", layoutName);
              if (newLayoutName) {
                save(layouts, widgets, newLayoutName);
                setLayoutName(newLayoutName);
                // Update URL query param without reloading
                const params = new URLSearchParams(window.location.search);
                params.set("layout", newLayoutName);
                window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
              }
            }}>
              Save as...
            </button>
            <button onClick={() => {
              const params = new URLSearchParams(window.location.search);
              fetch('/api/layout/list')
                .then((r) => {
                  if (!r.ok) throw new Error(`HTTP ${r.status}`);
                  return r.json();
                })
                // show a list of available layouts and let user pick one to load
                .then(({ layouts }) => {
                  const layoutToLoad = prompt("Enter layout name to load:\n" + layouts.join("\n"), layoutName);
                  if (layoutToLoad) {
                    setLayoutName(layoutToLoad);
                    params.set("layout", layoutToLoad);
                    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
                  }
                })
                .catch((e) => console.error('Failed to load layout list:', e));
            }}>
              Load layout
            </button>
          </div>
        </header>
      )}

      {widgets && layouts && (
        <div
          className="grid-container"
          style={
            !isKiosk
              ? {
                  width: `${resolution.width}px`,
                  height: `${resolution.height}px`,
                  margin: "20px auto",
                  outline: "1px solid #ccc",
                  overflow: "hidden",
                  scale: `${1.7 * (resolution.width / window.innerHeight)}`,
                  transformOrigin: "top",
                }
              : {}
          }
        >
          <ResponsiveGrid
            className="layout"
            layouts={layouts}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={80}
            isDraggable={!isKiosk}
            isResizable={!isKiosk}
            onLayoutChange={(_, allLayouts) => {
              setLayouts(allLayouts);
            }}
            onDragStart={() => setIsInteracting(true)}
            onDragStop={() => setIsInteracting(false)}
            onResizeStart={() => setIsInteracting(true)}
            onResizeStop={() => setIsInteracting(false)}
            margin={[0, 0]}
            containerPadding={[0, 0]}
          >
            {widgets.map((widget) => {
              const Widget = WIDGET_REGISTRY[widget.type];
              // find the height and width on the grid layout for this widget to calculate ratio for responsive rendering
              const layoutForWidget = layouts.sm.find((l) => l.i === widget.id);
              console.log(`Found layout for widget ${widget.id}:`, layoutForWidget);
              const canvasRatio = resolution.width / resolution.height;
              const gridRatio = layoutForWidget ? layoutForWidget.w / layoutForWidget.h : 1;
              const widgetRatio = canvasRatio * gridRatio;
              console.log(`Rendering widget ${widget.id} with ratio ${widgetRatio.toFixed(2)}, canvasRatio ${canvasRatio.toFixed(2)}, gridRatio ${gridRatio.toFixed(2)}`);
              if (!Widget) {
                console.warn(`Unknown widget type: ${widget.type}`);
                return null;
              }
              return (
                <div
                  key={widget.id}
                  onClick={() => {
                    if (!isInteracting && !isKiosk) {
                      setSelectedWidget(widget.id);
                      const foundWidget = widgets.find(
                        (w) => w.id === widget.id,
                      );
                      if (foundWidget) {
                        // Convert arrays to comma-separated strings for editing
                        // Convert literal \n to actual newlines for textarea display
                        const configForEditing = {};
                        Object.entries(foundWidget.config).forEach(([key, value]) => {
                          if (Array.isArray(value)) {
                            configForEditing[key] = value.join(", ");
                          } else if (typeof value === 'string') {
                            // Convert \n (literal backslash-n) to actual newlines
                            configForEditing[key] = value.replace(/\\n/g, '\n');
                          } else {
                            configForEditing[key] = value;
                          }
                        });
                        setEditingConfig(configForEditing);
                      }
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Widget
                    data={data[widget.config.dataSource] ?? null}
                    loading={loading}
                    error={errors[widget.config.dataSource] ?? null}
                    config={widget.config}
                    title={widget.title}
                    onRemove={!isKiosk ? () => removeWidget(widget.id) : null}
                    selected={selectedWidget === widget.id}
                    // get height and width from layout for this widget to pass down for responsive rendering
                    ratio = {widgetRatio}
                  />
                </div>
              );
            })}
          </ResponsiveGrid>
        </div>
      )}
      {selectedWidget && !isKiosk && (
        <div className="widget-config-panel">
          <h3>Widget configuration</h3>
          {Object.entries(editingConfig).map(([key, value]) => {
            // Get the original widget to check what type this field originally was
            const originalWidget = widgets.find(w => w.id === selectedWidget);
            const originalValue = originalWidget?.config?.[key];
            
            // Determine input type based on original value type, not current string content
            const inputType =
              typeof value === "number"
                ? "number"
                : typeof value === "boolean"
                  ? "checkbox"
                  : Array.isArray(originalValue)
                    ? "array"
                    : "text";

            return (
              <div key={key} className="config-item">
                <label>{key}:</label>
                {inputType === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={value || false}
                    onChange={(e) => {
                      setEditingConfig((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }));
                    }}
                  />
                ) : inputType === "text" ? (
                  <textarea
                    value={value || ""}
                    onChange={(e) => {
                      setEditingConfig((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }));
                    }}
                    placeholder="Enter text"
                    style={{ width: "100%", minHeight: "100px", fontFamily: "monospace" }}
                  />
                ) : (
                  <input
                    type={inputType === "array" ? "text" : inputType}
                    value={value || ""}
                    onChange={(e) => {
                      setEditingConfig((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }));
                    }}
                    placeholder={inputType === "array" ? "comma separated values" : ""}
                  />
                )}
              </div>
            );
          })}
          <button
            onClick={() => {
              // Convert comma-separated strings back to arrays
              // Convert actual newlines back to \n for storage
              const originalWidget = widgets.find(w => w.id === selectedWidget);
              const configToSave = { ...editingConfig };
              
              if (originalWidget) {
                Object.entries(originalWidget.config).forEach(([key, originalValue]) => {
                  if (Array.isArray(originalValue) && typeof configToSave[key] === 'string') {
                    configToSave[key] = configToSave[key]
                      .split(',')
                      .map(item => item.trim())
                      .filter(item => item !== '');
                  } else if (typeof configToSave[key] === 'string' && originalValue !== undefined && typeof originalValue !== 'string') {
                    // Handle number conversion if original was a number
                    if (typeof originalValue === 'number') {
                      configToSave[key] = configToSave[key] === '' ? '' : Number(configToSave[key]);
                    }
                  } else if (typeof configToSave[key] === 'string' && typeof originalValue === 'string') {
                    // Convert actual newlines back to \n for storage
                    configToSave[key] = configToSave[key].replace(/\n/g, '\\n');
                  }
                });
              }
              
              updateWidget(selectedWidget, { config: configToSave });
              setSelectedWidget(null);
            }}
          >
            Save
          </button>

          <button onClick={() => setSelectedWidget(null)}>Close</button>
          {/* Delete widget*/}
          <button
            onClick={() => {
              removeWidget(selectedWidget);
              setSelectedWidget(null);
            }}
            style={{
              marginLeft: "8px",
              backgroundColor: "#e74c3c",
              color: "#fff",
            }}
          >
            Remove widget
          </button>
        </div>
      )}
      {showAddPanel && (
        <AddWidgetPanel
          onAdd={addWidget}
          onClose={() => setShowAddPanel(false)}
        />
      )}
    </div>
  );
}
