import * as cheerio from 'cheerio'

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
  images: string[]
  businessType?: string
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
  }
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    // Fetch the HTML
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Detect currency
    const bodyText = $('body').text()
    let currency: '£' | '$' | '€' = '$'
    if (url.includes('.uk') || bodyText.match(/£[\d,]+/)) {
      currency = '£'
    } else if (bodyText.match(/€[\d,]+/)) {
      currency = '€'
    }
    
    // Extract prices
    const prices: string[] = []
    const pricePatterns = [
      /[£$€]\s*[\d,]+(?:\.\d{2})?/g,
      /[\d,]+\s*(?:GBP|USD|EUR)/gi,
      /(?:from|only|just|starting at)\s*[£$€]?\s*[\d,]+/gi
    ]
    
    pricePatterns.forEach(pattern => {
      const matches = bodyText.match(pattern)
      if (matches) {
        prices.push(...matches.slice(0, 10))
      }
    })
    
    // Extract headlines
    const headlines: string[] = []
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 5 && text.length < 200) {
        headlines.push(text)
      }
    })
    
    // Extract features/benefits
    const features: string[] = []
    $('li, .feature, .benefit, [class*="feature"], [class*="benefit"]').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 10 && text.length < 200) {
        features.push(text)
      }
    })
    
    // Extract testimonials
    const testimonials: string[] = []
    $('[class*="testimonial"], [class*="review"], blockquote, .quote').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 20) {
        testimonials.push(text.substring(0, 300))
      }
    })
    
    // Extract guarantees
    const guarantees: string[] = []
    const guaranteeKeywords = ['guarantee', 'refund', 'risk-free', 'money back', 'satisfaction']
    $('*').each((_, el) => {
      const text = $(el).text().trim()
      if (guaranteeKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
        if (text.length > 10 && text.length < 300) {
          guarantees.push(text)
        }
      }
    })
    
    // Extract urgency triggers
    const urgencyTriggers: string[] = []
    const urgencyKeywords = ['limited', 'only', 'left', 'hurry', 'today', 'ends', 'last chance', 'deadline']
    $('*').each((_, el) => {
      const text = $(el).text().trim()
      if (urgencyKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
        if (text.length > 10 && text.length < 200) {
          urgencyTriggers.push(text)
        }
      }
    })
    
    // Extract CTA buttons
    const ctaButtons: string[] = []
    $('button, a.button, a.btn, [class*="btn"], [class*="button"]').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 2 && text.length < 50) {
        ctaButtons.push(text)
      }
    })
    
    // Extract images (for visual analysis)
    const images: string[] = []
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      const alt = $(el).attr('alt')
      if (src) {
        images.push(alt || src)
      }
    })
    
    // Extract contact info
    const phone = $('a[href^="tel:"]').first().text().trim() || 
                  bodyText.match(/(?:\+?44|0)[\d\s-()]+/)?.[0]
    const email = $('a[href^="mailto:"]').first().text().trim()
    const address = $('[class*="address"], address').first().text().trim()
    
    // Detect business type from content
    let businessType = 'Service Business'
    if (bodyText.toLowerCase().includes('clinic') || bodyText.toLowerCase().includes('medical')) {
      businessType = 'Medical/Aesthetic Clinic'
    } else if (bodyText.toLowerCase().includes('salon') || bodyText.toLowerCase().includes('spa')) {
      businessType = 'Beauty Salon/Spa'
    }
    
    return {
      url,
      title: $('title').text() || $('h1').first().text(),
      description: $('meta[name="description"]').attr('content') || '',
      currency,
      prices: [...new Set(prices)].slice(0, 10),
      headlines: headlines.slice(0, 10),
      features: [...new Set(features)].slice(0, 20),
      testimonials: testimonials.slice(0, 5),
      guarantees: [...new Set(guarantees)].slice(0, 3),
      urgencyTriggers: [...new Set(urgencyTriggers)].slice(0, 5),
      ctaButtons: [...new Set(ctaButtons)].slice(0, 10),
      images: images.slice(0, 10),
      businessType,
      contactInfo: {
        phone,
        email,
        address
      }
    }
  } catch (error) {
    console.error('Scraping error:', error)
    throw error
  }
}

// Build knowledge base from scraped data
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
    `,
    
    visualElements: `
      Images found: ${data.images.length}
      Image descriptions: ${data.images.slice(0, 5).join(', ')}
    `
  }
}