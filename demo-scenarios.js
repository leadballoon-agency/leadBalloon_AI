/**
 * Demo different scenarios to test the magic
 */

async function runDemos() {
  console.log('🎭 RUNNING LIVE DEMOS\n')
  console.log('=' .repeat(60))
  
  // Demo 1: Business Owner Struggling
  console.log('\n📌 DEMO 1: Body Contouring Clinic Owner')
  console.log('-'.repeat(60))
  
  let context = {
    url: 'https://skulptbodycontouring.co.uk',
    domain: 'skulptbodycontouring.co.uk',
    businessType: 'Body Contouring Clinic',
    services: 'Fat freezing, body sculpting, skin tightening',
    priceRange: '£500-£2000'
  }
  
  let conversationHistory = []
  
  // First message
  let response = await fetch('http://localhost:3003/api/ai-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Hi, I just put my website in for analysis",
      context,
      conversationHistory
    })
  })
  
  let data = await response.json()
  console.log('👤 USER: Hi, I just put my website in for analysis')
  console.log(`🤖 AI: ${data.response}\n`)
  
  conversationHistory = data.conversationHistory || [
    { role: 'user', content: "Hi, I just put my website in for analysis" },
    { role: 'assistant', content: data.response }
  ]
  
  // Second message
  response = await fetch('http://localhost:3003/api/ai-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Yes it's my clinic. We're spending £2k on Facebook but only getting about 20 leads per month",
      context,
      conversationHistory
    })
  })
  
  data = await response.json()
  console.log('👤 USER: Yes it\'s my clinic. We\'re spending £2k on Facebook but only getting about 20 leads per month')
  console.log(`🤖 AI: ${data.response}\n`)
  
  // Demo 2: Competitor Researching
  console.log('\n📌 DEMO 2: Competitor Doing Research')
  console.log('-'.repeat(60))
  
  context = {
    url: 'https://www.harleymedical.co.uk',
    domain: 'harleymedical.co.uk',
    businessType: 'Aesthetics Clinic',
    services: 'Botox, fillers, skin treatments'
  }
  
  conversationHistory = []
  
  response = await fetch('http://localhost:3003/api/ai-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Interesting site, just checking what they're doing",
      context,
      conversationHistory
    })
  })
  
  data = await response.json()
  console.log('👤 USER: Interesting site, just checking what they\'re doing')
  console.log(`🤖 AI: ${data.response}\n`)
  
  conversationHistory = data.conversationHistory || [
    { role: 'user', content: "Interesting site, just checking what they're doing" },
    { role: 'assistant', content: data.response }
  ]
  
  // Follow up
  response = await fetch('http://localhost:3003/api/ai-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "We run a similar clinic nearby, trying to understand their strategy",
      context,
      conversationHistory
    })
  })
  
  data = await response.json()
  console.log('👤 USER: We run a similar clinic nearby, trying to understand their strategy')
  console.log(`🤖 AI: ${data.response}\n`)
  
  // Demo 3: High-Value Prospect
  console.log('\n📌 DEMO 3: High-Value Prospect with Budget')
  console.log('-'.repeat(60))
  
  context = {
    url: 'https://example-medspa.com',
    domain: 'example-medspa.com',
    businessType: 'Medical Spa'
  }
  
  conversationHistory = []
  
  response = await fetch('http://localhost:3003/api/ai-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "We're looking to scale our med spa. Currently spending £10k/month on marketing but ROI is terrible",
      context,
      conversationHistory
    })
  })
  
  data = await response.json()
  console.log('👤 USER: We\'re looking to scale our med spa. Currently spending £10k/month on marketing but ROI is terrible')
  console.log(`🤖 AI: ${data.response}\n`)
  
  console.log('\n' + '=' .repeat(60))
  console.log('✨ DEMO COMPLETE - Check for the magic!')
}

runDemos().catch(console.error)