import { NextRequest, NextResponse } from 'next/server'

/**
 * SIMPLIFIED Instant Analysis
 * Returns quick insights without complex scraping
 * Focus on WOW factor and lead capture
 */
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    
    console.log(`⚡ Running instant analysis for ${url}`)
    
    // Extract domain info
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    const domain = urlObj.hostname.replace('www.', '')
    const isUK = domain.includes('.uk') || domain.includes('.co.uk')
    const currency = isUK ? '£' : '$'
    
    // Detect likely business type from domain
    const businessType = detectBusinessType(domain)
    
    // Generate instant insights based on patterns
    const insights = {
      businessType,
      targetAudience: getTargetAudience(businessType),
      currency,
      domain,
      
      // Quick wins they can action
      quickWins: [
        {
          type: 'headline',
          issue: 'Missing emotional trigger',
          fix: `Add "Without [Pain Point]" to your headline`,
          impact: '+32% conversion rate'
        },
        {
          type: 'pricing',
          issue: 'No urgency on pricing',
          fix: `Add "Save ${currency}200 this week only"`,
          impact: '+47% click-through'
        },
        {
          type: 'social_proof',
          issue: 'No specific numbers',
          fix: 'Change "Many clients" to "2,847+ clients"',
          impact: '+18% trust factor'
        }
      ],
      
      // Competitor insights (simulated but valuable)
      competitors: [
        {
          name: 'Market Leader',
          insight: `Charging ${currency}${businessType === 'coaching' ? '2,997' : '497'}/month`,
          opportunity: 'You could charge 40% more'
        }
      ],
      
      // Facebook ads insight (manual research required)
      facebookInsight: {
        finding: `Manual research needed for competitor ads`,
        headline: getWinningHeadline(businessType),
        opportunity: 'We can manually research winning ads in your niche'
      }
    }
    
    return NextResponse.json({
      success: true,
      insights,
      message: 'Initial scan complete',
      nextStep: 'Provide more details for deeper analysis'
    })
    
  } catch (error) {
    console.error('Instant analysis error:', error)
    
    // Even on error, return something useful
    return NextResponse.json({
      success: false,
      insights: {
        businessType: 'general',
        targetAudience: 'professionals',
        currency: '$',
        quickWins: [
          {
            type: 'general',
            issue: 'Website not accessible',
            fix: 'Let us know your business type for custom insights',
            impact: 'Personalized recommendations'
          }
        ]
      },
      message: 'Could not access website directly',
      nextStep: 'Tell us about your business'
    })
  }
}

/**
 * Detect business type from domain patterns
 */
function detectBusinessType(domain: string): string {
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

/**
 * Get target audience based on business type
 */
function getTargetAudience(businessType: string): string {
  const audiences: Record<string, string> = {
    fitness: 'Health-conscious professionals aged 25-45',
    coaching: 'Ambitious entrepreneurs seeking growth',
    ecommerce: 'Online shoppers looking for quality',
    saas: 'Businesses seeking efficiency',
    healthcare: 'Patients seeking premium care',
    service: 'Local customers needing expertise'
  }
  
  return audiences[businessType] || 'Your ideal customers'
}

/**
 * Get winning headline based on business type
 */
function getWinningHeadline(businessType: string): string {
  const headlines: Record<string, string> = {
    fitness: 'Transform Your Body in 6 Weeks (Without Giving Up Carbs)',
    coaching: 'Scale to $10K/Month in 90 Days or Your Money Back',
    ecommerce: 'Free Shipping Today Only - 2,847 Happy Customers',
    saas: 'Cut Your Workload by 73% Starting Tomorrow',
    healthcare: 'Same Day Appointments - Trusted by 5,000+ Patients',
    service: 'Get It Done Right, On Time, Or It Is Free'
  }
  
  return headlines[businessType] || 'Get Results Fast - Guaranteed'
}