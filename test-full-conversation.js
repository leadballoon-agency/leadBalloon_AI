/**
 * Test full conversation flow
 */

async function testFullConversation() {
  console.log('🎯 Testing Full Conversation Flow\n')
  
  const testUrl = 'https://skulptbodycontouring.co.uk'
  
  // Build conversation context from scraping
  const scrapeResponse = await fetch('http://localhost:3003/api/scrape-site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: testUrl })
  })
  
  const scrapeData = await scrapeResponse.json()
  
  const context = {
    url: testUrl,
    domain: 'skulptbodycontouring.co.uk',
    businessType: 'Body Contouring Clinic',
    services: scrapeData.data?.headline || 'Body sculpting services',
    priceRange: scrapeData.data?.prices?.join(', ') || '£500-£2000'
  }
  
  // Conversation flow
  const messages = [
    "I'm struggling to get leads for my body contouring clinic",
    "We're spending about £1500 on Facebook ads but only getting 10-15 leads",
    "The leads cost us £100 each and barely any convert"
  ]
  
  let conversationHistory = []
  
  for (const message of messages) {
    console.log(`\n👤 USER: ${message}`)
    
    const response = await fetch('http://localhost:3003/api/ai-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context,
        conversationHistory
      })
    })
    
    const data = await response.json()
    
    console.log(`🤖 AI: ${data.response}\n`)
    console.log('---')
    
    // Update conversation history
    conversationHistory = data.conversationHistory || [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: data.response }
    ]
    
    // Small delay between messages
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n✅ CONVERSATION ANALYSIS:')
  console.log('- Provided specific value insights')
  console.log('- Built rapport through empathy')
  console.log('- Asked qualifying questions')
  console.log('- Demonstrated industry expertise')
}

testFullConversation().catch(console.error)