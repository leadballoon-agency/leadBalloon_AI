import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

/**
 * Real AI Analysis using GPT-4o and Claude Sonnet
 */
export async function POST(req: NextRequest) {
  try {
    const { url, type = 'quick', context = {} } = await req.json()
    
    console.log(`🤖 Running real AI analysis for ${url}`)
    
    // Determine which AI to use based on task type
    if (type === 'competitor-ads') {
      // Use GPT-4o for market research
      return await analyzeWithGPT4(url, context)
    } else if (type === 'copy-analysis') {
      // Use Claude for copywriting analysis
      return await analyzeWithClaude(url, context)
    } else if (type === 'contextual-enhancement') {
      // Use GPT-4o to enhance background analysis with conversation context
      return await enhanceWithConversationContext(url, context)
    } else {
      // Quick analysis with GPT-4o
      return await quickAnalysisGPT4(url, context)
    }
    
  } catch (error) {
    console.error('AI Analysis error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'AI analysis temporarily unavailable',
      fallback: true,
      insights: getBasicInsights('')
    })
  }
}

/**
 * Quick analysis with GPT-4o
 */
async function quickAnalysisGPT4(url: string, context: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a conversion optimization expert. Analyze this business and provide 3 specific, actionable improvements that would increase conversions. Be specific with numbers and proven patterns."
        },
        {
          role: "user",
          content: `Analyze this business URL: ${url}

${context.userName ? `User: ${context.userName}` : ''}
${context.businessDescription ? `Business Type: ${context.businessDescription}` : ''}
${context.mainChallenge ? `Main Challenge: ${context.mainChallenge}` : ''}
${context.conversationHistory ? `Conversation Context: ${context.conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}` : ''}

Based on the URL, domain name, and any available context, provide:
1. ${context.mainChallenge ? `Specific solutions for their main challenge: "${context.mainChallenge}"` : 'One headline improvement with expected impact'}
2. One pricing/offer insight ${context.businessDescription ? `tailored for ${context.businessDescription}` : ''}
3. One competitor intelligence insight
4. Assess if manual Facebook Ads Library research would be beneficial for this niche

${context.userName ? `Personalize recommendations for ${context.userName} and their specific situation.` : ''}

Format as JSON with: 
- quickWins (array) ${context.userName ? `- personalized for ${context.userName}` : ''}
- competitorInsight (string)
- pricingOpportunity (string)
- needsManualResearch (boolean) - true if niche is specialized/competitive and manual Facebook research would add significant value
- manualResearchReason (string) - why manual research would help if needsManualResearch is true`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    })
    
    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
    
    return NextResponse.json({
      success: true,
      source: 'gpt-4o',
      insights: {
        quickWins: aiResponse.quickWins || [],
        competitorInsight: aiResponse.competitorInsight || "Analyzing market patterns...",
        pricingOpportunity: aiResponse.pricingOpportunity || "Reviewing pricing strategies..."
      },
      needsManualResearch: aiResponse.needsManualResearch || false,
      manualResearchReason: aiResponse.manualResearchReason || "Manual Facebook Ads Library research could provide deeper competitor insights and winning ad patterns specific to your niche."
    })
  } catch (error) {
    console.error('GPT-4o error:', error)
    throw error
  }
}

/**
 * Competitor ad analysis with GPT-4o
 */
async function analyzeWithGPT4(url: string, context: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a Facebook Ads expert. Based on industry patterns, identify what types of ads work best for this business type. Reference real patterns you know from the ads library."
        },
        {
          role: "user",
          content: `Business: ${url}
Type: ${context.businessType}
Competitors: ${context.competitors?.join(', ') || 'unknown'}

Identify:
1. Ad hooks that work in this industry (with examples)
2. Offers that convert (specific numbers)
3. Audience targeting insights

Be specific about what's working NOW in this market.`
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    })
    
    return NextResponse.json({
      success: true,
      source: 'gpt-4o',
      analysis: completion.choices[0].message.content,
      type: 'competitor-ads'
    })
  } catch (error) {
    console.error('GPT-4o competitor analysis error:', error)
    throw error
  }
}

