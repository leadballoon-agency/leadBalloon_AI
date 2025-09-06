/**
 * Winning Ads Database
 * Collection of proven, high-converting ads with analysis
 */

export interface WinningAd {
  id: string
  title: string
  advertiser: string
  industry: string
  platform: 'facebook' | 'google' | 'youtube' | 'direct_mail' | 'email' | 'landing_page'
  runTime?: string // How long it ran (indicates success)
  headline: string
  bodyC opy?: string
  cta: string
  offer?: string
  imageUrl?: string
  metrics?: {
    ctr?: number
    conversionRate?: number
    roi?: string
  }
  analysis: {
    hook: string
    emotionalTriggers: string[]
    persuasionTechniques: string[]
    valueProposition: string
    urgencyElements?: string[]
    socialProof?: string[]
  }
  whyItWorks: string[]
  swipeNotes: string[]
  dateCollected: string
}

export const winningAdsDatabase: WinningAd[] = [
  {
    id: "fb-sculpt-001",
    title: "Freeze Your Fat Away",
    advertiser: "CoolSculpting",
    industry: "body_contouring",
    platform: "facebook",
    runTime: "8+ months",
    headline: "Freeze Away Stubborn Fat Without Surgery",
    bodyCopy: "FDA-cleared treatment that eliminates fat cells for good. No needles, no surgery, no downtime. See results in as little as 3 weeks.",
    cta: "Book Your Free Consultation",
    offer: "Free consultation + $500 off first treatment",
    analysis: {
      hook: "Non-surgical solution to a painful problem",
      emotionalTriggers: ["Fear of surgery", "Desire for quick results", "Safety concerns"],
      persuasionTechniques: ["Authority (FDA)", "Risk reversal", "Specificity"],
      valueProposition: "Permanent fat loss without the risks of surgery",
      urgencyElements: ["Limited appointments"],
      socialProof: ["FDA-cleared", "1 million treatments"]
    },
    whyItWorks: [
      "Addresses main objection (surgery fear)",
      "Uses authority trigger (FDA)",
      "Specific timeframe (3 weeks)",
      "Risk reversal with free consultation"
    ],
    swipeNotes: [
      "Lead with the transformation, not the technology",
      "FDA/medical authority crucial in health offers",
      "Free consultation removes risk"
    ],
    dateCollected: "2024-11-15"
  },
  {
    id: "fb-finance-001",
    title: "Penny Stock Millionaire",
    advertiser: "Timothy Sykes",
    industry: "finance",
    platform: "facebook",
    runTime: "3+ years",
    headline: "How I Turned $12,415 Into $4.8 Million Trading Penny Stocks",
    bodyCopy: "Now I'm teaching my exact strategy to 30 new students. Warning: This is NOT for everyone. I only want serious students who can follow rules.",
    cta: "Apply Now (Closing in 48 hours)",
    offer: "Free training + trading checklist",
    analysis: {
      hook: "Specific rags-to-riches transformation",
      emotionalTriggers: ["Greed", "FOMO", "Exclusivity"],
      persuasionTechniques: ["Specificity", "Scarcity", "Reluctant guru"],
      valueProposition: "Learn exact millionaire trading strategy",
      urgencyElements: ["48 hours", "30 students only"],
      socialProof: ["Personal success story", "Student results"]
    },
    whyItWorks: [
      "Ultra-specific numbers build credibility",
      "Reluctant guru positioning",
      "Exclusivity and screening",
      "Clear deadline"
    ],
    swipeNotes: [
      "Specific numbers > vague claims",
      "Reluctant teacher > eager seller",
      "Application process > direct sale"
    ],
    dateCollected: "2024-10-20"
  },
  {
    id: "dm-golf-001",
    title: "One Legged Golfer",
    advertiser: "John Carlton",
    industry: "sports",
    platform: "direct_mail",
    runTime: "10+ years",
    headline: "Amazing Secret Discovered By One-Legged Golfer Adds 50 Yards To Your Drives, Eliminates Hooks and Slices... And Can Slash Up To 10 Strokes From Your Game Almost Overnight!",
    bodyCopy: "If a guy with one leg can outdrive YOU... what's your excuse?",
    cta: "Order Now",
    offer: "$39 + free shipping",
    analysis: {
      hook: "Curiosity-driven paradox",
      emotionalTriggers: ["Shame", "Curiosity", "Competition"],
      persuasionTechniques: ["Pattern interrupt", "Specificity", "Proof by contrast"],
      valueProposition: "Instant golf improvement through counterintuitive method",
      urgencyElements: ["Almost overnight"],
      socialProof: ["Implied - one-legged golfer's success"]
    },
    whyItWorks: [
      "Massive curiosity gap",
      "Challenges ego/pride",
      "Specific benefits",
      "Memorable story"
    ],
    swipeNotes: [
      "Paradox headlines create unstoppable curiosity",
      "Challenge the ego for male markets",
      "Story-based proof beats statistics"
    ],
    dateCollected: "Classic"
  },
  {
    id: "email-agora-001",
    title: "End of America",
    advertiser: "Stansberry Research",
    industry: "finance",
    platform: "email",
    runTime: "5+ years",
    headline: "The End of America",
    bodyCopy: "A 30-year market veteran's urgent warning: The next 12 months will be unlike anything we've seen in 50 years of American history...",
    cta: "Watch the Full Presentation Free",
    offer: "Free video + research report",
    analysis: {
      hook: "Fear-based apocalyptic warning",
      emotionalTriggers: ["Fear", "Urgency", "Authority"],
      persuasionTechniques: ["Fear appeal", "Authority", "Free valuable information"],
      valueProposition: "Insider information to protect wealth",
      urgencyElements: ["Next 12 months", "Urgent warning"],
      socialProof: ["30-year veteran"]
    },
    whyItWorks: [
      "Fear is strongest motivator",
      "Specific timeframe",
      "Free high-value content",
      "Authority positioning"
    ],
    swipeNotes: [
      "Fear sells in uncertain times",
      "Free content with implied value",
      "Video presentations convert better than text"
    ],
    dateCollected: "2024-09-15"
  },
  {
    id: "fb-beauty-001",
    title: "Japanese Secret",
    advertiser: "Various Beauty Brands",
    industry: "beauty",
    platform: "facebook",
    runTime: "2+ years (various versions)",
    headline: "Japanese Women Don't Get Old or Fat - Here's Their Secret",
    bodyCopy: "A Nobel Prize winning scientist discovered this 5-second morning ritual that burns fat all day long...",
    cta: "Watch Video",
    offer: "Free video reveals secret",
    analysis: {
      hook: "Cultural authority + impossible benefit",
      emotionalTriggers: ["Curiosity", "Envy", "Hope"],
      persuasionTechniques: ["Cultural proof", "Authority", "Simplicity"],
      valueProposition: "Easy exotic secret to eternal youth",
      urgencyElements: ["Limited time video"],
      socialProof: ["Nobel Prize", "Japanese culture"]
    },
    whyItWorks: [
      "Cultural fascination",
      "Impossible benefit creates curiosity",
      "Simple solution to complex problem",
      "Authority stacking"
    ],
    swipeNotes: [
      "Foreign/exotic secrets intrigue",
      "'5-second' makes it achievable",
      "Nobel Prize = ultimate authority"
    ],
    dateCollected: "2024-11-01"
  },
  {
    id: "yt-tai-001",
    title: "Here In My Garage",
    advertiser: "Tai Lopez",
    industry: "education",
    platform: "youtube",
    runTime: "4+ years",
    headline: "Here In My Garage",
    bodyCopy: "Just bought this new Lamborghini here. But you know what I like more than materialistic things? Knowledge.",
    cta: "Click Here",
    offer: "67 steps to success",
    analysis: {
      hook: "Wealth display followed by unexpected pivot",
      emotionalTriggers: ["Envy", "Curiosity", "Aspiration"],
      persuasionTechniques: ["Pattern interrupt", "Demonstration", "Wisdom positioning"],
      valueProposition: "Knowledge that leads to Lamborghini lifestyle",
      socialProof: ["Visible wealth", "Library of books"]
    },
    whyItWorks: [
      "Visual wealth demonstration",
      "Unexpected pivot to knowledge",
      "Implies knowledge = wealth",
      "Memorable opening"
    ],
    swipeNotes: [
      "Show the dream outcome",
      "Pattern interrupts maintain attention",
      "Demonstration beats declaration"
    ],
    dateCollected: "Classic"
  }
]

