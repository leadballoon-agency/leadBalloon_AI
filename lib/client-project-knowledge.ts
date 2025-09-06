/**
 * Client Project Knowledge System
 * Deep research knowledge from actual client projects
 * Each project contains Avatar, Beliefs, Offer Brief, and Market Research
 */

export interface ClientProject {
  id: string
  clientName: string
  niche: string
  dateCreated: Date
  lastUpdated: Date
  
  // Core Research Documents
  avatar: CustomerAvatar
  beliefs: NecessaryBeliefs
  offerBrief: OfferBrief
  marketResearch: MarketResearch
  
  // Campaign Performance Data
  campaigns?: CampaignData[]
  winningAds?: WinningAd[]
  
  // Knowledge Extracted
  insights: ProjectInsights
}

export interface CustomerAvatar {
  // Demographics
  ageRange: string
  gender: string
  location: string
  monthlyRevenue: string
  professionalBackgrounds: string[]
  typicalIdentities: string[]
  
  // Pain Points & Challenges
  keyPainPoints: string[]
  deepFrustrations: string[]
  skepticisms: string[]
  
  // Goals & Aspirations
  shortTermGoals: string[]
  longTermAspirations: string[]
  successMetrics: string[]
  
  // Emotional & Psychological
  emotionalDrivers: string[]
  fears: string[]
  desires: string[]
  buyingTriggers: string[]
  
  // Direct Quotes
  painPointQuotes: string[]
  mindsetQuotes: string[]
  motivationQuotes: string[]
  objectionQuotes: string[]
  
  // Behavioral Patterns
  researchBehavior: string
  decisionProcess: string
  trustedSources: string[]
  emotionalJourney: {
    awareness: string
    frustration: string
    seeking: string
    relief: string
  }
}

export interface NecessaryBeliefs {
  // Core Beliefs They Must Have
  aboutProblem: string[]
  aboutSolution: string[]
  aboutYourCompany: string[]
  aboutThemselves: string[]
  
  // Belief Shifts Required
  from: string[]
  to: string[]
  
  // Trust Builders
  proofPoints: string[]
  credibilityMarkers: string[]
  socialProof: string[]
  
  // Objection Handlers
  commonObjections: string[]
  responses: string[]
}

export interface OfferBrief {
  // Core Offer
  headline: string
  subheadline: string
  mainPromise: string
  mechanism: string
  
  // Offer Structure
  pricing: {
    original: string
    discounted: string
    paymentPlans?: string[]
  }
  bonuses: string[]
  guarantees: string[]
  scarcity: string
  urgency: string
  
  // Value Stack
  coreValue: string
  additionalValue: string[]
  totalValue: string
  
  // Call to Action
  primaryCTA: string
  secondaryCTA: string
  microCommitments: string[]
}

export interface MarketResearch {
  // Market Analysis
  marketSize: string
  growthRate: string
  trends: string[]
  seasonality: string[]
  
  // Competitor Analysis
  mainCompetitors: {
    name: string
    strengths: string[]
    weaknesses: string[]
    pricing: string
    positioning: string
  }[]
  
  // Opportunity Gaps
  underservedSegments: string[]
  unmetNeeds: string[]
  differentiators: string[]
  
  // Regulatory/Industry
  regulations: string[]
  certifications: string[]
  industryTerms: string[]
}

export interface CampaignData {
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Email'
  campaignName: string
  dateRange: string
  
  // Performance Metrics
  spend: number
  impressions: number
  clicks: number
  conversions: number
  cpl: number // Cost per lead
  cpa: number // Cost per acquisition
  roas: number // Return on ad spend
  
  // Targeting
  audiences: string[]
  placements: string[]
  
  // Creative
  adCopy: string
  creative: string
  hooks: string[]
}

export interface WinningAd {
  platform: string
  hook: string
  bodyCopy: string
  cta: string
  imageDescription: string
  metrics: {
    ctr: number
    cvr: number
    cpl: number
  }
  whyItWorked: string
}

