/**
 * Smart Queue Manager
 * Intelligently manages queue length and converts wait time into lead capture
 * Shows personality while being genuinely helpful
 */

export interface QueueState {
  currentLength: number
  averageWaitTime: number // in minutes
  systemLoad: 'low' | 'medium' | 'high' | 'overloaded'
  userPosition?: number
  estimatedWait?: number
}

/**
 * Intelligent responses based on queue state
 */
export class SmartQueueManager {
  private readonly COMFORT_THRESHOLD = 5 // Queue under 5 = still make them wait
  private readonly PATIENCE_THRESHOLD = 15 // Queue over 15 = offer email
  private readonly PANIC_THRESHOLD = 30 // Queue over 30 = apologetic + priority
  private readonly MINIMUM_WAIT = 3 // ALWAYS at least 3 minutes (builds value)
  
  /**
   * Get smart message based on queue state
   */
  getQueueResponse(state: QueueState, hasEmail: boolean = false, hasPhone: boolean = false): {
    message: string
    action?: 'process' | 'capture_email' | 'capture_phone' | 'apologize'
    tone: 'playful' | 'helpful' | 'urgent' | 'apologetic'
  } {
    const { currentLength, userPosition = currentLength + 1 } = state
    
    // INSTANT GRATIFICATION (Queue < 5)
    if (currentLength < this.COMFORT_THRESHOLD) {
      return {
        message: this.getInstantMessage(userPosition),
        action: 'process',
        tone: 'playful'
      }
    }
    
    // MANAGEABLE WAIT (Queue 5-15)
    if (currentLength < this.PATIENCE_THRESHOLD) {
      if (!hasEmail) {
        return {
          message: this.getPatientCaptureMessage(userPosition),
          action: 'capture_email',
          tone: 'helpful'
        }
      }
      return {
        message: this.getManageableWaitMessage(userPosition),
        action: 'process',
        tone: 'playful'
      }
    }
    
    // GETTING LONG (Queue 15-30)
    if (currentLength < this.PANIC_THRESHOLD) {
      if (!hasEmail) {
        return {
          message: this.getUrgentCaptureMessage(userPosition),
          action: 'capture_email',
          tone: 'urgent'
        }
      }
      if (!hasPhone) {
        return {
          message: this.getPhonePriorityMessage(userPosition),
          action: 'capture_phone',
          tone: 'helpful'
        }
      }
      return {
        message: this.getLongWaitMessage(userPosition),
        action: 'process',
        tone: 'helpful'
      }
    }
    
    // OVERLOADED (Queue 30+)
    return {
      message: this.getOverloadedMessage(userPosition, hasEmail),
      action: hasEmail ? 'process' : 'capture_email',
      tone: 'apologetic'
    }
  }
  
