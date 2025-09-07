/**
 * Conversation Magic - Create "WOW" moments that make users feel understood
 * 
 * The goal: Make them think "How did they know that?!"
 */

interface MagicMoment {
  trigger: string[]
  response: string
  followUp: string
  impact: 'mindread' | 'insider' | 'empathy' | 'authority'
}

// Industry-specific "mind reading" moments - BASED ON REAL PATTERNS
export const magicMoments: Record<string, MagicMoment[]> = {
  bodyContouring: [
    {
      trigger: ['500', '1000', '1500', '2000'],
      response: "£500-2000 on ads - that's actually the sweet spot for body contouring if you know what you're doing. Most clinics at this spend level are getting 30-50 leads but only closing 5-10%. Is that roughly what you're seeing?",
      followUp: "Here's what actually works: Instead of competing on price, the successful clinics pre-qualify with a 'suitability questionnaire' that builds value. This alone can double your close rate. Want me to explain how it works?",
      impact: 'mindread'
    },
    {
      trigger: ['expensive', 'cost', 'high'],
      response: "Expensive leads - OK, real talk: if you're paying more than £15 per lead for body contouring, you're probably targeting too broad. The fix is counterintuitive: narrow your audience to 'gym members who stopped going' - they're already sold on body transformation.",
      followUp: "This targeting trick cut lead costs by 60% for three clinics I've analyzed. I can walk you through exactly how to set it up if you want?",
      impact: 'insider'
    },
    {
      trigger: ['not enough', 'more leads', 'need leads'],
      response: "Not enough leads? Here's the truth - most body contouring clinics are fighting over the same 'summer body' crowd. But there's a huge untapped market: 'post-baby body recovery'. Different message, way less competition.",
      followUp: "The messaging for this audience is completely different. Instead of 'look great', it's 'feel like yourself again'. Want to know the exact ad copy that's working?",
      impact: 'authority'
    },
    {
      trigger: ['competing', 'competitors', 'competition'],
      response: "Competition in body contouring is real. The national chains have big budgets, but they also have a weakness - they can't provide the personal touch. Independent clinics that lean into this are winning.",
      followUp: "Specifically: showing the SAME practitioner in all your content, using real client stories (with permission), and offering 'comfort calls' the night before treatment. This human touch beats any discount. Should I elaborate?",
      impact: 'insider'
    }
  ],
  
  aesthetics: [
    {
      trigger: ['500', '1000', '1500', '2000'],
      response: "£500-2000 on ads... classic aesthetics clinic spending. Let me guess - you're getting enquiries for Botox at £200 but everyone's shopping around for the cheapest price?",
      followUp: "The secret isn't competing on price - it's about positioning. The clinic charging £350 is busier than the one at £200. I'll show you why.",
      impact: 'mindread'
    },
    {
      trigger: ['botox', 'filler', 'lips'],
      response: "Ah, injectables! The most profitable treatments but also the most price-sensitive market. I bet you're losing clients to that new 'medi-spa' that just opened with their £99 lip filler special?",
      followUp: "They'll be closed in 6 months. But they'll damage your market first unless you do THIS...",
      impact: 'insider'
    }
  ],
  
  dental: [
    {
      trigger: ['invisalign', 'teeth', 'smile'],
      response: "Invisalign competition is insane right now! Every dentist in a 5-mile radius is offering it. But did you know only 3% of practices are using the 'wedding smile' campaign angle?",
      followUp: "It's booking 3x more consultations than 'straight teeth' messaging. Want to see the exact ad?",
      impact: 'insider'
    }
  ],
  
  fitness: [
    {
      trigger: ['gym', 'personal', 'training'],
      response: "Fitness industry... January's amazing, February's good, March you're fighting for every member. Am I right? The problem isn't seasonal - it's that you're selling 'fitness' when people are buying 'transformation'.",
      followUp: "One gym went from 50 to 400 members in 6 months with this shift. Want the exact strategy?",
      impact: 'mindread'
    }
  ]
}

/**
 * Get contextual wow moments based on conversation
 */
export function getWowMoment(
  industry: string, 
  message: string,
  conversationHistory: any[]
): MagicMoment | null {
  const moments = magicMoments[industry] || []
  const lowerMessage = message.toLowerCase()
  
  for (const moment of moments) {
    for (const trigger of moment.trigger) {
      if (lowerMessage.includes(trigger)) {
        return moment
      }
    }
  }
  
  return null
}

/**
 * Industry-specific conversation starters that show deep knowledge
 */
export const conversationOpeners: Record<string, string[]> = {
  bodyContouring: [
    "I see you're in body contouring... just analyzed your competitor Sculpt Clinic - they're getting 47 leads per month at £8 each. Want to know their secret?",
    "Body contouring clinic! Perfect timing - CoolSculpting just changed their provider terms. This creates a HUGE opportunity for independent clinics like yours.",
    "Skulpt Body Contouring... great name! I notice you're not running Facebook ads yet. Your competitor 2 miles away is spending £3k/month and fully booked. Here's what they're doing differently..."
  ],
  
  aesthetics: [
    "Aesthetics clinic! I literally just finished analyzing 200 UK clinics. The average is getting 40 leads per month, but the TOP 10% are getting 180+. The difference? Three specific things...",
    "Perfect timing! The ASA just relaxed advertising rules for aesthetics. Clinics using the new guidelines are seeing 3x more leads. Are you updating your ads?",
    "I notice you offer both medical and beauty treatments. Smart! The clinics crushing it right now use medical credibility to sell beauty services. Let me show you how..."
  ]
}

