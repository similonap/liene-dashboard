import { useState, useEffect } from 'react'
import type { MorningChecklistPageConfig } from '../config'
import { useMathLock } from '../hooks/useMathLock'
import IframeOverlay from '../components/IframeOverlay'

interface Props {
  config: MorningChecklistPageConfig
  childName: string
  mathExerciseUrl: string
}

function getTodayKey() {
  return `checklist-${new Date().toISOString().slice(0, 10)}`
}

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(getTodayKey())
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export default function MorningChecklist({ config, childName, mathExerciseUrl }: Props) {
  const [checked, setChecked] = useState<Set<string>>(loadChecked)
  const [time, setTime] = useState(new Date())
  const { unlocked, openLocked, iframeUrl, closeIframe } = useMathLock(mathExerciseUrl)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    localStorage.setItem(getTodayKey(), JSON.stringify([...checked]))
  }, [checked])

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'PUZZLE_SOLVED') {
        setChecked(prev => {
          const next = new Set(prev)
          config.items
            .filter(i => i.link?.href.startsWith(mathExerciseUrl))
            .forEach(i => next.add(i.id))
          return next
        })
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [config.items, mathExerciseUrl])

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const total = config.items.length
  const done = config.items.filter(item => checked.has(item.id)).length
  const allDone = done === total
  const progress = Math.round((done / total) * 100)

  const timeStr = time.toLocaleTimeString('nl-BE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
    {iframeUrl && <IframeOverlay url={iframeUrl} onClose={closeIframe} />}
    <div className={`page morning${allDone ? ' all-done' : ''}`}>
      <div className="stars" aria-hidden="true">
        {['⭐', '🌟', '✨', '💫', '⭐', '🌟', '✨'].map((s, i) => (
          <span key={i} className="star" style={{ '--i': i } as React.CSSProperties}>{s}</span>
        ))}
      </div>

      <header className="morning-header">
        <div className="clock">{timeStr}</div>
        <h1>{config.title}, {childName}! ☀️</h1>
        <p className="subtitle">{config.subtitle}</p>
      </header>

      <div className="progress-wrap">
        <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">{done} van {total} klaar</span>
      </div>

      <ul className="checklist" role="list">
        {config.items.map(item => {
          const isChecked = checked.has(item.id)
          return (
            <li key={item.id} className={`checklist-item${isChecked ? ' checked' : ''}`}>
              <button
                className="check-btn"
                onClick={() => toggle(item.id)}
                aria-pressed={isChecked}
              >
                <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
                <span className="item-label">{item.label}</span>
                <span className="item-check" aria-hidden="true">
                  {isChecked ? '✅' : '⬜'}
                </span>
              </button>
              {item.link && (
                item.link.mathLock && !unlocked.has(item.link.href)
                  ? (
                    <button
                      className="item-link math-locked"
                      onClick={() => openLocked(item.link!.href)}
                    >
                      🔒 {item.link.label} →
                    </button>
                  ) : (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="item-link"
                    >
                      {item.link.mathLock ? '🔓 ' : ''}{item.link.label} →
                    </a>
                  )
              )}
            </li>
          )
        })}
      </ul>

      {allDone && (
        <div className="celebration" role="status">
          <p>🎉 Super gedaan, {childName}! Alles is klaar! 🎉</p>
          <p className="celebration-sub">Je bent helemaal klaar voor school! 🏫</p>
        </div>
      )}
    </div>
    </>
  )
}
