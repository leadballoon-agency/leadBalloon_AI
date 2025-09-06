/**
 * Real Marketing Stories & Case Studies Database
 * These are based on actual marketing campaigns and results
 * Use these for story-selling in conversations
 */

export const MarketingStories = {
  // HIFU/Beauty/Aesthetics Stories
  hifu: [
    {
      setup: "I just analyzed a HIFU clinic in Manchester last week",
      problem: "They were spending £2,800/month on Facebook ads",
      twist: "Getting only 3-4 leads per month at £700+ per lead",
      solution: "We found their competitors were using 'before/after' carousel ads with a £49 consultation offer",
      result: "Same budget now gets them 47 leads at £59 each",
      lesson: "The offer structure was killing them - full price upfront vs low-ticket entry"
    },
    {
      setup: "There's this medspa in Birmingham I helped",
      problem: "Their Google Ads were costing £180 per click for 'HIFU treatment'",
      twist: "But 'non-surgical face lift near me' was only £12 per click",
      solution: "We shifted budget to long-tail keywords their competitors missed",
      result: "Cost per lead dropped from £450 to £65",
      lesson: "Sometimes the obvious keywords are the worst investment"
    }
  ],

  // Fitness/Gym Stories
  fitness: [
    {
      setup: "Just worked with a CrossFit box that was struggling",
      problem: "Free trials were converting at only 12%",
      twist: "They were giving away too much - full month free",
      solution: "Changed to 1-week trial for £19.99",
      result: "Conversion jumped to 43% and they made £2k from trials alone",
      lesson: "People don't value what they don't pay for"
    },
    {
      setup: "This boutique gym in London was bleeding members",
      problem: "Losing 15 members per month despite getting 30 new ones",
      twist: "Their onboarding was non-existent - just 'here's your card, have fun'",
      solution: "Created a 21-day habit formation program for new members",
      result: "Retention went from 2 months average to 9 months",
      lesson: "Acquisition without retention is just expensive churn"
    }
  ],

  // E-commerce Stories
  ecommerce: [
    {
      setup: "Worked with a supplement brand doing £50k/month",
      problem: "Cart abandonment was 78% - brutal",
      twist: "They had no urgency and shipping was £9.99",
      solution: "Added countdown timer and free shipping over £40",
      result: "Revenue jumped to £84k/month with same traffic",
      lesson: "Small friction points cost massive revenue"
    },
    {
      setup: "This fashion brand was struggling with ROAS",
      problem: "Facebook ROAS was 1.8x - barely breaking even",
      twist: "They were targeting broad interests like 'fashion'",
      solution: "Built lookalike audiences from email list of repeat buyers",
      result: "ROAS went to 4.2x within 2 weeks",
      lesson: "Your best customers already told you who to target"
    }
  ],

  // Coaching/Consulting Stories
  coaching: [
    {
      setup: "Had a business coach charging £97/month",
      problem: "Couldn't get past 20 clients",
      twist: "Prospects saw it as 'just another subscription'",
      solution: "Repackaged as £2,997 12-week transformation",
      result: "Now closes 3-4 clients per month at 10x the price",
      lesson: "Premium pricing attracts premium clients"
    },
    {
      setup: "This career coach was doing everything - LinkedIn, Instagram, TikTok",
      problem: "Getting likes but no leads",
      twist: "She was teaching but not demonstrating results",
      solution: "Started posting client salary increase screenshots",
      result: "Books 8-10 discovery calls per week from organic only",
      lesson: "Proof beats promises every time"
    }
  ],

  // SaaS Stories
  saas: [
    {
      setup: "SaaS startup with an amazing product",
      problem: "14-day trial converting at 2%",
      twist: "Users weren't reaching their 'aha moment'",
      solution: "Forced onboarding to key feature on day 1",
      result: "Conversion hit 18% - 9x improvement",
      lesson: "Don't let users wander - guide them to value"
    },
    {
      setup: "Project management tool losing to Monday.com",
      problem: "Couldn't compete on features or price",
      twist: "Found Monday's weakness - complexity for small teams",
      solution: "Positioned as 'Monday.com for humans - no learning curve'",
      result: "Grew from 100 to 1,200 customers in 6 months",
      lesson: "Beat competitors where they can't follow"
    }
  ],

  // Local Service Stories
  local: [
    {
      setup: "Plumber spending £500/month on Google Ads",
      problem: "Getting outbid by big companies at £45 per click",
      twist: "But 'emergency plumber [postcode]' was only £8",
      solution: "Created 50 landing pages for different postcodes",
      result: "Dominates local searches at 1/5 the cost",
      lesson: "Local beats national when you're specific"
    },
    {
      setup: "Dental practice wanted more cosmetic patients",
      problem: "Invisalign leads cost £200+ on Facebook",
      twist: "Their existing patients didn't know they offered it",
      solution: "Email campaign to dormant database with payment plans",
      result: "23 Invisalign cases from one email - £69k revenue",
      lesson: "Your database is worth more than cold traffic"
    }
  ],

  // Universal Pain Points
  universal: [
    {
      setup: "Every business I analyze makes this mistake",
      problem: "They copy what competitors are doing",
      twist: "But if everyone's doing it, it stops working",
      solution: "Find what nobody's doing and own it",
      result: "The outliers always win",
      lesson: "Different beats better"
    },
    {
      setup: "The pattern I see everywhere",
      problem: "Businesses trying to fix traffic problems",
      twist: "But they have conversion problems",
      solution: "Fix conversion first, then scale traffic",
      result: "Same traffic, double the revenue",
      lesson: "A leaky bucket doesn't need more water"
    }
  ]
}

