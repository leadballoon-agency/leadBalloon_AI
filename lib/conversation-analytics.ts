/**
 * Conversation Analytics System
 * Track, analyze, and improve Claude's waiting room conversations
 */

export interface ConversationSession {
  id: string
  timestamp: Date
  url: string
  domain: string
  businessType: string
  
  // Conversation Metrics
  duration: number // seconds
  messageCount: number
  userResponseTime: number[] // avg time to respond
  claudeResponseTime: number[] // should be instant
  
  // Quality Metrics
  questionsAsked: string[]
  questionsAnswered: string[]
  questionsSkipped: string[]
  informationExtracted: Record<string, any>
  
  // Engagement Metrics
  userEngagementScore: number // 0-100
  conversationFlow: 'smooth' | 'choppy' | 'abandoned'
  dropOffPoint?: string // where they stopped responding
  
  // Intelligence Gathered
  leadData: {
    name?: string
    email?: string
    phone?: string
    role?: string
    businessProblem?: string
    budget?: string
    timeline?: string
    currentSolution?: string
    decisionMaker?: boolean
  }
  
  // Educational Value
  insightsShared: string[]
  mistakesCorrected: string[] // wrong assumptions we made
  valueProvided: string[]
  
  // Conversion Metrics
  emailCaptured: boolean
  phoneCaptured: boolean
  bookingRequested: boolean
  reportRequested: boolean
  
  // Full Transcript
  transcript: Message[]
  
  // Analysis Summary
  summary: ConversationSummary
}

export interface Message {
  timestamp: Date
  speaker: 'claude' | 'user' | 'system'
  message: string
  messageType?: 'question' | 'answer' | 'statement' | 'education'
  multipleChoice?: string[]
  userChoice?: string
}

export interface ConversationSummary {
  // What Worked
  successfulTactics: string[]
  goodQuestions: string[]
  smoothTransitions: string[]
  
  // What Failed  
  mistakes: string[]
  awkwardMoments: string[]
  missedOpportunities: string[]
  
  // Key Insights
  businessInsights: string[]
  competitorMentions: string[]
  painPoints: string[]
  goals: string[]
  
  // Recommendations
  followUpStrategy: string
  leadTemperature: 'cold' | 'warm' | 'hot'
  nextBestAction: string
  personalNotes: string[]
}

/**
 * Analyze conversation quality
 */
export function analyzeConversation(session: ConversationSession): ConversationAnalysis {
  const analysis: ConversationAnalysis = {
    qualityScore: 0,
    dataCompleteness: 0,
    engagementLevel: '',
    recommendations: [],
    patterns: []
  }
  
  // Calculate quality score
  let score = 0
  
  // Data capture points (40%)
  if (session.leadData.name) score += 5
  if (session.leadData.email) score += 10
  if (session.leadData.phone) score += 10
  if (session.leadData.businessProblem) score += 5
  if (session.leadData.budget) score += 5
  if (session.leadData.timeline) score += 5
  
  // Engagement points (30%)
  if (session.messageCount > 10) score += 10
  if (session.messageCount > 5) score += 10
  else if (session.messageCount > 3) score += 5
  if (session.conversationFlow === 'smooth') score += 10
  
  // Value provided (20%)
  if (session.insightsShared.length > 2) score += 10
  if (session.insightsShared.length > 0) score += 10
  
  // No mistakes (10%)
  if (session.summary.mistakes.length === 0) score += 10
  else if (session.summary.mistakes.length < 2) score += 5
  
  analysis.qualityScore = score
  
  // Data completeness
  const dataFields = Object.keys(session.leadData).filter(key => session.leadData[key])
  analysis.dataCompleteness = (dataFields.length / 9) * 100
  
  // Engagement level
  if (session.userEngagementScore > 70) {
    analysis.engagementLevel = 'High - User was actively engaged'
  } else if (session.userEngagementScore > 40) {
    analysis.engagementLevel = 'Medium - Some engagement but could improve'
  } else {
    analysis.engagementLevel = 'Low - User was not very responsive'
  }
  
  // Generate recommendations
  if (!session.leadData.email) {
    analysis.recommendations.push('Failed to capture email - ask earlier in conversation')
  }
  if (session.summary.mistakes.length > 0) {
    analysis.recommendations.push(`Fix these mistakes: ${session.summary.mistakes.join(', ')}`)
  }
  if (session.questionsSkipped.length > 2) {
    analysis.recommendations.push('Too many questions ignored - be more engaging')
  }
  
  // Identify patterns
  analysis.patterns = identifyPatterns([session])
  
  return analysis
}

/**
 * Identify patterns across multiple conversations
 */
