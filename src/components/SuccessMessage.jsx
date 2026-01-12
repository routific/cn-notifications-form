import React from 'react'

function SuccessMessage({ onReset }) {
  return (
    <div className="success-message">
      <h2>✓ Templates Submitted!</h2>
      <p>
        Your templates have been submitted! Our team will review them within
        1-2 business days.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="button" onClick={onReset}>
          Submit Another Request
        </button>
      </div>
    </div>
  )
}

export default SuccessMessage
