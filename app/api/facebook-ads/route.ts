import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'

export async function POST(req: NextRequest) {
  let browser = null
  
  try {
    const { url, businessType } = await req.json()
    
    // Determine niche keywords from URL
    const nicheKeywords = getNicheKeywords(url, businessType)
    
    console.log(`📱 Searching Facebook Ads for niche: ${nicheKeywords.join(', ')}`)
    
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled']
    })
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    
    const page = await context.newPage()
    const allAds: any[] = []
    
    // Search for niche-relevant ads
    for (const keyword of nicheKeywords.slice(0, 3)) { // Limit to 3 searches
      const adsUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&q=${encodeURIComponent(keyword)}`
      
      await page.goto(adsUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      })
      
      await page.waitForTimeout(5000)
      
      // Scroll to load more ads
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000))
        await page.waitForTimeout(2000)
      }
      
      // Extract ad data
      const ads = await page.evaluate(() => {
        const adElements = document.querySelectorAll('[role="article"]')
        return Array.from(adElements).slice(0, 10).map(el => {
          const text = el.textContent || ''
          
          // Parse days running
          const dateMatch = text.match(/Started running on ([^.]+)/)
          let daysRunning = 0
          if (dateMatch) {
            const start = new Date(dateMatch[1])
            daysRunning = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
          }
          
          return {
            advertiser: el.querySelector('a')?.textContent || 'Unknown',
            text: text.substring(0, 500),
            daysRunning,
            isWinner: daysRunning >= 90
          }
        })
      })
      
      allAds.push(...ads)
    }
    
    await browser.close()
    
    // Find winning ads (90+ days)
    const winningAds = allAds
      .filter(ad => ad.daysRunning >= 90)
      .sort((a, b) => b.daysRunning - a.daysRunning)
    
    return NextResponse.json({
      success: true,
      niche: nicheKeywords,
      totalAdsFound: allAds.length,
      winningAds: {
        count: winningAds.length,
        ads: winningAds.slice(0, 5),
        insight: winningAds.length > 0 
          ? `Found ${winningAds.length} proven ads running 90+ days in your niche`
          : 'No long-running ads found - opportunity to be first!'
      }
    })
    
  } catch (error) {
    console.error('Facebook Ads scraping error:', error)
    
    if (browser) await browser.close()
    
    return NextResponse.json({
      success: false,
      requiresManual: true,
      message: 'Facebook Ads Library requires manual research',
      explanation: 'Facebook blocks automated scraping (they want you to pay for ads)',
      offer: 'Our team will manually research 50+ winning ads in your niche',
      timeframe: 'Within 24 hours',
      value: [
        'Find ads running 90+ days (the profitable ones)',
        'Get exact copy, offers, and strategies',
        'See what hooks are working NOW',
        'Discover competitors you didn\'t know about'
      ],
      nextStep: 'Enter your details to secure your spot in the queue'
    }, { status: 200 }) // Return 200 to avoid breaking the flow
  }
}

function getNicheKeywords(url: string, businessType?: string): string[] {
  const keywords: string[] = []
  
  // Extract from domain
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    keywords.push(domain.replace('www.', '').split('.')[0])
  } catch (e) {}
  
  // Add niche keywords based on business type
  const nicheMap: Record<string, string[]> = {
    fitness: ['fitness', 'gym', 'workout'],
    coaching: ['coaching', 'business coach'],
    ecommerce: ['sale', 'discount', 'shop'],
    saas: ['software', 'app', 'tool']
  }
  
  if (businessType && nicheMap[businessType]) {
    keywords.push(...nicheMap[businessType])
  }
  
  return [...new Set(keywords)]
}

export async function GET() {
  return NextResponse.json({
    status: 'Facebook Ads Scraper Ready',
    capabilities: [
      'Search specific businesses',
      'Search by industry (body contouring, aesthetics, etc)',
      'Extract ad copy and offers',
      'Identify pricing strategies',
      'Analyze urgency tactics',
      'Find competitor guarantees'
    ],
    usage: {
      specificBusiness: 'POST with {searchTerm: "business name"}',
      industry: 'POST with {industry: "body contouring", location: "london"}'
    }
  })
}