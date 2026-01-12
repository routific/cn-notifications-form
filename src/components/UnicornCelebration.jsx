import React from 'react'
import './UnicornCelebration.css'

function UnicornCelebration({ isActive }) {
  if (!isActive) return null

  return (
    <div className="unicorn-celebration">
      <div className="rainbow rainbow-1"></div>
      <div className="rainbow rainbow-2"></div>
      <div className="rainbow rainbow-3"></div>

      <div className="unicorn unicorn-1">🦄</div>
      <div className="unicorn unicorn-2">🦄</div>
      <div className="unicorn unicorn-3">🦄</div>
      <div className="unicorn unicorn-4">🦄</div>

      <div className="sparkles">
        <div className="sparkle sparkle-1">✨</div>
        <div className="sparkle sparkle-2">⭐</div>
        <div className="sparkle sparkle-3">💫</div>
        <div className="sparkle sparkle-4">✨</div>
        <div className="sparkle sparkle-5">⭐</div>
        <div className="sparkle sparkle-6">💫</div>
        <div className="sparkle sparkle-7">✨</div>
        <div className="sparkle sparkle-8">⭐</div>
      </div>

      <div className="celebration-message">
        <div className="message-text">
          🎉 PERFECT SCORE! 🎉
        </div>
        <div className="message-subtext">
          All templates are flawless!
        </div>
      </div>
    </div>
  )
}

export default UnicornCelebration
