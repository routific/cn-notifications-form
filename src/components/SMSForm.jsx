import React, { useState } from 'react'
import EmailInput from './EmailInput'
import TemplateSection from './TemplateSection'
import ValidationFeedback from './ValidationFeedback'
import SuccessMessage from './SuccessMessage'
import LoadingSpinner from './LoadingSpinner'
import { TEMPLATE_TYPES } from '../utils/templateConfig'
import {
  calculateComplianceScore,
  validateTemplate
} from '../utils/smsValidation'

function SMSForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [templates, setTemplates] = useState({
    delivery_scheduled: '',
    out_for_delivery: '',
    delivery_completed: '',
    delivery_missed: ''
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

  const handleTemplateChange = (templateId, value) => {
    setTemplates((prev) => ({
      ...prev,
      [templateId]: value
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

    const customizedTemplates = Object.entries(templates).filter(
      ([id, content]) => {
        const templateConfig = Object.values(TEMPLATE_TYPES).find(
          (t) => t.id === id
        )
        return content && content !== templateConfig?.defaultTemplate
      }
    )

    if (customizedTemplates.length === 0) {
      setSubmitError('Please customize at least one template')
      return
    }

    setIsSubmitting(true)

    try {
      const templatesData = customizedTemplates.map(([id, content]) => {
        const templateConfig = Object.values(TEMPLATE_TYPES).find(
          (t) => t.id === id
        )
        // Remove [link] from content as it's automatically appended by backend
        const sanitizedContent = content.replace(/\[link\]/gi, '').trim()
        const score = calculateComplianceScore(sanitizedContent, templateConfig.tags)
        const issues = validateTemplate(sanitizedContent, templateConfig.tags)

        return {
          name: templateConfig.title,
          content: sanitizedContent,
          score,
          issues
        }
      })

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          type: 'sms',
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
    setTemplates({
      delivery_scheduled: '',
      out_for_delivery: '',
      delivery_completed: '',
      delivery_missed: ''
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
          📱
        </div>
        <h1>Customize SMS Notifications</h1>
        <p>
          Create personalized delivery notification messages that match your brand voice.
          Our real-time validation ensures compliance with SMS regulations.
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
            Customize one or more SMS templates below. Each message will be validated in real-time
            for character limits, encoding, and compliance. Our team will review your submission
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

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            marginBottom: '1.5rem',
            color: 'var(--routific-dark)',
            fontSize: '1.25rem',
            fontWeight: 700
          }}>
            SMS Templates
          </h3>

          {Object.values(TEMPLATE_TYPES).map((template) => {
            const value = templates[template.id]
            const displayValue = value || template.defaultTemplate

            return (
              <TemplateSection
                key={template.id}
                template={template}
                value={value}
                onChange={(newValue) =>
                  handleTemplateChange(template.id, newValue)
                }
                validationFeedback={
                  <ValidationFeedback
                    text={displayValue}
                    validTags={template.tags}
                  />
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

export default SMSForm
