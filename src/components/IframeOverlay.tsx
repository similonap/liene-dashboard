interface Props {
  url: string
  onClose: () => void
}

export default function IframeOverlay({ url, onClose }: Props) {
  return (
    <div className="iframe-overlay" role="dialog" aria-modal="true" aria-label="Wiskundeoefening">
      <div className="iframe-toolbar">
        <span className="iframe-title">🧮 Wiskundeoefening</span>
        <button className="iframe-close" onClick={onClose} aria-label="Sluiten">✕</button>
      </div>
      <iframe
        src={url}
        className="iframe-content"
        title="Wiskundeoefening"
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
      />
    </div>
  )
}
