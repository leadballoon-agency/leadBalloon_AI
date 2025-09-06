/**
 * Facebook Page Discovery System
 * Ask for their FB page, check their ads, offer competitor spying
 * Perfect lead capture when it takes time
 */

export interface FacebookPageAnalysis {
  pageUrl: string
  pageId?: string
  pageName: string
  hasActiveAds: boolean
  adCount?: number
  competitorSuggestions: CompetitorPage[]
  analysisTime: 'instant' | 'quick' | 'deep'
}

export interface CompetitorPage {
  name: string
  pageUrl: string
  reason: string
  hasAds?: boolean
  priority: 'high' | 'medium' | 'low'
}

export class FacebookPageDiscovery {
  /**
   * Smart prompts to get Facebook page
   */
  getFacebookPagePrompt(websiteUrl: string): InteractivePrompt {
    return {
      id: 'facebook_discovery',
      title: "Let's spy on some ads 🕵️",
      mainPrompt: "Got a Facebook page? We'll check if you're running ads (and spy on competitors)",
      
      options: [
        {
          id: 'own_page',
          label: "Here's my Facebook page",
          input: 'text',
          placeholder: 'facebook.com/yourbusiness or just the page name',
          followUp: this.getOwnPageFollowUp()
        },
        {
          id: 'competitor_page',
          label: "Check my competitor's ads instead",
          input: 'text',
          placeholder: 'Their Facebook page URL or name',
          followUp: this.getCompetitorPageFollowUp()
        },
        {
          id: 'no_facebook',
          label: "I don't use Facebook for business",
          followUp: this.getNoFacebookFollowUp()
        },
        {
          id: 'find_competitors',
          label: "Find my competitors' Facebook pages",
          followUp: this.getFindCompetitorsFollowUp()
        }
      ],
      
      contextMessage: "Facebook Ads Library is PUBLIC - we can see everyone's ads 👀"
    }
  }
  
  /**
   * Follow-up when they give their own page
   */
  private getOwnPageFollowUp(): FollowUpFlow {
    return {
      processing: "🔍 Checking your Facebook page...",
      
      scenarios: {
        hasAds: {
          message: "🎯 Found {count} active ads! Want to see how they compare to competitors?",
          action: 'compare_ads',
          options: [
            "Yes! Show me what's working in my industry",
            "Just analyze my ads for now"
          ]
        },
        
        noAds: {
          message: "📭 No active ads found. Want to see what your competitors are running?",
          action: 'suggest_competitor_analysis',
          options: [
            "Yes! Show me their winning ads",
            "Help me create my first ad"
          ]
        },
        
        pageNotFound: {
          message: "🤔 Couldn't find that page. Try the exact URL or page name?",
          action: 'retry_input',
          options: [
            "Enter page URL again",
            "Skip to competitor analysis"
          ]
        }
      }
    }
  }
  
  /**
   * Follow-up when they give competitor page
   */
  private getCompetitorPageFollowUp(): FollowUpFlow {
    return {
      processing: "🕵️ Infiltrating competitor's ad strategy...",
      
      scenarios: {
        hasAds: {
          message: "💰 JACKPOT! {count} active ads found. This'll take 2-3 mins to analyze properly.",
          action: 'queue_deep_analysis',
          captureFields: ['email', 'name'],
          queueMessage: "Drop your email - we'll send the full spy report with:\n• Ad copy that's working\n• How long they've been running\n• Estimated spend\n• Weaknesses to exploit"
        },
        
        multipleAds: {
          message: "🔥 They're running {count} ads! Some for 60+ days (those are money makers)",
          action: 'queue_analysis',
          captureFields: ['email', 'phone'],
          queueMessage: "This needs deep analysis. Email for report, phone for priority processing?"
        },
        
        noAds: {
          message: "🤐 No active ads. But I found 3 other competitors who ARE advertising...",
          action: 'suggest_alternatives',
          options: [
            "Show me who's advertising",
            "Search another competitor"
          ]
        }
      }
    }
  }
  
  /**
   * When they don't have Facebook
   */
  private getNoFacebookFollowUp(): FollowUpFlow {
    return {
      processing: "No Facebook? No problem...",
      
      scenarios: {
        default: {
          message: "📊 Let's find out what you're missing. What's your industry?",
          action: 'industry_discovery',
          options: [
            "Fitness/Wellness",
            "Coaching/Consulting",
            "E-commerce",
            "SaaS/Software",
            "Local Services",
            "Other"
          ],
          followUp: "We'll show you the TOP 5 Facebook advertisers in your space"
        }
      }
    }
  }
  
