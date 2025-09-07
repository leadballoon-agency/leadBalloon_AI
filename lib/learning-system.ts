/**
 * Learning System - Makes LeadBalloon AI smarter with every use
 * 
 * Tracks and learns from:
 * - Conversation patterns that convert
 * - Industry-specific insights
 * - Successful qualifying questions
 * - Objections and how to handle them
 * - Pricing sweet spots
 * - Seasonal trends
 */

interface ConversationMetrics {
  conversationId: string
  timestamp: Date
  industry: string
  
  // Engagement metrics
  messagesExchanged: number
  conversationDuration: number
  responseTime: number[]
  
  // Lead quality
  emailProvided: boolean
  phoneProvided: boolean
  isRealEmail: boolean
  budgetDisclosed: boolean
  painPointsIdentified: string[]
  
  // Questions performance
  questionsAsked: Array<{
    question: string
    gotResponse: boolean
    responseQuality: 'high' | 'medium' | 'low' | 'none'
    extractedInfo: string[]
  }>
  
  // Conversion tracking
  becameClient: boolean | null // null = unknown yet
  dealValue?: number
  timeToConversion?: number
  
  // AI performance
  modelsUsed: string[]
  userSatisfaction?: number // 1-5 from feedback
}

interface IndustryIntelligence {
  industry: string
  lastUpdated: Date
  
  // Learned patterns
  topPainPoints: Map<string, number> // pain point -> frequency
  effectiveHooks: Map<string, number> // hook -> engagement rate
  pricingRanges: {
    low: number
    median: number
    high: number
    sweetSpot: number
  }
  
  // Conversion insights
  averageLeadCost: number
  conversionRate: number
  typicalObjections: string[]
  winningResponses: Map<string, string> // objection -> best response
  
  // Competitor intelligence
  commonCompetitors: string[]
  competitorWeaknesses: Map<string, string[]>
  
  // Seasonal patterns
  seasonalTrends: Map<string, number> // month -> demand index
}

export class LearningSystem {
  private conversationHistory: Map<string, ConversationMetrics> = new Map()
  private industryKnowledge: Map<string, IndustryIntelligence> = new Map()
  
  /**
   * Record a conversation for learning
   */
  async recordConversation(metrics: ConversationMetrics): Promise<void> {
    // Store conversation
    this.conversationHistory.set(metrics.conversationId, metrics)
    
    // Update industry knowledge
    await this.updateIndustryKnowledge(metrics)
    
    // Identify successful patterns
    await this.identifySuccessPatterns(metrics)
    
    // Log for analysis
    console.log(`📊 Recorded conversation: ${metrics.conversationId}`)
    console.log(`   Industry: ${metrics.industry}`)
    console.log(`   Lead Quality: ${this.calculateLeadScore(metrics)}/100`)
  }
  
  /**
   * Calculate lead quality score
   */
  private calculateLeadScore(metrics: ConversationMetrics): number {
    let score = 0
    
    // Email quality (30 points)
    if (metrics.emailProvided) {
      score += metrics.isRealEmail ? 30 : 10
    }
    
    // Phone provided (20 points)
    if (metrics.phoneProvided) score += 20
    
    // Budget disclosed (20 points)
    if (metrics.budgetDisclosed) score += 20
    
    // Pain points identified (20 points)
    score += Math.min(metrics.painPointsIdentified.length * 5, 20)
    
    // Engagement (10 points)
    if (metrics.messagesExchanged > 5) score += 10
    
    return score
  }
  
  /**
   * Update industry knowledge from conversation
   */
  private async updateIndustryKnowledge(metrics: ConversationMetrics): Promise<void> {
    let industry = this.industryKnowledge.get(metrics.industry)
    
    if (!industry) {
      industry = {
        industry: metrics.industry,
        lastUpdated: new Date(),
        topPainPoints: new Map(),
        effectiveHooks: new Map(),
        pricingRanges: { low: 0, median: 0, high: 0, sweetSpot: 0 },
        averageLeadCost: 0,
        conversionRate: 0,
        typicalObjections: [],
        winningResponses: new Map(),
        commonCompetitors: [],
        competitorWeaknesses: new Map(),
        seasonalTrends: new Map()
      }
    }
    
    // Update pain points frequency
    metrics.painPointsIdentified.forEach(pain => {
      const current = industry!.topPainPoints.get(pain) || 0
      industry!.topPainPoints.set(pain, current + 1)
    })
    
    // Track effective questions
    metrics.questionsAsked.forEach(q => {
      if (q.responseQuality === 'high') {
        const current = industry!.effectiveHooks.get(q.question) || 0
        industry!.effectiveHooks.set(q.question, current + 1)
      }
    })
    
    // Update timestamp
    industry.lastUpdated = new Date()
    
    this.industryKnowledge.set(metrics.industry, industry)
  }
  
  /**
   * Identify patterns that lead to success
   */
  private async identifySuccessPatterns(metrics: ConversationMetrics): Promise<void> {
    const successfulConversations = Array.from(this.conversationHistory.values())
      .filter(c => c.becameClient === true)
    
    if (successfulConversations.length < 10) return // Need more data
    
    // Analyze successful patterns
    const patterns = {
      averageMessagesBeforeEmail: 0,
      mostEffectiveQuestions: [] as string[],
      optimalConversationLength: 0,
      bestTimeToAskForContact: 0
    }
    
    // Calculate averages from successful conversations
    const totalMessages = successfulConversations.reduce((sum, c) => sum + c.messagesExchanged, 0)
    patterns.averageMessagesBeforeEmail = Math.round(totalMessages / successfulConversations.length)
    
    // Find most effective questions
    const questionSuccess = new Map<string, number>()
    successfulConversations.forEach(conv => {
      conv.questionsAsked
        .filter(q => q.responseQuality === 'high')
        .forEach(q => {
          const current = questionSuccess.get(q.question) || 0
          questionSuccess.set(q.question, current + 1)
        })
    })
    
    // Sort questions by success rate
    patterns.mostEffectiveQuestions = Array.from(questionSuccess.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([question]) => question)
    
    console.log('🎯 Success Patterns Identified:', patterns)
  }
  
