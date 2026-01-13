import React, { useState, useRef } from 'react'

const TEMPLATE_ICONS = {
  delivery_scheduled: '📅',
  out_for_delivery: '🚚',
  delivery_completed: '✅',
  delivery_missed: '❌'
}

function TemplateSection({
  template,
  value,
  onChange,
  onTagInsert,
  validationFeedback
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef(null)

  const isModified = value !== template.defaultTemplate
  const icon = TEMPLATE_ICONS[template.id] || '📱'

  const handleTagClick = (tag) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = value || template.defaultTemplate
    const newValue =
      currentValue.substring(0, start) +
      tag +
      currentValue.substring(end)

    onChange(newValue)

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
                (click to insert)
              </span>
            </label>
            <div className="tag-chips">
              {template.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="tag-chip"
                  onClick={() => handleTagClick(tag)}
                  title={`Click to insert ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`template-${template.id}`}>
              ✏️ Your custom message:
            </label>
            <textarea
              ref={textareaRef}
              id={`template-${template.id}`}
              value={value || template.defaultTemplate}
              onChange={(e) => onChange(e.target.value)}
              rows={5}
              placeholder={template.defaultTemplate}
            />
          </div>

          {validationFeedback}
        </div>
      )}
    </div>
  )
}

export default TemplateSection
