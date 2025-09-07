/**
 * Test paid ads knowledge integration
 */

const fetch = require('node-fetch')

async function testPaidAdsKnowledge() {
  console.log('💰 TESTING PAID ADS KNOWLEDGE INTEGRATION\n')
  console.log('=' .repeat(70))
  
  const testQuestions = [
    {
      question: "What's the average CPM for Facebook ads?",
      expectedKeywords: ['£8-15', 'CPM', 'Facebook']
    },
    {
      question: "How much should I budget for Google Ads?",
      expectedKeywords: ['CPC', 'Google', 'budget', '£']
    },
    {
      question: "Is TikTok advertising worth it?",
      expectedKeywords: ['TikTok', 'cheaper', 'CPM', '£2-6']
    },
    {
      question: "What's the best strategy for LinkedIn B2B ads?",
      expectedKeywords: ['LinkedIn', 'B2B', 'job title', 'company size']
    },
    {
      question: "How do I improve my landing page conversion rate?",
      expectedKeywords: ['conversion', 'landing', 'mobile', 'speed']
    },
    {
      question: "What creative works best for paid ads?",
      expectedKeywords: ['UGC', 'creative', '70%', 'performance']
    }
  ]
  
  const context = {
    url: 'https://testbusiness.co.uk',
    domain: 'testbusiness.co.uk',
    businessType: 'general'
  }
  
  for (const test of testQuestions) {
    console.log(`\n📌 Question: "${test.question}"`)
    console.log('-'.repeat(50))
    
    try {
      const response = await fetch('http://localhost:3003/api/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: test.question,
          context,
          conversationHistory: []
        })
      })
      
      const data = await response.json()
      const responseText = data.response?.toLowerCase() || ''
      
      // Check if response contains expected keywords
      const foundKeywords = test.expectedKeywords.filter(keyword => 
        responseText.includes(keyword.toLowerCase())
      )
      
      const hasKnowledge = foundKeywords.length > 0
      
      console.log(`Response: ${data.response?.substring(0, 200)}...`)
      console.log(`✅ Uses Paid Ads Knowledge: ${hasKnowledge ? 'YES' : 'NO'}`)
      if (hasKnowledge) {
        console.log(`   Found keywords: ${foundKeywords.join(', ')}`)
      } else {
        console.log(`   ⚠️ Missing expected keywords: ${test.expectedKeywords.join(', ')}`)
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`)
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '=' .repeat(70))
  console.log('📊 SUMMARY: Check if paid ads knowledge is being accessed correctly!')
}

testPaidAdsKnowledge().catch(console.error)