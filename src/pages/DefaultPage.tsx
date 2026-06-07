import { useState, useEffect } from 'react'
import type { ChecklistItem, TimeSlot } from '../config'

interface Props {
  childName: string
  timeSlots: TimeSlot[]
  alwaysVisibleItems: ChecklistItem[]
}

function getNextSlot(timeSlots: TimeSlot[]): { slot: TimeSlot; startsIn: string } | null {
  const now = new Date()
  const hour = now.getHours()

  const upcoming = timeSlots
    .filter(s => s.startHour > hour)
    .sort((a, b) => a.startHour - b.startHour)

  const next = upcoming[0] ?? timeSlots.sort((a, b) => a.startHour - b.startHour)[0]
  if (!next) return null

  let diffHours = next.startHour - hour
  if (diffHours < 0) diffHours += 24

  const startsIn =
    diffHours === 0 ? 'zo meteen' :
    diffHours === 1 ? 'over 1 uur' :
    `over ${diffHours} uur`

  return { slot: next, startsIn }
}

export default function DefaultPage({ childName, timeSlots, alwaysVisibleItems }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
  const dateStr = time.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })
  const next = getNextSlot(timeSlots)

  return (
    <div className="page default">
      <div className="default-card">
        <div className="clock large">{timeStr}</div>
        <div className="date">{dateStr}</div>
        <h1>Hallo, {childName}! 👋</h1>

        {next ? (
          <p className="next-up">
            Volgende activiteit: <strong>{next.slot.label}</strong>
            <br />
            <span className="next-time">Vanaf {next.slot.startHour}:00 — {next.startsIn}</span>
          </p>
        ) : (
          <p className="next-up">Geniet van je vrije tijd! 🎈</p>
        )}

        {alwaysVisibleItems.length > 0 && (
          <ul className="always-visible-tasks" role="list">
            {alwaysVisibleItems.map(item => (
              <li key={item.id} className="always-visible-task">
                <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
                <span className="item-label">{item.label}</span>
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
            ))}
          </ul>
        )}

        <div className="decorations" aria-hidden="true">
          <span>🌈</span>
          <span>⭐</span>
          <span>🦋</span>
          <span>🌸</span>
          <span>🎀</span>
        </div>
      </div>
    </div>
  )
}
