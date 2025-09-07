/**
 * Load and format paid ads knowledge for AI conversations
 * This provides the AI with expert-level paid advertising insights
 */

import * as fs from 'fs'
import * as path from 'path'

interface PaidAdsKnowledge {
  facebookAds?: any
  googleAds?: any
  tiktokAds?: any
  linkedinAds?: any
  universalTruths?: any
  platformArbitrage?: any
  conversionOptimization?: any
  trackingAndAnalytics?: any
  budgetAllocation?: any
}

/**
 * Load the complete paid ads knowledge base
 */
export function loadPaidAdsKnowledge(): PaidAdsKnowledge | null {
  try {
    const filePath = path.join(process.cwd(), 'knowledge-base', 'paid-ads-mastery.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('Paid ads knowledge not found, using defaults')
    return getDefaultPaidAdsKnowledge()
  }
}

/**
 * Get context-specific paid ads knowledge based on the question
 */
export function getPaidAdsContext(message: string): string {
  const lowerMessage = message.toLowerCase()
  const knowledge = loadPaidAdsKnowledge()
  
  if (!knowledge) return ''
  
  // Facebook/Meta specific
  if (lowerMessage.includes('facebook') || lowerMessage.includes('meta') || lowerMessage.includes('fb')) {
    return formatFacebookKnowledge(knowledge.facebookAds)
  }
  
  // Google Ads specific
  if (lowerMessage.includes('google') || lowerMessage.includes('ppc') || lowerMessage.includes('search ad')) {
    return formatGoogleKnowledge(knowledge.googleAds)
  }
  
  // TikTok specific
  if (lowerMessage.includes('tiktok') || lowerMessage.includes('tik tok')) {
    return formatTikTokKnowledge(knowledge.tiktokAds)
  }
  
  // LinkedIn specific
  if (lowerMessage.includes('linkedin') || lowerMessage.includes('b2b')) {
    return formatLinkedInKnowledge(knowledge.linkedinAds)
  }
  
  // Cost/pricing questions
  if (lowerMessage.includes('cost') || lowerMessage.includes('cpm') || lowerMessage.includes('cpc') || lowerMessage.includes('budget')) {
    return formatCostKnowledge(knowledge)
  }
  
  // Conversion/landing page questions
  if (lowerMessage.includes('conversion') || lowerMessage.includes('landing') || lowerMessage.includes('funnel')) {
    return formatConversionKnowledge(knowledge.conversionOptimization)
  }
  
  // Tracking/analytics questions
  if (lowerMessage.includes('track') || lowerMessage.includes('analyt') || lowerMessage.includes('pixel')) {
    return formatTrackingKnowledge(knowledge.trackingAndAnalytics)
  }
  
  // Creative/copy questions
  if (lowerMessage.includes('creative') || lowerMessage.includes('copy') || lowerMessage.includes('ad text')) {
    return formatCreativeKnowledge(knowledge)
  }
  
  // General paid ads question - return universal truths
  if (lowerMessage.includes('ad') || lowerMessage.includes('advertis') || lowerMessage.includes('campaign')) {
    return formatUniversalTruths(knowledge.universalTruths)
  }
  
  return ''
}

function formatFacebookKnowledge(fbData: any): string {
  if (!fbData) return ''
  
  return `
Facebook Ads insights:
- Average CPM: ${fbData.costBenchmarks?.avgCPM || '£8-15'}
- Campaign structure: ${fbData.winningStrategies?.campaignStructure?.CBO || 'Use CBO for 3+ ad sets'}
- Best audiences: ${fbData.winningStrategies?.audiences?.goldmine || 'Lookalike of high LTV customers'}
- Creative tip: ${fbData.winningStrategies?.creatives?.ugc || 'UGC gets 2.4x higher CTR'}
- Secret sauce: ${fbData.secretSauces?.broadTargeting || 'Broad beats interests with good creative'}`
}

function formatGoogleKnowledge(googleData: any): string {
  if (!googleData) return ''
  
  return `
Google Ads insights:
- Search strategy: ${googleData.winningStrategies?.searchCampaigns?.matchTypes || 'Start phrase, add exact after data'}
- Quality Score tip: ${googleData.winningStrategies?.searchCampaigns?.qualityScore || '10/10 cuts CPC by 50%'}
- Performance Max warning: ${googleData.winningStrategies?.performanceMax?.warning || 'Cannibalizes brand search'}
- Hidden gem: ${googleData.hiddenGems?.callOnlyAds || 'Call-only ads 50% cheaper for services'}`
}

function formatTikTokKnowledge(tiktokData: any): string {
  if (!tiktokData) return ''
  
  return `
TikTok Ads insights:
- Reality: ${tiktokData.reality?.demographics || '40% of users are 30+'}
- CPMs: ${tiktokData.reality?.costs || '£2-6, much cheaper than Facebook'}
- Winning formula: ${tiktokData.winningFormulas?.spark || 'Spark Ads get 3x engagement'}
- Optimal length: ${tiktokData.winningFormulas?.length || '21-34 seconds for conversions'}`
}

function formatLinkedInKnowledge(linkedinData: any): string {
  if (!linkedinData) return ''
  
  return `
LinkedIn Ads B2B insights:
- CPC range: ${linkedinData.b2bGoldmine?.costs || '£5-15 but worth it for B2B'}
- Best targeting: ${linkedinData.b2bGoldmine?.targeting || 'Job title + company size + industry'}
- Top format: ${linkedinData.b2bGoldmine?.formats || 'Sponsored InMail gets 50% open rates'}
- Strategy: ${linkedinData.strategies?.thoughtLeadership || 'CEO posts promoted = authority'}`
}

function formatCostKnowledge(knowledge: PaidAdsKnowledge): string {
  const fb = knowledge.facebookAds?.costBenchmarks
  const google = knowledge.googleAds?.costBenchmarks
  
  return `
Industry lead costs:
- Body Contouring: ${fb?.avgCPL?.bodyContouring || '£15-50'}
- Solar PV: ${fb?.avgCPL?.solarPV || '£20-60'}
- Dental: ${fb?.avgCPL?.dental || '£25-70'}
- E-commerce: ${fb?.avgCPL?.ecommerce || '£5-20'}
- B2B: ${fb?.avgCPL?.b2b || '£30-100'}

Platform CPMs:
- Facebook: ${fb?.avgCPM || '£8-15'}
- TikTok: £2-6 (cheapest)
- Google Display: £1-5
- LinkedIn: £20-50 (B2B premium)`
}

function formatConversionKnowledge(convData: any): string {
  if (!convData) return ''
  
  return `
Conversion optimization:
- Landing pages: ${convData.landingPages?.matchMessage || 'Must match ad message exactly'}
- Load speed: ${convData.landingPages?.loadSpeed || 'Every second delay = 20% fewer conversions'}
- Mobile: ${convData.landingPages?.mobile || '70% of traffic is mobile'}
- Funnel hack: ${convData.funnels?.microCommitments || 'Email → Quiz → Booking beats direct booking'}
- Two-step forms: ${convData.funnels?.twoStep || 'Convert 30% better'}`
}

function formatTrackingKnowledge(trackingData: any): string {
  if (!trackingData) return ''
  
  return `
Tracking setup:
- Essential: ${trackingData.setup?.gtm || 'GTM for everything'}
- Facebook: ${trackingData.setup?.fb || 'Conversions API + Pixel'}
- Links: ${trackingData.setup?.utm || 'UTM parameters on every link'}
- Focus on: ${trackingData.metrics?.real || 'CAC, LTV, payback period'}`
}

function formatCreativeKnowledge(knowledge: PaidAdsKnowledge): string {
  const fb = knowledge.facebookAds?.winningStrategies?.creatives
  const copy = knowledge.facebookAds?.winningStrategies?.copyFormulas
  
  return `
Creative insights:
- Best format: ${fb?.ugc || 'UGC gets 2.4x higher CTR'}
- Video length: ${fb?.video || '15-second videos, hook in first 3 seconds'}
- Copy formula: ${copy?.pas || 'Problem → Agitate → Solution'}
- CTA: ${copy?.cta || '"Learn More" beats "Buy Now" for cold traffic'}
- Universal truth: Creative is 70% of performance, targeting 30%`
}

function formatUniversalTruths(truths: any): string {
  if (!truths) return ''
  
  return `
Paid ads universal truths:
- ${truths.creative || 'Creative is 70% of performance'}
- ${truths.testing || 'Test big swings, not button colors'}
- ${truths.attribution || 'Last-click lies, use data-driven'}
- ${truths.ltv || 'Optimize for LTV not CPA'}
- Q4 reality: ${truths.seasonality?.q4 || 'CPMs double in Black Friday chaos'}`
}

function getDefaultPaidAdsKnowledge(): PaidAdsKnowledge {
  return {
    universalTruths: {
      creative: "Creative is 70% of performance, targeting 30%",
      testing: "Test big swings, not button colors",
      attribution: "Last-click lies, use data-driven attribution"
    }
  }
}

/**
 * Check if message is asking about paid ads
 */
export function isAskingAboutPaidAds(message: string): boolean {
  const adKeywords = [
    'ad', 'ads', 'advertis', 'campaign', 'facebook', 'google', 'tiktok', 'linkedin',
    'cpm', 'cpc', 'cpl', 'roas', 'ppc', 'paid', 'budget', 'creative', 'copy',
    'landing', 'conversion', 'funnel', 'pixel', 'tracking', 'audience', 'targeting'
  ]
  
  const lowerMessage = message.toLowerCase()
  return adKeywords.some(keyword => lowerMessage.includes(keyword))
}