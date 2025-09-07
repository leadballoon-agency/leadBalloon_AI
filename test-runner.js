/**
 * LeadBalloon AI Test Runner
 * Run comprehensive tests to ensure quality
 */

const TEST_SITES = {
  bodyContouring: [
    'https://skulptbodycontouring.co.uk',
    'https://www.3d-lipo.co.uk',
    'https://www.coolsculpting.co.uk'
  ],
  aesthetics: [
    'https://www.harleymedical.co.uk',
    'https://www.transform.co.uk',
    'https://www.sknclinics.co.uk'
  ],
  dental: [
    'https://www.bupa.co.uk/dental',
    'https://www.mydentist.co.uk'
  ],
  fitness: [
    'https://www.puregym.com',
    'https://www.thegymgroup.com'
  ],
  random: [
    'https://www.bbc.co.uk',  // News site
    'https://www.amazon.co.uk', // Ecommerce
    'https://www.gov.uk'  // Government
  ]
}

async function testScraping(url) {
  console.log(`\n🔍 Testing: ${url}`)
  
  try {
    const response = await fetch('http://localhost:3003/api/scrape-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    
    const data = await response.json()
    
    // Check critical fields from the scrape-site response
    const results = {
      url,
      success: data.success,
      hasHeadline: !!data.data?.headline,
      hasBodyText: !!data.data?.bodyText,
      hasPricing: data.data?.prices?.length > 0,
      hasCTAs: data.data?.ctas?.length > 0,
      hasTestimonials: data.data?.testimonials?.length > 0,
      scrapedContent: data.data?.bodyText?.substring(0, 100) + '...'
    }
    
    // Score the quality
    let score = 0
    if (results.success) score += 20
    if (results.hasHeadline) score += 20
    if (results.hasBodyText) score += 20
    if (results.hasPricing) score += 20
    if (results.hasCTAs) score += 10
    if (results.hasTestimonials) score += 10
    
    results.qualityScore = score
    
    return results
  } catch (error) {
    return {
      url,
      success: false,
      error: error.message,
      qualityScore: 0
    }
  }
}

async function testConversation(url, responses) {
  console.log(`\n💬 Testing conversation for: ${url}`)
  
  const conversationHistory = []
  
  // First scrape the site to get context
  const scrapeResponse = await fetch('http://localhost:3003/api/scrape-site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })
  
  const scrapeData = await scrapeResponse.json()
  
  // Start analysis with scraped context
  const startResponse = await fetch('http://localhost:3003/api/ai-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: responses[0] || "Not getting enough leads",
      context: { 
        url,
        domain: new URL(url).hostname,
        businessType: detectBusinessType(url, scrapeData.data?.bodyText || ''),
        services: scrapeData.data?.headline || '',
        priceRange: scrapeData.data?.prices?.join(', ') || ''
      },
      conversationHistory: []
    })
  })
  
  const startData = await startResponse.json()
  console.log('AI Response:', startData.response?.substring(0, 100))
  
  return {
    url,
    hasFollowUpQuestion: startData.response?.includes('?'),
    mentionsIndustry: startData.response?.toLowerCase().includes('body') || 
                      startData.response?.toLowerCase().includes('fitness') ||
                      startData.response?.toLowerCase().includes('dental'),
    providesValue: startData.response?.includes('£') || 
                   startData.response?.includes('%') ||
                   startData.response?.includes('strategy')
  }
}

async function runAllTests() {
  console.log('🚀 Starting LeadBalloon AI Test Suite\n')
  console.log('=' .repeat(50))
  
  const results = {
    scraping: [],
    conversation: [],
    failures: []
  }
  
  // Test scraping for all sites
  for (const [industry, urls] of Object.entries(TEST_SITES)) {
    console.log(`\n📊 Testing ${industry.toUpperCase()} sites...`)
    
    for (const url of urls) {
      const result = await testScraping(url)
      results.scraping.push(result)
      
      if (result.qualityScore < 60) {
        results.failures.push({
          url,
          issue: 'Poor scraping quality',
          score: result.qualityScore
        })
      }
      
      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  // Test conversations for select sites
  console.log('\n\n💬 Testing Conversations...')
  console.log('=' .repeat(50))
  
  const testConversations = [
    TEST_SITES.bodyContouring[0],
    TEST_SITES.aesthetics[0],
    TEST_SITES.fitness[0]
  ]
  
  for (const url of testConversations) {
    const result = await testConversation(url, ["Not getting enough leads"])
    results.conversation.push(result)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // Generate report
  console.log('\n\n📈 TEST RESULTS SUMMARY')
  console.log('=' .repeat(50))
  
  const avgScore = results.scraping.reduce((sum, r) => sum + r.qualityScore, 0) / results.scraping.length
  
  console.log(`✅ Sites tested: ${results.scraping.length}`)
  console.log(`📊 Average quality score: ${avgScore.toFixed(1)}%`)
  console.log(`❌ Failures: ${results.failures.length}`)
  
  if (results.failures.length > 0) {
    console.log('\n⚠️  FAILED SITES:')
    results.failures.forEach(f => {
      console.log(`  - ${f.url}: ${f.issue} (Score: ${f.score})`)
    })
  }
  
  console.log('\n💬 CONVERSATION QUALITY:')
  results.conversation.forEach(c => {
    console.log(`  ${c.url}:`)
    console.log(`    - Has follow-up question: ${c.hasFollowUpQuestion ? '✅' : '❌'}`)
    console.log(`    - Mentions industry: ${c.mentionsIndustry ? '✅' : '❌'}`)
    console.log(`    - Provides value: ${c.providesValue ? '✅' : '❌'}`)
  })
  
  // Save results
  const fs = require('fs')
  fs.writeFileSync(
    'test-results.json', 
    JSON.stringify(results, null, 2)
  )
  
  console.log('\n✅ Test results saved to test-results.json')
}

// Helper function to detect business type
function detectBusinessType(url, bodyText) {
  const urlLower = url.toLowerCase()
  const textLower = bodyText.toLowerCase()
  
  if (urlLower.includes('sculpt') || urlLower.includes('body') || textLower.includes('body contouring')) {
    return 'Body Contouring Clinic'
  }
  if (urlLower.includes('harley') || urlLower.includes('transform') || textLower.includes('aesthetics')) {
    return 'Aesthetics Clinic'
  }
  if (urlLower.includes('dental') || urlLower.includes('dentist') || textLower.includes('teeth')) {
    return 'Dental Practice'
  }
  if (urlLower.includes('gym') || urlLower.includes('fitness') || textLower.includes('training')) {
    return 'Fitness Center'
  }
  return 'Business'
}

// Run tests
runAllTests().catch(console.error)