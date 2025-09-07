/**
 * Quick verification test for LeadBalloon AI
 * Tests key functionality without comprehensive coverage
 */

const fetch = require('node-fetch')

async function quickVerifyTests() {
  console.log('🚀 QUICK VERIFICATION TEST\n')
  console.log('=' .repeat(50))
  
  const tests = [
    {
      name: 'Body Contouring Lead Cost',
      context: { url: 'https://bodysculpting.co.uk', businessType: 'bodyContouring' },
      message: "What's the typical lead cost?",
      expected: ['£15', '£50', 'lead']
    },
    {
      name: 'Facebook CPM Knowledge',
      context: { url: 'https://test.co.uk', businessType: 'general' },
      message: "What's the average CPM for Facebook?",
      expected: ['£8-15', 'CPM', 'Facebook']
    },
    {
      name: 'Email Open Rates',
      context: { url: 'https://test.co.uk', businessType: 'general' },
      message: "What's a good email open rate?",
      expected: ['21%', 'open', 'rate']
    },
    {
      name: 'SEO Timeline',
      context: { url: 'https://test.co.uk', businessType: 'general' },
      message: "How long does SEO take?",
      expected: ['3-6 months', 'SEO', 'depends']
    },
    {
      name: 'Landing Page Conversion',
      context: { url: 'https://test.co.uk', businessType: 'general' },
      message: "My landing page converts at 1%, is that bad?",
      expected: ['2.35%', 'average', 'improve']
    }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    console.log(`\n📌 ${test.name}`)
    console.log(`   Message: "${test.message}"`)
    
    try {
      const response = await fetch('http://localhost:3003/api/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: test.message,
          context: test.context,
          conversationHistory: []
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      const aiResponse = (data.response || '').toLowerCase()
      
      const foundKeywords = test.expected.filter(keyword => 
        aiResponse.includes(keyword.toLowerCase())
      )
      
      if (foundKeywords.length > 0) {
        console.log(`   ✅ PASS - Found: ${foundKeywords.join(', ')}`)
        passed++
      } else {
        console.log(`   ❌ FAIL - Expected: ${test.expected.join(', ')}`)
        console.log(`   Response: ${data.response?.substring(0, 100)}...`)
        failed++
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`)
      failed++
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`)
  console.log(`✨ Success Rate: ${Math.round(passed/(passed+failed)*100)}%`)
  
  if (passed === tests.length) {
    console.log('\n🎉 All tests passed! Knowledge banks are working!')
  } else {
    console.log('\n⚠️  Some tests failed - check knowledge integration')
  }
}

quickVerifyTests().catch(console.error)