import { useState, useEffect } from 'react'
import type { ChecklistPageConfig } from '../config'

interface Props {
  checklistId: string
  config: ChecklistPageConfig
  childName: string
}

function getTodayKey(checklistId: string) {
  return `checklist-${checklistId}-${new Date().toISOString().slice(0, 10)}`
}

function loadChecked(checklistId: string): Set<string> {
  try {
    const raw = localStorage.getItem(getTodayKey(checklistId))
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const MORNING_STARS = ['⭐', '🌟', '✨', '💫', '⭐', '🌟', '✨']
const EVENING_STARS = ['🌙', '⭐', '✨', '💫', '🌙', '⭐', '✨']

export default function MorningChecklist({ checklistId, config, childName }: Props) {
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked(checklistId))
  const [time, setTime] = useState(new Date())

  const variant = checklistId.replace('-checklist', '') // 'morning' | 'evening'
  const decorations = variant === 'evening' ? EVENING_STARS : MORNING_STARS
  const greeting = variant === 'evening' ? '🌙' : '☀️'

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    localStorage.setItem(getTodayKey(checklistId), JSON.stringify([...checked]))
  }, [checked, checklistId])

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'PUZZLE_SOLVED') {
        setChecked(prev => {
          const next = new Set(prev)
          config.items.filter(i => i.link).forEach(i => next.add(i.id))
          return next
        })
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [config.items])

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
    <div className={`page ${variant}${allDone ? ' all-done' : ''}`}>
      <div className="stars" aria-hidden="true">
        {decorations.map((s, i) => (
          <span key={i} className="star" style={{ '--i': i } as React.CSSProperties}>{s}</span>
        ))}
      </div>

      <header className="morning-header">
        <div className="clock">{timeStr}</div>
        <h1>{config.title}, {childName}! {greeting}</h1>
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
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="item-link"
                >
                  {item.link.label} →
                </a>
              )}
            </li>
          )
        })}
      </ul>

      {config.completionButton && (
        <button
          className={`completion-btn${allDone ? ' ready' : ''}`}
          disabled={!allDone}
          onClick={() =>
            window.postMessage({ type: config.completionButton!.messageType }, '*')
          }
        >
          {config.completionButton.label}
        </button>
      )}

      {allDone && (
        <div className="celebration" role="status">
          <p>🎉 Super gedaan, {childName}! 🎉</p>
          <p className="celebration-sub">{config.celebrationText}</p>
        </div>
      )}
    </div>
  )
}
