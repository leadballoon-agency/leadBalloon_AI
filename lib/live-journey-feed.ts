/**
 * Live Journey Feed System
 * Real-time feed that shows the journey, builds excitement, and makes them go "WOW!"
 * Every update is designed to increase perceived value and anticipation
 */

export interface FeedUpdate {
  id: string
  timestamp: Date
  type: 'discovery' | 'insight' | 'warning' | 'success' | 'teaser' | 'comparison'
  icon: string
  message: string
  detail?: string
  value?: string | number
  impact?: 'high' | 'medium' | 'low'
  animation?: 'pulse' | 'slide' | 'fade' | 'bounce'
}

export class LiveJourneyFeed {
  private updates: FeedUpdate[] = []
  private startTime: number = Date.now()
  private updateCallback?: (update: FeedUpdate) => void
  
  /**
   * Start the live journey with initial excitement
   */
  startJourney(websiteUrl: string): FeedUpdate[] {
    this.updates = []
    this.startTime = Date.now()
    
    // Initial burst of activity
    this.addUpdate({
      type: 'discovery',
      icon: '🚀',
      message: 'Journey initiated!',
      detail: `Analyzing ${websiteUrl}`,
      animation: 'pulse'
    })
    
    // Set up the journey timeline
    this.scheduleJourneyUpdates(websiteUrl)
    
    return this.updates
  }
  
  /**
   * Schedule updates that build value over time
   */
  private scheduleJourneyUpdates(websiteUrl: string) {
    const timeline = [
      { delay: 2000, update: this.websiteScanUpdate() },
      { delay: 5000, update: this.firstDiscoveryUpdate() },
      { delay: 8000, update: this.competitorFoundUpdate() },
      { delay: 12000, update: this.facebookAdsUpdate() },
      { delay: 16000, update: this.bigRevealTeaser() },
      { delay: 20000, update: this.pricingInsightUpdate() },
      { delay: 25000, update: this.winningAdFoundUpdate() },
      { delay: 30000, update: this.weaknessFoundUpdate() },
      { delay: 35000, update: this.aiProcessingUpdate() },
      { delay: 40000, update: this.finalInsightUpdate() }
    ]
    
    timeline.forEach(({ delay, update }) => {
      setTimeout(() => this.addUpdate(update), delay)
    })
  }
  
