import React, { useState, useEffect } from 'react'
import NotificationTypeSelector from './components/NotificationTypeSelector'
import SMSForm from './components/SMSForm'
import EmailForm from './components/EmailForm'
import UnicornCelebration from './components/UnicornCelebration'

function App() {
  const [notificationType, setNotificationType] = useState(null)
  const [showUnicorns, setShowUnicorns] = useState(false)

  // Keyboard shortcut: Ctrl+Shift+U to toggle unicorn celebration
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        e.preventDefault()
        setShowUnicorns((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNotificationTypeSelect = (type) => {
    setNotificationType(type)
  }

  const handleBack = () => {
    setNotificationType(null)
  }

  return (
    <>
      <UnicornCelebration isActive={showUnicorns} />
      {!notificationType ? (
        <NotificationTypeSelector onSelect={handleNotificationTypeSelect} />
      ) : notificationType === 'sms' ? (
        <SMSForm onBack={handleBack} />
      ) : (
        <EmailForm onBack={handleBack} />
      )}
    </>
  )
}

export default App