export interface ProjectInsights {
  // Key Learnings
  whatWorked: string[]
  whatFailed: string[]
  surprises: string[]
  
  // Messaging Insights
  winningHooks: string[]
  winningAngles: string[]
  winningOffers: string[]
  
  // Audience Insights
  bestAudiences: string[]
  bestPlacements: string[]
  bestTiming: string[]
  
  // Conversion Insights
  conversionKillers: string[]
  conversionBoosters: string[]
  
  // Future Recommendations
  nextSteps: string[]
  testIdeas: string[]
  scaleOpportunities: string[]
}

/**
 * Example: Solar PV Project Structure
 */
export const SOLAR_PV_PROJECT: Partial<ClientProject> = {
  clientName: "Get Solar PV",
  niche: "Solar Panel Installation",
  avatar: {
    ageRange: "35-70",
    gender: "Mixed, slightly skewed toward homeowners in couples",
    location: "England - Yorkshire, East/West Midlands, Nottinghamshire, Lincolnshire",
    monthlyRevenue: "£2,500-£6,000/month household income",
    professionalBackgrounds: ["skilled trades", "healthcare", "teachers", "early retirees"],
    typicalIdentities: ["budget-conscious families", "financially stressed homeowners", "eco-savvy households"],
    
    keyPainPoints: [
      "Monthly costs increasing with no end in sight",
      "Feeling powerless or exploited by big energy companies",
      "Distrust from past 'free solar' scams",
      "Fear of sales pressure or unsuitable installations"
    ],
    
    deepFrustrations: [
      "Being taken advantage of by energy companies",
      "Overwhelmed by conflicting information",
      "Feeling of helplessness or inaction"
    ],
    
    skepticisms: [
      "If it's really that good, why isn't everyone doing it?",
      "I've heard so many scams I don't know who to trust anymore"
    ],
    
    shortTermGoals: [
      "Find ways to reduce energy bills",
      "Explore solar without sales pressure",
      "Understand if their roof is suitable"
    ],
    
    longTermAspirations: [
      "Achieve energy independence or low fixed costs",
      "Increase home resale value or EPC score",
      "Leave a lighter environmental footprint"
    ],
    
    successMetrics: ["Monthly savings amount", "Payback period", "Energy independence percentage"],
    
    emotionalDrivers: [
      "Deep frustration with being exploited",
      "Hope that solar might finally be a real solution",
      "Desire to feel smart, proactive, and in control"
    ],
    
    fears: [
      "Fear of being scammed or pressured",
      "Fear of future energy inflation",
      "Uncertainty about cost of living increases"
    ],
    
    desires: [
      "Control over energy costs",
      "Independence from energy companies",
      "Smart financial decision"
    ],
    
    buyingTriggers: [
      "Seeing neighbor's panels and savings",
      "Energy bill shock",
      "Government incentive deadline"
    ],
    
    painPointQuotes: [
      "We've cut back on everything else, and still the bill climbs",
      "I'm tired of being in the dark when it comes to savings"
    ],
    
    mindsetQuotes: [
      "It's not just about saving money — it's about taking back control",
      "I'm not falling for another sales pitch",
      "We just want clarity, not commitments"
    ],
    
    motivationQuotes: [
      "If it works for my roof, I want to do it this year",
      "We're not waiting for prices to get worse again",
      "We've got to get ahead of this now — before winter"
    ],
    
    objectionQuotes: [
      "I just want to know the truth without being sold to",
      "If it's really that good, why isn't everyone doing it?"
    ],
    
    researchBehavior: "Extensive online research, calculator tools, comparison sites",
    decisionProcess: "Research → Calculate savings → Check reviews → Get multiple quotes → Decide",
    trustedSources: ["Which?", "MoneySavingExpert", "Neighbor recommendations", "Google reviews"],
    
    emotionalJourney: {
      awareness: "Notices rising bills or hears neighbour talking about savings",
      frustration: "Tries switching suppliers, sees no major change",
      seeking: "Begins researching solar but hits scams or salesy pages",
      relief: "Finds a tool (calculator) that feels trustworthy, gets an estimate, feels in control again"
    }
  },
  
  beliefs: {
    aboutProblem: [
      "Energy costs will keep rising",
      "Energy companies are profiting at their expense",
      "They're powerless to control costs"
    ],
    aboutSolution: [
      "Solar could work but probably has hidden catches",
      "It's probably too expensive upfront",
      "Their roof might not be suitable"
    ],
    aboutYourCompany: [],
    aboutThemselves: [
      "They're smart enough not to fall for scams",
      "They make careful financial decisions",
      "They deserve honest information"
    ],
    from: [
      "Solar is a scam or too good to be true",
      "It's too expensive for normal people",
      "The technology isn't ready yet"
    ],
    to: [
      "Solar is a proven investment with clear ROI",
      "Financing makes it affordable from day one",
      "Technology is mature and guaranteed for 25 years"
    ],
    proofPoints: [],
    credibilityMarkers: [],
    socialProof: [],
    commonObjections: [],
    responses: []
  },
  
  insights: {
    whatWorked: [],
    whatFailed: [],
    surprises: [],
    winningHooks: [],
    winningAngles: [],
    winningOffers: [],
    bestAudiences: [],
    bestPlacements: [],
    bestTiming: [],
    conversionKillers: [],
    conversionBoosters: [],
    nextSteps: [],
    testIdeas: [],
    scaleOpportunities: []
  }
}

