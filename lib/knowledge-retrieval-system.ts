/**
 * Intelligent Knowledge Retrieval System
 * Automatically pulls relevant insights from your client research database
 */

import { SOLAR_PV_PROJECT } from './client-project-knowledge'

// Niche mapping - maps business types to your knowledge folders
const NICHE_MAPPING = {
  // Beauty & Aesthetics
  'hifu': ['HIFU', 'Body Sculpting Skin Tightening', 'PRP (Platelet Rich Plasma)'],
  'botox': ['HIFU', 'Body Sculpting Skin Tightening', 'PRP (Platelet Rich Plasma)'],
  'aesthetics': ['HIFU', 'Body Sculpting Skin Tightening', 'Laser Hair Removal', 'PRP (Platelet Rich Plasma)'],
  'skin tightening': ['Body Sculpting Skin Tightening', 'HIFU'],
  'body sculpting': ['Body Sculpting Skin Tightening', 'HIFU'],
  'laser hair': ['Laser Hair Removal'],
  'hair removal': ['Laser Hair Removal'],
  'prp': ['PRP (Platelet Rich Plasma)'],
  'hair restoration': ['PRP (Platelet Rich Plasma)'],
  'vein': ['UK Vein Clinic'],
  'varicose': ['UK Vein Clinic'],
  
  // Medical Services
  'ultrasound': ['Ultrasound+ Early Pregnancy Scanning'],
  'pregnancy scan': ['Ultrasound+ Early Pregnancy Scanning'],
  'prenatal': ['Ultrasound+ Early Pregnancy Scanning'],
  
  // Energy & Home
  'solar': ['Solar PV'],
  'solar panels': ['Solar PV'],
  'renewable energy': ['Solar PV'],
  
  // Education & Training
  'driving instructor': ['Driving Instructor'],
  'driving school': ['Driving Instructor'],
  'first aid': ['First Aid UK Market Training'],
  'cpr training': ['First Aid UK Market Training'],
  
  // Home Improvement
  'driveway': ['Pattern Drives'],
  'landscaping': ['Pattern Drives'],
  'paving': ['Pattern Drives'],
  
  // E-commerce
  'tea': ['butterfly tea ecom'],
  'wellness tea': ['butterfly tea ecom'],
  'butterfly pea': ['butterfly tea ecom'],
  
  // B2B Services
  'consulting': ['Kaizen Initiative'],
  'business improvement': ['Kaizen Initiative'],
  'follow up': ['Follow Up Systems'],
  'crm': ['Follow Up Systems']
}

/**
 * Find relevant knowledge for a business type
 */
export function findRelevantKnowledge(businessDescription: string): RelevantKnowledge {
  const description = businessDescription.toLowerCase()
  const relevantFolders: Set<string> = new Set()
  
  // Find matching niches
  for (const [keyword, folders] of Object.entries(NICHE_MAPPING)) {
    if (description.includes(keyword)) {
      folders.forEach(folder => relevantFolders.add(folder))
    }
  }
  
  // If no exact match, use similarity scoring
  if (relevantFolders.size === 0) {
    const similarNiches = findSimilarNiches(description)
    similarNiches.forEach(niche => relevantFolders.add(niche))
  }
  
  return {
    exactMatches: Array.from(relevantFolders),
    insights: generateInsights(Array.from(relevantFolders)),
    recommendations: generateRecommendations(description, Array.from(relevantFolders))
  }
}

/**
 * Find similar niches using category matching
 */
