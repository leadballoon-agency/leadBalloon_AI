/**
 * User Knowledge Base System
 * Tracks everything we learn about each lead for intelligent follow-up
 */

export interface UserProfile {
  // Basic Info
  id: string
  email: string
  name: string
  phone?: string
  website: string
  domain: string
  
  // Business Intelligence
  businessType: string
  businessDescription: string
  mainChallenge: string
  competitors?: string[]
  
  // Financial Qualification
  currentAdSpend?: string
  budgetRange?: string
  customerLifetimeValue?: string
  currentCostPerLead?: string
  monthlyRevenue?: string
  
  // Pain Points & Goals
  painPoints: string[]
  goals: string[]
  timeline?: string
  urgencyLevel?: 'low' | 'medium' | 'high' | 'immediate'
  
  // Marketing Maturity
  marketingChannels: string[]
  hasWebsite: boolean
  hasFacebookAds: boolean
  hasGoogleAds: boolean
  hasEmailMarketing: boolean
  conversionRate?: string
  
  // Conversation History
  conversations: ConversationEntry[]
  questionsAnswered: string[]
  questionsSkipped: string[]
  
  // Analysis Results
  analysisResults?: {
    quickWins: any[]
    competitorInsights: string
    pricingOpportunity: string
    recommendedStrategy: string
  }
  
  // Engagement Metrics
  firstSeen: Date
  lastSeen: Date
  totalTimeSpent: number // seconds
  pagesViewed: string[]
  returningVisitor: boolean
  
  // Lead Scoring
  leadScore: number // 0-100
  leadTemperature: 'cold' | 'warm' | 'hot' | 'on-fire'
  readyToBuy: boolean
  
  // Follow-up Intelligence
  bestTimeToContact?: string
  preferredChannel?: 'email' | 'phone' | 'whatsapp'
  personalNotes: string[]
  triggers: string[] // What would make them buy
  objections: string[] // What's holding them back
  
  // Tags & Segments
  tags: string[]
  segment?: string
  persona?: string
}

export interface ConversationEntry {
  timestamp: Date
  question: string
  answer: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  extractedData?: Record<string, any>
}

/**
 * Calculate lead score based on all data points
 */
export function calculateLeadScore(profile: Partial<UserProfile>): number {
  let score = 0
  
  // Budget indicators (30 points max)
  if (profile.currentAdSpend) {
    const spend = parseInt(profile.currentAdSpend.replace(/[^0-9]/g, ''))
    if (spend > 5000) score += 30
    else if (spend > 2000) score += 20
    else if (spend > 500) score += 10
    else score += 5
  }
  
  // Pain level (20 points max)
  if (profile.urgencyLevel === 'immediate') score += 20
  else if (profile.urgencyLevel === 'high') score += 15
  else if (profile.urgencyLevel === 'medium') score += 10
  else if (profile.urgencyLevel === 'low') score += 5
  
  // Engagement (20 points max)
  if (profile.conversations && profile.conversations.length > 5) score += 20
  else if (profile.conversations && profile.conversations.length > 3) score += 15
  else if (profile.conversations && profile.conversations.length > 1) score += 10
  
  // Contact info completeness (15 points max)
  if (profile.email) score += 5
  if (profile.phone) score += 5
  if (profile.name) score += 5
  
  // Business maturity (15 points max)
  if (profile.hasWebsite) score += 5
  if (profile.hasFacebookAds) score += 5
  if (profile.hasGoogleAds) score += 5
  
  return Math.min(score, 100)
}

/**
 * Determine lead temperature
 */
export function getLeadTemperature(score: number): UserProfile['leadTemperature'] {
  if (score >= 80) return 'on-fire'
  if (score >= 60) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}

/**
 * Generate follow-up strategy based on profile
 */
export function generateFollowUpStrategy(profile: UserProfile): FollowUpStrategy {
  const strategy: FollowUpStrategy = {
    sequence: [],
    firstTouchDelay: '5 minutes',
    tone: 'friendly',
    angle: 'value-first'
  }
  
  // Immediate follow-up for hot leads
  if (profile.leadTemperature === 'on-fire') {
    strategy.sequence = [
      {
        type: 'email',
        delay: '5 minutes',
        template: 'immediate-value',
        subject: `${profile.name}, your ${profile.businessType} analysis is ready (3 quick wins inside)`
      },
      {
        type: 'phone',
        delay: '1 hour',
        script: 'discovery-call',
        note: 'Reference their main challenge and the specific solution'
      },
      {
        type: 'email',
        delay: '1 day',
        template: 'case-study',
        subject: `How ${profile.businessType} businesses like yours get ${profile.goals[0]}`
      }
    ]
  }
  
  // Nurture sequence for warm leads
  else if (profile.leadTemperature === 'hot' || profile.leadTemperature === 'warm') {
    strategy.sequence = [
      {
        type: 'email',
        delay: '30 minutes',
        template: 'analysis-results',
        subject: `${profile.name}, found 3 issues costing you customers`
      },
      {
        type: 'email',
        delay: '2 days',
        template: 'competitor-intel',
        subject: 'What your competitors don't want you to know'
      },
      {
        type: 'email',
        delay: '4 days',
        template: 'success-story',
        subject: `${profile.businessType} went from ${profile.currentCostPerLead} to £15 per lead (case study)`
      }
    ]
  }
  
  // Long-term nurture for cold leads
  else {
    strategy.sequence = [
      {
        type: 'email',
        delay: '1 day',
        template: 'educational',
        subject: '5 mistakes every ${profile.businessType} makes with Facebook ads'
      },
      {
        type: 'email',
        delay: '1 week',
        template: 'free-resource',
        subject: 'Free: ${profile.businessType} Facebook Ad templates (just released)'
      }
    ]
  }
  
  return strategy
}

