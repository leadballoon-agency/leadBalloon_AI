/**
 * Interactive Journey Builder
 * Turn every obstacle into an opportunity for engagement and data collection
 * If their site sucks, we pivot to competitors and learn even more
 */

export interface JourneyDecisionPoint {
  id: string
  condition: 'website_unclear' | 'no_pricing' | 'no_competitors' | 'blocked_site' | 'new_niche'
  userPrompt: string
  options: JourneyOption[]
  fallback: string
}

export interface JourneyOption {
  label: string
  value: string
  leadToStep: string
  collectsData?: string[]
}

export class InteractiveJourneyBuilder {
  /**
   * When website analysis hits a snag, pivot to value
   */
  handleUnclearWebsite(websiteUrl: string, initialScan: any): JourneyDecisionPoint {
    const competitorSuggestions = this.suggestCompetitors(websiteUrl)
    
    return {
      id: 'unclear_website',
      condition: 'website_unclear',
      userPrompt: `🤔 Your site's being mysterious (good for security, tricky for analysis). Help us out?`,
      options: [
        {
          label: `Analyze ${competitorSuggestions[0].name} instead (they're crushing it)`,
          value: competitorSuggestions[0].url,
          leadToStep: 'competitor_analysis',
          collectsData: ['competitor_awareness', 'market_position']
        },
        {
          label: 'Let me tell you about my business',
          value: 'describe_business',
          leadToStep: 'business_description',
          collectsData: ['business_model', 'target_market', 'main_offer']
        },
        {
          label: 'Enter a competitor I want to beat',
          value: 'manual_competitor',
          leadToStep: 'competitor_input',
          collectsData: ['main_competitor', 'competitive_intel']
        }
      ],
      fallback: 'No worries! Drop your email and our team will manually research everything'
    }
  }

  /**
   * Smart competitor suggestions based on niche
   */
  private suggestCompetitors(websiteUrl: string): CompetitorSuggestion[] {
    // Extract potential niche from URL
    const domain = new URL(websiteUrl).hostname
    const keywords = this.extractKeywords(domain)
    
    // Would connect to our intelligence database
    // For now, return smart suggestions
    return [
      {
        name: 'Market Leader',
        url: 'https://example-competitor.com',
        reason: 'They've been running the same FB ad for 94 days'
      },
      {
        name: 'Rising Star',
        url: 'https://new-competitor.com',
        reason: 'Just raised prices 40% and still growing'
      }
    ]
  }

  /**
   * No pricing found? Gold mine for intelligence gathering
   */
  handleNoPricing(): JourneyDecisionPoint {
    return {
      id: 'no_pricing',
      condition: 'no_pricing',
      userPrompt: `💰 No public pricing found (smart move or missed opportunity?)`,
      options: [
        {
          label: 'I charge £X for Y',
          value: 'manual_pricing',
          leadToStep: 'pricing_analysis',
          collectsData: ['current_pricing', 'service_model']
        },
        {
          label: 'Show me what competitors charge',
          value: 'competitor_pricing',
          leadToStep: 'market_pricing',
          collectsData: ['price_awareness']
        },
        {
          label: "I don't have pricing yet",
          value: 'no_pricing_yet',
          leadToStep: 'pricing_strategy',
          collectsData: ['business_stage']
        }
      ],
      fallback: 'We'll research competitor pricing and show you the sweet spot'
    }
  }

  /**
   * Build journey with progressive data collection
   */
  buildAdaptiveJourney(initialData: any): AdaptiveJourney {
    const journey: AdaptiveJourney = {
      id: `journey_${Date.now()}`,
      startTime: new Date(),
      phases: [],
      collectedIntel: {},
      leadScore: 0
    }

    // Phase 1: Initial scan
    journey.phases.push({
      id: 'initial_scan',
      name: 'Quick Website Scan',
      status: 'running',
      discoveryPrompts: []
    })

    // Adapt based on what we find
    if (!initialData.pricing) {
      journey.phases.push({
        id: 'pricing_discovery',
        name: 'Pricing Research',
        status: 'pending',
        interactive: true,
        decisionPoint: this.handleNoPricing()
      })
    }

    if (!initialData.clearOffer) {
      journey.phases.push({
        id: 'offer_discovery',
        name: 'Offer Analysis',
        status: 'pending',
        interactive: true,
        decisionPoint: this.handleUnclearOffer()
      })
    }

    // Always add competitor analysis
    journey.phases.push({
      id: 'competitor_scan',
      name: 'Competitor Intelligence',
      status: 'pending',
      interactive: true,
      decisionPoint: this.createCompetitorDecision(initialData)
    })

    return journey
  }

