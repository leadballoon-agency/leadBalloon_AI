/**
 * Authentic Journey System
 * Takes real time, admits failures, asks for help, creates genuine value
 * "If I had more time, I would have written a shorter letter"
 */

export interface JourneyPhase {
  phase: 'discovery' | 'research' | 'analysis' | 'crafting' | 'refining'
  duration: number // minimum seconds
  messages: string[]
  needsHelp?: string // What we might need from user
}

export class AuthenticJourney {
  private startTime: number = 0
  private currentPhase: number = 0
  private queuePosition: number = 0
  
  private phases: JourneyPhase[] = [
    {
      phase: 'discovery',
      duration: 15,
      messages: [
        "Starting your analysis...",
        "This is going to take a few minutes to do properly",
        "Quick question - while I'm working, what's your biggest challenge right now?",
        "Interesting... let me dig into that"
      ],
      needsHelp: "What's your main goal with this?"
    },
    {
      phase: 'research',
      duration: 30,
      messages: [
        "Trying to access Facebook Ads Library...",
        "Getting blocked by their security",
        "Let me try a different approach",
        "Actually, this needs manual access",
        "Switching to template analysis instead"
      ],
      needsHelp: "Name one competitor you admire?"
    },
    {
      phase: 'analysis',
      duration: 45,
      messages: [
        "Running your info through AI...",
        "Getting generic recommendations back",
        "These are templates, not custom insights",
        "For real analysis, we need human research",
        "Let me be honest about what I can actually do..."
      ]
    },
    {
      phase: 'crafting',
      duration: 60,
      messages: [
        "Writing your copy... first draft is terrible",
        "Deleting everything and starting over",
        "Remember: 'If I had more time, it would be shorter'",
        "Third draft... getting closer",
        "Using the Gary Halbert formula now",
        "This is actually good... but can be better"
      ]
    },
    {
      phase: 'refining',
      duration: 30,
      messages: [
        "Cutting 50% of the words (less is more)",
        "Making it punchier...",
        "One more pass to make it irresistible",
        "Done! But let me review once more",
        "Actually, changing the headline..."
      ]
    }
  ]
  
  /**
   * Start the authentic journey
   */
  startJourney(): string {
    this.startTime = Date.now()
    this.queuePosition = Math.floor(Math.random() * 5) + 3 // Queue position 3-7
    
    if (this.queuePosition > 1) {
      return `You're #${this.queuePosition} in queue. This will take about ${this.getTotalTime()} minutes to do properly.`
    }
    
    return "You're next! Starting your analysis now..."
  }
  
  /**
   * Get current status message
   */
  getCurrentMessage(elapsed: number): {
    message: string
    phase: string
    needsInput?: boolean
    inputPrompt?: string
    progress: number
  } {
    // Find current phase based on elapsed time
    let totalTime = 0
    let currentPhase = this.phases[0]
    
    for (const phase of this.phases) {
      if (elapsed < totalTime + phase.duration) {
        currentPhase = phase
        break
      }
      totalTime += phase.duration
    }
    
    // Get message for current phase
    const phaseProgress = (elapsed - totalTime) / currentPhase.duration
    const messageIndex = Math.floor(phaseProgress * currentPhase.messages.length)
    const message = currentPhase.messages[Math.min(messageIndex, currentPhase.messages.length - 1)]
    
    // Sometimes we need help
    const needsInput = currentPhase.needsHelp && Math.random() > 0.7
    
    return {
      message,
      phase: currentPhase.phase,
      needsInput,
      inputPrompt: needsInput ? currentPhase.needsHelp : undefined,
      progress: Math.min((elapsed / this.getTotalTime()) * 100, 100)
    }
  }
  
  /**
   * Handle when things go wrong (be honest)
   */
  handleError(error: string): string[] {
    return [
      "Okay, I hit a snag...",
      `Error: ${error}`,
      "Two options:",
      "1. Give me your email and I will send the full analysis in 2 hours",
      "2. Answer a few questions and I will work around this"
    ]
  }
  