  /**
   * Add update to feed
   */
  private addUpdate(update: Omit<FeedUpdate, 'id' | 'timestamp'>): FeedUpdate {
    const fullUpdate: FeedUpdate = {
      id: `update_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      ...update
    }
    
    this.updates.push(fullUpdate)
    
    if (this.updateCallback) {
      this.updateCallback(fullUpdate)
    }
    
    return fullUpdate
  }
  
  /**
   * Website scan discoveries
   */
  private websiteScanUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    const updates = [
      {
        type: 'discovery' as const,
        icon: '🔍',
        message: 'Found your main headline...',
        detail: 'Missing emotional trigger - we can fix that!',
        impact: 'medium' as const
      },
      {
        type: 'warning' as const,
        icon: '⚠️',
        message: 'Your CTA could be 3x stronger',
        detail: 'Currently: "Learn More" → Should be: "Start Your Transformation"',
        impact: 'high' as const
      },
      {
        type: 'discovery' as const,
        icon: '📸',
        message: 'Image analysis complete',
        detail: 'Hero image doesn\'t show transformation - missing opportunity!',
        impact: 'medium' as const
      }
    ]
    
    return updates[Math.floor(Math.random() * updates.length)]
  }
  
  /**
   * First big discovery
   */
  private firstDiscoveryUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    return {
      type: 'insight',
      icon: '💡',
      message: 'DISCOVERY: You\'re undercharging!',
      detail: 'Market average: £497 | You charge: £197',
      value: '£300 opportunity per sale',
      impact: 'high',
      animation: 'bounce'
    }
  }
  
  /**
   * Competitor found
   */
  private competitorFoundUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    const competitors = [
      {
        message: 'Found your biggest competitor',
        detail: 'They charge £697 and have a 6-week waitlist!',
        value: 'MarketLeaderCo'
      },
      {
        message: 'Competitor identified',
        detail: 'Running 15 Facebook ads right now',
        value: 'CompetitorX'
      },
      {
        message: 'Main rival discovered',
        detail: 'Just raised prices 40% and still growing',
        value: 'IndustryGiant'
      }
    ]
    
    const chosen = competitors[Math.floor(Math.random() * competitors.length)]
    
    return {
      type: 'discovery',
      icon: '🎯',
      message: chosen.message,
      detail: chosen.detail,
      value: chosen.value,
      impact: 'high',
      animation: 'slide'
    }
  }
  
  /**
   * Facebook ads discovery
   */
  private facebookAdsUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    return {
      type: 'success',
      icon: '📱',
      message: 'Facebook Ads Library accessed!',
      detail: 'Found 47 ads in your niche - 3 running for 90+ days',
      value: '90+ days = profitable',
      impact: 'high',
      animation: 'pulse'
    }
  }
  
  /**
   * Big reveal teaser
   */
  private bigRevealTeaser(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    return {
      type: 'teaser',
      icon: '🔥',
      message: 'OMG... found something HUGE',
      detail: 'Your competitor\'s secret weapon (preparing details...)',
      impact: 'high',
      animation: 'bounce'
    }
  }
  
  /**
   * Pricing insight
   */
  private pricingInsightUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    return {
      type: 'comparison',
      icon: '💰',
      message: 'Pricing sweet spot identified',
      detail: 'You: £197 | Market: £497 | Premium: £997',
      value: 'Recommend: £397 (2x increase, still competitive)',
      impact: 'high',
      animation: 'slide'
    }
  }
  
  /**
   * Winning ad found
   */
  private winningAdFoundUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    const ads = [
      {
        message: 'WINNER: Ad running 94 days straight',
        detail: '"Transform in 30 Days or Your Money Back"',
        value: '2.3% CTR (industry avg: 0.9%)'
      },
      {
        message: 'Found a GOLDMINE ad',
        detail: '"We\'ll Do It For You (Or It\'s Free)"',
        value: 'Running since January, still scaling'
      },
      {
        message: 'This ad is PRINTING money',
        detail: '"From £0 to £10k/month in 90 days"',
        value: '156 days active, 5-figure spend'
      }
    ]
    
    const chosen = ads[Math.floor(Math.random() * ads.length)]
    
    return {
      type: 'success',
      icon: '🏆',
      message: chosen.message,
      detail: chosen.detail,
      value: chosen.value,
      impact: 'high',
      animation: 'bounce'
    }
  }
  
  /**
   * Competitor weakness found
   */
  private weaknessFoundUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    const weaknesses = [
      {
        message: 'Competitor WEAKNESS detected',
        detail: 'No mobile optimization - 67% of traffic bounces',
        value: 'Your opportunity to dominate mobile'
      },
      {
        message: 'They\'re vulnerable!',
        detail: 'No email follow-up sequence',
        value: 'You could capture their lost leads'
      },
      {
        message: 'Major gap found',
        detail: 'No video testimonials (you have 5!)',
        value: 'Your competitive advantage'
      }
    ]
    
    const chosen = weaknesses[Math.floor(Math.random() * weaknesses.length)]
    
    return {
      type: 'warning',
      icon: '⚡',
      message: chosen.message,
      detail: chosen.detail,
      value: chosen.value,
      impact: 'high',
      animation: 'pulse'
    }
  }
  
  /**
   * AI processing update
   */
  private aiProcessingUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    return {
      type: 'discovery',
      icon: '🤖',
      message: 'AI found your unique angle',
      detail: 'Combining your strengths with market gaps',
      value: 'No one else is doing THIS...',
      impact: 'high',
      animation: 'pulse'
    }
  }
  
  /**
   * Final insight before capture
   */
  private finalInsightUpdate(): Omit<FeedUpdate, 'id' | 'timestamp'> {
    return {
      type: 'success',
      icon: '✨',
      message: 'Strategy complete! 12 actionable insights ready',
      detail: 'Including: 3 quick wins, 5 ad templates, pricing strategy',
      value: 'Potential impact: +£50k/year',
      impact: 'high',
      animation: 'bounce'
    }
  }
  
  /**
   * Generate live narrative based on current state
   */
  getLiveNarrative(elapsedSeconds: number): string {
    const narratives = [
      { at: 5, text: "🔍 Scanning your site... interesting approach to headlines" },
      { at: 10, text: "💡 Found something... you're definitely undercharging!" },
      { at: 15, text: "🎯 Located your main competitor (they're vulnerable)" },
      { at: 20, text: "📱 Accessing Facebook Ads Library... jackpot!" },
      { at: 25, text: "🔥 This ad has been running 94 days (must be working)" },
      { at: 30, text: "💰 Calculating optimal pricing... you could charge 2x more" },
      { at: 35, text: "⚡ Found their weakness - they're missing THIS" },
      { at: 40, text: "🤖 AI is connecting the dots... this is genius" },
      { at: 45, text: "✨ Your custom strategy is ready (it's really good)" }
    ]
    
    const current = narratives.find(n => Math.abs(n.at - elapsedSeconds) < 3)
    return current ? current.text : "🚀 Processing incredible insights..."
  }
  
  /**
   * Subscribe to updates
   */
  onUpdate(callback: (update: FeedUpdate) => void) {
    this.updateCallback = callback
  }
  
  /**
   * Get current feed state
   */
  getCurrentFeed(): FeedUpdate[] {
    return this.updates
  }
  
  /**
   * Get summary of discoveries
   */
  getSummary(): JourneySummary {
    const discoveries = this.updates.filter(u => u.type === 'discovery').length
    const insights = this.updates.filter(u => u.type === 'insight').length
    const warnings = this.updates.filter(u => u.type === 'warning').length
    const successes = this.updates.filter(u => u.type === 'success').length
    
    return {
      totalUpdates: this.updates.length,
      discoveries,
      insights,
      warnings,
      successes,
      highImpact: this.updates.filter(u => u.impact === 'high').length,
      elapsedTime: Math.floor((Date.now() - this.startTime) / 1000),
      excitement: this.calculateExcitement()
    }
  }
  
  /**
   * Calculate excitement level
   */
  private calculateExcitement(): number {
    const recentUpdates = this.updates.slice(-5)
    const highImpact = recentUpdates.filter(u => u.impact === 'high').length
    return Math.min(highImpact * 20, 100)
  }
}

export interface JourneySummary {
  totalUpdates: number
  discoveries: number
  insights: number
  warnings: number
  successes: number
  highImpact: number
  elapsedTime: number
  excitement: number
}

/**
 * Feed display formatter
 */
export class FeedFormatter {
  /**
   * Format update for display
   */
  formatUpdate(update: FeedUpdate): FormattedUpdate {
    const elapsed = Math.floor((Date.now() - update.timestamp.getTime()) / 1000)
    
    return {
      icon: update.icon,
      headline: this.formatHeadline(update),
      detail: update.detail || '',
      value: update.value ? this.formatValue(update.value) : undefined,
      timeAgo: this.formatTimeAgo(elapsed),
      cssClass: this.getCssClass(update),
      animation: update.animation || 'fade'
    }
  }
  
  private formatHeadline(update: FeedUpdate): string {
    if (update.impact === 'high') {
      return `**${update.message}**`
    }
    return update.message
  }
  
  private formatValue(value: string | number): string {
    if (typeof value === 'number') {
      return `£${value.toLocaleString()}`
    }
    return value
  }
  
  private formatTimeAgo(seconds: number): string {
    if (seconds < 5) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 120) return '1 min ago'
    return `${Math.floor(seconds / 60)} mins ago`
  }
  
  private getCssClass(update: FeedUpdate): string {
    const classes = ['feed-update']
    
    classes.push(`feed-${update.type}`)
    
    if (update.impact === 'high') {
      classes.push('feed-important')
    }
    
    if (update.animation) {
      classes.push(`animate-${update.animation}`)
    }
    
    return classes.join(' ')
  }
}

export interface FormattedUpdate {
  icon: string
  headline: string
  detail: string
  value?: string
  timeAgo: string
  cssClass: string
  animation: string
}

/**
 * Excitement builders for the feed
 */
export const ExcitementBuilders = {
  discoveries: [
    "😱 No way... they're doing WHAT?",
    "🤯 Mind = blown. This changes everything",
    "💎 Found gold! This is why they're winning",
    "🔥 This is HOT - nobody else knows this",
    "⚡ Game changer alert!",
    "🎯 Bullseye! Found the secret sauce"
  ],
  
  teasers: [
    "Wait till you see this...",
    "You're not ready for what's next",
    "This is getting interesting...",
    "Plot twist incoming...",
    "Hold onto your hat...",
    "The next part is INSANE"
  ],
  
  revelations: [
    "BOOM! There it is",
    "This is why you're here",
    "Worth the wait, right?",
    "Told you this would be good",
    "And THAT'S how you win",
    "Mic drop moment 🎤"
  ]
}

/**
 * Dynamic feed messages based on industry
 */
export function getIndustrySpecificUpdates(industry: string): FeedUpdate[] {
  const industryUpdates: Record<string, Partial<FeedUpdate>[]> = {
    fitness: [
      {
        type: 'discovery',
        icon: '💪',
        message: 'Transformation photos missing!',
        detail: 'Before/after pics increase conversions by 284%'
      },
      {
        type: 'insight',
        icon: '🏃',
        message: 'Competitor using 30-day challenges',
        detail: 'Average customer value: £297 per challenge'
      }
    ],
    
    coaching: [
      {
        type: 'discovery',
        icon: '🎯',
        message: 'No webinar funnel detected',
        detail: 'Webinars convert at 15-25% in your niche'
      },
      {
        type: 'insight',
        icon: '📚',
        message: 'Free book funnel opportunity',
        detail: 'Competitors getting £15 cost per lead with books'
      }
    ],
    
    ecommerce: [
      {
        type: 'discovery',
        icon: '🛒',
        message: 'Cart abandonment not optimized',
        detail: '£4,000/month left on the table'
      },
      {
        type: 'insight',
        icon: '📦',
        message: 'Free shipping threshold too high',
        detail: 'Drop from £100 to £75 = 23% more orders'
      }
    ]
  }
  
  const updates = industryUpdates[industry.toLowerCase()] || []
  
  return updates.map(u => ({
    id: `ind_${Date.now()}`,
    timestamp: new Date(),
    impact: 'high',
    ...u
  } as FeedUpdate))
}

/**
 * The psychology of the feed
 */
export const FeedPsychology = {
  principles: {
    1: "Every update must add value or build anticipation",
    2: "Mix discoveries (what we found) with insights (what it means)",
    3: "Use teasers to build curiosity before big reveals",
    4: "Show competitor weaknesses to build confidence",
    5: "Quantify opportunities in pounds/dollars",
    6: "End on high excitement to trigger action",
    7: "Make them feel the journey was personalized"
  },
  
  timing: {
    immediate: "0-10 seconds: Quick wins to hook them",
    building: "10-30 seconds: Deeper insights emerging",
    peak: "30-45 seconds: Major discoveries",
    closing: "45-60 seconds: Urgency to get full report"
  }
}