import { useState, useEffect, useCallback } from 'react'

function getTodayKey() {
  return `math-unlocked-${new Date().toISOString().slice(0, 10)}`
}

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(getTodayKey())
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function useMathLock(mathExerciseUrl: string) {
  const [unlocked, setUnlocked] = useState<Set<string>>(loadUnlocked)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(getTodayKey(), JSON.stringify([...unlocked]))
  }, [unlocked])

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type !== 'MATH_LOCK_EXERCISE_COMPLETED') return
      const targetUrl = e.data.targetUrl as string | undefined
      if (!targetUrl) return

      setUnlocked(prev => new Set([...prev, targetUrl]))
      setIframeUrl(null)
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // If already unlocked today, open directly.
  // Otherwise show the puzzle in an iframe — the puzzle reads window.location.hash
  // to get targetUrl, then calls: window.parent.postMessage({ type: 'MATH_LOCK_EXERCISE_COMPLETED', targetUrl }, '*')
  const openLocked = useCallback(
    (href: string) => {
      if (unlocked.has(href)) {
        window.open(href, '_blank', 'noopener,noreferrer')
      } else {
        setIframeUrl(`${mathExerciseUrl}#${encodeURIComponent(href)}`)
      }
    },
    [unlocked, mathExerciseUrl],
  )

  return {
    unlocked,
    openLocked,
    iframeUrl,
    closeIframe: () => setIframeUrl(null),
  }
}