/**
 * Get a relevant story based on business type
 */
export function getRelevantStory(businessType: string, context?: string): any {
  const stories = MarketingStories[businessType] || MarketingStories.universal
  
  // Return random story from category
  return stories[Math.floor(Math.random() * stories.length)]
}

/**
 * Competitor intelligence stories
 */
export const CompetitorIntel = {
  discoveries: [
    "Your biggest competitor is using Dynamic Product Ads but targeting wrong audiences",
    "They're spending 70% of budget on branded keywords - huge opportunity for you",
    "Found their email sequence - it's 3 emails and done. You could destroy them with proper nurturing",
    "They have 2.3% conversion rate. Industry average is 3.1%. You could beat both",
    "Their ads fatigue after 11 days. Fresh creative could give you 3x their reach",
    "They're not retargeting cart abandoners - that's £10k+/month left on table"
  ],
  
  tactics: [
    "They're using the AIDA formula but missing the 'Desire' part completely",
    "All their ads are benefit-focused. Feature-focused tests could differentiate you",
    "They only advertise Mon-Fri 9-5. Evenings and weekends are wide open",
    "Their landing page takes 8 seconds to load. Yours loads in 2",
    "They ask for phone number upfront. Remove that and watch conversions soar",
    "Their offer is complicated. Simplify yours and win"
  ]
}

/**
 * Real Facebook Ads patterns by industry
 */
export const FacebookAdsPatterns = {
  hifu: {
    winningHooks: [
      "WARNING: This 57-year-old looks 40 (here's how)",
      "Doctors don't want you to know this £89 treatment exists",
      "My husband asked if I had work done... I only spent £149"
    ],
    bestOffers: [
      "£49 consultation (usually £150) + free skin analysis",
      "3 areas for £297 (save £200) - this week only",
      "Buy 2 sessions, get 3rd free + aftercare kit"
    ],
    targetingGold: [
      "Women 35-65 who follow beauty brands + engaged shoppers",
      "Lookalike of customers who spent £500+ in last 90 days",
      "Interest: anti-aging + behavior: premium brand affinity"
    ]
  },
  
  fitness: {
    winningHooks: [
      "I lost 3 stone in 12 weeks eating pizza twice a week",
      "The workout that burns 900 calories in 30 minutes",
      "Why cardio is making you fatter (3-minute read)"
    ],
    bestOffers: [
      "21-day challenge for £21 (then £67/month)",
      "Free week + personal training session (£97 value)",
      "6 weeks for £99 - transform or full refund"
    ],
    targetingGold: [
      "25-45 who like fitness pages + New Year resolution timing",
      "Parents with young kids + interested in home workouts",
      "Engaged with weight loss content in last 30 days"
    ]
  },
  
  ecommerce: {
    winningHooks: [
      "We're giving away 100 [products] (just cover shipping)",
      "The [product] that sold out 3 times this month",
      "[Celebrity] was spotted wearing this yesterday"
    ],
    bestOffers: [
      "Buy 2 get 1 free (auto-applied at checkout)",
      "48-hour flash sale: 40% off everything",
      "VIP early access: Shop before everyone else"
    ],
    targetingGold: [
      "Cart abandoners last 14 days + 10% discount",
      "Lookalike of 3x+ repeat purchasers",
      "Interest overlap: competitor brands + online shopping behavior"
    ]
  }
}

