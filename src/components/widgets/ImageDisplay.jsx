// src/components/widgets/ImageDisplay.jsx
// Displays a full-bleed image with an optional caption.
// {
//   url: string,          // image URL — can be absolute or relative to your server
//   title: string,        // optional caption
//   credit: string,       // optional credit line (e.g. "NASA APOD")
// }
//
// The image is intentionally rendered without any CSS filters or color adjustments
// so your Playwright → PIL dithering pipeline sees the raw pixel values.
// object-fit: cover fills the widget area and lets react-grid-layout control sizing.

import WidgetShell from "../WidgetShell";
export default function ImageDisplay({
  loading,
  error,
  config,
  title,
  selected,
  ratio,
}) {
  let src = new URL(config.src);

  if (config.sendRatio) {
    src.searchParams.set("ratio", ratio);
  }
  if (config.forceDynamic) {
    src.searchParams.set("t", Date.now());
    src.searchParams.set("r", Math.random());
  }
  // if halloween, invert color with css filter, handle any year
  const isHalloween =
    Date.now() >= new Date(`${new Date().getFullYear()}-10-27`).getTime() &&
    Date.now() <= new Date(`${new Date().getFullYear()}-11-01`).getTime();
  const halloweenFilter = isHalloween ? { filter: "invert(100%)" } : {};

  return (
    <WidgetShell
      title={title}
      loading={loading}
      error={error}
      selected={selected}
    >
      {config.src && (
        <div className="image-widget">
          <img
            src={src.toString()}
            alt={title ?? ""}
            className="image-widget-img"
            style={{ ...halloweenFilter }}
          />
        </div>
      )}
    </WidgetShell>
  );
}