/**
 * Proven headlines categorized by type
 */
export const provenHeadlines = {
  how_to: [
    "How to [Achieve Desired Outcome] Without [Biggest Obstacle]",
    "How to [Result] in [Timeframe] (Even if [Objection])",
    "How [Number] [Target Audience] [Achieved Specific Result]",
    "How I [Achieved Result] (And How You Can Too)",
    "How to Get Rid of [Problem] Once and For All"
  ],
  secret: [
    "The Secret [Industry] Doesn't Want You to Know",
    "[Industry] Insiders Hate This One Simple Trick",
    "The Hidden Truth About [Topic]",
    "What [Authority] Doesn't Tell You About [Topic]",
    "Discover the [Country/Culture] Secret to [Benefit]"
  ],
  warning: [
    "Warning: Don't [Action] Before Reading This",
    "The Shocking Truth About [Common Belief]",
    "[Number] Warning Signs You're [Problem]",
    "Why Everything You Know About [Topic] Is Wrong",
    "Urgent: [Threat] Coming [Timeframe]"
  ],
  social_proof: [
    "Why [Number] [Target Audience] Choose [Solution]",
    "Join [Number] [Target Audience] Who [Achieved Result]",
    "[Authority] Reveals [Solution] to [Problem]",
    "The [Solution] [Number]% of [Experts] Recommend",
    "[Celebrity/Expert] Swears By This [Solution]"
  ],
  benefit: [
    "[Achieve Result] in [Timeframe] or Your Money Back",
    "Finally, A [Solution] That Actually [Achieves Result]",
    "The Fastest Way to [Achieve Result]",
    "[Result] Without [Common Requirement]",
    "Get [Result] or Pay Nothing"
  ],
  curiosity: [
    "The One Thing [Successful People] Do Differently",
    "This [Time] [Adjective] [Thing] Changed Everything",
    "Why I [Unexpected Action] (And You Should Too)",
    "The [Adjective] Reason You're Not [Achieving Result]",
    "What Happened When I [Took Unexpected Action]"
  ],
  news: [
    "New Discovery [Achieves Breakthrough]",
    "Scientists Discover [Breakthrough] in [Location]",
    "Breaking: [Authority] Announces [News]",
    "[Date]: The Day Everything Changes for [Industry]",
    "Finally Released: [Long-Awaited Solution]"
  ]
}

