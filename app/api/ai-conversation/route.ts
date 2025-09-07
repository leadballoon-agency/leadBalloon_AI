import { NextRequest, NextResponse } from 'next/server'
import { detectIndustry, getIndustryContext, getSLOStrategy, getROASEducation } from '@/lib/knowledge-loader'
import { verifyUserIdentity, getConversationStrategy } from '@/lib/user-verification'
import { callSmartAI, detectConversationType } from '@/lib/ai-router'
import { learningSystem } from '@/lib/learning-system'
import { getWowMoment, createPersonalizedInsight, competitorIntelligence, transitionPhrases } from '@/lib/conversation-magic'
import { createSystemPrompt } from '@/lib/create-system-prompt'

/**
 * Interactive AI Conversation - Real API calls for better UX
 */
export async function POST(req: NextRequest) {
  let message: string = ''
  let context: any = {}
  let conversationHistory: any[] = []
  
  try {
    const body = await req.json()
    message = body.message
    context = body.context
    conversationHistory = body.conversationHistory || []
    
    console.log(`🤖 AI Conversation: "${message}"`)
    
    // Detect industry type using our knowledge system
    const detectedIndustry = detectIndustry({
      domain: context.domain,
      url: context.url,
      businessType: context.businessType,
      description: context.services
    })
    
    // Get industry-specific context
    const industryContext = getIndustryContext(detectedIndustry)
    
    // Load SLO strategy knowledge
    const sloStrategy = getSLOStrategy()
    
    // Load ROAS education for unrealistic expectations
    const roasEducation = getROASEducation()
    
    console.log(`🎯 Detected Industry: ${detectedIndustry || 'general'}`)
    
    // Get AI recommendations based on learning
    const recommendations = await learningSystem.getRecommendations(
      detectedIndustry || 'general',
      conversationHistory.length
    )
    console.log(`🧠 AI Learning: Next best question: "${recommendations.nextBestQuestion}"`)
    
    // Check for WOW moments based on user's message
    const wowMoment = getWowMoment(detectedIndustry || 'general', message, conversationHistory)
    const personalizedInsight = createPersonalizedInsight(
      detectedIndustry || 'general',
      context.mainChallenge || 'growth',
      message // If message contains spend amount
    )
    
    // Get competitor intelligence for name-dropping
    const competitorInfo = competitorIntelligence[detectedIndustry || 'general'] || []
    const transitions = transitionPhrases
    
    // Verify user identity
    const verification = verifyUserIdentity(
      context.userName,
      context.userEmail,
      {
        ownerName: context.ownerName,
        businessName: context.businessName,
        contactEmail: context.contactEmail,
        teamMembers: context.teamMembers,
        domain: context.domain
      }
    )
    
    const strategy = getConversationStrategy(verification)
    console.log(`👤 User Type: ${verification.userType} (${verification.confidence * 100}% confidence)`)
    console.log(`📋 Strategy: ${strategy.disclosure} disclosure`)
    
    // Build conversation history for context with CONCISE prompt
    const systemPrompt = createSystemPrompt(context, detectedIndustry, verification, strategy, message)
    
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ]

    // Detect conversation type to route to best AI
    const conversationType = detectConversationType(message, conversationHistory)
    
    // Use smart AI routing - Claude for copywriting/rapport, GPT for data
    const { response: aiResponse, model } = await callSmartAI(
      messages,
      undefined, // auto-select model
      0.8,
      200
    )
    
    console.log(`💬 Used ${model} for ${conversationType} response`)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: aiResponse }
      ]
    })

  } catch (error) {
    console.error('AI Conversation error:', error)
    
    // Better fallback based on message content
    const userMessage = (message || '').toLowerCase()
    let fallbackResponse = "Thanks for sharing that. While I analyze your website, "
    
    if (userMessage.includes('lead') || userMessage.includes('struggl')) {
      fallbackResponse = "I hear you - lead generation challenges are real. Most businesses in your industry are facing similar issues with rising ad costs and increased competition. What's your current cost per lead running at?"
    } else if (userMessage.includes('spend') || userMessage.includes('budget') || userMessage.includes('£')) {
      fallbackResponse = "That's a solid budget to work with. The key isn't how much you spend, but how efficiently you're spending it. Are you tracking your conversion rate from lead to customer?"
    } else if (userMessage.includes('hi') || userMessage.includes('hello')) {
      fallbackResponse = "Hey there! I'm analyzing your website right now to give you personalized insights. Quick question while we wait - is this your business or are you researching the market?"
    } else {
      fallbackResponse += "tell me more about your biggest marketing challenge right now?"
    }
    
    return NextResponse.json({
      success: true,
      response: fallbackResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: fallbackResponse }
      ]
    })
  }
}