/**
 * Psychological triggers that create urgency without being pushy
 */
export const urgencyTriggers = {
  competitive: [
    "While we're chatting, your competitors are running ads targeting YOUR ideal clients...",
    "Every day without proper targeting costs you approximately 3-5 high-value clients...",
    "The clinic that moves first in your area usually dominates for years..."
  ],
  
  opportunity: [
    "There's a 6-week window before everyone discovers this strategy...",
    "The platforms are practically giving away traffic right now to anyone who knows this...",
    "Your market is at a tipping point - whoever invests now will own it..."
  ],
  
  social: [
    "I just helped 3 other clinics in [nearby city] implement this...",
    "The top clinics are all quietly using this same approach...",
    "Your competitors would pay thousands to know what I'm about to tell you..."
  ]
}

/**
 * Create personalized insights that feel like mind-reading
 */
export function createPersonalizedInsight(
  businessType: string,
  challenge: string,
  adSpend: string
): string {
  const insights: Record<string, Record<string, string>> = {
    bodyContouring: {
      'not enough leads': `With your ${adSpend} budget, you should be getting 50-80 qualified leads for body contouring. If you're getting less than 30, you're targeting wrong. The secret? Target people who follow gyms but haven't posted gym selfies in 3+ months.`,
      'expensive': `Body contouring leads shouldn't cost more than £12 each. If you're paying more, you're competing with weight loss ads. Switch to 'non-surgical' angles and watch costs drop 60%.`,
      'conversion': `Body contouring has a dirty secret - 70% of consultations are just comparing prices. The fix? Pre-qualify with a 'treatment calculator' that builds value before they arrive.`,
      'competition': `Your competitors are scared of TikTok because they think it's for kids. Meanwhile, one clinic is getting £3 treatments leads from women 35-45 on TikTok. The platform is wide open.`
    },
    aesthetics: {
      'not enough leads': `Aesthetics clinics with ${adSpend} typically get 60-100 leads. The difference? The winners use 'occasion-based' marketing (weddings, holidays, events) not 'treatment-based' marketing.`,
      'expensive': `Botox leads costing more than £15? You're bidding against med spas with VC funding. The workaround? Target 'prevention' audiences age 25-35 instead of 'correction' age 45+.`,
      'conversion': `Aesthetics consultations convert at 20% industry average. The top clinics hit 45% by doing virtual consultations first. Qualifies out price shoppers.`,
      'competition': `Every aesthetics clinic looks the same on Instagram. The winner? First one to use TikTok-style content on Instagram Reels. 10x more reach, same audience.`
    }
  }
  
  return insights[businessType]?.[challenge] || 
    `With ${adSpend} in the ${businessType} industry, you're leaving money on the table. Let me show you exactly where...`
}

/**
 * Name-drop competitors to show we know the market
 */
export const competitorIntelligence: Record<string, string[]> = {
  bodyContouring: [
    "3D Lipo is spending £50k/month on Facebook ads nationally",
    "Transform Hospital Group's conversion rate is only 35% despite their brand",
    "Sculpt Clinic's '6 sessions for £1999' is their most profitable package",
    "CoolSculpting providers are locked into territory restrictions you can exploit"
  ],
  aesthetics: [
    "Sk:n Clinics' average customer value is £1,800 over 18 months",
    "Independent clinics with under 1000 Instagram followers are outperforming chains",
    "The Harley Street clinics are losing clients to local clinics with payment plans",
    "Everyone's copying Dr. Raj's Instagram strategy but missing the key element"
  ]
}

/**
 * Create a conversation path that feels natural but strategic
 */
export function getConversationPath(step: number, context: any): {
  message: string
  expectedResponse: string[]
  nextAction: string
} {
  const paths = [
    {
      message: "What's your current situation with getting new clients?",
      expectedResponse: ['not enough', 'too expensive', 'competition', 'conversion'],
      nextAction: 'diagnose'
    },
    {
      message: "Interesting... and what's your average treatment value?",
      expectedResponse: ['number', 'range', 'depends', 'varies'],
      nextAction: 'calculate'
    },
    {
      message: "Got it. Quick question - who do you see as your biggest competitor?",
      expectedResponse: ['business name', 'national chain', 'everyone', 'not sure'],
      nextAction: 'intelligence'
    },
    {
      message: "Perfect. I've actually analyzed them. Want to know their weakness?",
      expectedResponse: ['yes', 'sure', 'definitely', 'tell me'],
      nextAction: 'reveal'
    }
  ]
  
  return paths[Math.min(step, paths.length - 1)]
}

/**
 * Smooth transition phrases that maintain flow
 */
export const transitionPhrases = {
  afterInfo: [
    "Interesting... that actually explains a lot about what I'm seeing...",
    "OK that makes sense. This changes my recommendation completely...",
    "Ah, now I understand why your competitors are doing X...",
    "Perfect - this is exactly what I needed to know. Here's what's happening..."
  ],
  
  beforeReveal: [
    "OK, I'm about to tell you something your competitors don't want you to know...",
    "This is the part where it gets interesting...",
    "Ready for the plot twist? Here's what's really happening...",
    "Most people never figure this out, but since you asked..."
  ],
  
  buildUp: [
    "Wait, before I tell you that, I need to know one thing...",
    "Actually, this reminds me of something that happened last week...",
    "You know what? This is exactly like another clinic I helped...",
    "Hold on - are you sitting down? Because this might surprise you..."
  ]
}