  /**
   * Unclear offer = opportunity to understand their business
   */
  private handleUnclearOffer(): JourneyDecisionPoint {
    return {
      id: 'unclear_offer',
      condition: 'no_competitors',
      userPrompt: `🎯 What's your main thing? (We'll find who's doing it best)`,
      options: [
        {
          label: 'Coaching/Consulting',
          value: 'coaching',
          leadToStep: 'coaching_analysis',
          collectsData: ['business_type', 'service_model']
        },
        {
          label: 'Digital Products/Courses',
          value: 'digital_products',
          leadToStep: 'product_analysis',
          collectsData: ['business_type', 'delivery_model']
        },
        {
          label: 'Services/Agency',
          value: 'services',
          leadToStep: 'service_analysis',
          collectsData: ['business_type', 'service_type']
        },
        {
          label: 'E-commerce/Physical',
          value: 'ecommerce',
          leadToStep: 'ecommerce_analysis',
          collectsData: ['business_type', 'product_category']
        },
        {
          label: 'Something else',
          value: 'other',
          leadToStep: 'custom_analysis',
          collectsData: ['business_type', 'unique_model']
        }
      ],
      fallback: 'Tell us your business and we'll find your perfect competitors'
    }
  }

  /**
   * Create competitor decision point
   */
  private createCompetitorDecision(data: any): JourneyDecisionPoint {
    const suggestions = this.suggestCompetitors(data.url)
    
    return {
      id: 'competitor_selection',
      condition: 'no_competitors',
      userPrompt: `🔍 Who should we spy on for you?`,
      options: [
        {
          label: `${suggestions[0].name} - ${suggestions[0].reason}`,
          value: suggestions[0].url,
          leadToStep: 'analyze_suggested',
          collectsData: ['competitor_choice']
        },
        {
          label: 'I have a specific competitor in mind',
          value: 'custom',
          leadToStep: 'enter_competitor',
          collectsData: ['known_competitor']
        },
        {
          label: 'Find all my competitors',
          value: 'find_all',
          leadToStep: 'comprehensive_search',
          collectsData: ['market_awareness']
        },
        {
          label: "I don't know my competitors",
          value: 'no_idea',
          leadToStep: 'market_discovery',
          collectsData: ['market_stage']
        }
      ],
      fallback: 'We'll find your top 5 competitors and their weaknesses'
    }
  }

  /**
   * Extract keywords from domain
   */
  private extractKeywords(domain: string): string[] {
    // Remove common TLDs and www
    const cleaned = domain
      .replace(/^www\./, '')
      .replace(/\.(com|co\.uk|org|net|io|app|ai)$/, '')
    
    // Split on hyphens and camelCase
    const words = cleaned
      .split(/[-_]/)
      .flatMap(word => word.split(/(?=[A-Z])/))
      .map(w => w.toLowerCase())
      .filter(w => w.length > 2)
    
    return words
  }
}

export interface CompetitorSuggestion {
  name: string
  url: string
  reason: string
}

export interface AdaptiveJourney {
  id: string
  startTime: Date
  phases: JourneyPhase[]
  collectedIntel: Record<string, any>
  leadScore: number
}

export interface JourneyPhase {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'waiting_input'
  interactive?: boolean
  decisionPoint?: JourneyDecisionPoint
  discoveryPrompts?: string[]
  userResponse?: any
}

/**
 * Conversation flows that feel natural
 */
