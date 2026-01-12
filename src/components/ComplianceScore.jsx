import React from 'react'
import { calculateComplianceScore, getScoreGuidance } from '../utils/smsValidation'

function ComplianceScore({ text, validTags }) {
  if (!text) return null

  const score = calculateComplianceScore(text, validTags)
  const guidance = getScoreGuidance(score)

  const scoreClass =
    guidance.level === 'excellent'
      ? 'score-excellent'
      : guidance.level === 'good'
      ? 'score-good'
      : 'score-poor'

  return (
    <div className="compliance-score">
      <div className="score-header">
        <span style={{ fontWeight: 600 }}>Compliance Score</span>
        <span className={`score-value ${scoreClass}`}>{score}/100</span>
      </div>
      <div className="score-guidance">{guidance.message}</div>
    </div>
  )
}

export default ComplianceScore
