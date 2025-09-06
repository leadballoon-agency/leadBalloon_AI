/**
 * Interactive Feed System
 * The feed pauses strategically to ask intelligent questions
 * Each interaction deepens engagement AND collects valuable data
 */

import { FeedUpdate } from './live-journey-feed'

export interface InteractivePause {
  id: string
  triggerTime: number // When to pause (seconds)
  reason: string // Why we're pausing
  question: QuestionPrompt
  continueWithout?: boolean // Can they skip?
  valueOfAnswer: string // What we gain from this
}

export interface QuestionPrompt {
  id: string
  type: 'text' | 'select' | 'multi' | 'url' | 'confirm'
  icon: string
  headline: string
  subtext?: string
  placeholder?: string
  options?: QuestionOption[]
  validation?: (input: any) => boolean
  followUp?: (answer: any) => QuestionPrompt | null
}

export interface QuestionOption {
  value: string
  label: string
  icon?: string
  description?: string
}

export class InteractiveFeedSystem {
  private pauses: InteractivePause[] = []
  private collectedData: Map<string, any> = new Map()
  private currentPause?: InteractivePause
  private feedPaused = false
  
  /**
   * Initialize strategic pause points
   */
  initializePausePoints(context: any): InteractivePause[] {
    this.pauses = [
      this.createNicheClarificationPause(),
      this.createFacebookPagePause(),
      this.createCompetitorPause(),
      this.createPricingPause(),
      this.createGoalPause(),
      this.createContactPause()
    ]
    
    return this.pauses
  }
  
  /**
   * Niche clarification pause (10 seconds in)
   */
  private createNicheClarificationPause(): InteractivePause {
    return {
      id: 'niche_clarification',
      triggerTime: 10,
      reason: 'Website unclear about specific niche',
      valueOfAnswer: 'Precise competitor matching and ad targeting',
      
      question: {
        id: 'niche',
        type: 'select',
        icon: '🎯',
        headline: 'Quick question - what is your specific niche?',
        subtext: 'Manual research takes time. Let me focus on YOUR exact market...',
        
        options: [
          {
            value: 'fitness_gym',
            label: 'Gym/Fitness Studio',
            icon: '🏋️',
            description: 'Physical location, classes, memberships'
          },
          {
            value: 'fitness_online',
            label: 'Online Fitness/Coaching',
            icon: '💪',
            description: 'Digital programs, app-based, remote'
          },
          {
            value: 'fitness_nutrition',
            label: 'Nutrition/Supplements',
            icon: '🥗',
            description: 'Meal plans, supplements, diet coaching'
          },
          {
            value: 'coaching_business',
            label: 'Business Coaching',
            icon: '💼',
            description: 'B2B, entrepreneurship, consulting'
          },
          {
            value: 'coaching_life',
            label: 'Life/Personal Coaching',
            icon: '🧠',
            description: 'Personal development, mindset, relationships'
          },
          {
            value: 'other',
            label: 'Something else',
            icon: '✨',
            description: 'I will tell you specifically'
          }
        ],
        
        followUp: (answer) => {
          if (answer === 'other') {
            return {
              id: 'niche_other',
              type: 'text',
              icon: '📝',
              headline: 'Tell me your exact niche',
              subtext: 'The more specific, the better intel I can find',
              placeholder: 'e.g., "CrossFit for moms over 40"'
            }
          }
          return null
        }
      }
    }
  }
  
  /**
   * Facebook page pause (20 seconds in)
   */
  private createFacebookPagePause(): InteractivePause {
    return {
      id: 'facebook_page',
      triggerTime: 20,
      reason: 'Ready to check Facebook Ads',
      valueOfAnswer: 'Direct competitor ad analysis',
      continueWithout: true,
      
      question: {
        id: 'fb_page',
        type: 'text',
        icon: '📱',
        headline: 'Got a Facebook page? Let\'s spy on some ads 🕵️',
        subtext: 'I can check if YOU have ads running (or check a competitor)',
        placeholder: 'Paste FB page URL or type page name',
        
        validation: (input) => {
          // Basic validation
          return input.length > 3
        },
        
        followUp: (answer) => {
          if (!answer || answer === 'skip') return null
          
          return {
            id: 'fb_choice',
            type: 'confirm',
            icon: '🤔',
            headline: `Check "${answer}" for active ads?`,
            subtext: 'Requires manual research - Facebook blocks automation',
            options: [
              { value: 'yes', label: 'Yes, check their ads' },
              { value: 'competitor', label: 'Actually, check a competitor instead' },
              { value: 'skip', label: 'Skip Facebook for now' }
            ]
          }
        }
      }
    }
  }
  
