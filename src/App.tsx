import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { config } from './config'
import type { ChecklistPageConfig } from './config'
import ChecklistPage from './pages/ChecklistPage'
import DefaultPage from './pages/DefaultPage'

function getDebugHour(): number | null {
  const param = new URLSearchParams(window.location.search).get('time')
  if (!param) return null
  const [h] = param.split(':').map(Number)
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : null
}

function getCurrentPageId(timeSlots: { startHour: number; endHour: number; page: string }[]): string | null {
  const hour = getDebugHour() ?? new Date().getHours()
  for (const slot of timeSlots) {
    if (hour >= slot.startHour && hour < slot.endHour) {
      return slot.page
    }
  }
  return null
}

function App() {
  const { slug = 'liene' } = useParams()
  const user = config.users[slug]

  const [pageId, setPageId] = useState<string | null>(() =>
    user ? getCurrentPageId(user.timeSlots) : null
  )
  const debugHour = getDebugHour()

  useEffect(() => {
    if (!user || debugHour !== null) return
    const interval = setInterval(() => setPageId(getCurrentPageId(user.timeSlots)), 60_000)
    return () => clearInterval(interval)
  }, [user, debugHour])

  if (!user) {
    return (
      <div className="page default" style={{ justifyContent: 'center' }}>
        <div className="default-card">
          <div style={{ fontSize: '3rem' }}>🤷</div>
          <h1>Onbekende gebruiker</h1>
          <p className="next-up">Geen dashboard gevonden voor <strong>/{slug || '…'}</strong></p>
        </div>
      </div>
    )
  }

  const debugBanner = debugHour !== null && (
    <div className="debug-banner">
      🛠 Debug: gesimuleerd uur {String(debugHour).padStart(2, '0')}:00
      &nbsp;—&nbsp;
      <a href={window.location.pathname}>echte tijd</a>
    </div>
  )

  const activeConfig: ChecklistPageConfig | null = pageId && user.pages[pageId]
    ? user.pages[pageId]
    : null

  if (activeConfig && pageId) {
    return (
      <>
        {debugBanner}
        <ChecklistPage
          userSlug={slug}
          checklistId={pageId}
          config={activeConfig}
          childName={user.name}
        />
      </>
    )
  }

  const alwaysVisibleItems = Object.values(user.pages)
    .flatMap(p => p.items)
    .filter(item => item.alwaysVisible)

  return (
    <>
      {debugBanner}
      <DefaultPage
        childName={user.name}
        timeSlots={user.timeSlots}
        alwaysVisibleItems={alwaysVisibleItems}
      />
    </>
  )
}

export default App
