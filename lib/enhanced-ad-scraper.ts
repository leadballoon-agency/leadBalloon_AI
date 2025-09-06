/**
 * Enhanced Ad Scraper with Winning Ad Collection
 * Scrapes ads and analyzes them against proven formulas
 */

import { chromium, Page } from 'playwright'
import { analyzeAdCopy, WinningAd } from './winning-ads-database'
import marketingLegends from './marketing-legends.json'

export interface ScrapedAd {
  platform: 'facebook' | 'google' | 'native'
  advertiser: string
  headline: string
  bodyCopy: string
  cta?: string
  imageUrl?: string
  videoUrl?: string
  landingPageUrl?: string
  firstSeen: Date
  lastSeen: Date
  daysRunning: number
  engagement?: {
    likes?: number
    comments?: number
    shares?: number
  }
}

export interface AdAnalysis {
  ad: ScrapedAd
  analysis: {
    formula: string // Which copy formula it follows
    legendTechniques: string[] // Which legend's techniques are used
    emotionalTriggers: string[]
    hooks: string[]
    valueProps: string[]
    urgencyElements: string[]
    socialProof: string[]
    score: number // 0-100 based on proven elements
  }
  recommendations: string[]
  swipeWorthy: boolean
  estimatedConversion: 'low' | 'medium' | 'high'
}

/**
 * Scrape Facebook Ads with enhanced analysis
 */