/**
 * Store a new client project
 */
export function storeClientProject(project: ClientProject): void {
  if (typeof window !== 'undefined') {
    const projects = JSON.parse(localStorage.getItem('clientProjects') || '{}')
    projects[project.id] = project
    localStorage.setItem('clientProjects', JSON.stringify(projects))
    
    console.log('📚 Client Project Stored:', {
      client: project.clientName,
      niche: project.niche,
      dataPoints: Object.keys(project).length
    })
  }
}

/**
 * Get project by niche
 */
export function getProjectsByNiche(niche: string): ClientProject[] {
  if (typeof window !== 'undefined') {
    const projects = JSON.parse(localStorage.getItem('clientProjects') || '{}')
    return (Object.values(projects) as ClientProject[]).filter((p: ClientProject) => 
      p.niche.toLowerCase().includes(niche.toLowerCase())
    )
  }
  return []
}

/**
 * Extract knowledge from Claude Projects format
 * This would parse the PDF/text exports from Claude Projects
 */
export function extractFromClaudeProject(
  avatarDoc: string,
  beliefsDoc: string,
  offerDoc: string,
  researchDoc: string
): Partial<ClientProject> {
  // This would parse the documents and extract structured data
  // For now, returning the Solar PV example structure
  return SOLAR_PV_PROJECT
}

/**
 * Use project knowledge for new campaigns
 */
export function applyProjectKnowledge(
  businessType: string,
  existingProjects: ClientProject[]
): any {
  // Find similar projects
  const relevantProjects = existingProjects.filter(p => 
    p.niche.toLowerCase().includes(businessType.toLowerCase())
  )
  
  if (relevantProjects.length === 0) return null
  
  // Aggregate insights from all relevant projects
  const aggregatedInsights = {
    commonPainPoints: [],
    provenHooks: [],
    bestOffers: [],
    audienceTargeting: [],
    conversionTips: []
  }
  
  relevantProjects.forEach(project => {
    aggregatedInsights.commonPainPoints.push(...project.avatar.keyPainPoints)
    aggregatedInsights.provenHooks.push(...project.insights.winningHooks)
    aggregatedInsights.bestOffers.push(...project.insights.winningOffers)
    aggregatedInsights.audienceTargeting.push(...project.insights.bestAudiences)
    aggregatedInsights.conversionTips.push(...project.insights.conversionBoosters)
  })
  
  return aggregatedInsights
}