  /**
   * Find competitors flow
   */
  private getFindCompetitorsFollowUp(): FollowUpFlow {
    return {
      processing: "🔍 Searching for your competition on Facebook...",
      
      scenarios: {
        found: {
          message: "Found {count} potential competitors with Facebook pages. Checking for ads...",
          action: 'analyze_multiple',
          queueMessage: "⏰ This'll take 3-5 minutes. Want us to:",
          options: [
            "Email me the full report (get it and relax)",
            "Text me when ready (priority queue)",
            "I will wait here (grab coffee!)"
          ],
          captureFields: ['email', 'name']
        },
        
        needMoreInfo: {
          message: "Help me narrow it down. What's your:",
          action: 'collect_details',
          fields: [
            { id: 'industry', label: 'Industry/Niche', required: true },
            { id: 'location', label: 'Location (optional)', required: false },
            { id: 'service', label: 'Main service/product', required: true }
          ]
        }
      }
    }
  }
  
  /**
   * Check if page has ads (would call FB Ads Library API)
   */
  async checkPageAds(pageUrl: string): Promise<{
    hasAds: boolean
    adCount: number
    oldestAd?: { days: number, headline: string }
  }> {
    // Extract page ID from URL
    const pageId = this.extractPageId(pageUrl)
    
    // Would call Facebook Ads Library API
    // For now, simulate based on page characteristics
    
    return {
      hasAds: Math.random() > 0.3, // 70% chance they have ads
      adCount: Math.floor(Math.random() * 15) + 1,
      oldestAd: {
        days: Math.floor(Math.random() * 120) + 1,
        headline: "Their best performing ad headline here"
      }
    }
  }
  
