/**
 * Qualification Checklist - Data we MUST have before offering call
 */

export interface QualificationData {
  // MANDATORY - Must have these before call offer
  ownership: {
    isOwner: boolean // "Is this your business?" 
    role?: string // "Owner", "Marketing Manager", "Just researching"
    confirmed: boolean
  }
  
  budget: {
    monthlyAdSpend?: number // "What's your monthly ad spend?"
    yearlyRevenue?: number // "Roughly what's your annual revenue?"
    hasbudget: boolean // Do they actually have money to spend?
    confirmed: boolean
  }
  
  // HIGHLY VALUABLE - Try to get these
  currentSituation: {
    currentCPA?: number // "What's your current cost per acquisition?"
    conversionRate?: number // "Do you know your conversion rate?"
    mainTrafficSource?: string // "Google Ads? Facebook? Both?"
    biggestProblem?: string // "What's your biggest challenge right now?"
    triedBefore?: string[] // "What have you tried that didn't work?"
  }
  
  // BONUS INTEL - Nice to have
  competition: {
    mainCompetitors?: string[] // "Who do you see as your main competitors?"
    competitorEnvy?: string // "Which competitor's marketing do you admire?"
    uniqueAdvantage?: string // "What makes you different from them?"
  }
  
  timeline: {
    urgency?: 'immediate' | 'this_quarter' | 'exploring' // "When do you need this fixed?"
    decisionProcess?: string // "Who else is involved in marketing decisions?"
    previousAgencies?: boolean // "Ever worked with an agency before?"
  }
}

export function isQualifiedForCall(data: QualificationData): {
  qualified: boolean
  reason?: string
  dataCompleteness: number
} {
  // MUST have these
  if (!data.ownership.isOwner) {
    return {
      qualified: false,
      reason: "Not the business owner - can't make decisions",
      dataCompleteness: 0
    }
  }
  
  // Lower threshold - we help beginners too!
  if (!data.budget.monthlyAdSpend || data.budget.monthlyAdSpend < 200) {
    return {
      qualified: false,
      reason: "Budget not disclosed or too small to start",
      dataCompleteness: 25
    }
  }
  
  // Calculate how much data we have
  let dataPoints = 0
  let totalPossible = 0
  
  // Check mandatory fields
  if (data.ownership.confirmed) dataPoints += 2
  totalPossible += 2
  
  if (data.budget.confirmed) dataPoints += 2
  totalPossible += 2
  
  // Check valuable fields
  if (data.currentSituation.currentCPA) dataPoints++
  if (data.currentSituation.conversionRate) dataPoints++
  if (data.currentSituation.mainTrafficSource) dataPoints++
  if (data.currentSituation.biggestProblem) dataPoints++
  if (data.currentSituation.triedBefore?.length) dataPoints++
  totalPossible += 5
  
  // Check bonus fields
  if (data.competition.mainCompetitors?.length) dataPoints++
  if (data.competition.competitorEnvy) dataPoints++
  if (data.competition.uniqueAdvantage) dataPoints++
  if (data.timeline.urgency) dataPoints++
  if (data.timeline.previousAgencies !== undefined) dataPoints++
  totalPossible += 5
  
  const completeness = Math.round((dataPoints / totalPossible) * 100)
  
  return {
    qualified: true,
    reason: `Qualified with ${completeness}% data completeness`,
    dataCompleteness: completeness
  }
}

export function getNextQualifyingQuestion(data: QualificationData): string {
  // Priority order of questions
  if (!data.ownership.confirmed) {
    return "Quick question - is this your business or are you researching the market?"
  }
  
  if (!data.budget.monthlyAdSpend) {
    return "What's your current monthly ad spend roughly?"
  }
  
  if (!data.currentSituation.biggestProblem) {
    return "What's the biggest challenge you're facing with your marketing right now?"
  }
  
  if (!data.currentSituation.currentCPA) {
    return "Do you know roughly what you're paying per lead or customer right now?"
  }
  
  if (!data.currentSituation.mainTrafficSource) {
    return "Are you mainly using Google Ads, Facebook, or both?"
  }
  
  if (!data.timeline.urgency) {
    return "How urgently do you need to fix this? This month? This quarter?"
  }
  
  if (!data.competition.mainCompetitors) {
    return "Who do you see as your biggest competitor?"
  }
  
  // We have enough data
  return ""
}

export function generateCallOfferMessage(data: QualificationData): string {
  const budget = data.budget.monthlyAdSpend
  const problem = data.currentSituation.biggestProblem
  const cpa = data.currentSituation.currentCPA
  
  // Beginner / Never advertised before
  if (budget && budget < 500) {
    return `I see you're just getting started with ads. I'd love to help you avoid the expensive mistakes most businesses make. Want a FREE 30-minute chat where I'll show you what's working in your industry? No pressure, just helpful advice: `
  }
  
  // Small budget but established
  if (budget && budget >= 500 && budget < 2000) {
    return `With £${budget}/month, every penny counts. I've analyzed what your successful competitors are doing and found some quick wins for you. Want to see? FREE 30-minute friendly chat: `
  }
  
  // Medium budget
  if (budget && budget >= 2000 && budget < 5000) {
    return `I've analyzed your site against competitors spending similar amounts. Found some interesting opportunities. Want a relaxed 30-minute chat about what I discovered? Completely free: `
  }
  
  // Larger budget
  if (budget && budget >= 5000) {
    return `With your £${budget}/month spend, I've spotted several areas where you're leaving money on the table. Happy to share what I found in a no-pressure 30-minute chat. Interested? `
  }
  
  // High CPA concern
  if (cpa && cpa > 100) {
    return `£${cpa} per lead does seem high. I can show you what similar businesses in your area are doing to get better results. FREE 30-minute friendly chat - no sales, just helpful insights: `
  }
  
  // Generic but qualified
  return `I've finished analyzing your site and have some insights that might help. Want a relaxed 30-minute chat about what I found? No pressure, just helpful advice: `
}