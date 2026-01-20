import React from 'react'

function NotificationTypeSelector({ onSelect }) {
  return (
    <div className="container">
      <div className="header">
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          📬
        </div>
        <h1>Customize Your Notifications</h1>
        <p>
          Create personalized delivery notification messages that match your brand voice.
          Choose the type of notification you'd like to customize.
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

      <div className="form-container">
        <div className="intro-text">
          <h3>Select Notification Type</h3>
          <p style={{ marginBottom: '2rem' }}>
            Choose <strong>one</strong> notification type to customize. You can submit templates for either SMS or Email notifications.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <button
            type="button"
            onClick={() => onSelect('sms')}
            style={{
              padding: '2rem',
              backgroundColor: 'white',
              border: '2px solid var(--routific-gray-light)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--routific-orange)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--routific-gray-light)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📱</div>
            <h3 style={{
              color: 'var(--routific-dark)',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
              fontWeight: 700
            }}>
              SMS Templates
            </h3>
            <p style={{
              color: 'var(--routific-gray)',
              fontSize: '0.9375rem',
              lineHeight: '1.5',
              margin: 0
            }}>
              Customize text message notifications sent to your customers' mobile devices
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelect('email')}
            style={{
              padding: '2rem',
              backgroundColor: 'white',
              border: '2px solid var(--routific-gray-light)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--routific-orange)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--routific-gray-light)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📧</div>
            <h3 style={{
              color: 'var(--routific-dark)',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
              fontWeight: 700
            }}>
              Email Templates
            </h3>
            <p style={{
              color: 'var(--routific-gray)',
              fontSize: '0.9375rem',
              lineHeight: '1.5',
              margin: 0
            }}>
              Customize email notifications with custom subject lines and reply-to addresses
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationTypeSelector
