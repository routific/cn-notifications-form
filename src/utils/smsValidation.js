// GSM-7 character set
const GSM7_BASIC = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'
const GSM7_EXTENDED = '\\^{}\\[~\\]|€'

// Check if a character is in GSM-7 encoding
function isGSM7Character(char) {
  return GSM7_BASIC.includes(char) || GSM7_EXTENDED.includes(char)
}

// Detect which encoding the message uses
export function detectEncoding(text) {
  if (!text) return { encoding: 'GSM-7', limit: 160 }

  for (let char of text) {
    if (!isGSM7Character(char)) {
      return { encoding: 'UCS-2', limit: 70 }
    }
  }

  return { encoding: 'GSM-7', limit: 160 }
}

// Find characters that force UCS-2 encoding
export function findNonGSM7Characters(text) {
  if (!text) return []

  const nonGSM7Chars = new Set()
  for (let char of text) {
    if (!isGSM7Character(char)) {
      nonGSM7Chars.add(char)
    }
  }

  return Array.from(nonGSM7Chars)
}

// Calculate character count for SMS
export function calculateCharacterCount(text) {
  if (!text) return 0

  const { encoding } = detectEncoding(text)

  if (encoding === 'GSM-7') {
    let count = 0
    for (let char of text) {
      count += GSM7_EXTENDED.includes(char) ? 2 : 1
    }
    return count
  }

  return text.length
}

// SHAFT-C compliance keywords (Sex, Hate, Alcohol, Firearms, Tobacco, Cannabis)
const SHAFT_KEYWORDS = {
  sex: [
    'sex', 'xxx', 'adult', 'nude', 'porn', 'escort', 'dating', 'hookup', 'erotic',
    'sexy', 'nsfw', 'strip', 'stripper', 'prostitut', 'webcam', 'fetish', 'sexual',
    'playboy', 'pleasure', 'seduct', 'explicit', 'x-rated', 'obscene', 'horny'
  ],
  hate: [
    'hate', 'kill', 'racist', 'slur', 'violence', 'threat', 'attack', 'terroris',
    'murder', 'assault', 'abuse', 'harm', 'discriminat', 'extremis', 'radical',
    'hostile', 'enemy', 'destroy', 'annihilat', 'eradicat', 'genocide'
  ],
  alcohol: [
    'alcohol', 'beer', 'wine', 'liquor', 'vodka', 'whiskey', 'drunk', 'booze',
    'champagne', 'cocktail', 'tequila', 'rum', 'gin', 'bourbon', 'scotch',
    'brew', 'brewery', 'winery', 'distillery', 'spirits', 'ale', 'lager',
    'intoxicat', 'inebriat', 'tipsy', 'wasted', 'hammered', 'pub', 'bar drink'
  ],
  firearms: [
    'gun', 'firearm', 'weapon', 'ammo', 'rifle', 'pistol', 'shoot',
    'shotgun', 'revolver', 'handgun', 'assault rifle', 'ak-47', 'ar-15',
    'bullet', 'ammunition', 'trigger', 'firearms', 'armed', 'gunshot'
  ],
  tobacco: [
    'tobacco', 'cigarette', 'vape', 'smoking', 'nicotine', 'cigar',
    'e-cig', 'juul', 'pod', 'vaping', 'smoke', 'lighter', 'ash',
    'marlboro', 'camel', 'newport', 'menthol', 'hookah', 'shisha'
  ],
  cannabis: [
    'cannabis', 'marijuana', 'weed', 'pot', 'thc', 'cbd', 'hemp',
    'ganja', 'bud', 'dank', 'kush', 'hash', 'joint', 'blunt',
    'edible', 'dispensary', 'stoner', 'high', 'stoned', 'blazing',
    'mary jane', 'reefer', 'grass', '420', 'cannabinoid', 'indica',
    'sativa', 'dab', 'vape pen', 'cartridge', 'concentrate'
  ]
}

// Check for SHAFT violations
export function checkSHAFTCompliance(text) {
  if (!text) return []

  const violations = []
  const lowerText = text.toLowerCase()

  for (let [category, keywords] of Object.entries(SHAFT_KEYWORDS)) {
    for (let keyword of keywords) {
      if (lowerText.includes(keyword)) {
        violations.push({
          category: category.toUpperCase(),
          keyword,
          type: 'SHAFT'
        })
      }
    }
  }

  return violations
}