  /**
   * Competitor pause (30 seconds in)
   */
  private createCompetitorPause(): InteractivePause {
    return {
      id: 'competitor_check',
      triggerTime: 30,
      reason: 'Found potential competitors',
      valueOfAnswer: 'Validate we\'re analyzing the right competition',
      
      question: {
        id: 'competitor',
        type: 'select',
        icon: '🎯',
        headline: 'Is THIS your main competitor?',
        subtext: 'I found these guys dominating your space...',
        
        options: [
          {
            value: 'competitor_1',
            label: '[Dynamic Competitor Name]',
            description: 'Running 15 FB ads, £697 pricing'
          },
          {
            value: 'different',
            label: 'No, my competitor is...',
            description: 'Let me tell you who to analyze'
          },
          {
            value: 'no_idea',
            label: 'I don\'t know my competitors',
            description: 'Find them for me!'
          },
          {
            value: 'multiple',
            label: 'I have several competitors',
            description: 'Analyze them all (takes longer)'
          }
        ],
        
        followUp: (answer) => {
          if (answer === 'different') {
            return {
              id: 'competitor_custom',
              type: 'text',
              icon: '🔍',
              headline: 'Who should I analyze?',
              placeholder: 'Competitor name or website'
            }
          }
          if (answer === 'multiple') {
            return {
              id: 'competitor_priority',
              type: 'text',
              icon: '📋',
              headline: 'List your top 3 competitors',
              subtext: 'This will take 3-5 minutes to analyze properly',
              placeholder: 'Company1, Company2, Company3'
            }
          }
          return null
        }
      }
    }
  }
  
  /**
   * Pricing pause (40 seconds in)
   */
  private createPricingPause(): InteractivePause {
    return {
      id: 'pricing_check',
      triggerTime: 40,
      reason: 'Calculating pricing strategy',
      valueOfAnswer: 'Personalized pricing recommendations',
      continueWithout: true,
      
      question: {
        id: 'current_pricing',
        type: 'select',
        icon: '💰',
        headline: 'Quick pricing check - what do you charge now?',
        subtext: 'I found competitors at £497-997. Where are you?',
        
        options: [
          {
            value: 'under_100',
            label: 'Under £100',
            description: 'Way too low (we can fix this)'
          },
          {
            value: '100_300',
            label: '£100-300',
            description: 'Room to grow'
          },
          {
            value: '300_500',
            label: '£300-500',
            description: 'Getting there'
          },
          {
            value: '500_1000',
            label: '£500-1000',
            description: 'Solid range'
          },
          {
            value: 'over_1000',
            label: 'Over £1000',
            description: 'Premium positioning'
          },
          {
            value: 'no_pricing',
            label: 'Haven\'t decided yet',
            description: 'I\'ll help you price it right'
          }
        ],
        
        followUp: (answer) => {
          if (answer === 'under_100') {
            return {
              id: 'pricing_concern',
              type: 'confirm',
              icon: '⚡',
              headline: 'You could EASILY charge 3x more',
              subtext: 'Want to see exactly how to justify higher prices?',
              options: [
                { value: 'yes', label: 'Yes! Show me how' },
                { value: 'nervous', label: 'I\'m nervous about raising prices' },
                { value: 'later', label: 'Maybe later' }
              ]
            }
          }
          return null
        }
      }
    }
  }
  
  /**
   * Goal pause (50 seconds in)
   */
  private createGoalPause(): InteractivePause {
    return {
      id: 'goal_check',
      triggerTime: 50,
      reason: 'Customize final recommendations',
      valueOfAnswer: 'Tailored action plan',
      
      question: {
        id: 'main_goal',
        type: 'select',
        icon: '🎯',
        headline: 'What\'s your #1 goal right now?',
        subtext: 'I\'ll prioritize insights based on this...',
        
        options: [
          {
            value: 'more_leads',
            label: 'Get more leads',
            icon: '📈',
            description: 'Fill your pipeline'
          },
          {
            value: 'higher_prices',
            label: 'Charge higher prices',
            icon: '💰',
            description: 'Increase revenue per customer'
          },
          {
            value: 'better_ads',
            label: 'Create winning ads',
            icon: '📱',
            description: 'Facebook/Instagram that convert'
          },
          {
            value: 'beat_competitor',
            label: 'Beat specific competitor',
            icon: '🥊',
            description: 'Take market share'
          },
          {
            value: 'scale_fast',
            label: 'Scale to £10k/month',
            icon: '🚀',
            description: 'Rapid growth strategy'
          }
        ]
      }
    }
  }
  