/**
 * Copy analysis with Claude Sonnet
 */
async function analyzeWithClaude(url: string, context: any) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-4-sonnet", // Using Claude Sonnet 4 as specified
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a master copywriter trained in the methods of Claude Hopkins, Gary Halbert, and Dan Kennedy.

Business: ${url}
Type: ${context.businessType}
Current headline: ${context.headline || 'unknown'}

Create:
1. A new headline using proven direct response formulas
2. An irresistible offer structure
3. Three psychological triggers to use

Be specific with the exact copy to use. Reference timeless copywriting principles.`
        }
      ]
    })
    
    const content = message.content[0]
    
    return NextResponse.json({
      success: true,
      source: 'claude-sonnet',
      analysis: content.type === 'text' ? content.text : 'Analysis complete',
      type: 'copy-analysis'
    })
  } catch (error) {
    console.error('Claude error:', error)
    throw error
  }
}

/**
 * Enhance background analysis with conversation context
 */
async function enhanceWithConversationContext(url: string, context: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a conversion optimization expert. You have background analysis results, and now you need to enhance them with personal conversation context from the user to make recommendations laser-focused on their specific situation."
        },
        {
          role: "user",
          content: `Business: ${url}
User Name: ${context.userName}
Business Description: ${context.businessDescription}
Main Challenge: ${context.mainChallenge}

Background Analysis Already Done:
${JSON.stringify(context.backgroundInsights, null, 2)}

Conversation History:
${context.conversationHistory?.map(h => `${h.role}: ${h.content}`).join('\n') || 'No conversation history'}

Based on this personal context, enhance the background analysis with:
1. Specific recommendations for their main challenge: "${context.mainChallenge}"
2. Personalized quick wins that address their business type: "${context.businessDescription}"
3. Tailored advice using their name "${context.userName}" 
4. Priority ranking of what they should focus on first given their specific situation

Format as JSON with:
- personalizedRecommendations (array of specific actions)
- priorityFocus (string - what they should tackle first and why)
- personalizedQuickWins (array - modifications of existing quick wins to be more specific to their situation)
- conversationInsights (string - insights drawn from the conversation)`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800
    })
    
    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
    
    return NextResponse.json({
      success: true,
      source: 'gpt-4o-contextual',
      insights: {
        personalizedRecommendations: aiResponse.personalizedRecommendations || [],
        priorityFocus: aiResponse.priorityFocus || "Focus on your main challenge area first",
        personalizedQuickWins: aiResponse.personalizedQuickWins || [],
        conversationInsights: aiResponse.conversationInsights || "Analyzing your specific situation..."
      },
      type: 'contextual-enhancement'
    })
  } catch (error) {
    console.error('GPT-4o contextual enhancement error:', error)
    throw error
  }
}

/**
 * Basic insights fallback
 */
function getBasicInsights(businessType: string) {
  const insights: Record<string, any> = {
    fitness: {
      quickWins: [
        {
          issue: "Missing transformation story",
          fix: "Add before/after testimonial above fold",
          impact: "+34% conversion rate"
        }
      ],
      competitorInsight: "Top competitors using 6-week challenges at $197",
      pricingOpportunity: "You could charge 40% more with payment plans"
    },
    ecommerce: {
      quickWins: [
        {
          issue: "No urgency in offer",
          fix: "Add countdown timer with real stock levels",
          impact: "+28% checkout completion"
        }
      ],
      competitorInsight: "Competitors offering free shipping at $50+",
      pricingOpportunity: "Bundle products for 23% higher AOV"
    },
    saas: {
      quickWins: [
        {
          issue: "Features-focused messaging",
          fix: "Lead with time/money saved, not features",
          impact: "+41% trial signups"
        }
      ],
      competitorInsight: "Market leaders offering 14-day trials",
      pricingOpportunity: "Annual plans with 20% discount converting well"
    }
  }
  
  return insights[businessType] || insights.saas
}