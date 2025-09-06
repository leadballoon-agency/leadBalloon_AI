import knowledgeBase from './knowledge-base.json'
import { scrapeWebsite, buildKnowledgeBase, ScrapedData } from './scraper'

export interface CompetitorIntelligence {
  url: string
  knownData?: typeof knowledgeBase.competitors[keyof typeof knowledgeBase.competitors]
  scrapedData: ScrapedData
  insights: {
    pricePositioning: string
    mainDifferentiator: string
    weaknessToExploit: string
    offerStrategy: string
  }
  suggestedCounterOffer: {
    pricing: string
    guarantee: string
    urgency: string
    bonuses: string[]
  }
}

export async function analyzeCompetitor(url: string): Promise<CompetitorIntelligence> {
  // Check if we have existing knowledge
  const domain = new URL(url).hostname.replace('www.', '')
  const knownData = knowledgeBase.competitors[domain as keyof typeof knowledgeBase.competitors]
  
  // Scrape fresh data
  const scrapedData = await scrapeWebsite(url)
  
  // Combine known and scraped data for insights
  const insights = generateInsights(knownData, scrapedData)
  const counterOffer = generateCounterOffer(knownData, scrapedData, insights)
  
  return {
    url,
    knownData,
    scrapedData,
    insights,
    suggestedCounterOffer: counterOffer
  }
}

function generateInsights(
  known: any,
  scraped: ScrapedData
): CompetitorIntelligence['insights'] {
  // Analyze price positioning
  let pricePositioning = 'mid-market'
  if (scraped.prices.some(p => p.includes('000') || p.includes('999'))) {
    pricePositioning = 'premium'
  } else if (scraped.prices.some(p => parseInt(p.replace(/\D/g, '')) < 500)) {
    pricePositioning = 'budget'
  }
  
  // Identify main differentiator
  const differentiators = []
  if (scraped.guarantees.length > 0) differentiators.push('strong guarantees')
  if (scraped.testimonials.length > 5) differentiators.push('social proof')
  if (scraped.urgencyTriggers.length > 0) differentiators.push('urgency tactics')
  if (known?.strengths?.includes('FDA approved')) differentiators.push('medical credibility')
  
  // Find weakness to exploit
  const weaknesses = []
  if (!scraped.guarantees.length) weaknesses.push('No clear guarantee')
  if (!scraped.urgencyTriggers.length) weaknesses.push('No urgency')
  if (scraped.prices.length === 0) weaknesses.push('Hidden pricing')
  if (known?.weaknesses) weaknesses.push(...known.weaknesses)
  
  return {
    pricePositioning,
    mainDifferentiator: differentiators[0] || 'brand recognition',
    weaknessToExploit: weaknesses[0] || 'Generic approach',
    offerStrategy: determineOfferStrategy(pricePositioning, differentiators, weaknesses)
  }
}

function determineOfferStrategy(
  pricing: string,
  differentiators: string[],
  weaknesses: string[]
): string {
  if (pricing === 'premium' && weaknesses.includes('No clear guarantee')) {
    return 'Undercut with stronger guarantee at lower price'
  }
  if (pricing === 'budget' && !differentiators.includes('medical credibility')) {
    return 'Position as premium alternative with medical backing'
  }
  if (weaknesses.includes('Hidden pricing')) {
    return 'Lead with transparent, value-stacked pricing'
  }
  if (!differentiators.includes('urgency tactics')) {
    return 'Create genuine scarcity with limited spots'
  }
  return 'Stack more value at competitive price point'
}

function generateCounterOffer(
  known: any,
  scraped: ScrapedData,
  insights: CompetitorIntelligence['insights']
): CompetitorIntelligence['suggestedCounterOffer'] {
  const currency = scraped.currency
  
  // Smart pricing based on competitor analysis
  let suggestedPrice = `${currency}997`
  if (insights.pricePositioning === 'premium') {
    suggestedPrice = `${currency}597` // Undercut premium competitors
  } else if (insights.pricePositioning === 'budget') {
    suggestedPrice = `${currency}1497` // Position above budget competitors
  }
  
  // Generate guarantee based on weaknesses
  let guarantee = `100% satisfaction guarantee - ${currency}0 risk to you`
  if (insights.weaknessToExploit.includes('guarantee')) {
    guarantee = `See visible results in 30 days or DOUBLE your money back`
  }
  
  // Create urgency based on real factors
  const urgency = knowledgeBase.industryInsights.urgencyTriggers.find(t => 
    !scraped.urgencyTriggers.some(st => st.toLowerCase().includes(t.toLowerCase().substring(0, 5)))
  ) || 'Only 5 spots left this month (machine fully booked)'
  
  // Generate bonuses that fill gaps
  const bonuses = [
    `FREE consultation & 3D body scan (${currency}200 value)`,
    known?.weaknesses?.includes('No aftercare') 
      ? `Lifetime maintenance program (${currency}497 value)`
      : `Bring a friend - both save 20%`,
    scraped.testimonials.length < 3
      ? `Results guarantee - we work until you're happy`
      : `VIP fast-track appointments`
  ]
  
  return {
    pricing: suggestedPrice,
    guarantee,
    urgency,
    bonuses
  }
}

// Get industry best practices
export function getIndustryInsights() {
  return {
    commonPainPoints: knowledgeBase.industryInsights.commonPainPoints,
    priceAnchors: knowledgeBase.industryInsights.priceAnchoring,
    bestOffers: knowledgeBase.industryInsights.bestOffers,
    trustBuilders: knowledgeBase.industryInsights.trustBuilders,
    ukSpecifics: knowledgeBase.ukMarketSpecifics
  }
}