  /**
   * Get smart recommendations based on learning
   */
  async getRecommendations(industry: string, conversationStage: number): Promise<{
    nextBestQuestion: string
    avoidQuestions: string[]
    expectedObjections: string[]
    conversionProbability: number
  }> {
    const industryData = this.industryKnowledge.get(industry)
    
    if (!industryData) {
      // Return defaults if no data yet
      return {
        nextBestQuestion: "What's your biggest challenge right now?",
        avoidQuestions: [],
        expectedObjections: ["Too expensive", "Need to think about it"],
        conversionProbability: 0.3
      }
    }
    
    // Get top performing questions for this stage
    const topQuestions = Array.from(industryData.effectiveHooks.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([question]) => question)
    
    // Get questions to avoid (low engagement)
    const avoidQuestions = Array.from(this.conversationHistory.values())
      .filter(c => c.industry === industry)
      .flatMap(c => c.questionsAsked)
      .filter(q => q.responseQuality === 'none')
      .map(q => q.question)
      .filter((q, i, arr) => arr.indexOf(q) === i) // unique
    
    // Calculate conversion probability based on historical data
    const industryConversations = Array.from(this.conversationHistory.values())
      .filter(c => c.industry === industry)
    
    const converted = industryConversations.filter(c => c.becameClient).length
    const conversionProbability = industryConversations.length > 0 
      ? converted / industryConversations.length 
      : 0.3
    
    return {
      nextBestQuestion: topQuestions[Math.min(conversationStage, topQuestions.length - 1)] || "What's your biggest challenge?",
      avoidQuestions: avoidQuestions.slice(0, 3),
      expectedObjections: industryData.typicalObjections.slice(0, 3),
      conversionProbability
    }
  }
  
  /**
   * Weekly analysis and optimization
   */
  async runWeeklyOptimization(): Promise<{
    insights: string[]
    recommendations: string[]
    knowledgeUpdates: number
  }> {
    const insights: string[] = []
    const recommendations: string[] = []
    let updates = 0
    
    // Analyze conversion patterns
    const thisWeekConversations = Array.from(this.conversationHistory.values())
      .filter(c => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return c.timestamp > weekAgo
      })
    
    if (thisWeekConversations.length > 0) {
      // Calculate metrics
      const avgLeadScore = thisWeekConversations
        .reduce((sum, c) => sum + this.calculateLeadScore(c), 0) / thisWeekConversations.length
      
      insights.push(`Average lead score this week: ${avgLeadScore.toFixed(1)}/100`)
      
      // Find best performing questions
      const questionPerformance = new Map<string, number>()
      thisWeekConversations.forEach(c => {
        c.questionsAsked.forEach(q => {
          if (q.responseQuality === 'high') {
            const current = questionPerformance.get(q.question) || 0
            questionPerformance.set(q.question, current + 1)
          }
        })
      })
      
      const topQuestion = Array.from(questionPerformance.entries())
        .sort((a, b) => b[1] - a[1])[0]
      
      if (topQuestion) {
        insights.push(`Top performing question: "${topQuestion[0]}"`)
        recommendations.push(`Use this question more: "${topQuestion[0]}"`)
      }
      
      // Industry-specific insights
      const industryBreakdown = new Map<string, number>()
      thisWeekConversations.forEach(c => {
        const current = industryBreakdown.get(c.industry) || 0
        industryBreakdown.set(c.industry, current + 1)
      })
      
      const topIndustry = Array.from(industryBreakdown.entries())
        .sort((a, b) => b[1] - a[1])[0]
      
      if (topIndustry) {
        insights.push(`Most active industry: ${topIndustry[0]} (${topIndustry[1]} conversations)`)
        recommendations.push(`Focus marketing on ${topIndustry[0]} businesses`)
      }
      
      updates = industryBreakdown.size
    }
    
    return {
      insights,
      recommendations,
      knowledgeUpdates: updates
    }
  }
  
  /**
   * Export learnings for backup/sharing
   */
  async exportLearnings(): Promise<{
    conversations: number
    industries: string[]
    topInsights: string[]
    successRate: number
  }> {
    const conversations = this.conversationHistory.size
    const industries = Array.from(this.industryKnowledge.keys())
    
    // Calculate overall success rate
    const allConversations = Array.from(this.conversationHistory.values())
    const successful = allConversations.filter(c => c.becameClient).length
    const successRate = allConversations.length > 0 
      ? successful / allConversations.length 
      : 0
    
    // Get top insights across all industries
    const topInsights: string[] = []
    this.industryKnowledge.forEach((data, industry) => {
      const topPain = Array.from(data.topPainPoints.entries())
        .sort((a, b) => b[1] - a[1])[0]
      
      if (topPain) {
        topInsights.push(`${industry}: Main pain point is "${topPain[0]}"`)
      }
    })
    
    return {
      conversations,
      industries,
      topInsights: topInsights.slice(0, 10),
      successRate
    }
  }
}

// Singleton instance
export const learningSystem = new LearningSystem()