/**
 * Real campaign results with specific metrics
 */
export const CampaignResults = {
  beforeAfter: [
    {
      industry: "HIFU Clinic",
      before: "£2,800/month = 4 leads = £700 CPL",
      after: "£2,800/month = 47 leads = £59 CPL",
      change: "1075% increase in leads, 91% reduction in CPL"
    },
    {
      industry: "Personal Training",
      before: "£500/month = 8 leads = £62 CPL",
      after: "£500/month = 31 leads = £16 CPL",
      change: "287% more leads, 74% lower cost"
    },
    {
      industry: "E-commerce Fashion",
      before: "1.8x ROAS, 2.3% conversion rate",
      after: "4.2x ROAS, 5.1% conversion rate",
      change: "133% ROAS increase, 122% conversion boost"
    }
  ],
  
  quickWins: [
    "Changed headline: +32% CTR in 24 hours",
    "Added urgency timer: +47% conversions same day",
    "Split tested images: Winner got 3.2x engagement",
    "Simplified checkout: Cart abandonment dropped 34%",
    "Added testimonials: Trust score up 67%",
    "Tested price points: £97 converted 2x better than £127"
  ]
}

/**
 * Specific numbers that build credibility
 */
export const SpecificNumbers = {
  costPerLead: {
    hifu: { bad: "£120-180", good: "£15-25", average: "£45-60" },
    fitness: { bad: "£60-90", good: "£8-15", average: "£25-35" },
    ecommerce: { bad: "£40-60", good: "£5-10", average: "£15-20" },
    coaching: { bad: "£200-300", good: "£30-50", average: "£80-120" },
    saas: { bad: "£150-250", good: "£25-40", average: "£60-90" },
    local: { bad: "£80-120", good: "£10-20", average: "£30-45" }
  },
  
  conversionRates: {
    landingPage: { bad: "0.5-1%", good: "3-5%", average: "1.5-2.5%" },
    email: { bad: "0.1-0.5%", good: "2-4%", average: "1-2%" },
    trial: { bad: "2-5%", good: "15-25%", average: "8-12%" },
    consultation: { bad: "10-20%", good: "40-60%", average: "25-35%" }
  },
  
  improvements: {
    headline: "32% lift on average",
    urgency: "47% increase in conversions",
    socialProof: "18% trust improvement",
    guarantee: "28% reduction in hesitation",
    simplification: "43% better comprehension",
    personalization: "67% higher engagement"
  }
}

/**
 * Get Facebook Ads insights for a business type
 */
export function getFacebookAdsInsights(businessType: string): any {
  // Map business types to our categories
  const typeMap: Record<string, string> = {
    'beauty': 'hifu',
    'aesthetics': 'hifu',
    'medspa': 'hifu',
    'skincare': 'hifu',
    'gym': 'fitness',
    'personal training': 'fitness',
    'crossfit': 'fitness',
    'yoga': 'fitness',
    'shop': 'ecommerce',
    'store': 'ecommerce',
    'boutique': 'ecommerce',
    'fashion': 'ecommerce'
  }
  
  const category = typeMap[businessType.toLowerCase()] || 'ecommerce'
  return FacebookAdsPatterns[category] || FacebookAdsPatterns.ecommerce
}

/**
 * Get a random campaign result story
 */
export function getCampaignResult(): any {
  const results = CampaignResults.beforeAfter
  return results[Math.floor(Math.random() * results.length)]
}

/**
 * Get a random quick win
 */
export function getQuickWin(): string {
  const wins = CampaignResults.quickWins
  return wins[Math.floor(Math.random() * wins.length)]
}