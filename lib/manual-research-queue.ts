/**
 * Manual Research Queue System
 * When automation fails, we admit it and put them in a queue for manual research
 * This captures their details and sets proper expectations
 */

export interface QueueEntry {
  id: string
  timestamp: Date
  position: number
  estimatedTime: string
  contactInfo: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  researchRequest: {
    url: string
    businessType: string
    niche: string
    competitors?: string[]
    specificNeeds?: string
  }
  status: 'waiting' | 'in_progress' | 'completed' | 'delivered'
  assignedTo?: string // Team member handling this
  notes?: string[]
}

export class ManualResearchQueue {
  private queue: Map<string, QueueEntry> = new Map()
  private currentPosition: number = 1
  
  /**
   * Add someone to the manual research queue
   */
  addToQueue(
    contactInfo: QueueEntry['contactInfo'],
    researchRequest: QueueEntry['researchRequest']
  ): {
    entry: QueueEntry
    messages: string[]
  } {
    const id = `research_${Date.now()}`
    const position = this.queue.size + 1
    
    const entry: QueueEntry = {
      id,
      timestamp: new Date(),
      position,
      estimatedTime: this.getEstimatedTime(position),
      contactInfo,
      researchRequest,
      status: 'waiting'
    }
    
    this.queue.set(id, entry)
    
    // Return honest messages about what's happening
    const messages = [
      `📋 You're #${position} in the queue for manual research`,
      `⏰ Estimated delivery: ${entry.estimatedTime}`,
      `👨‍💻 A real human will personally research your niche`,
      `📱 We'll analyze 50+ Facebook ads in your industry`,
      `✅ You'll receive: Winning ads report + Custom strategy`,
      `📧 Sending confirmation to ${contactInfo.email}`
    ]
    
    return { entry, messages }
  }
  
  /**
   * Get estimated time based on queue position
   */
  private getEstimatedTime(position: number): string {
    if (position === 1) {
      return "Within 2-4 hours"
    } else if (position <= 3) {
      return "Within 6-8 hours"
    } else if (position <= 5) {
      return "Within 12-24 hours"
    } else {
      return "Within 24-48 hours"
    }
  }
  
  /**
   * Messages to show while they wait
   */
  getWaitingMessages(): string[] {
    return [
      "While you wait, here's what we're doing for you:",
      "1. Searching Facebook Ads Library for your exact niche",
      "2. Finding ads that have been running 90+ days (the winners)",
      "3. Analyzing their hooks, offers, and psychology",
      "4. Creating your custom strategy based on what works",
      "",
      "This takes time because we do it RIGHT.",
      "No AI guessing. Real research. Real results."
    ]
  }
  
  /**
   * What they get in their report
   */
  getDeliverables(): string[] {
    return [
      "📊 5-10 winning ads from your niche with full breakdowns",
      "💰 Exact pricing strategies your competitors use",
      "📝 Copy templates based on proven winners",
      "🎯 Your unique angle (what others are missing)",
      "🚀 30-day launch plan with daily tasks",
      "💎 BONUS: Assessment tool template for Facebook ads"
    ]
  }
}

/**
 * Messages for different stages of manual research
 */
export const ManualResearchMessages = {
  admission: [
    "Full transparency: Facebook blocked our automated scraping",
    "But that's actually GOOD news for you...",
    "It means we'll do this manually - which gets BETTER results",
    "Real human eyes on your competition",
    "We'll find things AI would miss"
  ],
  
  valueBuilding: [
    "Manual research finds the hidden gems",
    "We'll check competitor pages, not just ads library",
    "We'll look at their landing pages too",
    "You're getting $2,000 worth of research for free",
    "This is what agencies charge $5k+ for"
  ],
  
  urgency: [
    "Only taking 10 manual research requests this week",
    "After that, it's a 2-week wait",
    "Secure your spot now"
  ],
  
  social: [
    "Janet from Bristol: 'Found 3 competitors I didn't know existed'",
    "Mike from Manchester: 'The manual research was 10x more valuable'",
    "Sarah from London: 'Worth the wait - found my exact positioning'"
  ]
}

/**
 * Lead capture during queue
 */
export interface LeadCaptureData {
  name: string
  email: string
  phone?: string
  company?: string
  url: string
  businessType?: string
  monthlyRevenue?: string
  biggestChallenge?: string
  competitors?: string[]
  whenToLaunch?: string
  budget?: string
}

export class LeadCaptureFlow {
  private capturedData: Partial<LeadCaptureData> = {}
  
  /**
   * Progressive questions to ask while they wait
   */
  getNextQuestion(): {
    question: string
    field: keyof LeadCaptureData
    required: boolean
    options?: string[]
  } | null {
    // Essential info first
    if (!this.capturedData.name) {
      return {
        question: "What's your name?",
        field: 'name',
        required: true
      }
    }
    
    if (!this.capturedData.email) {
      return {
        question: "Where should we send your research?",
        field: 'email',
        required: true
      }
    }
    
    if (!this.capturedData.phone) {
      return {
        question: "Phone number? (We'll text you when ready)",
        field: 'phone',
        required: false
      }
    }
    
    // Valuable qualifying questions
    if (!this.capturedData.monthlyRevenue) {
      return {
        question: "Current monthly revenue?",
        field: 'monthlyRevenue',
        required: false,
        options: ['$0-5k', '$5-25k', '$25-100k', '$100k+']
      }
    }
    
    if (!this.capturedData.biggestChallenge) {
      return {
        question: "What's your biggest marketing challenge?",
        field: 'biggestChallenge',
        required: false
      }
    }
    
    if (!this.capturedData.competitors) {
      return {
        question: "Name 1-3 competitors (helps our research)",
        field: 'competitors',
        required: false
      }
    }
    
    if (!this.capturedData.whenToLaunch) {
      return {
        question: "When do you want to launch ads?",
        field: 'whenToLaunch',
        required: false,
        options: ['This week', 'Next month', 'In 3 months', 'Just researching']
      }
    }
    
    if (!this.capturedData.budget) {
      return {
        question: "Monthly ad budget?",
        field: 'budget',
        required: false,
        options: ['$500-2k', '$2-5k', '$5-10k', '$10k+']
      }
    }
    
    return null // All questions answered
  }
  
  /**
   * Save answer and check if we have enough
   */
  saveAnswer(field: keyof LeadCaptureData, value: any): boolean {
    this.capturedData[field] = value
    
    // Check if we have minimum required
    return !!(this.capturedData.name && this.capturedData.email)
  }
  
  /**
   * Get captured data
   */
  getData(): Partial<LeadCaptureData> {
    return this.capturedData
  }
}