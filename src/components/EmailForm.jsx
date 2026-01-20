import React, { useState } from 'react'
import EmailInput from './EmailInput'
import EmailTemplateSection from './EmailTemplateSection'
import SuccessMessage from './SuccessMessage'
import LoadingSpinner from './LoadingSpinner'
import { EMAIL_TEMPLATE_TYPES } from '../utils/emailTemplateConfig'

function EmailForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [replyTo, setReplyTo] = useState('')
  const [replyToTouched, setReplyToTouched] = useState(false)
  const [templates, setTemplates] = useState({
    delivery_scheduled: { subject: '', body: '' },
    out_for_delivery: { subject: '', body: '' },
    delivery_completed: { subject: '', body: '' },
    delivery_missed: { subject: '', body: '' }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateEmail = (email) => {
    if (!email) {
      return 'Please enter your Routific email address'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const validateReplyTo = (replyTo) => {
    if (!replyTo) {
      return ''  // Optional field
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(replyTo)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const handleTemplateChange = (templateId, field, value) => {
    setTemplates((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const emailError = validateEmail(email)
    if (emailError) {
      setEmailTouched(true)
      return
    }

    const replyToError = validateReplyTo(replyTo)
    if (replyToError) {
      setReplyToTouched(true)
      return
    }

    const customizedTemplates = Object.entries(templates).filter(
      ([id, data]) => {
        const templateConfig = Object.values(EMAIL_TEMPLATE_TYPES).find(
          (t) => t.id === id
        )
        return (
          (data.subject && data.subject !== templateConfig?.defaultSubject) ||
          (data.body && data.body !== templateConfig?.defaultTemplate)
        )
      }
    )

    if (customizedTemplates.length === 0) {
      setSubmitError('Please customize at least one email template')
      return
    }

    setIsSubmitting(true)

    try {
      const templatesData = customizedTemplates.map(([id, data]) => {
        const templateConfig = Object.values(EMAIL_TEMPLATE_TYPES).find(
          (t) => t.id === id
        )

        return {
          name: templateConfig.title,
          subject: data.subject || templateConfig.defaultSubject,
          content: data.body || templateConfig.defaultTemplate
        }
      })

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          replyTo: replyTo || undefined,
          type: 'email',
          templates: templatesData
        })
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setIsSuccess(true)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setEmail('')
    setEmailTouched(false)
    setReplyTo('')
    setReplyToTouched(false)
    setTemplates({
      delivery_scheduled: { subject: '', body: '' },
      out_for_delivery: { subject: '', body: '' },
      delivery_completed: { subject: '', body: '' },
      delivery_missed: { subject: '', body: '' }
    })
    setIsSuccess(false)
    setSubmitError('')
  }

  if (isSuccess) {
    return (
      <div className="container">
        <SuccessMessage onReset={handleReset} />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          📧
        </div>
        <h1>Customize Email Notifications</h1>
        <p>
          Create personalized email delivery notifications that match your brand voice.
          Customize subject lines, message content, and reply-to addresses.
        </p>
        <div style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          Powered by
          <img
            src="https://cdn.prod.website-files.com/637d4a05b569ec2beeefbec0/64ed04f3fe0cead395e589f8_routific-logo-on-dark.svg"
            alt="Routific"
            style={{ height: '20px' }}
          />
        </div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="intro-text">
          <h3>How It Works</h3>
          <p>
            Customize one or more email templates below. Our team will review your submission
            within 1-2 business days.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{
            marginBottom: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--routific-gray-light)',
            borderRadius: '8px',
            color: 'var(--routific-dark)',
            cursor: 'pointer',
            fontSize: '0.9375rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          ← Back to notification type selection
        </button>

        <EmailInput
          value={email}
          onChange={setEmail}
          onBlur={() => setEmailTouched(true)}
          touched={emailTouched}
          error={validateEmail(email)}
        />

        <div className="form-group">
          <label htmlFor="reply-to">
            📮 Reply-To Email Address (Optional)
          </label>
          <input
            type="email"
            id="reply-to"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            onBlur={() => setReplyToTouched(true)}
            className={replyToTouched && validateReplyTo(replyTo) ? 'error' : ''}
            placeholder="support@yourcompany.com"
          />
          {replyToTouched && validateReplyTo(replyTo) && (
            <div className="error-message">
              {validateReplyTo(replyTo)}
            </div>
          )}
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--routific-gray)'
          }}>
            Set a custom reply-to address for all email notifications sent from your account.
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            marginBottom: '1.5rem',
            color: 'var(--routific-dark)',
            fontSize: '1.25rem',
            fontWeight: 700
          }}>
            Email Templates
          </h3>

          {Object.values(EMAIL_TEMPLATE_TYPES).map((template) => {
            const templateData = templates[template.id]

            return (
              <EmailTemplateSection
                key={template.id}
                template={template}
                subject={templateData.subject}
                body={templateData.body}
                onSubjectChange={(value) =>
                  handleTemplateChange(template.id, 'subject', value)
                }
                onBodyChange={(value) =>
                  handleTemplateChange(template.id, 'body', value)
                }
              />
            )
          })}
        </div>

        {submitError && (
          <div className="error-message" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--error-red-light)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--error-red)'
          }}>
            ⚠️ {submitError}
          </div>
        )}

        <div className="submit-section">
          <button
            type="submit"
            className="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner /> Submitting...
              </>
            ) : (
              'Submit for Review'
            )}
          </button>
          <div className="footer-note">
            By submitting, you agree that these templates will be reviewed by our team
            before being activated on your account.
          </div>
        </div>
      </form>
    </div>
  )
}

export default EmailForm
