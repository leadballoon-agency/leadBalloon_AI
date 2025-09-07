/**
 * AI Router - Intelligently routes to GPT-4o or Claude based on task
 * 
 * GPT-4o Strengths:
 * - Data analysis and pattern recognition
 * - Technical explanations
 * - Structured output (JSON, lists)
 * - Industry knowledge and facts
 * - Quick responses
 * 
 * Claude Strengths:
 * - Natural conversation and empathy
 * - Creative writing and storytelling
 * - Understanding context and nuance
 * - Building rapport
 * - Longer, thoughtful responses
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export type AIModel = 'gpt-4o' | 'claude-sonnet' | 'auto'
export type ConversationType = 'greeting' | 'qualification' | 'technical' | 'emotional' | 'closing'

/**
 * Determine which AI to use based on conversation context
 */
export function selectAI(
  conversationType: ConversationType,
  messageContent: string,
  conversationLength: number
): AIModel {
  // Early conversation - Claude is better at building rapport
  if (conversationLength < 3) {
    return 'claude-sonnet'
  }
  
  // Specific routing based on conversation type
  switch (conversationType) {
    case 'greeting':
      return 'claude-sonnet' // Better at natural, warm greetings
      
    case 'emotional':
      return 'claude-sonnet' // Better at empathy and understanding frustration
      
    case 'technical':
      return 'gpt-4o' // Better at analyzing data and providing facts
      
    case 'qualification':
      // Mix based on what we're qualifying
      if (messageContent.toLowerCase().includes('price') || 
          messageContent.toLowerCase().includes('cost') ||
          messageContent.toLowerCase().includes('lead')) {
        return 'gpt-4o' // Better with numbers and data
      }
      return 'claude-sonnet' // Better at natural qualifying questions
      
    case 'closing':
      return 'claude-sonnet' // Better at persuasive, natural closing
      
    default:
      // Alternate for variety
      return conversationLength % 2 === 0 ? 'gpt-4o' : 'claude-sonnet'
  }
}

/**
 * Detect conversation type from message content
 */
export function detectConversationType(
  message: string,
  conversationHistory: Array<{role: string, content: string}>
): ConversationType {
  const lowerMessage = message.toLowerCase()
  const historyLength = conversationHistory.length
  
  // Greeting detection
  if (historyLength === 0 || 
      lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return 'greeting'
  }
  
  // Emotional/frustration detection
  if (lowerMessage.includes('struggling') ||
      lowerMessage.includes('frustrated') ||
      lowerMessage.includes('difficult') ||
      lowerMessage.includes('tough') ||
      lowerMessage.includes('hard')) {
    return 'emotional'
  }
  
  // Technical discussion detection
  if (lowerMessage.includes('how does') ||
      lowerMessage.includes('what is') ||
      lowerMessage.includes('explain') ||
      lowerMessage.includes('technical') ||
      lowerMessage.includes('api') ||
      lowerMessage.includes('integration')) {
    return 'technical'
  }
  
  // Closing signals
  if (lowerMessage.includes('ready') ||
      lowerMessage.includes('let\'s do') ||
      lowerMessage.includes('sign up') ||
      lowerMessage.includes('get started') ||
      historyLength > 10) {
    return 'closing'
  }
  
  // Default to qualification
  return 'qualification'
}

/**
 * Call GPT-4o
 */
export async function callGPT4(
  messages: Array<{role: string, content: string}>,
  temperature: number = 0.8,
  maxTokens: number = 200
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature,
      max_tokens: maxTokens
    })
    
    return completion.choices[0].message.content || 'Let me help you with that.'
  } catch (error) {
    console.error('GPT-4o error:', error)
    throw error
  }
}

/**
 * Call Claude Sonnet
 */
export async function callClaude(
  messages: Array<{role: string, content: string}>,
  temperature: number = 0.8,
  maxTokens: number = 200
): Promise<string> {
  try {
    // Convert messages to Claude format (system message separate)
    const systemMessage = messages.find(m => m.role === 'system')?.content || ''
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user' as 'assistant' | 'user',
        content: m.content
      }))
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      system: systemMessage,
      messages: conversationMessages,
      temperature,
      max_tokens: maxTokens
    })
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Let me help you with that.'
  } catch (error) {
    console.error('Claude error:', error)
    throw error
  }
}

/**
 * Smart AI call that routes to best model
 */
export async function callSmartAI(
  messages: Array<{role: string, content: string}>,
  forceModel?: AIModel,
  temperature: number = 0.8,
  maxTokens: number = 200
): Promise<{response: string, model: string}> {
  // Extract last user message and history
  const lastUserMessage = messages[messages.length - 1]?.content || ''
  const conversationHistory = messages.slice(0, -1)
  
  // Determine which AI to use
  let selectedModel: AIModel = forceModel || 'auto'
  
  if (selectedModel === 'auto') {
    const conversationType = detectConversationType(lastUserMessage, conversationHistory)
    selectedModel = selectAI(conversationType, lastUserMessage, conversationHistory.length)
    console.log(`🤖 Auto-selected ${selectedModel} for ${conversationType} conversation`)
  }
  
  // Call the appropriate AI with fallback
  let response: string
  let actualModel = selectedModel
  
  try {
    if (selectedModel === 'claude-sonnet') {
      response = await callClaude(messages, temperature, maxTokens)
    } else {
      response = await callGPT4(messages, temperature, maxTokens)
    }
  } catch (error) {
    console.log(`Primary model ${selectedModel} failed, falling back to GPT-4o`)
    // Fallback to GPT-4o if Claude fails
    response = await callGPT4(messages, temperature, maxTokens)
    actualModel = 'gpt-4o'
  }
  
  return {
    response,
    model: actualModel
  }
}

/**
 * Blend responses from both AIs for maximum impact
 */
export async function blendAIResponses(
  messages: Array<{role: string, content: string}>,
  temperature: number = 0.8
): Promise<{response: string, models: string}> {
  try {
    // Get responses from both AIs in parallel
    const [gptResponse, claudeResponse] = await Promise.all([
      callGPT4(messages, temperature, 150),
      callClaude(messages, temperature, 150)
    ])
    
    // Blend the responses intelligently
    // Take the more empathetic opening from Claude
    // Add the data/facts from GPT
    // Close with Claude's conversational question
    
    const claudeParts = claudeResponse.split('.')
    const gptParts = gptResponse.split('.')
    
    // Simple blending strategy (can be enhanced)
    const blended = [
      claudeParts[0], // Claude's opening (usually more natural)
      ...gptParts.slice(1, -1), // GPT's middle (facts/data)
      claudeParts[claudeParts.length - 1] // Claude's closing question
    ].join('.').trim()
    
    return {
      response: blended,
      models: 'gpt-4o+claude-sonnet'
    }
  } catch (error) {
    console.error('Blending error:', error)
    // Fallback to GPT if blending fails
    const response = await callGPT4(messages, temperature, 200)
    return { response, models: 'gpt-4o' }
  }
}