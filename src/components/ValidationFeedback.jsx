import React from 'react'
import {
  calculateCharacterCount,
  detectEncoding,
  validateTemplate
} from '../utils/smsValidation'

function ValidationFeedback({ text, validTags }) {
  if (!text) return null

  const charCount = calculateCharacterCount(text)
  const { encoding, limit } = detectEncoding(text)
  const issues = validateTemplate(text, validTags)

  const countClass =
    charCount > limit
      ? 'count-error'
      : charCount > limit * 0.9
      ? 'count-warning'
      : 'count-ok'

  return (
    <div className="validation-feedback">
      <div className="character-count">
        <span className={`count-text ${countClass}`}>
          {charCount}/{limit} characters
        </span>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          {encoding}
        </span>
      </div>

      {issues.length > 0 && (
        <ul className="warning-list">
          {issues.map((issue, index) => (
            <li key={index} className={issue.type}>
              {issue.type === 'error' ? '❌' : '⚠️'} {issue.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ValidationFeedback
