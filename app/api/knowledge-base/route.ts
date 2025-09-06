import { NextRequest, NextResponse } from 'next/server'

// In-memory knowledge base (in production, this would be a proper database)
let knowledgeBase: Array<{
  id: string
  url: string
  domain: string
  businessType: string
  industry: string
  insights: any
  timestamp: string
  aiRecommendations: any
  userBehavior?: {
    timeOnSite?: number
    clickedManualResearch?: boolean
    submittedTicket?: boolean
  }
}> = []

export async function POST(req: NextRequest) {
  try {
    const { 
      url, 
      domain, 
      businessType, 
      industry, 
      insights, 
      aiRecommendations,
      userBehavior 
    } = await req.json()

    // Create knowledge entry
    const knowledgeEntry = {
      id: `kb-${Date.now()}`,
      url,
      domain,
      businessType: businessType || extractBusinessType(domain),
      industry: industry || extractIndustry(domain),
      insights,
      aiRecommendations,
      userBehavior,
      timestamp: new Date().toISOString()
    }

    knowledgeBase.push(knowledgeEntry)

    // Log for debugging
    console.log(`📚 Added to knowledge base: ${domain} (${businessType})`)
    console.log(`💡 Total entries: ${knowledgeBase.length}`)

    return NextResponse.json({
      success: true,
      entryId: knowledgeEntry.id,
      totalEntries: knowledgeBase.length
    })

  } catch (error) {
    console.error('Knowledge base update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update knowledge base'
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const businessType = searchParams.get('businessType')
    const industry = searchParams.get('industry')
    const limit = parseInt(searchParams.get('limit') || '10')

    let results = knowledgeBase

    // Filter by business type
    if (businessType) {
      results = results.filter(entry => 
        entry.businessType.toLowerCase().includes(businessType.toLowerCase())
      )
    }

    // Filter by industry
    if (industry) {
      results = results.filter(entry => 
        entry.industry.toLowerCase().includes(industry.toLowerCase())
      )
    }

    // Sort by most recent
    results = results
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    // Generate insights from knowledge base
    const insights = generateKnowledgeInsights(results)

    return NextResponse.json({
      success: true,
      totalEntries: knowledgeBase.length,
      filteredResults: results.length,
      entries: results.map(entry => ({
        id: entry.id,
        domain: entry.domain,
        businessType: entry.businessType,
        industry: entry.industry,
        timestamp: entry.timestamp,
        // Don't expose full URLs for privacy
        insights: entry.insights ? Object.keys(entry.insights) : []
      })),
      patterns: insights
    })

  } catch (error) {
    console.error('Knowledge base query error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to query knowledge base'
    }, { status: 500 })
  }
}

function extractBusinessType(domain: string): string {
  const lower = domain.toLowerCase()
  
  if (lower.includes('fit') || lower.includes('gym') || lower.includes('health')) {
    return 'fitness'
  }
  if (lower.includes('coach') || lower.includes('consult')) {
    return 'coaching'
  }
  if (lower.includes('shop') || lower.includes('store') || lower.includes('buy')) {
    return 'ecommerce'
  }
  if (lower.includes('app') || lower.includes('saas') || lower.includes('software')) {
    return 'saas'
  }
  if (lower.includes('dental') || lower.includes('medical') || lower.includes('clinic')) {
    return 'healthcare'
  }
  
  return 'service'
}

function extractIndustry(domain: string): string {
  const businessType = extractBusinessType(domain)
  return businessType === 'service' ? 'professional-services' : businessType
}

function generateKnowledgeInsights(entries: any[]): any {
  if (entries.length === 0) return {}

  const businessTypes = entries.reduce((acc, entry) => {
    acc[entry.businessType] = (acc[entry.businessType] || 0) + 1
    return acc
  }, {})

  const manualResearchRequests = entries.filter(
    entry => entry.userBehavior?.clickedManualResearch || entry.userBehavior?.submittedTicket
  ).length

  return {
    mostCommonBusinessType: Object.keys(businessTypes).reduce((a, b) => 
      businessTypes[a] > businessTypes[b] ? a : b
    ),
    manualResearchConversionRate: Math.round((manualResearchRequests / entries.length) * 100),
    totalAnalyses: entries.length,
    businessTypeDistribution: businessTypes
  }
}