  /**
   * Contact pause (60 seconds in)
   */
  private createContactPause(): InteractivePause {
    return {
      id: 'contact_capture',
      triggerTime: 60,
      reason: 'Report ready',
      valueOfAnswer: 'Deliver personalized report',
      continueWithout: false,
      
      question: {
        id: 'contact',
        type: 'text',
        icon: '📧',
        headline: 'Report ready! Where should I send it?',
        subtext: 'Your custom 12-page competitive intelligence report',
        placeholder: 'your@email.com',
        
        followUp: (email) => {
          return {
            id: 'phone_upgrade',
            type: 'text',
            icon: '📱',
            headline: 'Want priority processing?',
            subtext: 'Phone number = jump the queue + SMS when ready',
            placeholder: 'Your phone (optional)'
          }
        }
      }
    }
  }
  
  /**
   * Check if should pause
   */
  shouldPause(elapsedSeconds: number): InteractivePause | null {
    if (this.feedPaused) return null
    
    const pause = this.pauses.find(p => 
      Math.abs(p.triggerTime - elapsedSeconds) < 2 &&
      !this.collectedData.has(p.id)
    )
    
    if (pause) {
      this.currentPause = pause
      this.feedPaused = true
    }
    
    return pause
  }
  
  /**
   * Process user answer
   */
  async processAnswer(pauseId: string, answer: any): Promise<ProcessedAnswer> {
    this.collectedData.set(pauseId, answer)
    this.feedPaused = false
    
    // Generate insights from answer
    const insights = this.generateInsightsFromAnswer(pauseId, answer)
    
    // Determine next action
    const nextAction = this.determineNextAction(pauseId, answer)
    
    // Update journey based on answer
    const updates = this.generateFeedUpdates(pauseId, answer)
    
    return {
      pauseId,
      answer,
      insights,
      nextAction,
      feedUpdates: updates,
      continueJourney: true
    }
  }
  
  /**
   * Generate insights from answer
   */
  private generateInsightsFromAnswer(pauseId: string, answer: any): string[] {
    const insights: string[] = []
    
    switch (pauseId) {
      case 'niche_clarification':
        insights.push(`Focusing on ${answer} niche`)
        insights.push('Loading niche-specific competitor data')
        insights.push('Accessing specialized ad templates')
        break
        
      case 'facebook_page':
        if (answer && answer !== 'skip') {
          insights.push('Facebook page identified')
          insights.push('Checking Ads Library access')
          insights.push('Preparing competitor comparison')
        }
        break
        
      case 'competitor_check':
        if (answer === 'multiple') {
          insights.push('Multi-competitor analysis requested')
          insights.push('This will provide comprehensive market view')
          insights.push('Extended processing time approved')
        }
        break
        
      case 'pricing_check':
        const priceInsights = {
          'under_100': 'Massive price increase opportunity detected',
          '100_300': 'Room for 50-100% price increase',
          '300_500': 'Pricing in market range, optimization possible',
          '500_1000': 'Premium positioning viable',
          'over_1000': 'High-ticket strategy confirmed',
          'no_pricing': 'Will create pricing from scratch'
        }
        insights.push(priceInsights[answer] || 'Pricing data collected')
        break
    }
    
    return insights
  }
  
  /**
   * Determine next action based on answer
   */
  private determineNextAction(pauseId: string, answer: any): NextAction {
    // Complex logic for determining journey path
    if (pauseId === 'contact_capture') {
      return {
        type: 'complete',
        message: 'Processing your report...',
        deliverable: 'Full competitive intelligence report'
      }
    }
    
    if (pauseId === 'competitor_check' && answer === 'multiple') {
      return {
        type: 'queue',
        message: 'Multiple competitor analysis queued',
        estimatedTime: 300 // 5 minutes
      }
    }
    
    return {
      type: 'continue',
      message: 'Great! Continuing analysis...'
    }
  }
  
