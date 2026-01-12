import React from 'react'

function EmailInput({ value, onChange, error, onBlur, touched }) {
  return (
    <div className="form-group">
      <label htmlFor="email">Your Routific email address *</label>
      <input
        type="email"
        id="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={error && touched ? 'error' : ''}
        placeholder="your.email@company.com"
      />
      {error && touched && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
}

export default EmailInput
