import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { scrapeWithPlaywright, buildKnowledgeBase } from '@/lib/playwright-scraper'
import { scrapeFacebookAds, scrapeIndustryAds } from '@/lib/facebook-ads-scraper'

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
}) : null

// Analyze with Claude (better for understanding context and creating copy)
async function analyzeWithClaude(url: string) {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured')
  }
  try {
    let scrapedData = null
    let knowledge = null
    let facebookAds = null
    
    // Try to scrape the website for real data (optional - falls back if not available)
    try {
      scrapedData = await scrapeWithPlaywright(url, true) // Use Oxylabs proxy
      knowledge = buildKnowledgeBase(scrapedData)
    } catch (scrapeError) {
      console.log('⚠️ Website scraping unavailable, using AI analysis only')
    }
    
    // Try to scrape Facebook Ads for competitor insights
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      const businessName = domain.split('.')[0] // Get business name from domain
      
      // First try exact business name
      facebookAds = await scrapeFacebookAds(businessName)
      
      // If no ads found, try industry-wide search
      if (!facebookAds || facebookAds.adsFound === 0) {
        console.log(`📱 No ads for ${businessName}, searching industry...`)
        
        // Detect industry and search for top performers
        const industryTerms = detectIndustry(url)
        const industryAds = await scrapeIndustryAds(industryTerms)
        
        if (industryAds && industryAds.topPerformers) {
          facebookAds = {
            adsFound: industryAds.totalAds,
            topPerformers: industryAds.topPerformers,
            insights: {
              commonOffers: industryAds.insights.commonOffers,
              pricePoints: industryAds.insights.pricePoints,
              urgencyTactics: industryAds.insights.urgencyTactics,
              longRunningAds: industryAds.longRunningAds // Ads running 3+ months = proven
            }
          }
          console.log(`📱 Found ${industryAds.totalAds} industry ads, ${industryAds.longRunningAds.length} are proven winners`)
        }
      } else {
        console.log(`📱 Found ${facebookAds.adsFound} Facebook ads for ${businessName}`)
      }
    } catch (fbError) {
      console.log('⚠️ Facebook Ads scraping unavailable')
    }
    
    if (scrapedData) {
      console.log('📊 Scraped data:', {
        prices: scrapedData.prices.length,
        headlines: scrapedData.headlines.length,
        features: scrapedData.features.length,
        currency: scrapedData.currency
      })
    }
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // Claude 4 Sonnet - May 2025 version
      max_tokens: 1500,
      temperature: 0.7,
      system: `You are a master copywriter trained in the techniques of Claude Hopkins (scientific advertising, specificity), John Carlton (conversational, story-driven copy), Gary Halbert (starving crowd, urgency), Eugene Schwartz (market sophistication), David Ogilvy (long-form, research-based), and Joe Sugarman (psychological triggers).
      
      You also use modern frameworks from Alex Hormozi (value equation, Grand Slam Offers) and Russell Brunson (perfect webinar, value ladder).
      
      Apply these principles:
      - Hopkins: Use specific numbers, test everything, reason-why copy
      - Carlton: Write conversationally, tell stories, enter the conversation in their head
      - Halbert: Find the starving crowd, create urgency, use grabbers
      - Schwartz: Match market sophistication level, channel existing desires
      - Ogilvy: Research deeply, long copy sells, specifics beat generalities
      - Sugarman: Create slippery slide, plant curiosity seeds, use psychological triggers
      
      ${scrapedData ? 'Use the REAL DATA provided from the website scraping.' : 'Analyze the URL and create compelling offers using these legendary techniques.'}`,
      messages: [{
        role: 'user',
        content: scrapedData ? 
        `Based on this REAL DATA scraped from ${url}, create an irresistible offer:
        
        ${knowledge.businessContext}
        
        ${knowledge.pricing}
        
        ${knowledge.messaging}
        
        ${knowledge.socialProof}
        
        ${facebookAds ? `
        Facebook Ads Intelligence:
        - ${facebookAds.adsFound} active ads found
        ${facebookAds.topPerformers ? `
        - TOP PERFORMERS (ads running 3+ months = proven winners):
          ${facebookAds.topPerformers.map((p: any) => `${p.name}: ${p.adsCount} ads`).join(', ')}
        ` : ''}
        ${facebookAds.insights ? `
        - Common offers: ${facebookAds.insights.commonOffers.join(', ')}
        - Price points in ads: ${facebookAds.insights.pricePoints.join(', ')}
        - Urgency tactics used: ${facebookAds.insights.urgencyTactics.join(', ')}
        ` : ''}
        ${facebookAds.insights?.longRunningAds ? `
        - PROVEN WINNERS: ${facebookAds.insights.longRunningAds.length} ads running 3+ months
        ` : ''}
        ` : ''}
        
        IMPORTANT: 
        - Use the currency detected: ${scrapedData.currency}
        - Base pricing on ACTUAL prices found: ${scrapedData.prices.slice(0, 3).join(', ')}
        - Use their actual messaging style and pain points
        ${facebookAds ? '- Create BETTER offers than what they\'re running on Facebook' : ''}` :
        `Analyze this website and create an irresistible offer: ${url}
        
        IMPORTANT: 
        - If this is a UK website (.uk, .co.uk) use British Pounds (£) 
        - Try to identify realistic pricing for this market
        - Create compelling value stacks
        
        Return ONLY a valid JSON object (no markdown, no backticks, no other text) with:
        - businessType: what kind of business
        - targetAudience: who they serve  
        - mainPainPoints: array of 3-4 deep emotional pain points
        - competitors: array with {name, price, weakness}
        - suggestedOffer: {
            dreamOutcome: the transformation they want (emotional, not logical)
            valueStack: array of 4-5 items with {item, value, description}
            pricing: {offerPrice, totalValue, paymentPlan}
            guarantee: risk-reversing guarantee
            urgency: genuine scarcity reason
            bonuses: array of 2-3 bonus offers
          }`
      }]
    })

    let content = response.content[0].type === 'text' ? response.content[0].text : ''
    // Remove markdown code block if present
    content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
    return JSON.parse(content)
  } catch (error) {
    console.error('Claude error:', error)
    throw error
  }
}