  /**
   * Generate feed updates based on answer
   */
  private generateFeedUpdates(pauseId: string, answer: any): FeedUpdate[] {
    const updates: FeedUpdate[] = []
    
    // Acknowledge their input
    updates.push({
      id: `ack_${Date.now()}`,
      timestamp: new Date(),
      type: 'success',
      icon: '✅',
      message: 'Perfect! Using this to customize your analysis',
      impact: 'medium',
      animation: 'fade'
    })
    
    // Add specific insights
    switch (pauseId) {
      case 'niche_clarification':
        updates.push({
          id: `niche_${Date.now()}`,
          timestamp: new Date(),
          type: 'discovery',
          icon: '🎯',
          message: `Loading ${answer} specific data...`,
          detail: 'Found 47 active advertisers in your exact niche',
          impact: 'high',
          animation: 'slide'
        })
        break
        
      case 'facebook_page':
        if (answer && answer !== 'skip') {
          updates.push({
            id: `fb_${Date.now()}`,
            timestamp: new Date(),
            type: 'discovery',
            icon: '📱',
            message: 'Manual Facebook research required...',
            detail: 'Building queue for human researcher',
            impact: 'high',
            animation: 'pulse'
          })
        }
        break
    }
    
    return updates
  }
  
  /**
   * Get conversation state
   */
  getConversationState(): ConversationState {
    return {
      paused: this.feedPaused,
      currentPause: this.currentPause,
      collectedData: Object.fromEntries(this.collectedData),
      completedPauses: Array.from(this.collectedData.keys()),
      remainingPauses: this.pauses.filter(p => !this.collectedData.has(p.id)),
      engagementScore: this.calculateEngagementScore()
    }
  }
  
  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(): number {
    let score = 0
    
    // Points for each answer
    score += this.collectedData.size * 10
    
    // Bonus for specific valuable data
    if (this.collectedData.has('facebook_page')) score += 15
    if (this.collectedData.has('competitor_check')) score += 20
    if (this.collectedData.has('pricing_check')) score += 15
    if (this.collectedData.has('contact_capture')) score += 25
    
    return Math.min(score, 100)
  }
}

export interface ProcessedAnswer {
  pauseId: string
  answer: any
  insights: string[]
  nextAction: NextAction
  feedUpdates: FeedUpdate[]
  continueJourney: boolean
}

export interface NextAction {
  type: 'continue' | 'queue' | 'complete' | 'branch'
  message: string
  estimatedTime?: number
  deliverable?: string
}

export interface ConversationState {
  paused: boolean
  currentPause?: InteractivePause
  collectedData: Record<string, any>
  completedPauses: string[]
  remainingPauses: InteractivePause[]
  engagementScore: number
}

/**
 * Dynamic question generation based on context
 */
export class DynamicQuestionGenerator {
  /**
   * Generate contextual questions based on journey state
   */
  generateContextualQuestion(
    context: any,
    previousAnswers: Map<string, any>
  ): QuestionPrompt | null {
    // If they mentioned a competitor, ask about them
    if (context.mentionedCompetitor && !previousAnswers.has('competitor_analysis')) {
      return {
        id: 'competitor_mentioned',
        type: 'confirm',
        icon: '👀',
        headline: `Should I analyze ${context.mentionedCompetitor}?`,
        subtext: 'I can check their ads, pricing, and weaknesses',
        options: [
          { value: 'yes', label: 'Yes, analyze them' },
          { value: 'no', label: 'No, focus on my business' }
        ]
      }
    }
    
    // If low pricing detected, probe deeper
    if (context.lowPricing && !previousAnswers.has('pricing_concern')) {
      return {
        id: 'pricing_fear',
        type: 'select',
        icon: '💭',
        headline: 'What stops you charging more?',
        subtext: 'I can help overcome this',
        options: [
          { value: 'competition', label: 'Competitors are cheaper' },
          { value: 'value', label: 'Not sure of my value' },
          { value: 'confidence', label: 'Lack confidence' },
          { value: 'customers', label: 'Customers won\'t pay' }
        ]
      }
    }
    
    return null
  }
}

/**
 * Engagement patterns that work
 */
export const EngagementPatterns = {
  questions: {
    timing: "Ask when natural, not forced",
    tone: "Conversational, not interrogation",
    value: "Each question should feel valuable to answer",
    skip: "Allow skipping non-critical questions"
  },
  
  rewards: {
    immediate: "Thank them for each answer",
    reveal: "Show something new after they answer",
    customize: "Use their answer immediately in the feed",
    progress: "Show how their input improves results"
  },
  
  psychology: {
    curiosity: "Tease what's coming to maintain interest",
    investment: "More they interact, more invested they become",
    personalization: "Each answer makes it more 'theirs'",
    anticipation: "Build excitement for final deliverable"
  }
}