function findSimilarNiches(description: string): string[] {
  const categories = {
    beauty: ['HIFU', 'Body Sculpting Skin Tightening', 'Laser Hair Removal', 'PRP (Platelet Rich Plasma)', 'UK Vein Clinic'],
    medical: ['PRP (Platelet Rich Plasma)', 'UK Vein Clinic', 'Ultrasound+ Early Pregnancy Scanning'],
    education: ['Driving Instructor', 'First Aid UK Market Training'],
    home: ['Solar PV', 'Pattern Drives'],
    ecommerce: ['butterfly tea ecom'],
    b2b: ['Kaizen Initiative', 'Follow Up Systems']
  }
  
  // Check which category fits best
  if (description.includes('beauty') || description.includes('cosmetic') || description.includes('appearance')) {
    return categories.beauty
  }
  if (description.includes('medical') || description.includes('health') || description.includes('clinic')) {
    return categories.medical
  }
  if (description.includes('training') || description.includes('course') || description.includes('education')) {
    return categories.education
  }
  if (description.includes('home') || description.includes('property') || description.includes('house')) {
    return categories.home
  }
  if (description.includes('shop') || description.includes('store') || description.includes('product')) {
    return categories.ecommerce
  }
  if (description.includes('business') || description.includes('b2b') || description.includes('service')) {
    return categories.b2b
  }
  
  // Default to beauty (your strongest niche)
  return categories.beauty
}

/**
 * Generate insights from relevant knowledge
 */
function generateInsights(folders: string[]): Insights {
  // This would actually read from your knowledge files
  // For now, returning structured insights based on folder names
  
  const insights: Insights = {
    commonPainPoints: [],
    provenHooks: [],
    bestOffers: [],
    audienceTargeting: [],
    objectionHandlers: [],
    trustBuilders: []
  }
  
  // Beauty/Aesthetics insights
  if (folders.some(f => f.includes('HIFU') || f.includes('Body Sculpting'))) {
    insights.commonPainPoints.push(
      "Looking older than their years",
      "Previous treatments haven't worked",
      "Fear of looking 'done' or unnatural",
      "Embarrassment about sagging skin"
    )
    insights.provenHooks.push(
      "WARNING: This 57-year-old looks 40 (here's how)",
      "The non-surgical facelift celebrities don't want you to know about",
      "Why Botox users are switching to this instead"
    )
    insights.bestOffers.push(
      "£49 consultation (worth £150) + free skin analysis",
      "3 areas for £297 - this week only",
      "Try one area for £97 (no obligation)"
    )
    insights.audienceTargeting.push(
      "Women 35-65 interested in anti-aging",
      "Lookalike of high-value beauty customers",
      "People who follow aesthetic clinics + engaged shoppers"
    )
  }
  
  // Hair removal insights
  if (folders.some(f => f.includes('Laser Hair'))) {
    insights.commonPainPoints.push(
      "Tired of constant shaving/waxing",
      "Embarrassment about unwanted hair",
      "Ingrown hairs and skin irritation",
      "Cost of ongoing hair removal"
    )
    insights.provenHooks.push(
      "6 sessions for the price of 4 (ends Friday)",
      "Why 73% of women wish they'd done this sooner",
      "The truth about laser hair removal pain levels"
    )
  }
  
  // PRP insights
  if (folders.some(f => f.includes('PRP'))) {
    insights.commonPainPoints.push(
      "Hair loss affecting confidence",
      "Looking angry or mean due to hair loss",
      "Failed treatments (Minoxidil, supplements)",
      "Professional image concerns"
    )
    insights.provenHooks.push(
      "I wasn't ready to go bald at 26!",
      "The £1800 I wasted before finding this",
      "Richmond professionals' secret hair restoration method"
    )
    insights.objectionHandlers.push(
      "Uses your own blood - 100% natural",
      "Medical-grade treatment, not cosmetic",
      "One treatment works better than 6 elsewhere"
    )
  }
  
  // Solar PV insights
  if (folders.includes('Solar PV')) {
    insights.commonPainPoints.push(
      "Rising energy bills with no end in sight",
      "Feeling exploited by energy companies",
      "Fear of being scammed by solar companies",
      "Uncertainty about roof suitability"
    )
    insights.provenHooks.push(
      "Calculate your exact savings in 60 seconds",
      "Why your neighbor's panels are saving them £2,400/year",
      "Government grants ending soon - check eligibility"
    )
    insights.trustBuilders.push(
      "No sales pressure - online calculator only",
      "Which? Trusted Trader approved",
      "See real customer bills before/after"
    )
  }
  
  return insights
}

/**
 * Generate specific recommendations
 */
