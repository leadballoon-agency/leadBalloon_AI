import { chromium } from 'playwright'

export interface ScrapedData {
  url: string
  title: string
  description: string
  currency: '£' | '$' | '€'
  prices: string[]
  headlines: string[]
  features: string[]
  testimonials: string[]
  guarantees: string[]
  urgencyTriggers: string[]
  ctaButtons: string[]
  businessType?: string
}

export async function scrapeWithPlaywright(url: string, useProxy = false): Promise<ScrapedData> {
  const browser = await chromium.launch({ headless: true })
  
  const contextOptions: any = {}
  
  // Use Oxylabs proxy if requested
  if (useProxy && process.env.OXYLABS_USERNAME) {
    contextOptions.proxy = {
      server: 'http://pr.oxylabs.io:7777',
      username: process.env.OXYLABS_USERNAME,
      password: process.env.OXYLABS_PASSWORD
    }
  }
  
  const context = await browser.newContext(contextOptions)
  const page = await context.newPage()
  
  console.log(`🔍 Scraping ${url} with Playwright...`)
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    const data = await page.evaluate((url) => {
      // Detect currency based on domain and content
      const bodyText = document.body.innerText
      let currency: '£' | '$' | '€' = '$'
      
      // Check domain extensions first
      if (url.includes('.uk') || url.includes('.co.uk')) {
        currency = '£'
      } else if (url.includes('.eu') || url.includes('.de') || url.includes('.fr') || url.includes('.es') || url.includes('.it')) {
        currency = '€'
      } else if (url.includes('.au')) {
        currency = '$' // Australian dollar (could add A$ later)
      } else if (url.includes('.ca')) {
        currency = '$' // Canadian dollar (could add C$ later)
      }
      
      // Override with actual currency symbols found on page
      if (bodyText.match(/£[\d,]+/)) {
        currency = '£'
      } else if (bodyText.match(/€[\d,]+/)) {
        currency = '€'
      }
      
      // Extract prices
      const prices: string[] = []
      const priceElements = document.querySelectorAll('*')
      priceElements.forEach(el => {
        const text = el.textContent || ''
        const priceMatches = text.match(/[£$€]\s*[\d,]+(?:\.\d{2})?/g)
        if (priceMatches) {
          prices.push(...priceMatches)
        }
      })
      
      // Extract headlines
      const headlines = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 5 && text.length < 200) as string[]
      
      // Extract features/benefits
      const features = Array.from(document.querySelectorAll('li, .feature, .benefit, [class*="feature"], [class*="benefit"]'))
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 10 && text.length < 200) as string[]
      
      // Extract testimonials
      const testimonials = Array.from(document.querySelectorAll('[class*="testimonial"], [class*="review"], blockquote'))
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 20) as string[]
      
      // Extract guarantees
      const guarantees: string[] = []
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.toLowerCase() || ''
        if (text.includes('guarantee') || text.includes('refund') || text.includes('risk-free')) {
          const fullText = el.textContent?.trim()
          if (fullText && fullText.length > 10 && fullText.length < 300) {
            guarantees.push(fullText)
          }
        }
      })
      
      // Extract urgency triggers
      const urgencyTriggers: string[] = []
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.toLowerCase() || ''
        if (text.includes('limited') || text.includes('only') || text.includes('hurry') || text.includes('ends')) {
          const fullText = el.textContent?.trim()
          if (fullText && fullText.length > 10 && fullText.length < 200) {
            urgencyTriggers.push(fullText)
          }
        }
      })
      
      // Extract CTAs
      const ctaButtons = Array.from(document.querySelectorAll('button, a.button, a.btn, [class*="btn"]'))
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 2 && text.length < 50) as string[]
      
      // Detect business type
      let businessType = 'Service Business'
      if (bodyText.toLowerCase().includes('clinic') || bodyText.toLowerCase().includes('medical')) {
        businessType = 'Medical/Aesthetic Clinic'
      } else if (bodyText.toLowerCase().includes('salon') || bodyText.toLowerCase().includes('spa')) {
        businessType = 'Beauty Salon/Spa'
      }
      
      return {
        url,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        currency,
        prices: Array.from(new Set(prices)).slice(0, 10),
        headlines: headlines.slice(0, 10),
        features: Array.from(new Set(features)).slice(0, 20),
        testimonials: testimonials.slice(0, 5),
        guarantees: Array.from(new Set(guarantees)).slice(0, 3),
        urgencyTriggers: Array.from(new Set(urgencyTriggers)).slice(0, 5),
        ctaButtons: Array.from(new Set(ctaButtons)).slice(0, 10),
        businessType
      }
    }, url)
    
    // Take screenshot for reference
    await page.screenshot({ path: `scraped-${new URL(url).hostname}.png` })
    
    await context.close()
    await browser.close()
    
    console.log(`✅ Scraped successfully:`, {
      prices: data.prices.length,
      headlines: data.headlines.length,
      currency: data.currency
    })
    
    return data
  } catch (error) {
    console.error('Scraping error:', error)
    await context.close()
    await browser.close()
    throw error
  }
}

export function buildKnowledgeBase(data: ScrapedData) {
  return {
    businessContext: `
      Business: ${data.businessType}
      Website: ${data.url}
      Title: ${data.title}
      Description: ${data.description}
      Currency: ${data.currency}
    `,
    
    pricing: `
      Actual prices found on website:
      ${data.prices.join('\n')}
    `,
    
    messaging: `
      Headlines: ${data.headlines.slice(0, 5).join(' | ')}
      
      Key Features/Benefits:
      ${data.features.slice(0, 10).map(f => `- ${f}`).join('\n')}
      
      Guarantees offered:
      ${data.guarantees.join(' | ')}
      
      Urgency/Scarcity tactics:
      ${data.urgencyTriggers.join(' | ')}
      
      Call-to-action buttons:
      ${data.ctaButtons.slice(0, 5).join(' | ')}
    `,
    
    socialProof: `
      Number of testimonials found: ${data.testimonials.length}
      ${data.testimonials.length > 0 ? `Sample testimonial: "${data.testimonials[0]}"` : 'No testimonials found'}
    `
  }
}