  /**
   * Instant processing messages (Queue < 5)
   */
  private getInstantMessage(position: number): string {
    const messages = [
      `⚡ Only ${position} ahead! This'll be quicker than deciding what to watch on Netflix`,
      `🏃 Just ${position} in front! Faster than Uber surge pricing updates`,
      `✨ ${position} to go! We'll be done before your coffee gets cold`,
      `🚀 Position ${position}! Practically instant (in geological terms)`,
      `🎯 Lucky you! Only ${position} ahead. It's giving VIP without the price tag`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Patient capture messages (Queue 5-15, no email)
   */
  private getPatientCaptureMessage(position: number): string {
    const messages = [
      `📬 Position ${position} - about ${position * 2} mins. Drop your email and go touch grass, we'll ping you when ready!`,
      `☕ You're #${position} (~${position * 2} mins). Email us and we'll send a notification - better than watching paint dry!`,
      `📱 Queue: ${position}. Perfect coffee break timing! Leave your email and we'll text when ready`,
      `🎬 #${position} in line. Enough time for a YouTube rabbit hole. Email = notification when done!`,
      `⏰ About ${position * 2} mins wait. Drop your email and we'll slide into your inbox when ready`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Manageable wait messages (Queue 5-15, has email)
   */
  private getManageableWaitMessage(position: number): string {
    const messages = [
      `📧 Great! Position ${position}. We'll email you in ~${position * 2} mins. Time to pretend to work!`,
      `✅ Perfect! #${position}. Check your email in ${position * 2} mins (or doom-scroll, we don't judge)`,
      `🎯 Noted! You're ${position}. Email coming faster than Amazon same-day delivery`,
      `📬 Got it! Position ${position}. We'll email you before your Wordle streak is broken`,
      `⚡ Sweet! #${position}. Email notification coming in ${position * 2} mins. Maybe check your spam folder?`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Urgent capture messages (Queue 15-30, no email)
   */
  private getUrgentCaptureMessage(position: number): string {
    const messages = [
      `😅 Oof, position ${position}. Gonna be ~${position * 2} mins. Email = you can close this tab and live your life!`,
      `🎪 It's busy! You're #${position}. Drop your email unless you enjoy watching progress bars`,
      `📊 Popular today! Position ${position}. Email us - we promise not to spam (just this once)`,
      `🔥 We're cooking! #${position} means ${position * 2} mins. Email = freedom to do literally anything else`,
      `⏳ Yikes, ${position} ahead. That's a whole episode of The Office. Email for notification?`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Phone priority messages (Queue 15-30, has email, no phone)
   */
  private getPhonePriorityMessage(position: number): string {
    const messages = [
      `📱 Psst... position ${position} but phone number = jump to express lane (we'll text AND email)`,
      `⚡ Want to skip ahead? Phone gets priority processing. Currently ${position} vs could be top 5...`,
      `🎫 VIP access available: Add phone, skip to priority queue. From ${position} to basically now`,
      `💨 Skip ${position - 5} people with your digits. It's not cutting, it's... strategic queueing`,
      `🚀 Phone number unlocks turbo mode. Jump from ${position} to the fast lane!`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Long wait messages (Queue 15-30, has contact)
   */
  private getLongWaitMessage(position: number): string {
    const messages = [
      `⏰ Position ${position}. ETA: ${position * 2} mins. We'll text AND email. Go live your best life!`,
      `📲 All set! #${position}. We've got your number. Expect good news in ${position * 2} mins`,
      `✨ Perfect! You're ${position}. Notification squad assembled. See you in ${position * 2}!`,
      `🎯 Locked in at ${position}. We'll hit you up on all channels when ready`,
      `📬 Position ${position} confirmed. ${position * 2} mins to greatness. We'll find you!`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Overloaded messages (Queue 30+)
   */
  private getOverloadedMessage(position: number, hasEmail: boolean): string {
    if (!hasEmail) {
      const messages = [
        `😬 Okay, real talk - position ${position} is rough. Like ${position * 2}+ mins rough. Email = we'll make it worth the wait!`,
        `🙈 We're SWAMPED! Position ${position}. Drop your email and we'll send you something special for waiting`,
        `💔 Position ${position}?! That's... a lot. Email us - we'll prioritize you tomorrow morning!`,
        `🆘 System is POPULAR today! #${position}. Email = priority tomorrow + bonus insights`,
        `😅 Yeahhh ${position} is giving "check back tomorrow" energy. Email for priority notification?`
      ]
      return messages[Math.floor(Math.random() * messages.length)]
    }
    
    // Has email, apologetic but reassuring
    const messages = [
      `🙏 Thanks for your patience! Position ${position}. We're manually fast-tracking emails. Hang tight!`,
      `💪 You're a legend for waiting! #${position}. Your report will be EXTRA thorough`,
      `🏆 Position ${position} but you've got VIP status now. We're on it!`,
      `⚡ We see you at ${position}! Working overtime to clear this queue. You're getting the premium treatment`,
      `🎁 Position ${position} = bonus insights coming your way. Thanks for sticking around!`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  /**
   * Calculate realistic wait times
   */
  calculateWaitTime(position: number, systemLoad: string): number {
    const baseTime = 2 // 2 minutes per position normally
    
    const multiplier = {
      'low': 1,
      'medium': 1.5,
      'high': 2,
      'overloaded': 3
    }[systemLoad] || 1
    
    return Math.ceil(position * baseTime * multiplier)
  }
  
  /**
   * Get follow-up messages for long waits
   */
  getFollowUpMessage(waitedMinutes: number): string {
    if (waitedMinutes < 5) {
      return "⚡ Almost there! Your analysis is cooking..."
    } else if (waitedMinutes < 10) {
      return "🔥 Getting spicy! Just optimizing your insights..."
    } else if (waitedMinutes < 20) {
      return "🏃 Still here! Finding some REALLY good competitor intel..."
    } else {
      return "🙏 You're a saint for waiting. Making this EXTRA valuable for you..."
    }
  }
  
  /**
   * Error recovery messages (when things break)
   */
  getErrorRecovery(hasContact: boolean): string {
    if (!hasContact) {
      return "😅 Okay our robots had a moment. Drop your email and a human will personally handle this!"
    }
    return "🔧 Technical hiccup! But we've got your details. Expect something amazing within 2 hours!"
  }
}

export const queueManager = new SmartQueueManager()

/**
 * Dynamic queue messages based on real conditions
 */
export function getSmartQueueMessage(
  queueLength: number,
  userPosition: number,
  hasEmail: boolean = false,
  hasPhone: boolean = false
): {
  display: string
  showEmailCapture: boolean
  showPhoneCapture: boolean
  priority: 'instant' | 'normal' | 'urgent'
} {
  const state: QueueState = {
    currentLength: queueLength,
    userPosition,
    averageWaitTime: userPosition * 2,
    systemLoad: queueLength > 30 ? 'overloaded' : 
                queueLength > 15 ? 'high' : 
                queueLength > 5 ? 'medium' : 'low'
  }
  
  const response = queueManager.getQueueResponse(state, hasEmail, hasPhone)
  
  return {
    display: response.message,
    showEmailCapture: response.action === 'capture_email',
    showPhoneCapture: response.action === 'capture_phone',
    priority: response.tone === 'urgent' || response.tone === 'apologetic' ? 'urgent' : 
              state.currentLength < 5 ? 'instant' : 'normal'
  }
}