function generateRecommendations(businessDescription: string, folders: string[]): string[] {
  const recommendations: string[] = []
  
  // General recommendations
  recommendations.push(
    `Based on ${folders.length} similar projects, start with education-based content to build trust`,
    `Test calculator/assessment tools - they work well in professional service niches`,
    `Focus on professional credibility and discrete service for higher-income demographics`
  )
  
  // Specific to beauty/aesthetics
  if (folders.some(f => f.includes('HIFU') || f.includes('Body') || f.includes('Laser'))) {
    recommendations.push(
      "Before/after images are crucial but must be realistic, not dramatic",
      "Emphasize 'natural-looking results' and 'no downtime'",
      "Target ages 35-65 with household income £60k+",
      "Test both 'anti-aging' and 'prevention' angles"
    )
  }
  
  // Specific to medical services
  if (folders.some(f => f.includes('PRP') || f.includes('Vein') || f.includes('Ultrasound'))) {
    recommendations.push(
      "Lead with medical credentials and qualifications",
      "Use scientific evidence and clinical studies",
      "Offer free consultations to overcome trust barriers",
      "Focus on Richmond/Southwest London affluent areas"
    )
  }
  
  // Specific to home services
  if (folders.some(f => f.includes('Solar') || f.includes('Pattern'))) {
    recommendations.push(
      "Calculator tools dramatically increase conversion",
      "Focus on ROI and payback period",
      "Use neighbor/local area social proof",
      "Government incentives create urgency"
    )
  }
  
  return recommendations
}

/**
 * Types
 */
interface RelevantKnowledge {
  exactMatches: string[]
  insights: Insights
  recommendations: string[]
}

interface Insights {
  commonPainPoints: string[]
  provenHooks: string[]
  bestOffers: string[]
  audienceTargeting: string[]
  objectionHandlers: string[]
  trustBuilders: string[]
}

/**
 * Quick lookup function for conversation
 */
export function quickInsightLookup(businessType: string, insightType: 'pain' | 'hook' | 'offer' | 'audience'): string[] {
  const knowledge = findRelevantKnowledge(businessType)
  
  switch(insightType) {
    case 'pain':
      return knowledge.insights.commonPainPoints
    case 'hook':
      return knowledge.insights.provenHooks
    case 'offer':
      return knowledge.insights.bestOffers
    case 'audience':
      return knowledge.insights.audienceTargeting
    default:
      return []
  }
}

/**
 * Get cross-niche insights
 */
export function getCrossNichePatterns(): any {
  return {
    universal: {
      conversionBoosters: [
        "Calculator/assessment tools increase conversion 3-5x",
        "Multi-step forms outperform single long forms",
        "Countdown timers increase urgency by 47%",
        "Video testimonials convert 2x better than text",
        "Mobile-first design is non-negotiable"
      ],
      trustBuilders: [
        "Professional associations and certifications",
        "Google reviews prominently displayed",
        "Money-back guarantees",
        "Free consultations or assessments",
        "Real practitioner names and photos"
      ],
      pricingPsychology: [
        "Anchor high, discount to target price",
        "Payment plans reduce barrier to entry",
        "Bundle services for higher AOV",
        "Time-limited offers create urgency",
        "Show price per month vs total cost"
      ]
    },
    beauty: {
      specific: [
        "Ages 35-65 are sweet spot for non-surgical treatments",
        "Instagram/Facebook perform better than Google Ads",
        "Before/after galleries are essential",
        "Emphasize 'natural' and 'subtle' results",
        "Richmond/Southwest London = premium pricing accepted"
      ]
    },
    medical: {
      specific: [
        "Lead with qualifications and experience",
        "Clinical evidence and studies build trust",
        "Discrete service appeals to professionals",
        "Flexible appointment times for workers",
        "Payment plans essential for higher-ticket treatments"
      ]
    },
    services: {
      specific: [
        "Local area targeting crucial",
        "Seasonal timing affects conversion",
        "Reviews and testimonials from neighbors",
        "Free quotes/assessments standard expectation",
        "Mobile-responsive booking essential"
      ]
    }
  }
}