interface FollowUpStrategy {
  sequence: FollowUpStep[]
  firstTouchDelay: string
  tone: string
  angle: string
}

interface FollowUpStep {
  type: 'email' | 'phone' | 'sms' | 'whatsapp'
  delay: string
  template: string
  subject?: string
  script?: string
  note?: string
}

/**
 * Extract data from conversation
 */
export function extractDataFromConversation(message: string): Record<string, any> {
  const extracted: Record<string, any> = {}
  
  // Extract email
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) extracted.email = emailMatch[0]
  
  // Extract phone
  const phoneMatch = message.match(/[\d\s()+-]{10,}/)
  if (phoneMatch) extracted.phone = phoneMatch[0].trim()
  
  // Extract budget/numbers
  const moneyMatch = message.match(/£[\d,]+|[\d,]+\s*(?:pounds?|gbp)/i)
  if (moneyMatch) extracted.budget = moneyMatch[0]
  
  // Extract urgency keywords
  const urgencyKeywords = ['asap', 'urgent', 'immediately', 'today', 'this week', 'now']
  if (urgencyKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
    extracted.urgency = 'high'
  }
  
  // Extract competitor mentions
  const competitorKeywords = ['competitor', 'competition', 'rival', 'alternative']
  if (competitorKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
    extracted.competitorMentioned = true
  }
  
  return extracted
}

/**
 * Smart question selector based on what we already know
 */
export function getNextSmartQuestion(profile: Partial<UserProfile>): string {
  // If we don't have their name yet
  if (!profile.name) {
    return "By the way, I'm Claude - what should I call you?"
  }
  
  // If we don't know their budget
  if (!profile.currentAdSpend && !profile.budgetRange) {
    return `${profile.name}, what's your monthly marketing budget looking like?`
  }
  
  // If we don't know their main challenge
  if (!profile.mainChallenge) {
    return `What's the biggest challenge you're facing with ${profile.businessType || 'your business'}?`
  }
  
  // If we don't have contact info
  if (!profile.email) {
    return "Where should I send the full analysis? What's your best email?"
  }
  
  if (!profile.phone) {
    return "If we find something urgent, what's the best number to reach you?"
  }
  
  // If we don't know their timeline
  if (!profile.timeline) {
    return "When are you looking to fix these issues? This month? This quarter?"
  }
  
  // If we don't know their goals
  if (!profile.goals || profile.goals.length === 0) {
    return "If I could wave a magic wand, what would success look like for you?"
  }
  
  return "Tell me more about your business..."
}

/**
 * Save user profile to database (localStorage for now, would be DB in production)
 */
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}')
    profiles[profile.id] = profile
    localStorage.setItem('userProfiles', JSON.stringify(profiles))
    
    // Log for tracking
    console.log('📊 User Profile Updated:', {
      name: profile.name,
      email: profile.email,
      leadScore: profile.leadScore,
      temperature: profile.leadTemperature,
      dataPoints: Object.keys(profile).length
    })
  }
}

/**
 * Get user profile
 */
export function getUserProfile(id: string): UserProfile | null {
  if (typeof window !== 'undefined') {
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}')
    return profiles[id] || null
  }
  return null
}

/**
 * Update profile from conversation
 */
export function updateProfileFromConversation(
  profile: Partial<UserProfile>,
  question: string,
  answer: string
): Partial<UserProfile> {
  const updated = { ...profile }
  const extracted = extractDataFromConversation(answer)
  
  // Update with extracted data
  Object.assign(updated, extracted)
  
  // Add to conversation history
  if (!updated.conversations) updated.conversations = []
  updated.conversations.push({
    timestamp: new Date(),
    question,
    answer,
    extractedData: extracted
  })
  
  // Update questions answered
  if (!updated.questionsAnswered) updated.questionsAnswered = []
  updated.questionsAnswered.push(question)
  
  // Specific field updates based on question context
  if (question.toLowerCase().includes('name')) {
    updated.name = answer.trim()
  }
  if (question.toLowerCase().includes('email')) {
    updated.email = answer.trim()
  }
  if (question.toLowerCase().includes('challenge')) {
    updated.mainChallenge = answer
  }
  if (question.toLowerCase().includes('budget') || question.toLowerCase().includes('spend')) {
    updated.currentAdSpend = answer
  }
  
  // Recalculate lead score
  updated.leadScore = calculateLeadScore(updated)
  updated.leadTemperature = getLeadTemperature(updated.leadScore)
  
  return updated
}