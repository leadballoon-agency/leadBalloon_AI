/**
 * Quick test to verify scraping and conversation APIs
 */

async function quickTest() {
  console.log('🚀 Quick API Test\n')
  
  const testUrl = 'https://skulptbodycontouring.co.uk'
  
  // Test 1: Scrape Site
  console.log('1️⃣ Testing scrape-site API...')
  try {
    const scrapeResponse = await fetch('http://localhost:3003/api/scrape-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: testUrl })
    })
    
    const scrapeData = await scrapeResponse.json()
    console.log('✅ Scrape Response:')
    console.log('  - Success:', scrapeData.success)
    console.log('  - Has headline:', !!scrapeData.data?.headline)
    console.log('  - Has body text:', !!scrapeData.data?.bodyText)
    console.log('  - Headline:', scrapeData.data?.headline?.substring(0, 50))
    
    if (!scrapeData.success) {
      console.log('  ❌ Error:', scrapeData.error)
    }
  } catch (error) {
    console.log('  ❌ Failed:', error.message)
  }
  
  // Test 2: AI Conversation
  console.log('\n2️⃣ Testing ai-conversation API...')
  try {
    const convResponse = await fetch('http://localhost:3003/api/ai-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "I'm struggling to get leads for my body contouring clinic",
        context: {
          url: testUrl,
          domain: 'skulptbodycontouring.co.uk',
          businessType: 'Body Contouring Clinic',
          services: 'Fat freezing, body sculpting',
          priceRange: '£500-£2000'
        },
        conversationHistory: []
      })
    })
    
    const convData = await convResponse.json()
    console.log('✅ Conversation Response:')
    console.log('  - Success:', convData.success)
    console.log('  - Response length:', convData.response?.length)
    console.log('  - Has follow-up question:', convData.response?.includes('?'))
    console.log('  - Mentions industry:', convData.response?.toLowerCase().includes('body') || convData.response?.toLowerCase().includes('contouring'))
    console.log('  - Response preview:', convData.response?.substring(0, 100) + '...')
  } catch (error) {
    console.log('  ❌ Failed:', error.message)
  }
}

quickTest().catch(console.error)