// Check for URLs
export function checkForURLs(text) {
  if (!text) return []

  const urlPatterns = [
    /https?:\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /[^\s]+\.(com|net|org|io|co|gov|edu)[^\s]*/gi
  ]

  const urls = []
  for (let pattern of urlPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      urls.push(...matches)
    }
  }

  return [...new Set(urls)]
}

// Check for phone numbers
export function checkForPhoneNumbers(text) {
  if (!text) return []

  const phonePatterns = [
    /\(\d{3}\)\s*\d{3}-\d{4}/g,
    /\d{3}-\d{3}-\d{4}/g,
    /\+\d{10,}/g,
    /\d{10,}/g
  ]

  const phones = []
  for (let pattern of phonePatterns) {
    const matches = text.match(pattern)
    if (matches) {
      phones.push(...matches)
    }
  }

  return [...new Set(phones)]
}

// Check for excessive caps
export function checkExcessiveCaps(text) {
  if (!text || text.length < 10) return false

  const letters = text.replace(/[^a-zA-Z]/g, '')
  if (letters.length === 0) return false

  const upperCount = text.replace(/[^A-Z]/g, '').length
  const ratio = upperCount / letters.length

  return ratio > 0.5
}

// Check for invalid tags
export function checkInvalidTags(text, validTags) {
  if (!text) return []

  const tagPattern = /\{[^}]+\}/g
  const foundTags = text.match(tagPattern) || []

  const invalidTags = foundTags.filter(tag => !validTags.includes(tag))

  return invalidTags
}

// Calculate compliance score
export function calculateComplianceScore(text, validTags) {
  if (!text) return 0

  let score = 0

  // Character count within limit (+30 pts)
  const charCount = calculateCharacterCount(text)
  const { limit } = detectEncoding(text)
  if (charCount <= limit) {
    score += 30
  }

  // No encoding issues (+20 pts)
  const { encoding } = detectEncoding(text)
  if (encoding === 'GSM-7') {
    score += 20
  }

  // No SHAFT keywords (+30 pts)
  const shaftViolations = checkSHAFTCompliance(text)
  if (shaftViolations.length === 0) {
    score += 30
  }

  // No URLs (+10 pts)
  const urls = checkForURLs(text)
  if (urls.length === 0) {
    score += 10
  }

  // Valid tags only (+10 pts)
  const invalidTags = checkInvalidTags(text, validTags)
  if (invalidTags.length === 0) {
    score += 10
  }

  return score
}

// Get score guidance
export function getScoreGuidance(score) {
  if (score >= 90) {
    return {
      level: 'excellent',
      message: 'Looks great! Likely to be approved quickly.'
    }
  } else if (score >= 70) {
    return {
      level: 'good',
      message: 'Minor issues. Review flagged items.'
    }
  } else {
    return {
      level: 'poor',
      message: 'Needs revision. Please address flagged content.'
    }
  }
}

// Get all validation issues
export function validateTemplate(text, validTags) {
  const issues = []

  // Character count
  const charCount = calculateCharacterCount(text)
  const { encoding, limit } = detectEncoding(text)

  if (charCount > limit) {
    issues.push({
      type: 'error',
      message: `Message exceeds ${limit} character limit (${charCount}/${limit})`
    })
  }

  // Encoding warning
  if (encoding === 'UCS-2') {
    const nonGSM7 = findNonGSM7Characters(text)
    issues.push({
      type: 'warning',
      message: `Special characters detected (${nonGSM7.join(', ')}) - reduced to 70 char limit`
    })
  }

  // SHAFT violations
  const shaftViolations = checkSHAFTCompliance(text)
  shaftViolations.forEach(violation => {
    issues.push({
      type: 'error',
      message: `SHAFT violation (${violation.category}): contains "${violation.keyword}"`
    })
  })

  // URLs
  const urls = checkForURLs(text)
  if (urls.length > 0) {
    issues.push({
      type: 'warning',
      message: 'URLs may reduce deliverability. Consider removing.'
    })
  }

  // Phone numbers
  const phones = checkForPhoneNumbers(text)
  if (phones.length > 0) {
    issues.push({
      type: 'warning',
      message: 'Phone numbers may trigger spam filters.'
    })
  }

  // Excessive caps
  if (checkExcessiveCaps(text)) {
    issues.push({
      type: 'warning',
      message: 'Excessive capitalization looks spammy.'
    })
  }

  // Invalid tags
  const invalidTags = checkInvalidTags(text, validTags)
  if (invalidTags.length > 0) {
    issues.push({
      type: 'error',
      message: `Unrecognized tags: ${invalidTags.join(', ')}`
    })
  }

  return issues
}