/**
 * Ad copy formulas that consistently convert
 */
export const copyFormulas = {
  PAS: {
    name: "Problem-Agitate-Solution",
    structure: [
      "Identify the problem",
      "Agitate the pain points",
      "Present your solution"
    ],
    example: "Tired of stubborn belly fat? (Problem) You've tried everything - diets, exercise, pills - but nothing works. That embarrassing bulge ruins how clothes fit... (Agitate) Introducing CoolSculpting - FDA-cleared fat freezing that eliminates fat cells permanently. (Solution)"
  },
  AIDA: {
    name: "Attention-Interest-Desire-Action",
    structure: [
      "Grab attention with bold claim",
      "Build interest with benefits",
      "Create desire with proof",
      "Call to action"
    ]
  },
  BAB: {
    name: "Before-After-Bridge",
    structure: [
      "Paint the 'before' state",
      "Show the 'after' transformation",
      "Bridge - how to get there"
    ]
  },
  "4Ps": {
    name: "Promise-Picture-Proof-Push",
    structure: [
      "Make a big promise",
      "Paint picture of life with solution",
      "Provide proof it works",
      "Push them to act now"
    ]
  },
  PASTOR: {
    name: "Problem-Amplify-Story-Transformation-Offer-Response",
    structure: [
      "Identify problem",
      "Amplify consequences",
      "Share story/solution",
      "Show transformation",
      "Present offer",
      "Call for response"
    ]
  }
}

