import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'

/**
 * Real website scraping with Playwright
 */
export async function POST(req: NextRequest) {
  let browser = null
  let requestBody: any
  
  try {
    requestBody = await req.json()
    const { url, options = {} } = requestBody
    
    console.log(`🌐 Scraping ${url} with Playwright...`)
    
    // Launch browser
    browser = await chromium.launch({
      headless: true
    })
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    
    const page = await context.newPage()
    
    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    })
    
    // Extract key information
    const siteData = await page.evaluate(() => {
      // Get headline
      const headline = document.querySelector('h1')?.textContent?.trim() || 
                      document.querySelector('h2')?.textContent?.trim() || 
                      ''
      
      // Get meta description
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      
      // Get all text content for analysis
      const bodyText = document.body.innerText.substring(0, 5000) // First 5000 chars
      
      // Look for pricing
      const priceElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent || ''
        return /\$\d+|\£\d+|\€\d+|pricing|price|cost|fee/i.test(text)
      })
      
      const prices = priceElements.slice(0, 5).map(el => el.textContent?.trim())
      
      // Look for CTAs
      const buttons = Array.from(document.querySelectorAll('button, a.btn, a.button, [class*="button"], [class*="cta"]'))
      const ctas = buttons.slice(0, 10).map(btn => btn.textContent?.trim()).filter(Boolean)
      
      // Look for testimonials
      const testimonials = Array.from(document.querySelectorAll('[class*="testimonial"], [class*="review"], blockquote'))
        .slice(0, 3)
        .map(el => el.textContent?.trim())
      
      // Get images
      const images = Array.from(document.querySelectorAll('img'))
        .slice(0, 10)
        .map(img => ({
          src: img.src,
          alt: img.alt
        }))
      
      return {
        headline,
        metaDesc,
        bodyText,
        prices,
        ctas,
        testimonials,
        images,
        title: document.title
      }
    })
    
    // Take a screenshot
    const screenshot = await page.screenshot({ 
      type: 'jpeg',
      quality: 70,
      fullPage: false
    })
    
    await browser.close()
    
    return NextResponse.json({
      success: true,
      data: siteData,
      screenshot: screenshot.toString('base64'),
      url: page.url(),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Playwright scraping error:', error)
    
    if (browser) {
      await browser.close()
    }
    
    // Fallback to simple fetch when Playwright fails
    try {
      const { url } = requestBody
      console.log(`🔄 Falling back to simple fetch for ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000)
      })
      
      const html = await response.text()
      
      // Simple HTML parsing
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1] : 'Unknown'
      
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
      const metaDesc = descMatch ? descMatch[1] : ''
      
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
      const headline = h1Match ? h1Match[1] : title
      
      // Extract prices
      const priceMatches = html.match(/[\$£€]\d+/g) || []
      const prices = Array.from(new Set(priceMatches)).slice(0, 5)
      
      return NextResponse.json({
        success: true,
        data: {
          headline,
          metaDesc,
          bodyText: html.substring(0, 1000), // Limited text for analysis
          prices,
          ctas: [],
          testimonials: [],
          images: [],
          title
        },
        screenshot: null,
        url,
        timestamp: new Date().toISOString(),
        method: 'fallback-fetch'
      })
      
    } catch (fallbackError) {
      console.error('Fallback scraping also failed:', fallbackError)
      
      return NextResponse.json({
        success: false,
        error: 'Both Playwright and fallback scraping failed',
        originalError: error instanceof Error ? error.message : 'Unknown error',
        fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
      })
    }
  }
}

/**
 * Scrape Facebook Ads Library
 */
export async function GET(req: NextRequest) {
  let browser = null
  
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const country = searchParams.get('country') || 'US'
    
    console.log(`📱 Scraping Facebook Ads Library for: ${query}`)
    
    browser = await chromium.launch({
      headless: true
    })
    
    const context = await browser.newContext()
    const page = await context.newPage()
    
    // Navigate to Facebook Ads Library
    const adsLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(query)}&media_type=all`
    
    await page.goto(adsLibraryUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    })
    
    // Wait for ads to load
    await page.waitForTimeout(3000)
    
    // Extract ad data
    const ads = await page.evaluate(() => {
      const adCards = Array.from(document.querySelectorAll('[role="article"]')).slice(0, 10)
      
      return adCards.map(card => {
        const textContent = card.textContent || ''
        
        // Extract what we can from the card
        const adText = textContent.substring(0, 500)
        
        // Look for "Active since" text
        const activeMatch = textContent.match(/Active since (.+?)(?:\.|$)/)
        const activeSince = activeMatch ? activeMatch[1] : 'Unknown'
        
        // Look for advertiser name
        const advertiserEl = card.querySelector('a[href*="/ads/library"]')
        const advertiser = advertiserEl?.textContent || 'Unknown'
        
        return {
          advertiser,
          activeSince,
          adText: adText.trim(),
          platform: 'Facebook',
          status: 'Active'
        }
      })
    })
    
    await browser.close()
    
    return NextResponse.json({
      success: true,
      query,
      country,
      adsFound: ads.length,
      ads,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Facebook Ads Library scraping error:', error)
    
    if (browser) {
      await browser.close()
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unable to access Facebook Ads Library',
      message: 'This might require manual research or authentication',
      fallback: true
    })
  }
}