  /**
   * Extract page ID from various Facebook URL formats
   */
  private extractPageId(input: string): string {
    // Handle various formats:
    // - https://facebook.com/pagename
    // - https://www.facebook.com/pagename
    // - facebook.com/pagename
    // - @pagename
    // - just pagename
    
    let cleaned = input.trim()
    
    // Remove common prefixes
    cleaned = cleaned
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/^facebook\.com\//, '')
      .replace(/^fb\.com\//, '')
      .replace(/^@/, '')
    
    // Remove trailing slashes and query params
    cleaned = cleaned.split('/')[0].split('?')[0]
    
    return cleaned
  }
  
  /**
   * Smart competitor suggestions based on industry
   */
  async suggestCompetitorPages(
    industry: string,
    location?: string
  ): Promise<CompetitorPage[]> {
    // This would query our database of known advertisers
    const suggestions: CompetitorPage[] = []
    
    // Industry-specific suggestions
    const industryCompetitors: Record<string, CompetitorPage[]> = {
      'fitness': [
        {
          name: 'F45 Training',
          pageUrl: 'facebook.com/F45Training',
          reason: 'Running 15 ads, same campaign for 94 days',
          hasAds: true,
          priority: 'high'
        },
        {
          name: 'Barry\'s Bootcamp',
          pageUrl: 'facebook.com/barrysbootcamp',
          reason: 'Big budget, 30+ active ads',
          hasAds: true,
          priority: 'high'
        }
      ],
      'coaching': [
        {
          name: 'Tony Robbins',
          pageUrl: 'facebook.com/TonyRobbins',
          reason: 'Master of FB ads, 50+ variations',
          hasAds: true,
          priority: 'high'
        }
      ]
    }
    
    return industryCompetitors[industry.toLowerCase()] || [
      {
        name: 'Industry Leader',
        pageUrl: 'facebook.com/example',
        reason: 'Top advertiser in your space',
        priority: 'medium'
      }
    ]
  }
  
  /**
   * Build the full discovery journey
   */
  buildDiscoveryJourney(
    startPoint: 'own_page' | 'competitor' | 'no_facebook',
    userInput: string
  ): DiscoveryJourney {
    const journey: DiscoveryJourney = {
      id: `discovery_${Date.now()}`,
      startTime: new Date(),
      currentPhase: 'initial',
      collectedData: {
        startPoint,
        userInput
      },
      nextSteps: [],
      estimatedTime: this.estimateAnalysisTime(startPoint)
    }
    
    switch (startPoint) {
      case 'own_page':
        journey.nextSteps = [
          'Check own ads',
          'Find similar pages',
          'Analyze competitor ads',
          'Generate comparison report'
        ]
        break
        
      case 'competitor':
        journey.nextSteps = [
          'Verify page exists',
          'Check ad library',
          'Analyze ad copy',
          'Find ad patterns',
          'Identify weaknesses'
        ]
        break
        
      case 'no_facebook':
        journey.nextSteps = [
          'Identify industry',
          'Find top advertisers',
          'Show what you\'re missing',
          'Create action plan'
        ]
        break
    }
    
    return journey
  }
  
  /**
   * Estimate realistic analysis time
   */
  private estimateAnalysisTime(type: string): number {
    const times = {
      'own_page': 60, // 1 minute
      'competitor': 120, // 2 minutes
      'no_facebook': 180 // 3 minutes
    }
    return times[type] || 120
  }
  
  /**
   * Generate engaging queue messages
   */
  getQueueMessages(context: any): string[] {
    const messages = [
      "🕵️ Currently infiltrating Facebook's Ad Library...",
      "📊 Found {count} ads. Analyzing which ones are winners...",
      "💰 Calculating their ad spend (this is the good stuff)...",
      "🎯 Identifying the hooks that actually convert...",
      "🔍 Checking how long each ad has been running...",
      "📈 Ads running 30+ days = money makers. Found {winning} so far...",
      "⚡ Cross-referencing with our database of {total} winning ads...",
      "🧠 AI is finding patterns your competitors don't want you to see..."
    ]
    
    return messages
  }
}

/**
 * Interactive prompt structure
 */
export interface InteractivePrompt {
  id: string
  title: string
  mainPrompt: string
  options: PromptOption[]
  contextMessage?: string
}

export interface PromptOption {
  id: string
  label: string
  input?: 'text' | 'select' | 'none'
  placeholder?: string
  followUp: FollowUpFlow
}

export interface FollowUpFlow {
  processing: string
  scenarios: Record<string, Scenario>
}

export interface Scenario {
  message: string
  action: string
  options?: string[]
  captureFields?: string[]
  queueMessage?: string
  fields?: Field[]
  followUp?: string
}

export interface Field {
  id: string
  label: string
  required: boolean
}

export interface DiscoveryJourney {
  id: string
  startTime: Date
  currentPhase: string
  collectedData: Record<string, any>
  nextSteps: string[]
  estimatedTime: number
}

/**
 * Queue messages for Facebook analysis
 */
export const FacebookAnalysisMessages = {
  starting: [
    "🚀 Accessing Facebook Ads Library (yes, it's all public!)...",
    "🔓 Opening the vault of advertising secrets...",
    "📱 Facebook Ads Library initializing (thanks Zuck for making this public)..."
  ],
  
  foundAds: [
    "😱 Holy... they're running {count} ads! This is gonna be good...",
    "💎 Found {count} active campaigns. Checking which ones are crushing it...",
    "🎰 Jackpot! {count} ads to analyze. The longest running one is {days} days old..."
  ],
  
  analyzing: [
    "🔬 Analyzing ad copy with our 50,000+ winning ads database...",
    "📊 This ad's been running {days} days. That means it's profitable...",
    "🎯 Found their hook: '{hook}'. Stealing... I mean, researching it...",
    "💰 Based on reach, they're spending roughly ${estimate}/day on this..."
  ],
  
  findingWeaknesses: [
    "🕵️ Looking for what they're missing (found something!)...",
    "⚠️ Their CTA is weak. You could beat this...",
    "📝 They're not using emotional triggers. Opportunity detected...",
    "🎨 Their creative is... questionable. You can do better..."
  ],
  
  almostDone: [
    "✨ Compiling everything into an actionable spy report...",
    "📋 Creating your competitive advantage checklist...",
    "🎁 Adding bonus: 3 ad variations that would beat theirs...",
    "🏃 Almost done! Just organizing {pages} pages of intelligence..."
  ]
}

/**
 * Convert discovery to leads
 */
export function convertDiscoveryToLead(
  journey: DiscoveryJourney,
  contactInfo: any
): LeadWithIntel {
  return {
    id: `lead_${Date.now()}`,
    source: 'facebook_discovery',
    contactInfo,
    intelligence: {
      startPoint: journey.collectedData.startPoint,
      competitorsFound: journey.collectedData.competitors || [],
      adsAnalyzed: journey.collectedData.adsFound || 0,
      insights: journey.collectedData.insights || [],
      priority: journey.collectedData.adsFound > 10 ? 'high' : 'medium'
    },
    promisedDeliverables: [
      'Complete competitor ad analysis',
      'Ad copy that\'s working',
      'Estimated competitor ad spend',
      'Weaknesses to exploit',
      'Your custom ad strategy'
    ],
    createdAt: new Date(),
    followUpTiming: 'immediate'
  }
}

export interface LeadWithIntel {
  id: string
  source: string
  contactInfo: any
  intelligence: any
  promisedDeliverables: string[]
  createdAt: Date
  followUpTiming: string
}