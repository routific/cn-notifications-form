import React, { useState, useRef } from 'react'

const TEMPLATE_ICONS = {
  delivery_scheduled: '📅',
  out_for_delivery: '🚚',
  delivery_completed: '✅',
  delivery_missed: '❌'
}

function EmailTemplateSection({
  template,
  subject,
  body,
  onSubjectChange,
  onBodyChange
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const subjectRef = useRef(null)
  const bodyRef = useRef(null)

  const isModified = subject !== template.defaultSubject || body !== template.defaultTemplate
  const icon = TEMPLATE_ICONS[template.id] || '📧'

  const handleTagClick = (tag, targetField) => {
    const textarea = targetField === 'subject' ? subjectRef.current : bodyRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = targetField === 'subject'
      ? (subject || template.defaultSubject)
      : (body || template.defaultTemplate)

    const newValue =
      currentValue.substring(0, start) +
      tag +
      currentValue.substring(end)

    if (targetField === 'subject') {
      onSubjectChange(newValue)
    } else {
      onBodyChange(newValue)
    }

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + tag.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="template-section">
      <div
        className="template-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="template-title">
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{icon}</span>
          {template.title}
        </div>
        <div className="template-status">
          {isModified ? (
            <span style={{ color: 'var(--routific-orange)' }}>✓ Customized</span>
          ) : (
            <span>{isExpanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="template-body">
          <div className="template-trigger">
            <strong>📨 When it's sent:</strong> {template.trigger}
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏷️ Available tags</span>
              <span style={{
                fontSize: '0.8125rem',
                fontWeight: 400,
                color: 'var(--routific-gray)',
                fontStyle: 'italic'
              }}>
                (click to insert into subject or body)
              </span>
            </label>
            <div className="tag-chips">
              {template.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="tag-chip"
                  onClick={() => {
                    // Insert into the last focused field, or body by default
                    const lastFocused = document.activeElement
                    const targetField = lastFocused === subjectRef.current ? 'subject' : 'body'
                    handleTagClick(tag, targetField)
                  }}
                  title={`Click to insert ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`subject-${template.id}`}>
              📌 Email Subject:
            </label>
            <input
              ref={subjectRef}
              type="text"
              id={`subject-${template.id}`}
              value={subject || template.defaultSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder={template.defaultSubject}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`body-${template.id}`}>
              ✏️ Email Body:
            </label>
            <textarea
              ref={bodyRef}
              id={`body-${template.id}`}
              value={body || template.defaultTemplate}
              onChange={(e) => onBodyChange(e.target.value)}
              rows={8}
              placeholder={template.defaultTemplate}
            />
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--routific-gray)'
          }}>
            <strong>💡 Tip:</strong> Email templates support multi-line formatting. Use line breaks to structure your message clearly.
          </div>
        </div>
      )}
    </div>
  )
}

export default EmailTemplateSection
