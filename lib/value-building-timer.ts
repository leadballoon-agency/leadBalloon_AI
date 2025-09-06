/**
 * Value Building Timer
 * "Never deliver too quickly - show a bit of leg only"
 * The wait time IS part of the value proposition
 */

export class ValueBuildingTimer {
  // Minimum waits to build anticipation
  private readonly MIN_INSTANT_ANALYSIS = 45 // 45 seconds minimum even if ready
  private readonly MIN_DEEP_ANALYSIS = 180 // 3 minutes minimum
  private readonly IDEAL_TEASE_TIME = 120 // 2 minutes is perfect for showing value
  
  /**
   * Calculate strategic wait time
   * NEVER instant - that looks cheap
   */
  calculateStrategicWait(actualProcessingTime: number): {
    displayTime: number
    phases: WaitPhase[]
  } {
    // Never less than minimum
    const targetTime = Math.max(
      actualProcessingTime,
      this.MIN_DEEP_ANALYSIS
    )
    
    return {
      displayTime: targetTime,
      phases: this.generateWaitPhases(targetTime)
    }
  }
  
  /**
   * Generate phases that build value
   */
  private generateWaitPhases(totalTime: number): WaitPhase[] {
    return [
      {
        start: 0,
        duration: 15,
        message: "🔍 Scanning your website structure...",
        showPreview: false
      },
      {
        start: 15,
        duration: 20,
        message: "💡 Found something interesting...",
        showPreview: true,
        preview: "Your headline is missing a key element..."
      },
      {
        start: 35,
        duration: 25,
        message: "🎯 Analyzing competitor strategies...",
        showPreview: false
      },
      {
        start: 60,
        duration: 20,
        message: "😮 Your top competitor is vulnerable...",
        showPreview: true,
        preview: "They're charging £697 but missing..."
      },
      {
        start: 80,
        duration: 30,
        message: "📱 Scanning Facebook Ads Library...",
        showPreview: false
      },
      {
        start: 110,
        duration: 20,
        message: "🔥 Found ads running 90+ days...",
        showPreview: true,
        preview: "This headline is converting like crazy..."
      },
      {
        start: 130,
        duration: 30,
        message: "🧠 AI optimizing your custom strategy...",
        showPreview: false
      },
      {
        start: 160,
        duration: 20,
        message: "✨ Generating your report...",
        showPreview: true,
        preview: "You could charge 47% more because..."
      }
    ]
  }
}

export interface WaitPhase {
  start: number // seconds
  duration: number // seconds
  message: string
  showPreview: boolean
  preview?: string
}

/**
 * Drip-feed value discoveries
 * Show just enough to build desire
 */
export class ValueDripFeeder {
  private discoveries: Discovery[] = []
  private currentIndex = 0
  
  /**
   * Add discoveries to reveal over time
   */
  addDiscoveries(discoveries: Discovery[]) {
    this.discoveries = discoveries
    this.currentIndex = 0
  }
  
  /**
   * Get next discovery to show
   * Reveals more valuable info as time passes
   */
  getNextDiscovery(elapsedSeconds: number): Discovery | null {
    // Show discoveries at strategic intervals
    const revealSchedule = [
      20,  // Quick win at 20 seconds
      45,  // Bigger insight at 45 seconds  
      75,  // Competitor weakness at 75 seconds
      105, // Winning ad at 105 seconds
      135, // Pricing opportunity at 135 seconds
    ]
    
    const shouldReveal = revealSchedule.some(
      time => Math.abs(elapsedSeconds - time) < 2
    )
    
    if (shouldReveal && this.currentIndex < this.discoveries.length) {
      return this.discoveries[this.currentIndex++]
    }
    
    return null
  }
}

export interface Discovery {
  type: 'quick-win' | 'competitor' | 'opportunity' | 'warning'
  teaser: string // What we show
  fullInsight: string // What they get in the report
  value: 'low' | 'medium' | 'high'
}

/**
 * Psychological wait strategies
 */
export const WaitStrategies = {
  /**
   * The "Cooking Show" Strategy
   * Show the process to build anticipation
   */
  cookingShow: [
    "🔥 Preheating our AI engines...",
    "🥘 Adding your website data to the mix...",
    "🧂 Seasoning with competitor insights...",
    "👨‍🍳 Our algorithms are working their magic...",
    "🍽️ Plating your custom strategy..."
  ],
  
  /**
   * The "Behind the Curtain" Strategy
   * Show impressive technical process
   */
  behindCurtain: [
    "🤖 Neural networks analyzing 10,000 data points...",
    "📊 Cross-referencing with 50,000 winning ads...",
    "🔬 Pattern matching against industry leaders...",
    "⚡ Quantum processing your unique angle...",
    "🎯 Precision targeting your opportunities..."
  ],
  
  /**
   * The "Treasure Hunt" Strategy
   * Build excitement about discoveries
   */
  treasureHunt: [
    "🗺️ Mapping your market landscape...",
    "🔍 X marks the spot... found something!",
    "💎 Uncovering hidden opportunities...",
    "🏴‍☠️ Your competitors' weakness discovered...",
    "🏆 Calculating your treasure value..."
  ],
  
  /**
   * The "Doctor Diagnosis" Strategy
   * Professional and thorough
   */
  diagnosis: [
    "🩺 Initial examination of symptoms...",
    "🔬 Running diagnostic tests...",
    "💊 Identifying the core issues...",
    "📋 Comparing to successful cases...",
    "💉 Preparing your treatment plan..."
  ]
}

/**
 * Never give it all at once
 * The tease is the product
 */
export function getTeaseSchedule(): TeaseSchedule {
  return {
    immediate: {
      show: "Basic website issues",
      hide: "Specific fixes"
    },
    after30Seconds: {
      show: "Competitor exists",
      hide: "Who they are and weaknesses"
    },
    after60Seconds: {
      show: "Found winning ads",
      hide: "Actual ad copy"
    },
    after90Seconds: {
      show: "Price opportunity exists",
      hide: "Exact pricing strategy"
    },
    after120Seconds: {
      show: "Custom strategy ready",
      hide: "The actual strategy"
    },
    onEmailCapture: {
      show: "Everything",
      hide: "Nothing - they earned it"
    }
  }
}

interface TeaseSchedule {
  [key: string]: {
    show: string
    hide: string
  }
}

/**
 * The golden rule
 */
export const VALUE_RULES = {
  1: "Never deliver in under 45 seconds - looks too easy",
  2: "Always show discoveries progressively - builds anticipation",
  3: "Make them feel the value through the wait",
  4: "The 'almost done' phase should last 30+ seconds",
  5: "If they give email/phone, still wait 30 seconds minimum",
  6: "Premium feel = thoughtful pace, not rushed",
  7: "Show enough to prove value, not enough to DIY"
}

/**
 * Calculate perceived value based on wait time
 */
export function calculatePerceivedValue(waitTimeSeconds: number): {
  perception: string
  trustLevel: number
} {
  if (waitTimeSeconds < 30) {
    return {
      perception: "Too quick - seems generic",
      trustLevel: 3
    }
  } else if (waitTimeSeconds < 60) {
    return {
      perception: "Fast but thorough",
      trustLevel: 5
    }
  } else if (waitTimeSeconds < 180) {
    return {
      perception: "Detailed analysis - high value",
      trustLevel: 8
    }
  } else if (waitTimeSeconds < 300) {
    return {
      perception: "Deep research - premium service",
      trustLevel: 9
    }
  } else {
    return {
      perception: "Comprehensive - worth the wait",
      trustLevel: 10
    }
  }
}