export function identifyPatterns(sessions: ConversationSession[]): string[] {
  const patterns: string[] = []
  
  // Common drop-off points
  const dropOffPoints = sessions
    .filter(s => s.dropOffPoint)
    .map(s => s.dropOffPoint)
  
  const mostCommonDropOff = getMostFrequent(dropOffPoints)
  if (mostCommonDropOff) {
    patterns.push(`Users often stop responding after: "${mostCommonDropOff}"`)
  }
  
  // Questions that get answered most
  const answeredQuestions = sessions.flatMap(s => s.questionsAnswered)
  const topAnswered = getTopItems(answeredQuestions, 3)
  if (topAnswered.length > 0) {
    patterns.push(`Questions that work: ${topAnswered.join(', ')}`)
  }
  
  // Questions that get skipped
  const skippedQuestions = sessions.flatMap(s => s.questionsSkipped)
  const topSkipped = getTopItems(skippedQuestions, 3)
  if (topSkipped.length > 0) {
    patterns.push(`Questions to avoid: ${topSkipped.join(', ')}`)
  }
  
  // Average engagement by business type
  const typeEngagement: Record<string, number[]> = {}
  sessions.forEach(s => {
    if (!typeEngagement[s.businessType]) typeEngagement[s.businessType] = []
    typeEngagement[s.businessType].push(s.userEngagementScore)
  })
  
  Object.entries(typeEngagement).forEach(([type, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    patterns.push(`${type} businesses: ${avg.toFixed(0)}% avg engagement`)
  })
  
  return patterns
}

/**
 * Generate conversation report
 */
export function generateConversationReport(sessions: ConversationSession[]): ConversationReport {
  const report: ConversationReport = {
    period: 'Last 7 days',
    totalConversations: sessions.length,
    avgQualityScore: 0,
    avgDataCompleteness: 0,
    conversionMetrics: {
      emailCaptureRate: 0,
      phoneCaptureRate: 0,
      bookingRequestRate: 0
    },
    topMistakes: [],
    topSuccesses: [],
    recommendations: []
  }
  
  // Calculate averages
  const qualityScores = sessions.map(s => analyzeConversation(s).qualityScore)
  report.avgQualityScore = qualityScores.reduce((a, b) => a + b, 0) / sessions.length
  
  const dataScores = sessions.map(s => analyzeConversation(s).dataCompleteness)
  report.avgDataCompleteness = dataScores.reduce((a, b) => a + b, 0) / sessions.length
  
  // Conversion metrics
  const emailCaptures = sessions.filter(s => s.emailCaptured).length
  report.conversionMetrics.emailCaptureRate = (emailCaptures / sessions.length) * 100
  
  const phoneCaptures = sessions.filter(s => s.phoneCaptured).length
  report.conversionMetrics.phoneCaptureRate = (phoneCaptures / sessions.length) * 100
  
  const bookings = sessions.filter(s => s.bookingRequested).length
  report.conversionMetrics.bookingRequestRate = (bookings / sessions.length) * 100
  
  // Top mistakes and successes
  const allMistakes = sessions.flatMap(s => s.summary.mistakes)
  report.topMistakes = getTopItems(allMistakes, 5)
  
  const allSuccesses = sessions.flatMap(s => s.summary.successfulTactics)
  report.topSuccesses = getTopItems(allSuccesses, 5)
  
  // Generate recommendations
  if (report.conversionMetrics.emailCaptureRate < 70) {
    report.recommendations.push('Email capture rate low - ask for email earlier')
  }
  if (report.avgQualityScore < 60) {
    report.recommendations.push('Overall quality needs improvement - review conversation flow')
  }
  if (report.topMistakes.length > 0) {
    report.recommendations.push(`Address these common mistakes: ${report.topMistakes[0]}`)
  }
  
  return report
}

/**
 * Helper functions
 */
function getMostFrequent(items: string[]): string | null {
  if (items.length === 0) return null
  
  const frequency: Record<string, number> = {}
  items.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1
  })
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null
}

function getTopItems(items: string[], count: number): string[] {
  const frequency: Record<string, number> = {}
  items.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1
  })
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([item]) => item)
}

/**
 * Types
 */
interface ConversationAnalysis {
  qualityScore: number // 0-100
  dataCompleteness: number // 0-100
  engagementLevel: string
  recommendations: string[]
  patterns: string[]
}

interface ConversationReport {
  period: string
  totalConversations: number
  avgQualityScore: number
  avgDataCompleteness: number
  conversionMetrics: {
    emailCaptureRate: number
    phoneCaptureRate: number
    bookingRequestRate: number
  }
  topMistakes: string[]
  topSuccesses: string[]
  recommendations: string[]
}

/**
 * Store conversation for analysis
 */
export function storeConversation(session: ConversationSession): void {
  if (typeof window !== 'undefined') {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    conversations.push(session)
    localStorage.setItem('conversations', JSON.stringify(conversations))
    
    // Log summary for monitoring
    console.log('📊 Conversation Complete:', {
      url: session.url,
      duration: `${session.duration}s`,
      messages: session.messageCount,
      dataCapture: {
        name: !!session.leadData.name,
        email: !!session.leadData.email,
        phone: !!session.leadData.phone,
        problem: !!session.leadData.businessProblem
      },
      quality: analyzeConversation(session).qualityScore
    })
  }
}

/**
 * Get conversation analytics dashboard data
 */
export function getAnalyticsDashboard(): any {
  if (typeof window !== 'undefined') {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const recent = conversations.slice(-50) // Last 50 conversations
    
    return {
      report: generateConversationReport(recent),
      patterns: identifyPatterns(recent),
      recentSessions: recent.slice(-5) // Last 5 for review
    }
  }
  return null
}