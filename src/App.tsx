import { useState, useEffect } from 'react'
import { config } from './config'
import type { ChecklistPageConfig } from './config'
import MorningChecklist from './pages/MorningChecklist'

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

const defaultConfig: ChecklistPageConfig = {
  title: 'Even wachten!',
  subtitle: 'Doe eerst je taak, dan mag je spelen! 🎮',
  celebrationText: 'Je mag nu spelen! Veel plezier! 🎉',
  completionButton: { label: 'Ik mag spelen! 🚀', messageType: 'CHECKLIST_COMPLETED' },
  items: Object.values(config.pages).flatMap(p => p.items).filter(item => item.alwaysVisible),
}

function App() {
  const [pageId, setPageId] = useState<string | null>(getCurrentPageId)
  const debugHour = getDebugHour()

  useEffect(() => {
    if (debugHour !== null) return
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

  const checklistId = (pageId === 'morning-checklist' || pageId === 'evening-checklist')
    ? pageId
    : 'default-checklist'
  const checklistConfig = checklistId === 'default-checklist'
    ? defaultConfig
    : config.pages[checklistId]

  return (
    <>
      {debugBanner}
      <MorningChecklist
        checklistId={checklistId}
        config={checklistConfig}
        childName={config.childName}
      />
    </>
  )
}

export default App
