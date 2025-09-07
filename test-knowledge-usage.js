/**
 * Test if the AI is actually using our knowledge library
 */

async function testKnowledgeUsage() {
  console.log('🧠 TESTING KNOWLEDGE LIBRARY USAGE\n')
  console.log('=' .repeat(60))
  
  const context = {
    url: 'https://skulptbodycontouring.co.uk',
    domain: 'skulptbodycontouring.co.uk',
    businessType: 'Body Contouring Clinic',
    services: 'Fat freezing, body sculpting',
    priceRange: '£500-£2000'
  }
  
  // Test messages that should trigger specific knowledge
  const testMessages = [
    {
      message: "What are my competitors doing?",
      expectedKnowledge: "Should mention Transform, 3D Lipo, or specific competitor spending"
    },
    {
      message: "How can I get leads for free?",
      expectedKnowledge: "Should mention SLO strategy or self-liquidating offers"
    },
    {
      message: "What ROAS should I expect?",
      expectedKnowledge: "Should educate about realistic ROAS (2-3x is good)"
    },
    {
      message: "My leads cost £80 each, is that normal?",
      expectedKnowledge: "Should reference industry benchmarks (£15-50 typical)"
    }
  ]
  
  let conversationHistory = []
  
  for (const test of testMessages) {
    console.log(`\n📝 Testing: "${test.message}"`)
    console.log(`   Expected: ${test.expectedKnowledge}`)
    console.log('   ---')
    
    const response = await fetch('http://localhost:3003/api/ai-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: test.message,
        context,
        conversationHistory
      })
    })
    
    const data = await response.json()
    console.log(`   🤖 Response: ${data.response}`)
    
    // Check for specific knowledge markers
    const responseText = data.response.toLowerCase()
    const hasSpecificKnowledge = 
      responseText.includes('transform') ||
      responseText.includes('3d lipo') ||
      responseText.includes('slo') ||
      responseText.includes('self-liquidating') ||
      responseText.includes('£15') ||
      responseText.includes('£50') ||
      responseText.includes('2-3x') ||
      responseText.includes('roas')
    
    console.log(`   ✅ Uses Knowledge: ${hasSpecificKnowledge ? 'YES' : 'NO'}`)
    
    conversationHistory = [
      { role: 'user', content: test.message },
      { role: 'assistant', content: data.response }
    ]
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '=' .repeat(60))
  console.log('💡 ANALYSIS:')
  console.log('If responses don\'t include specific knowledge, we need to fix the knowledge loading!')
}

testKnowledgeUsage().catch(console.error)