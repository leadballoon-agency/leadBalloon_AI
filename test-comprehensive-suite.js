/**
 * Comprehensive test suite for LeadBalloon AI
 * Tests all industries, knowledge banks, and conversation scenarios
 */

const fetch = require('node-fetch')
const fs = require('fs')

// Test scenarios covering different user types and intents
const testScenarios = [
  // OWNER SCENARIOS
  {
    category: 'Business Owner - Pain Points',
    context: {
      url: 'https://bodysculpting.co.uk',
      businessType: 'bodyContouring',
      userName: 'John Smith',
      userEmail: 'john@bodysculpting.co.uk'
    },
    conversations: [
      { message: "Hi, I'm struggling with Facebook ads", expected: ['£15-50', 'lead', 'targeting'] },
      { message: "My leads cost £80 each, is that normal?", expected: ['high', 'typical', '£15-50'] },
      { message: "Competitors seem to be everywhere online", expected: ['Transform', '3D Lipo', 'spending'] },
      { message: "How do I reduce my cost per lead?", expected: ['creative', 'audience', 'offer'] }
    ]
  },
  
  {
    category: 'Business Owner - Strategy Questions',
    context: {
      url: 'https://solarpanels.co.uk',
      businessType: 'solarPV',
      userName: 'Sarah Jones',
      userEmail: 'sarah@solarpanels.co.uk'
    },
    conversations: [
      { message: "What's the best way to target homeowners?", expected: ['£350k+', 'south-facing', 'energy bills'] },
      { message: "Should I use Google or Facebook ads?", expected: ['Google', 'intent', 'Facebook', 'awareness'] },
      { message: "What's a good conversion rate?", expected: ['2-4%', 'landing page', 'survey'] },
      { message: "How much should I budget for ads?", expected: ['LTV', 'CAC', 'test'] }
    ]
  },
  
  // COMPETITOR SCENARIOS
  {
    category: 'Competitor - Researching',
    context: {
      url: 'https://laserhair.co.uk',
      businessType: 'laserHairRemoval',
      userName: 'Mike Wilson',
      userEmail: 'mike@competitorclinic.com'
    },
    conversations: [
      { message: "Interesting site, what makes you different?", expected: ['results', 'technology', 'experience'] },
      { message: "How many treatments do you do per month?", expected: ['volume', 'busy', 'booking'] },
      { message: "What's your marketing strategy?", expected: ['partial', 'results', 'qualify'] }
    ]
  },
  
  // MARKETING KNOWLEDGE TESTS
  {
    category: 'Paid Ads Knowledge',
    context: {
      url: 'https://testbusiness.co.uk',
      businessType: 'general'
    },
    conversations: [
      { message: "What's the average CPM for Facebook?", expected: ['£8-15', 'UK market', 'varies'] },
      { message: "Is TikTok worth it for my business?", expected: ['£2-6', 'cheaper', '40% are 30+'] },
      { message: "How do I improve my ROAS?", expected: ['creative', 'LTV', 'testing'] },
      { message: "What's the best campaign structure?", expected: ['CBO', 'testing', 'scaling'] }
    ]
  },
  
  {
    category: 'Email Marketing Knowledge',
    context: {
      url: 'https://ecommerce.co.uk',
      businessType: 'ecommerce'
    },
    conversations: [
      { message: "What's a good email open rate?", expected: ['21%', '16-20%', 'industry'] },
      { message: "How often should I email my list?", expected: ['2-3', 'engagement', 'segment'] },
      { message: "Best time to send emails?", expected: ['Tuesday', 'Thursday', '8-9am'] },
      { message: "How do I reduce unsubscribes?", expected: ['segment', 'value', 'frequency'] }
    ]
  },
  
  {
    category: 'SEO Knowledge',
    context: {
      url: 'https://localservice.co.uk',
      businessType: 'general'
    },
    conversations: [
      { message: "How do I rank in Google Maps?", expected: ['GMB', 'reviews', 'citations'] },
      { message: "What's more important - content or links?", expected: ['both', 'quality', 'authority'] },
      { message: "How long does SEO take?", expected: ['3-6 months', 'competition', 'depends'] },
      { message: "Should I do PPC or SEO?", expected: ['both', 'immediate', 'long-term'] }
    ]
  },
  
  {
    category: 'Conversion Optimization',
    context: {
      url: 'https://clinic.co.uk',
      businessType: 'general'
    },
    conversations: [
      { message: "My landing page converts at 1%, is that bad?", expected: ['below average', '2.35%', 'improve'] },
      { message: "What's the best CTA button color?", expected: ['contrast', 'test', 'orange/green'] },
      { message: "Should I use a multi-step form?", expected: ['30% higher', 'commitment', 'progressive'] },
      { message: "How do I reduce cart abandonment?", expected: ['guest checkout', 'shipping', 'trust'] }
    ]
  },
  
  // INDUSTRY-SPECIFIC DEEP DIVES
  {
    category: 'HIFU Specialist',
    context: {
      url: 'https://hifuclinic.co.uk',
      businessType: 'hifu'
    },
    conversations: [
      { message: "What's the typical HIFU client profile?", expected: ['40-60', 'pre-surgical', 'afraid of facelifts'] },
      { message: "How much should I charge per treatment?", expected: ['£800-2000', 'average £1,200', 'packages'] },
      { message: "Best way to market HIFU treatments?", expected: ['before/after', 'lunch hour facelift', 'video testimonials'] }
    ]
  },
  
  {
    category: 'Driving Instructor',
    context: {
      url: 'https://drivingschool.co.uk',
      businessType: 'drivingInstructor'
    },
    conversations: [
      { message: "How do I compete with RED?", expected: ['flexibility', 'pass rate', 'personal'] },
      { message: "Should I offer intensive courses?", expected: ['£1000-2000', 'quick pass', 'popular'] },
      { message: "Best way to get students?", expected: ['referrals', 'parents', '17th birthday'] }
    ]
  }
]

