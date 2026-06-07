import { useState, useEffect } from 'react'
import { config } from './config'
import MorningChecklist from './pages/MorningChecklist'
import DefaultPage from './pages/DefaultPage'

// Debug: add ?time=08:30 to the URL to simulate a specific hour
function getDebugHour(): number | null {
  const param = new URLSearchParams(window.location.search).get('time')
  if (!param) return null
  const [h] = param.split(':').map(Number)
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : null
}

function getCurrentPageId(): string | null {
  const hour = getDebugHour() ?? new Date().getHours()
  for (const slot of config.timeSlots) {
    if (hour >= slot.startHour && hour < slot.endHour) {
      return slot.page
    }
  }
  return null
}

function App() {
  const [pageId, setPageId] = useState<string | null>(getCurrentPageId)
  const debugHour = getDebugHour()

  useEffect(() => {
    if (debugHour !== null) return // don't auto-switch when debugging
    const interval = setInterval(() => setPageId(getCurrentPageId()), 60_000)
    return () => clearInterval(interval)
  }, [debugHour])

  const debugBanner = debugHour !== null && (
    <div className="debug-banner">
      🛠 Debug: gesimuleerd uur {String(debugHour).padStart(2, '0')}:00
      &nbsp;—&nbsp;
      <a href={window.location.pathname}>echte tijd</a>
    </div>
  )

  if (pageId === 'morning-checklist') {
    return (
      <>
        {debugBanner}
        <MorningChecklist
          config={config.pages['morning-checklist']}
          childName={config.childName}
          mathExerciseUrl={config.mathExerciseUrl}
        />
      </>
    )
  }

  const alwaysVisibleItems = config.pages['morning-checklist'].items.filter(
    item => item.alwaysVisible,
  )

  return (
    <>
      {debugBanner}
      <DefaultPage
        childName={config.childName}
        timeSlots={config.timeSlots}
        alwaysVisibleItems={alwaysVisibleItems}
        mathExerciseUrl={config.mathExerciseUrl}
      />
    </>
  )
}

export default App