/**
 * Emotional triggers that drive action
 */
export const emotionalTriggers = {
  fear: {
    triggers: ["Fear of loss", "Fear of missing out", "Fear of failure", "Fear of embarrassment"],
    usage: "Most powerful for urgent action"
  },
  greed: {
    triggers: ["Easy money", "Massive returns", "Get rich quick", "Insider advantage"],
    usage: "Strong in financial markets"
  },
  pride: {
    triggers: ["Status symbols", "Exclusivity", "Achievement", "Recognition"],
    usage: "Luxury and high-ticket items"
  },
  love: {
    triggers: ["Connection", "Belonging", "Romance", "Family"],
    usage: "Relationship and family products"
  },
  curiosity: {
    triggers: ["Secrets", "Forbidden knowledge", "Mysteries", "Paradoxes"],
    usage: "Information products"
  }
}

/**
 * Function to analyze ad copy and identify techniques used
 */
export function analyzeAdCopy(adCopy: string): {
  techniques: string[]
  emotionalTriggers: string[]
  structure: string
} {
  const techniques: string[] = []
  const triggers: string[] = []
  let structure = 'Unknown'

  // Check for specific words/patterns
  if (adCopy.toLowerCase().includes('how to')) techniques.push('How-to headline')
  if (adCopy.match(/\d+/)) techniques.push('Specific numbers')
  if (adCopy.toLowerCase().includes('secret')) techniques.push('Curiosity/secrets')
  if (adCopy.toLowerCase().includes('free')) techniques.push('Free offer')
  if (adCopy.toLowerCase().includes('limited') || adCopy.toLowerCase().includes('only')) {
    techniques.push('Scarcity')
    triggers.push('FOMO')
  }
  if (adCopy.toLowerCase().includes('guarantee')) techniques.push('Risk reversal')
  
  // Check emotional triggers
  if (adCopy.match(/fear|worried|danger|warning/i)) triggers.push('Fear')
  if (adCopy.match(/save|discount|profit|rich/i)) triggers.push('Greed')
  if (adCopy.match(/exclusive|vip|elite|premium/i)) triggers.push('Pride')
  if (adCopy.match(/discover|reveal|secret|hidden/i)) triggers.push('Curiosity')
  
  return { techniques, emotionalTriggers: triggers, structure }
}

/**
 * Function to generate ad copy based on winning formulas
 */
export function generateAdCopy(
  product: string,
  benefit: string,
  audience: string,
  formula: 'PAS' | 'AIDA' | 'BAB' | '4Ps'
): string {
  // This would integrate with AI to generate copy based on proven formulas
  // For now, returns template
  const templates = {
    PAS: `Struggling with ${product}? You're not alone. ${audience} everywhere face this daily frustration. Introducing ${benefit} - the solution you've been waiting for.`,
    AIDA: `Attention ${audience}! Discover ${benefit}. Thousands are already transforming their lives with ${product}. Join them today!`,
    BAB: `Before: Frustrated with current solutions. After: ${benefit}. The Bridge: Our proven ${product} system.`,
    '4Ps': `Promise: ${benefit}. Picture your life transformed. Proven by thousands of ${audience}. Order ${product} now!`
  }
  
  return templates[formula]
}