// Analysis metrics
const analysisMetrics = {
  totalTests: 0,
  successful: 0,
  failed: 0,
  knowledgeUsage: {},
  responseQuality: [],
  averageResponseLength: 0,
  conversationFlow: [],
  userTypeDetection: [],
  industryDetection: []
}

async function runComprehensiveTests() {
  console.log('🚀 LEADBALLOON AI - COMPREHENSIVE TEST SUITE\n')
  console.log('=' .repeat(70))
  console.log('Testing: Industries, Knowledge Banks, User Types, Conversation Quality\n')
  
  const results = []
  
  for (const scenario of testScenarios) {
    console.log(`\n📋 ${scenario.category}`)
    console.log('-'.repeat(50))
    
    const scenarioResults = {
      category: scenario.category,
      context: scenario.context,
      conversations: []
    }
    
    let conversationHistory = []
    
    for (const conv of scenario.conversations) {
      console.log(`\n💬 "${conv.message}"`)
      
      try {
        const response = await fetch('http://localhost:3003/api/ai-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: conv.message,
            context: scenario.context,
            conversationHistory
          })
        })
        
        const data = await response.json()
        const aiResponse = data.response || ''
        
        // Check for expected keywords
        const foundKeywords = conv.expected.filter(keyword => 
          aiResponse.toLowerCase().includes(keyword.toLowerCase())
        )
        
        const score = (foundKeywords.length / conv.expected.length) * 100
        const quality = score >= 60 ? 'GOOD' : score >= 30 ? 'OK' : 'POOR'
        
        // Analyze response characteristics
        const analysis = {
          message: conv.message,
          response: aiResponse.substring(0, 150) + '...',
          expectedKeywords: conv.expected,
          foundKeywords,
          score: Math.round(score),
          quality,
          hasQuestion: aiResponse.includes('?'),
          responseLength: aiResponse.length,
          usesIndustryKnowledge: foundKeywords.length > 0,
          conversational: !aiResponse.startsWith('I understand') && !aiResponse.startsWith('Thank you')
        }
        
        scenarioResults.conversations.push(analysis)
        
        // Update conversation history
        conversationHistory = [
          ...conversationHistory,
          { role: 'user', content: conv.message },
          { role: 'assistant', content: aiResponse }
        ]
        
        // Update metrics
        analysisMetrics.totalTests++
        if (score >= 60) analysisMetrics.successful++
        else analysisMetrics.failed++
        
        analysisMetrics.responseQuality.push(score)
        analysisMetrics.averageResponseLength += aiResponse.length
        
        // Display results
        console.log(`   📊 Score: ${analysis.score}% (${quality})`)
        console.log(`   ✅ Found: ${foundKeywords.join(', ') || 'None'}`)
        if (foundKeywords.length < conv.expected.length) {
          const missing = conv.expected.filter(k => !foundKeywords.includes(k))
          console.log(`   ⚠️  Missing: ${missing.join(', ')}`)
        }
        console.log(`   💭 Has Question: ${analysis.hasQuestion ? 'Yes' : 'No'}`)
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`)
        analysisMetrics.failed++
      }
      
      // Small delay between conversations
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    results.push(scenarioResults)
  }
  
  // Calculate final metrics
  analysisMetrics.averageResponseLength = Math.round(
    analysisMetrics.averageResponseLength / analysisMetrics.totalTests
  )
  
  const avgQuality = analysisMetrics.responseQuality.reduce((a, b) => a + b, 0) / 
    analysisMetrics.responseQuality.length
  
  // Generate analysis report
  console.log('\n' + '=' .repeat(70))
  console.log('📊 COMPREHENSIVE ANALYSIS REPORT\n')
  
  console.log('Overall Performance:')
  console.log(`  Total Tests: ${analysisMetrics.totalTests}`)
  console.log(`  Successful: ${analysisMetrics.successful} (${Math.round(analysisMetrics.successful/analysisMetrics.totalTests*100)}%)`)
  console.log(`  Failed: ${analysisMetrics.failed}`)
  console.log(`  Average Quality Score: ${Math.round(avgQuality)}%`)
  console.log(`  Average Response Length: ${analysisMetrics.averageResponseLength} chars`)
  
  console.log('\nKnowledge Usage by Category:')
  const categoryScores = {}
  for (const result of results) {
    const categoryAvg = result.conversations.reduce((sum, c) => sum + c.score, 0) / 
      result.conversations.length
    categoryScores[result.category] = Math.round(categoryAvg)
  }
  
  Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, score]) => {
      const bar = '█'.repeat(Math.floor(score / 5))
      console.log(`  ${category}: ${bar} ${score}%`)
    })
  
  console.log('\n🎯 Key Insights:')
  
  // Find best and worst performing areas
  const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])
  console.log(`  ✅ Strongest: ${sorted[0][0]} (${sorted[0][1]}%)`)
  console.log(`  ⚠️  Weakest: ${sorted[sorted.length-1][0]} (${sorted[sorted.length-1][1]}%)`)
  
  // Check conversation quality
  const hasQuestions = results.flatMap(r => r.conversations).filter(c => c.hasQuestion)
  console.log(`  💬 Asks follow-up questions: ${Math.round(hasQuestions.length/analysisMetrics.totalTests*100)}% of responses`)
  
  // Save detailed results
  fs.writeFileSync(
    'test-results-analysis.json',
    JSON.stringify({ results, metrics: analysisMetrics, categoryScores }, null, 2)
  )
  
  console.log('\n📁 Detailed results saved to test-results-analysis.json')
  
  console.log('\n' + '=' .repeat(70))
  console.log('🚀 RECOMMENDATIONS FOR IMPROVEMENT:\n')
  
  if (avgQuality < 70) {
    console.log('1. ⚠️  Knowledge Integration: Responses missing expected keywords')
    console.log('   → Check system prompt is including relevant knowledge')
  }
  
  if (hasQuestions.length < analysisMetrics.totalTests * 0.8) {
    console.log('2. ⚠️  Engagement: Not enough follow-up questions')
    console.log('   → Ensure AI always ends with qualifying questions')
  }
  
  if (analysisMetrics.averageResponseLength > 300) {
    console.log('3. ⚠️  Brevity: Responses might be too long')
    console.log('   → Consider more concise responses for better UX')
  }
  
  if (sorted[sorted.length-1][1] < 50) {
    console.log(`4. ⚠️  Weak Area: ${sorted[sorted.length-1][0]} needs improvement`)
    console.log('   → Review knowledge base for this category')
  }
  
  console.log('\n✨ Marketing agencies will definitely be unhappy with this level of insight!')
}

// Run the tests
runComprehensiveTests().catch(console.error)