// Analyze with GPT (good for quick analysis)
async function analyzeWithOpenAI(url: string) {
  try {
    let scrapedData = null
    let knowledge = null
    
    // Try to scrape the website for real data (optional - falls back if not available)
    try {
      scrapedData = await scrapeWithPlaywright(url, true) // Use Oxylabs proxy
      knowledge = buildKnowledgeBase(scrapedData)
      console.log('📊 Scraped data for GPT:', {
        prices: scrapedData.prices.length,
        currency: scrapedData.currency
      })
    } catch (scrapeError) {
      console.log('⚠️ Scraping unavailable for GPT, using AI analysis only')
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // GPT-4 Turbo - Best for September 2025
      // model: "gpt-4o", // GPT-4o - Multimodal model
      // model: "gpt-4", // GPT-4 - Standard
      // model: "gpt-3.5-turbo", // Faster, cheaper option
      messages: [
        { 
          role: "system", 
          content: `You are a master copywriter trained by legends: Claude Hopkins (specificity), John Carlton (storytelling), Gary Halbert (urgency), Eugene Schwartz (sophistication), David Ogilvy (research), Joe Sugarman (triggers), Hormozi (value stacking), and Brunson (funnels).
          
          Create offers using: Specific numbers (Hopkins), conversational stories (Carlton), urgency (Halbert), market sophistication matching (Schwartz), deep benefits (Ogilvy), and psychological triggers (Sugarman).
          
          ${scrapedData ? 'Use the REAL DATA provided.' : ''} Return ONLY valid JSON with no markdown, no backticks, no other text.`
        },
        { 
          role: "user", 
          content: scrapedData ? 
          `Based on scraped data from ${url}:
          
          ${knowledge.businessContext}
          ${knowledge.pricing}
          ${knowledge.messaging}
          
          Currency: ${scrapedData.currency}
          Actual prices: ${scrapedData.prices.slice(0, 3).join(', ')}
          
          Create offer JSON with: businessType, targetAudience, mainPainPoints (array), competitors (array), suggestedOffer (with dreamOutcome, valueStack array, pricing, guarantee, urgency, bonuses array)` :
          `Analyze ${url} and create an offer. If UK site (.uk/.co.uk) use £ pounds. Create offer JSON with: businessType, targetAudience, mainPainPoints (array), competitors (array), suggestedOffer (with dreamOutcome, valueStack array, pricing, guarantee, urgency, bonuses array)`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    let response = completion.choices[0].message.content || '{}'
    // Remove markdown code block if present
    response = response.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
    return JSON.parse(response)
  } catch (error) {
    console.error('OpenAI error:', error)
    throw error
  }
}

// Detect industry from URL for targeted Facebook Ads search
function detectIndustry(url: string): string[] {
  const lowerUrl = url.toLowerCase()
  
  if (lowerUrl.includes('sculpt') || lowerUrl.includes('contour') || lowerUrl.includes('lipo')) {
    return ['body contouring', 'coolsculpting', 'body sculpting', 'fat freezing']
  }
  if (lowerUrl.includes('hifu') || lowerUrl.includes('aesthetic') || lowerUrl.includes('botox')) {
    return ['aesthetic clinic', 'medical aesthetics', 'botox', 'dermal fillers']
  }
  if (lowerUrl.includes('dental') || lowerUrl.includes('smile')) {
    return ['dental practice', 'cosmetic dentistry', 'invisalign', 'teeth whitening']
  }
  if (lowerUrl.includes('hair') || lowerUrl.includes('transplant')) {
    return ['hair transplant', 'hair restoration', 'hair clinic']
  }
  
  // Default to generic medical aesthetic terms
  return ['medical spa', 'aesthetic clinic', 'cosmetic treatment']
}

// Intelligent fallback based on URL patterns
function getFallbackAnalysis(url: string) {
  const lowerUrl = url.toLowerCase()
  const isUK = url.includes('.uk') || url.includes('.co.uk')
  const currency = isUK ? '£' : '$'
  
  // Check for UK aesthetic/medical clinics
  if ((lowerUrl.includes('hifu') || lowerUrl.includes('aesthetic') || lowerUrl.includes('skin') || lowerUrl.includes('beauty')) && isUK) {
    return {
      businessType: 'Aesthetic/Medical Clinic',
      targetAudience: 'People seeking non-surgical aesthetic treatments',
      mainPainPoints: [
        'Starting to see signs of aging but not ready for surgery',
        'Want to look refreshed without anyone knowing they had work done',
        'Concerned about safety and want medical-grade treatments',
        'Tired of spending money on skincare that doesn\'t work'
      ],
      competitors: [
        { name: 'Harley Street Clinics', price: `${currency}2000-5000`, weakness: 'Overpriced, pretentious, long wait times' },
        { name: 'Local Beauty Salons', price: `${currency}200-500`, weakness: 'Not medical grade, risky, poor results' },
        { name: 'DIY/At-home devices', price: `${currency}50-200`, weakness: 'Dangerous, ineffective, waste of money' }
      ],
      suggestedOffer: {
        dreamOutcome: 'Look 10 years younger without surgery - natural, refreshed, confident',
        valueStack: [
          { item: 'HIFU Full Face & Neck Treatment', value: `${currency}1500`, description: 'Medical-grade lifting and tightening' },
          { item: 'Professional Consultation & Skin Analysis', value: `${currency}150`, description: 'Personalized treatment plan by medical professional' },
          { item: 'Luxury Skincare Bundle', value: `${currency}200`, description: 'Medical-grade products to maintain results' },
          { item: 'Follow-up Appointments (3 months)', value: `${currency}300`, description: 'Ensure perfect results with adjustments' },
          { item: 'VIP Priority Booking', value: `${currency}250`, description: 'Skip the waiting list for touch-ups' }
        ],
        pricing: { 
          offerPrice: `${currency}697`, 
          totalValue: `${currency}2400`,
          paymentPlan: `${currency}233`
        },
        guarantee: 'See visible lifting in 30 days or full refund - zero risk',
        urgency: 'Only 3 appointment slots this month (HIFU machine fully booked)',
        bonuses: [
          `FREE skin consultation (${currency}150 value) - this week only`,
          `Bring a friend and both save 15%`,
          `FREE touch-up session after 6 months (${currency}300 value)`
        ]
      }
    }
  }
  
  if (lowerUrl.includes('sculpt') || lowerUrl.includes('body') || lowerUrl.includes('contour')) {
    return {
      businessType: 'Body Contouring Clinic',
      targetAudience: 'People with loose skin after dramatic weight loss (Ozempic/Wegovy users)',
      mainPainPoints: [
        'Feel betrayed - worked so hard to lose weight but still hate their body',
        'Clothes fit worse than before - loose skin makes them look bigger',
        'Avoiding intimacy and hiding their body from partners',
        'Summer anxiety - can\'t enjoy the beach or pool'
      ],
      competitors: [
        { name: 'CoolSculpting', price: `${currency}2000-4000`, weakness: 'Only freezes fat, doesn\'t tighten skin' },
        { name: 'Tummy Tuck Surgery', price: `${currency}8000-15000`, weakness: 'Major surgery, 6-week recovery, scarring' },
        { name: 'At-home devices', price: `${currency}200-500`, weakness: 'Don\'t work, waste of money' }
      ],
      suggestedOffer: {
        dreamOutcome: 'Finally love your body after weight loss - tight, toned skin that matches your hard work',
        valueStack: [
          { item: 'ProMax Lipo Skin Tightening (6 sessions)', value: `${currency}2400`, description: 'Medical-grade technology that actually works' },
          { item: 'Custom Body Transformation Plan', value: `${currency}497`, description: 'Targets YOUR specific problem areas' },
          { item: '3D Body Scanning & Progress Tracking', value: `${currency}297`, description: 'SEE your transformation happening' },
          { item: 'Nutrition & Collagen Building Program', value: `${currency}197`, description: 'Enhance and maintain your results' },
          { item: 'VIP Concierge Support (6 months)', value: `${currency}397`, description: 'We\'re with you every step' }
        ],
        pricing: { 
          offerPrice: `${currency}597`, 
          totalValue: `${currency}3788`,
          paymentPlan: `${currency}197`
        },
        guarantee: 'See visible skin tightening in 30 days or 100% money back - zero risk to you',
        urgency: 'Only 5 spots this month - ProMax machine is booked solid (2 spots left)',
        bonuses: [
          `FREE consultation & body scan (${currency}200 value) - this week only`,
          'Bring a friend and BOTH save 20% (accountability partner!)',
          `FREE maintenance session after 6 months (${currency}400 value)`
        ]
      }
    }
  }
  
  // Generic fallback
  return {
    businessType: 'Service Business',
    targetAudience: 'People looking for professional solutions',
    mainPainPoints: [
      'Tired of DIY solutions that don\'t work',
      'Wasted money on cheap alternatives',
      'Need results fast'
    ],
    competitors: [
      { name: 'Competitor A', price: `${currency}500-1000`, weakness: 'Poor service' }
    ],
    suggestedOffer: {
      dreamOutcome: 'Get the results you want without the premium price',
      valueStack: [
        { item: 'Core Service Package', value: `${currency}997`, description: 'Everything you need' },
        { item: 'Priority Support', value: `${currency}297`, description: 'Direct access when you need help' }
      ],
      pricing: { offerPrice: `${currency}297`, totalValue: `${currency}1294`, paymentPlan: `${currency}97` },
      guarantee: '100% satisfaction guaranteed or full refund',
      urgency: 'Special pricing ends Friday',
      bonuses: [`FREE consultation (${currency}100 value)`]
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, aiModel = 'auto' } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let analysis;
    let modelUsed = 'fallback';
    
    // Try Claude first (usually better for marketing copy)
    if (process.env.ANTHROPIC_API_KEY && (aiModel === 'claude' || aiModel === 'auto')) {
      try {
        console.log('🤖 Trying Claude...')
        analysis = await analyzeWithClaude(url)
        modelUsed = 'claude'
        console.log('✅ Claude analysis successful')
      } catch (error) {
        console.log('⚠️ Claude failed, trying OpenAI...')
      }
    }
    
    // Try OpenAI if Claude fails or not available
    if (!analysis && process.env.OPENAI_API_KEY && (aiModel === 'openai' || aiModel === 'auto')) {
      try {
        console.log('🤖 Trying OpenAI...')
        analysis = await analyzeWithOpenAI(url)
        modelUsed = 'openai'
        console.log('✅ OpenAI analysis successful')
      } catch (error) {
        console.log('⚠️ OpenAI failed, using fallback')
      }
    }
    
    // Use intelligent fallback if both fail
    if (!analysis) {
      console.log('📌 AI models unavailable, using fallback')
      
      // Return error message if user expects AI
      if (aiModel !== 'auto') {
        return NextResponse.json({ 
          success: false,
          error: 'AI models are currently offline. Both Claude and OpenAI are unavailable.',
          details: 'Please check your API keys or try again later.'
        }, { status: 503 })
      }
      
      // For auto mode, use fallback with clear indication
      analysis = getFallbackAnalysis(url)
    }

    return NextResponse.json({ 
      success: true, 
      analysis,
      modelUsed,
      aiPowered: modelUsed !== 'fallback',
      ...(modelUsed === 'fallback' && {
        notice: '⚠️ AI models are offline. Using pre-configured templates based on URL patterns.'
      })
    })
    
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze website' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Dual AI Analyzer Ready',
    models: {
      claude: !!process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '❌ Not configured',
      openai: !!process.env.OPENAI_API_KEY ? '✅ Connected' : '❌ Not configured'
    },
    capabilities: [
      'Claude 3 for nuanced marketing copy',
      'GPT-3.5 for quick analysis',
      'Automatic fallback between models',
      'Smart defaults if both fail'
    ]
  })
}