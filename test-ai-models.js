/**
 * Test which AI models are actually working
 */

async function testAIModels() {
  console.log('🔬 Testing AI Model Access\n')
  console.log('=' .repeat(50))
  
  const testMessage = "I need help with my body contouring clinic marketing"
  const testContext = {
    url: 'https://example.com',
    domain: 'example.com',
    businessType: 'Body Contouring Clinic'
  }
  
  // Test different conversation types to trigger different models
  const testCases = [
    { 
      message: "Hi there!", 
      type: "greeting",
      expectedModel: "claude-sonnet"
    },
    {
      message: "I'm really struggling with lead costs",
      type: "emotional", 
      expectedModel: "claude-sonnet"
    },
    {
      message: "What's my ROI if I spend £5000?",
      type: "data/pricing",
      expectedModel: "gpt-4o"
    },
    {
      message: "How does the Facebook pixel work?",
      type: "technical",
      expectedModel: "gpt-4o"
    }
  ]
  
  const results = []
  
  for (const test of testCases) {
    console.log(`\n📝 Testing: "${test.message}"`)
    console.log(`   Type: ${test.type}`)
    console.log(`   Expected: ${test.expectedModel}`)
    
    try {
      const response = await fetch('http://localhost:3003/api/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: test.message,
          context: testContext,
          conversationHistory: []
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const quality = data.response.length > 100 ? 'GOOD' : 'POOR'
        const hasQuestion = data.response.includes('?')
        
        console.log(`   ✅ Success`)
        console.log(`   Response length: ${data.response.length} chars`)
        console.log(`   Quality: ${quality}`)
        console.log(`   Has follow-up: ${hasQuestion}`)
        
        results.push({
          test: test.type,
          success: true,
          quality,
          responseLength: data.response.length,
          hasQuestion
        })
      } else {
        console.log(`   ❌ Failed`)
        results.push({
          test: test.type,
          success: false
        })
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
      results.push({
        test: test.type,
        success: false,
        error: error.message
      })
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Summary
  console.log('\n' + '=' .repeat(50))
  console.log('📊 SUMMARY\n')
  
  const successful = results.filter(r => r.success && r.quality === 'GOOD').length
  const failed = results.filter(r => !r.success || r.quality === 'POOR').length
  
  console.log(`✅ High Quality Responses: ${successful}/${testCases.length}`)
  console.log(`❌ Poor/Failed Responses: ${failed}/${testCases.length}`)
  
  // Check server logs for actual models used
  console.log('\n💡 Check server logs to see which models were actually used')
  console.log('   Look for: "Auto-selected" or "Primary model failed"')
  
  return results
}

testAIModels().catch(console.error)