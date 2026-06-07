import { useState, useEffect } from 'react'

interface Props {
  url: string
  onClose: () => void
}

export default function IframeOverlay({ url, onClose }: Props) {
  const [canProceed, setCanProceed] = useState(false)

  // targetUrl is encoded in the hash: puzzel.lienesimilon.be#https%3A%2F%2F...
  const targetUrl = decodeURIComponent(url.split('#')[1] ?? '')

  // Reset when a different exercise is opened
  useEffect(() => {
    setCanProceed(false)
  }, [url])

  // Enable the button when the puzzle signals all checkboxes are done
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'PUZZLE_SOLVED') {
        setCanProceed(true)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  function handleProceed() {
    window.postMessage({ type: 'MATH_LOCK_EXERCISE_COMPLETED', targetUrl }, '*')
  }

  return (
    <div className="iframe-overlay" role="dialog" aria-modal="true" aria-label="Wiskundeoefening">
      <div className="iframe-toolbar">
        <span className="iframe-title">🧮 Wiskundeoefening</span>
        <div className="iframe-actions">
          <button
            className="iframe-proceed"
            onClick={handleProceed}
            disabled={!canProceed}
          >
            Doorgaan →
          </button>
          <button className="iframe-close" onClick={onClose} aria-label="Sluiten">✕</button>
        </div>
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