export const ConversationalPrompts = {
  websiteBlocked: [
    "😅 Your site's Fort Knox! Respect. Mind telling us what you do?",
    "🔒 Security game strong! What's your business about?",
    "🛡️ Can't get in (good problem to have). What do you sell?"
  ],
  
  noPricingFound: [
    "💰 Playing pricing close to the chest? Smart. What's your range?",
    "🤫 Secret pricing strategy? We get it. Ballpark?",
    "💎 Premium pricing hidden? What do you typically charge?"
  ],
  
  competitorSuggestion: [
    "👀 We found {competitor} crushing it in your space. Want their secrets?",
    "🎯 {competitor} is your main competition (94-day ad campaign!). Analyze them?",
    "🔥 {competitor} just raised prices 40%. Want to know why?"
  ],
  
  businessTypeDiscovery: [
    "🎨 What's your thing? We'll find who's best at it",
    "🚀 Main business model? We'll benchmark the leaders",
    "💼 What do you actually do? We'll find your competition"
  ],
  
  offerDiscovery: [
    "🎁 What's your best seller? We'll find similar winners",
    "⭐ Main offer/service? We'll analyze the market",
    "📦 What makes you money? We'll find the patterns"
  ]
}

/**
 * Turn every interaction into intelligence
 */
export class IntelligenceCollector {
  private collectedData: Map<string, any> = new Map()
  
  /**
   * Collect data from user interactions
   */
  collectFromInteraction(
    interaction: string,
    response: any,
    context: any
  ): IntelligenceData {
    const intelligence: IntelligenceData = {
      timestamp: new Date(),
      interactionType: interaction,
      userResponse: response,
      derivedInsights: this.deriveInsights(interaction, response),
      confidenceScore: this.calculateConfidence(interaction, response),
      suggestedNextSteps: this.suggestNextSteps(interaction, response)
    }
    
    this.collectedData.set(`${interaction}_${Date.now()}`, intelligence)
    
    return intelligence
  }
  
  private deriveInsights(interaction: string, response: any): string[] {
    const insights: string[] = []
    
    switch (interaction) {
      case 'competitor_choice':
        insights.push('User aware of competition')
        insights.push('Likely established business')
        break
      case 'no_pricing_yet':
        insights.push('Early stage or pivoting')
        insights.push('Needs pricing strategy')
        break
      case 'manual_competitor':
        insights.push('Specific competitive target')
        insights.push('Market knowledge exists')
        break
    }
    
    return insights
  }
  
  private calculateConfidence(interaction: string, response: any): number {
    // Higher confidence when user provides specific data
    if (response.includes('http')) return 0.9
    if (response.includes('£') || response.includes('$')) return 0.85
    if (response.length > 50) return 0.8
    return 0.6
  }
  
  private suggestNextSteps(interaction: string, response: any): string[] {
    const steps: string[] = []
    
    switch (interaction) {
      case 'competitor_choice':
        steps.push('Deep dive competitor ads')
        steps.push('Analyze pricing delta')
        steps.push('Find competitor weaknesses')
        break
      case 'business_description':
        steps.push('Market research')
        steps.push('Find similar businesses')
        steps.push('Identify best practices')
        break
    }
    
    return steps
  }
  
  /**
   * Build lead score based on interactions
   */
  calculateLeadScore(): number {
    let score = 0
    
    this.collectedData.forEach((data, key) => {
      // Points for engagement
      score += 10
      
      // Extra points for specific data
      if (key.includes('competitor')) score += 15
      if (key.includes('pricing')) score += 20
      if (key.includes('email')) score += 25
      if (key.includes('phone')) score += 30
      
      // Confidence multiplier
      score *= data.confidenceScore
    })
    
    return Math.min(score, 100)
  }
}

export interface IntelligenceData {
  timestamp: Date
  interactionType: string
  userResponse: any
  derivedInsights: string[]
  confidenceScore: number
  suggestedNextSteps: string[]
}

/**
 * The magic: Every obstacle becomes an opportunity
 */
export const JourneyPrinciples = {
  1: "If their site sucks, analyze competitors instead",
  2: "No pricing found? Ask them directly (data!)",
  3: "Don't know competitors? We suggest them (show expertise)",
  4: "Every question collects intelligence",
  5: "Build lead score through engagement",
  6: "Turn confusion into conversation",
  7: "Make them feel smart for participating"
}