export async function scrapeFacebookAdsEnhanced(
  searchTerm: string,
  options: {
    minDaysRunning?: number // Only get ads running X+ days (proven winners)
    limit?: number
    analyzeCompetitors?: boolean
  } = {}
) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  })
  
  // Use proxy if available
  if (process.env.OXYLABS_USERNAME) {
    // Configure proxy
  }
  
  const page = await context.newPage()
  
  try {
    // Navigate to Facebook Ad Library
    const searchUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(searchTerm)}&media_type=all`
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForTimeout(3000)
    
    // Collect ads
    const ads = await collectAds(page, options.limit || 20)
    
    // Analyze each ad
    const analyzedAds: AdAnalysis[] = []
    
    for (const ad of ads) {
      const analysis = analyzeAdAgainstLegends(ad)
      analyzedAds.push(analysis)
      
      // Save winning ads to database
      if (analysis.swipeWorthy && ad.daysRunning >= (options.minDaysRunning || 30)) {
        await saveWinningAd(ad, analysis)
      }
    }
    
    // Find competitors if requested
    if (options.analyzeCompetitors) {
      const competitors = await findCompetitorAds(page, searchTerm)
      // Analyze competitor ads
    }
    
    await browser.close()
    
    return {
      adsFound: analyzedAds.length,
      winningAds: analyzedAds.filter(a => a.swipeWorthy),
      insights: extractInsights(analyzedAds),
      topFormulas: getTopFormulas(analyzedAds),
      recommendations: generateRecommendations(analyzedAds, searchTerm)
    }
    
  } catch (error) {
    console.error('Enhanced scraping error:', error)
    await browser.close()
    throw error
  }
}

/**
 * Analyze ad against marketing legends' principles
 */
function analyzeAdAgainstLegends(ad: ScrapedAd): AdAnalysis {
  const analysis: AdAnalysis = {
    ad,
    analysis: {
      formula: detectCopyFormula(ad.headline + ' ' + ad.bodyCopy),
      legendTechniques: detectLegendTechniques(ad),
      emotionalTriggers: detectEmotionalTriggers(ad),
      hooks: extractHooks(ad),
      valueProps: extractValueProps(ad),
      urgencyElements: detectUrgency(ad),
      socialProof: detectSocialProof(ad),
      score: 0
    },
    recommendations: [],
    swipeWorthy: false,
    estimatedConversion: 'low'
  }
  
  // Calculate score based on proven elements
  let score = 0
  
  // Check for Hopkins' specificity
  if (ad.headline.match(/\d+/) || ad.bodyCopy.match(/\d+%/)) {
    score += 10
    analysis.analysis.legendTechniques.push("Hopkins' specificity")
  }
  
  // Check for Carlton's storytelling
  if (ad.bodyCopy.length > 100 && ad.bodyCopy.includes('I')) {
    score += 10
    analysis.analysis.legendTechniques.push("Carlton's storytelling")
  }
  
  // Check for Halbert's urgency
  if (analysis.analysis.urgencyElements.length > 0) {
    score += 15
    analysis.analysis.legendTechniques.push("Halbert's urgency")
  }
  
  // Check for Schwartz's market sophistication
  if (detectMechanismInAd(ad)) {
    score += 10
    analysis.analysis.legendTechniques.push("Schwartz's unique mechanism")
  }
  
  // Check for Sugarman's curiosity
  if (ad.headline.includes('?') || ad.headline.match(/secret|discover|reveal/i)) {
    score += 10
    analysis.analysis.legendTechniques.push("Sugarman's curiosity seeds")
  }
  
  // Long-running ads get bonus points
  if (ad.daysRunning > 30) score += 20
  if (ad.daysRunning > 90) score += 20
  
  // Multiple emotional triggers
  score += analysis.analysis.emotionalTriggers.length * 5
  
  analysis.analysis.score = Math.min(score, 100)
  analysis.swipeWorthy = score >= 60
  
  if (score >= 80) {
    analysis.estimatedConversion = 'high'
  } else if (score >= 60) {
    analysis.estimatedConversion = 'medium'
  }
  
  // Generate recommendations
  analysis.recommendations = generateAdRecommendations(analysis)
  
  return analysis
}

/**
 * Detect which copy formula the ad follows
 */
function detectCopyFormula(text: string): string {
  const lower = text.toLowerCase()
  
  // PAS detection
  if (lower.includes('struggling') || lower.includes('tired of')) {
    if (lower.includes('introducing') || lower.includes('finally')) {
      return 'PAS (Problem-Agitate-Solution)'
    }
  }
  
  // AIDA detection
  if (text.match(/attention|announcing|new/i) && text.match(/discover|learn/i)) {
    return 'AIDA (Attention-Interest-Desire-Action)'
  }
  
  // BAB detection
  if (lower.includes('before') && lower.includes('after')) {
    return 'BAB (Before-After-Bridge)'
  }
  
  // Story-based
  if (text.match(/^(I |My |When I |It was )/)) {
    return 'Story-based (Carlton/Halbert style)'
  }
  
  return 'Direct benefit'
}

/**
 * Detect which legend's techniques are being used
 */
function detectLegendTechniques(ad: ScrapedAd): string[] {
  const techniques: string[] = []
  const text = ad.headline + ' ' + ad.bodyCopy
  
  // Check each legend's signature moves
  for (const [legendKey, legend] of Object.entries(marketingLegends.legends)) {
    // Hopkins - Specificity and testing
    if (legendKey === 'claude_hopkins') {
      if (text.match(/\d+%|\d+ out of \d+/)) {
        techniques.push(`${legend.name}: Specific claims`)
      }
    }
    
    // Carlton - Conversational and story
    if (legendKey === 'john_carlton') {
      if (text.match(/^Look,|^Listen,|^Here's/)) {
        techniques.push(`${legend.name}: Conversational opening`)
      }
    }
    
    // Halbert - Urgency and scarcity
    if (legendKey === 'gary_halbert') {
      if (text.match(/only \d+ left|expires|deadline/i)) {
        techniques.push(`${legend.name}: Urgency`)
      }
    }
    
    // Add more legend detection...
  }
  
  return techniques
}

/**
 * Extract emotional triggers
 */
function detectEmotionalTriggers(ad: ScrapedAd): string[] {
  const triggers: string[] = []
  const text = (ad.headline + ' ' + ad.bodyCopy).toLowerCase()
  
  // Fear triggers
  if (text.match(/warning|danger|risk|threat|mistake|wrong/)) {
    triggers.push('Fear')
  }
  
  // Greed triggers
  if (text.match(/rich|wealth|profit|fortune|millionaire|money/)) {
    triggers.push('Greed')
  }
  
  // Pride/Status triggers
  if (text.match(/exclusive|vip|elite|premium|luxury|prestige/)) {
    triggers.push('Pride/Status')
  }
  
  // Curiosity triggers
  if (text.match(/secret|discover|reveal|hidden|unknown|mystery/)) {
    triggers.push('Curiosity')
  }
  
  // Social belonging
  if (text.match(/join|community|belong|together|others/)) {
    triggers.push('Belonging')
  }
  
  return triggers
}

/**
 * Extract hooks from ad
 */
function extractHooks(ad: ScrapedAd): string[] {
  const hooks: string[] = []
  
  // Headline is usually the main hook
  if (ad.headline) hooks.push(ad.headline)
  
  // Look for sub-hooks in body
  const sentences = ad.bodyCopy.split(/[.!?]/)
  for (const sentence of sentences.slice(0, 3)) {
    if (sentence.match(/^(Did you know|What if|Imagine|The truth is)/i)) {
      hooks.push(sentence.trim())
    }
  }
  
  return hooks
}

/**
 * Extract value propositions
 */
function extractValueProps(ad: ScrapedAd): string[] {
  const props: string[] = []
  const text = ad.bodyCopy
  
  // Look for benefit statements
  const benefitPatterns = [
    /you('ll| will) (get|receive|discover|learn)/i,
    /transform|change|improve|boost|increase/i,
    /without|no more|never again/i,
    /save|earn|make|profit/i
  ]
  
  for (const pattern of benefitPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      // Extract the sentence containing the match
      const sentences = text.split(/[.!?]/)
      for (const sentence of sentences) {
        if (sentence.match(pattern)) {
          props.push(sentence.trim())
          break
        }
      }
    }
  }
  
  return props.slice(0, 3) // Top 3 value props
}

/**
 * Detect urgency elements
 */
function detectUrgency(ad: ScrapedAd): string[] {
  const urgency: string[] = []
  const text = (ad.headline + ' ' + ad.bodyCopy + ' ' + ad.cta).toLowerCase()
  
  const urgencyPatterns = [
    { pattern: /today only/, label: 'Today only' },
    { pattern: /limited time/, label: 'Limited time' },
    { pattern: /only \d+ (left|remaining|available)/, label: 'Limited quantity' },
    { pattern: /expires|deadline|ends/, label: 'Deadline' },
    { pattern: /now|immediately|instant/, label: 'Act now' },
    { pattern: /last chance|final/, label: 'Last chance' },
    { pattern: /hurry|quick|fast/, label: 'Speed urgency' }
  ]
  
  for (const { pattern, label } of urgencyPatterns) {
    if (text.match(pattern)) {
      urgency.push(label)
    }
  }
  
  return urgency
}

/**
 * Detect social proof elements
 */
function detectSocialProof(ad: ScrapedAd): string[] {
  const proof: string[] = []
  const text = ad.headline + ' ' + ad.bodyCopy
  
  // Numbers of users/customers
  const userMatch = text.match(/(\d{1,3}[,.]?\d*)\+? (customers|users|people|clients)/i)
  if (userMatch) proof.push(userMatch[0])
  
  // Testimonial indicators
  if (text.includes('"') || text.match(/said|says|wrote/i)) {
    proof.push('Testimonial')
  }
  
  // Authority mentions
  if (text.match(/doctor|expert|scientist|professor|CEO/i)) {
    proof.push('Authority endorsement')
  }
  
  // Awards/recognition
  if (text.match(/award|winner|best|#1|top rated/i)) {
    proof.push('Awards/Recognition')
  }
  
  return proof
}

/**
 * Check for unique mechanism (Schwartz principle)
 */
function detectMechanismInAd(ad: ScrapedAd): boolean {
  const text = ad.bodyCopy.toLowerCase()
  
  // Look for mechanism indicators
  return !!(
    text.match(/method|system|technique|formula|process|secret|trick/) &&
    text.match(/unique|proprietary|exclusive|patented|discovered/)
  )
}

/**
 * Generate recommendations based on analysis
 */
function generateAdRecommendations(analysis: AdAnalysis): string[] {
  const recs: string[] = []
  
  // Check what's missing
  if (analysis.analysis.emotionalTriggers.length === 0) {
    recs.push('Add emotional triggers (fear, greed, curiosity)')
  }
  
  if (!analysis.analysis.urgencyElements.length) {
    recs.push('Add urgency (deadline, scarcity, limited offer)')
  }
  
  if (!analysis.analysis.socialProof.length) {
    recs.push('Add social proof (testimonials, user numbers, authority)')
  }
  
  if (!analysis.ad.headline.match(/\d+/)) {
    recs.push('Use specific numbers in headline (Hopkins principle)')
  }
  
  if (analysis.ad.bodyCopy.length < 50) {
    recs.push('Expand body copy with benefits and story')
  }
  
  return recs
}

/**
 * Collect ads from page
 */
async function collectAds(page: Page, limit: number): Promise<ScrapedAd[]> {
  // Implementation would scrape actual ads from page
  // Simplified for example
  return []
}

/**
 * Find competitor ads
 */
async function findCompetitorAds(page: Page, originalSearch: string) {
  // Would search for related terms and competitors
  return []
}

/**
 * Extract insights from analyzed ads
 */
function extractInsights(ads: AdAnalysis[]) {
  const winningAds = ads.filter(a => a.swipeWorthy)
  
  return {
    topEmotionalTriggers: getMostCommon(ads.flatMap(a => a.analysis.emotionalTriggers)),
    topFormulas: getMostCommon(ads.map(a => a.analysis.formula)),
    topLegendTechniques: getMostCommon(ads.flatMap(a => a.analysis.legendTechniques)),
    averageScore: ads.reduce((sum, a) => sum + a.analysis.score, 0) / ads.length,
    winningAdCount: winningAds.length
  }
}

/**
 * Get top formulas used
 */
function getTopFormulas(ads: AdAnalysis[]) {
  const formulas = ads.map(a => a.analysis.formula)
  return getMostCommon(formulas)
}

/**
 * Generate recommendations for user
 */
function generateRecommendations(ads: AdAnalysis[], searchTerm: string): string[] {
  const recs: string[] = []
  const winningAds = ads.filter(a => a.swipeWorthy)
  
  if (winningAds.length > 0) {
    const topFormula = getTopFormulas(winningAds)[0]
    recs.push(`Use ${topFormula} formula - it's working in your industry`)
    
    const topTrigger = getMostCommon(winningAds.flatMap(a => a.analysis.emotionalTriggers))[0]
    if (topTrigger) {
      recs.push(`Focus on ${topTrigger} as primary emotional trigger`)
    }
  }
  
  return recs
}

/**
 * Save winning ad to database
 */
async function saveWinningAd(ad: ScrapedAd, analysis: AdAnalysis) {
  // Would save to database
  console.log('Saving winning ad:', ad.headline)
}

/**
 * Helper to get most common items
 */
function getMostCommon(items: string[]): string[] {
  const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item)
}