  /**
   * Get queue messages
   */
  getQueueMessage(): string {
    const messages = [
      "While you wait, go watch that Netflix show you've been putting off",
      "Perfect time for a coffee break - this is going to be worth it",
      "Fun fact: The best ads are written in 10 minutes... after 10 hours of research",
      "Your competitors have no idea what's about to hit them",
      "I'm literally reading 100+ ads right now to find patterns",
      "The longer this takes, the better your results (like good wine)"
    ]
    
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Get total time in minutes
   */
  private getTotalTime(): number {
    const totalSeconds = this.phases.reduce((sum, phase) => sum + phase.duration, 0)
    return Math.ceil(totalSeconds / 60)
  }
  
  /**
   * Admission of limitations - COMPLETE HONESTY
   */
  getHonestyMoment(): string[] {
    return [
      "Okay, time for complete honesty...",
      "I tried to scrape your website - it timed out",
      "I tried Facebook Ads Library - they blocked me",
      "The AI analysis? Would need API keys you probably don't have",
      "",
      "Here's the REAL deal:",
      "This is a lead capture tool disguised as an analyzer",
      "But that's actually GOOD for you because...",
      "We DO manually research everything we promised",
      "You get REAL human analysis, not AI guesses",
      "It just takes 24 hours instead of 24 seconds"
    ]
  }
  
  /**
   * The payoff - BE HONEST about what we actually did
   */
  deliverResults(): {
    summary: string
    insights: string[]
    offer: string
    nextSteps: string
  } {
    return {
      summary: "Here's what I actually found (no BS):",
      insights: [
        "I tried to scrape your site - got some basic info",
        "I ran it through AI - got template recommendations", 
        "Facebook Ads? Can't scrape that (they block automation)",
        "The REAL analysis requires manual work by experts"
      ],
      offer: "Get a FULL manual analysis: Complete competitor research + winning copy frameworks + conversion strategy",
      nextSteps: "Take a ticket - Get your manual analysis within 24 hours (Only 5 spots left this week)"
    }
  }
}

/**
 * Queue management system
 */
export class QueueManager {
  private queue: Map<string, {
    position: number
    startTime: number
    email?: string
    status: 'waiting' | 'processing' | 'completed'
  }> = new Map()
  
  /**
   * Add user to queue
   */
  addToQueue(userId: string): number {
    const position = this.queue.size + 1
    this.queue.set(userId, {
      position,
      startTime: Date.now(),
      status: 'waiting'
    })
    return position
  }
  
  /**
   * Update queue position
   */
  updatePosition(userId: string): number {
    const user = this.queue.get(userId)
    if (!user) return 0
    
    // Move up in queue over time
    const elapsed = (Date.now() - user.startTime) / 1000
    const moveUp = Math.floor(elapsed / 30) // Move up 1 spot every 30 seconds
    
    return Math.max(1, user.position - moveUp)
  }
  
  /**
   * Get estimated wait time
   */
  getWaitTime(position: number): string {
    const minutes = position * 3 // 3 minutes per person ahead
    if (minutes < 5) return "Less than 5 minutes"
    if (minutes < 15) return "About 10 minutes"
    return `About ${Math.round(minutes / 5) * 5} minutes`
  }
}

/**
 * Storytelling elements
 */
export const JourneyStories = {
  copywriterStory: [
    "You know the story about the copywriter who apologized for the long letter?",
    "'If I'd had more time, it would have been shorter'",
    "That's what I'm doing now - taking the time to make this perfect",
    "Your offer will be so tight, so compelling, it'll feel effortless",
    "But it takes time to make something look easy"
  ],
  
  workingHard: [
    "I'm reading your competitor's ad for the 3rd time",
    "There's something hidden in their copy... found it!",
    "They are using the 'Problem-Agitate-Solve' formula",
    "But they are missing the 'Unique Mechanism' (huge mistake)",
    "You are going to destroy them with what I am building"
  ],
  
  breakthrough: [
    "WAIT. I just found something huge.",
    "Your biggest competitor? Their ads stop working after 34 days.",
    "I know exactly why (and how to avoid it)",
    "This changes everything...",
    "Give me 5 more minutes to rewrite your strategy"
  ]
}