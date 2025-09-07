/**
 * User Verification System
 * Detects user type to personalize the experience and convert everyone to clients
 */

interface VerificationResult {
  userType: 'owner' | 'competitor_researching' | 'potential_client' | 'unknown'
  confidence: number
  reason: string
  suggestedApproach: string
}

/**
 * Verify if the user is the actual business owner
 */
export function verifyUserIdentity(
  userName: string | undefined,
  userEmail: string | undefined,
  scrapedData: {
    ownerName?: string
    businessName?: string
    contactEmail?: string
    teamMembers?: string[]
    domain?: string
  }
): VerificationResult {
  
  // No user data provided
  if (!userName && !userEmail) {
    return {
      userType: 'unknown',
      confidence: 0,
      reason: 'No user identification provided',
      suggestedApproach: 'Gather more information through conversation'
    }
  }
  
  // Check for owner match
  if (userName && scrapedData.ownerName) {
    const nameMatch = calculateNameSimilarity(userName, scrapedData.ownerName)
    if (nameMatch > 0.8) {
      return {
        userType: 'owner',
        confidence: nameMatch,
        reason: `Name matches owner: ${scrapedData.ownerName}`,
        suggestedApproach: 'Provide full analysis and actionable insights'
      }
    }
  }
  
  // Check email domain match
  if (userEmail && scrapedData.domain) {
    const emailDomain = userEmail.split('@')[1]
    if (emailDomain === scrapedData.domain) {
      return {
        userType: 'owner',
        confidence: 0.9,
        reason: 'Email domain matches business domain',
        suggestedApproach: 'Likely team member - provide helpful insights'
      }
    }
  }
  
  // Check for team member
  if (userName && scrapedData.teamMembers) {
    for (const member of scrapedData.teamMembers) {
      if (calculateNameSimilarity(userName, member) > 0.8) {
        return {
          userType: 'owner',
          confidence: 0.85,
          reason: `Matches team member: ${member}`,
          suggestedApproach: 'Team member verified - provide full support'
        }
      }
    }
  }
  
  // Competitor researching their competition - they're a potential client!
  const competitorSignals = detectCompetitorSignals(userName, userEmail, scrapedData)
  if (competitorSignals.isCompetitor) {
    return {
      userType: 'competitor_researching',
      confidence: competitorSignals.confidence,
      reason: competitorSignals.reason,
      suggestedApproach: 'WOW them with insights - they could become our client!'
    }
  }
  
  return {
    userType: 'unknown',
    confidence: 0.3,
    reason: 'Could not verify identity',
    suggestedApproach: 'Gather more information before providing detailed insights'
  }
}

/**
 * Detect if user might be a competitor
 */
function detectCompetitorSignals(
  userName: string | undefined,
  userEmail: string | undefined,
  scrapedData: any
): { isCompetitor: boolean; confidence: number; reason: string } {
  
  const signals: string[] = []
  let confidenceScore = 0
  
  // Check for competitor domain in email
  if (userEmail) {
    const competitorDomains = [
      'competitor', 'rival', 'agency', 'marketing', 'seo', 'digital'
    ]
    const emailDomain = userEmail.split('@')[1]?.toLowerCase() || ''
    
    if (competitorDomains.some(comp => emailDomain.includes(comp))) {
      signals.push('Suspicious email domain')
      confidenceScore += 0.3
    }
    
    // Check if email domain is from same industry but different business
    if (scrapedData.businessType && emailDomain.includes(scrapedData.businessType.toLowerCase())) {
      if (emailDomain !== scrapedData.domain) {
        signals.push('Email from similar business')
        confidenceScore += 0.5
      }
    }
  }
  
  // Check for generic/fake names
  if (userName) {
    const genericNames = ['test', 'admin', 'user', 'demo', 'john doe', 'jane doe']
    if (genericNames.some(generic => userName.toLowerCase().includes(generic))) {
      signals.push('Generic or test name')
      confidenceScore += 0.4
    }
  }
  
  // Check conversation patterns (would be enhanced with actual conversation analysis)
  // This would analyze if they're asking competitive intelligence questions
  
  return {
    isCompetitor: confidenceScore > 0.5,
    confidence: Math.min(confidenceScore, 0.9),
    reason: signals.join(', ') || 'No competitor signals detected'
  }
}

/**
 * Calculate similarity between two names
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  // Normalize names
  const n1 = name1.toLowerCase().trim().replace(/[^a-z ]/g, '')
  const n2 = name2.toLowerCase().trim().replace(/[^a-z ]/g, '')
  
  // Exact match
  if (n1 === n2) return 1
  
  // Check if one contains the other (e.g., "John" in "John Smith")
  if (n1.includes(n2) || n2.includes(n1)) return 0.85
  
  // Check last name match (assuming format "First Last")
  const parts1 = n1.split(' ')
  const parts2 = n2.split(' ')
  if (parts1.length > 1 && parts2.length > 1) {
    if (parts1[parts1.length - 1] === parts2[parts2.length - 1]) {
      return 0.75
    }
  }
  
  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(n1, n2)
  const maxLength = Math.max(n1.length, n2.length)
  const similarity = 1 - (distance / maxLength)
  
  return similarity
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Get conversation strategy based on user type
 */
export function getConversationStrategy(verification: VerificationResult): {
  tone: string
  disclosure: 'full' | 'partial' | 'minimal'
  objectives: string[]
  warnings: string[]
} {
  switch (verification.userType) {
    case 'owner':
      return {
        tone: 'Collaborative and supportive - we are here to help YOUR business',
        disclosure: 'full',
        objectives: [
          'Provide maximum value and insights',
          'Build trust for long-term relationship',
          'Demonstrate our expertise',
          'Gather information for better analysis'
        ],
        warnings: []
      }
      
    case 'competitor_researching':
      return {
        tone: 'Super helpful and impressive - show them why they should work with us!',
        disclosure: 'full',
        objectives: [
          'WOW them with deep insights about their competitor',
          'Show our expertise and knowledge',
          'Demonstrate value they cannot get elsewhere',
          'Plant the seed: Imagine what we could do for YOUR business',
          'Position ourselves as the obvious choice for their marketing'
        ],
        warnings: []
      }
      
    case 'unknown':
    default:
      return {
        tone: 'Friendly but investigative - gather more information',
        disclosure: 'partial',
        objectives: [
          'Identify who they are',
          'Understand their relationship to the business',
          'Provide value while protecting insights',
          'Build trust gradually'
        ],
        warnings: [
          'Verify identity before sharing sensitive insights',
          'Ask qualifying questions naturally'
        ]
      }
  }
}