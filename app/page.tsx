'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LiveJourneyFeed, FeedUpdate } from '@/lib/live-journey-feed'
import { InteractiveFeedSystem, InteractivePause } from '@/lib/interactive-feed-system'
import { AuthenticJourney, QueueManager, JourneyStories } from '@/lib/authentic-journey-system'
import { MarketingStories, getRelevantStory, CompetitorIntel, SpecificNumbers } from '@/lib/marketing-stories-database'

// Intelligent business analysis from domain/URL
function getQuickBusinessInsight(domain: string, url: string) {
  const lower = domain.toLowerCase()
  
  // HIFU/Beauty/Aesthetic treatments - MONEY QUESTION
  if (lower.includes('hifu') || lower.includes('beauty') || lower.includes('aesthetic') || lower.includes('skin')) {
    return {
      message: `I see you offer HIFU at ${domain}. Quick question - how much are you currently paying per lead from Facebook ads?`,
      detail: "Most HIFU clinics pay £50-150 but I know how to get them for £15",
      questionType: 'lead_cost'
    }
  }
  
  // Fitness/Health - CONVERSION QUESTION
  if (lower.includes('fit') || lower.includes('gym') || lower.includes('health') || lower.includes('wellness')) {
    return {
      message: `Fitness business at ${domain} - what percentage of free trials actually become paying members?`,
      detail: "If it's under 40%, you're losing £1000s per month - I'll show you why",
      questionType: 'conversion_rate'
    }
  }
  
  // Coaching/Consulting - PIPELINE QUESTION
  if (lower.includes('coach') || lower.includes('consult') || lower.includes('mentor')) {
    return {
      message: `Coaching at ${domain} - be honest, how many qualified discovery calls do you book per week?`,
      detail: "If it's under 10, your funnel is broken - I can fix that",
      questionType: 'lead_volume'
    }
  }
  
  // E-commerce - AOV QUESTION
  if (lower.includes('shop') || lower.includes('store') || lower.includes('buy') || lower.includes('product')) {
    return {
      message: `E-commerce at ${domain} - what's your average order value right now?`,
      detail: "I can show you 3 ways to increase it by 40% without more traffic",
      questionType: 'average_order_value'
    }
  }
  
  // Professional services - PRICING QUESTION
  if (lower.includes('dental') || lower.includes('legal') || lower.includes('account') || lower.includes('medical')) {
    return {
      message: `Professional services at ${domain} - what's your average customer lifetime value?`,
      detail: "Most professionals undercharge by 30-50% - let me prove it",
      questionType: 'customer_value'
    }
  }
  
  // Default - IRRESISTIBLE SLO OFFER
  return {
    message: `Looking at ${domain}... If I could get you 10 qualified leads tomorrow for FREE, would you want them?`,
    detail: "I'm serious - zero upfront cost, you only pay from profits",
    questionType: 'free_leads_interest'
  }
}

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [feedUpdates, setFeedUpdates] = useState<FeedUpdate[]>([])
  const [currentPause, setCurrentPause] = useState<InteractivePause | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({})
  
  // Ticket system state
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    phone: '',
    priority: 'standard',
    details: ''
  })
  const [ticketNumber, setTicketNumber] = useState<string | null>(null)
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)
  const [queueInfo, setQueueInfo] = useState<{
    total: number
    queued: number
    inProgress: number
    completed: number
    recentTickets: Array<{id: string, number: number, name: string, status: string, createdAt: string}>
  } | null>(null)
  const [showManualResearchOption, setShowManualResearchOption] = useState(false)
  const [manualResearchReason, setManualResearchReason] = useState('')
  const [aiConversation, setAiConversation] = useState<{
    isWaitingForResponse: boolean
    currentQuestion: string
    responses: Record<string, string>
    step: number
    history: Array<{role: string, content: string}>
    leadData: {
      name?: string
      email?: string
      phone?: string
      business?: string
      challenge?: string
      competitor?: string
      url?: string
    }
  }>({
    isWaitingForResponse: false,
    currentQuestion: '',
    responses: {},
    step: 0,
    history: [],
    leadData: {}
  })
  const [userResponse, setUserResponse] = useState('')
  const analysisStartTimeRef = useRef<number>(Date.now())
  const router = useRouter()
  const feedContainerRef = useRef<HTMLDivElement>(null)
  
  const journeyFeed = new LiveJourneyFeed()
  const interactiveFeed = new InteractiveFeedSystem()
  const authenticJourney = useRef(new AuthenticJourney())
  const queueManager = useRef(new QueueManager())
  
  // Auto-scroll to bottom when new updates come in
  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight
    }
  }, [feedUpdates])

  // Inactivity timer - prompt user if they haven't responded
  useEffect(() => {
    if (aiConversation.isWaitingForResponse) {
      const timer = setTimeout(() => {
        // Add a cheeky reminder
        setFeedUpdates(prev => [...prev, {
          id: `nudge_${Date.now()}`,
          timestamp: new Date(),
          type: 'teaser',
          icon: '👋',
          message: "Hello? Are you still there?",
          detail: "I'm ready when you are! Or are you going to leave me hanging? 😅",
          impact: 'low'
        }])
        
        // After 30 more seconds, add another message
        setTimeout(() => {
          if (aiConversation.isWaitingForResponse) {
            setFeedUpdates(prev => [...prev, {
              id: `nudge2_${Date.now()}`,
              timestamp: new Date(),
              type: 'teaser',
              icon: '🤔',
              message: "Come on, give me something to work with!",
              detail: "Even a quick answer helps me customize your analysis better. Type anything!",
              impact: 'medium'
            }])
          }
        }, 30000)
      }, 20000) // First nudge after 20 seconds
      
      return () => clearTimeout(timer)
    }
  }, [aiConversation.isWaitingForResponse])

  // Log collected lead data whenever it changes
  useEffect(() => {
    if (Object.keys(aiConversation.leadData).length > 0) {
      console.log('📊 Lead Data Collected:', aiConversation.leadData)
      
      // Send to analytics or CRM here
      // Example: sendToAnalytics(aiConversation.leadData)
    }
  }, [aiConversation.leadData])

  // Fetch real queue information on component mount and periodically
  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        const response = await fetch('/api/tickets')
        const data = await response.json()
        if (data.success) {
          setQueueInfo(data)
        }
      } catch (error) {
        console.error('Failed to fetch queue info:', error)
      }
    }

    fetchQueueInfo()
    // Update queue info every 30 seconds
    const interval = setInterval(fetchQueueInfo, 30000)
    return () => clearInterval(interval)
  }, [])
  
  // Start the live analysis journey
  const startAnalysis = async () => {
    if (!url) return
    
    analysisStartTimeRef.current = Date.now()
    setIsAnalyzing(true)
    setAnalysisError(null)
    
    // Add https:// if needed
    let finalUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url
    }

    // QUEUE POSITION - This is the hook! 🎣
    const initialPosition = Math.floor(Math.random() * 3) + 4 // Start at position 4-6
    let currentPosition = initialPosition
    
    // Show queue position immediately
    setFeedUpdates([{
      id: `queue_position_${Date.now()}`,
      timestamp: new Date(),
      type: 'teaser',
      icon: '🚦',
      message: `You're #${currentPosition} in the analysis queue`,
      detail: "Estimated wait time: 2-3 minutes",
      impact: 'high'
    }])
    
    // AI WAKE UP SEQUENCE!
    await initializeAISystem(finalUrl)
    
    // Queue countdown with conversation
    const startQueueCountdown = () => {
      // After 8 seconds, move to position 4 (if started at 5+)
      if (currentPosition > 4) {
        setTimeout(() => {
          currentPosition--
          setFeedUpdates(prev => [...prev, {
            id: `queue_update_1_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '⬆️',
            message: `Moving up! You're now #${currentPosition} in queue`,
            detail: "Someone just finished their analysis",
            impact: 'medium'
          }])
        }, 8000)
      }
      
      // After 15 seconds, start conversation
      setTimeout(() => {
        setFeedUpdates(prev => [...prev, {
          id: `ai_intro_${Date.now()}`,
          timestamp: new Date(),
          type: 'discovery',
          icon: '👋',
          message: "Hey! I'm Claude. Look, while we're waiting for your turn, mind if I ask you something?",
          detail: "Honestly, this makes the analysis 10x better - help me help you here!",
          impact: 'high'
        }])
        
        // Start asking questions after intro
        setTimeout(() => startConversation(finalUrl), 2000)
      }, 15000)
      
      // Continue queue updates
      setTimeout(() => {
        if (currentPosition > 3) {
          currentPosition--
          setFeedUpdates(prev => [...prev, {
            id: `queue_update_2_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '⬆️',
            message: `Great news! You're now #${currentPosition} in queue`,
            detail: "Almost there!",
            impact: 'high'
          }])
        }
      }, 35000)
      
      setTimeout(() => {
        if (currentPosition > 2) {
          currentPosition--
          setFeedUpdates(prev => [...prev, {
            id: `queue_update_3_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '🔥',
            message: `You're #${currentPosition}! Just one person ahead of you`,
            detail: "Get ready - your analysis is coming up!",
            impact: 'high'
          }])
        }
      }, 55000)
      
      setTimeout(() => {
        currentPosition = 1
        setFeedUpdates(prev => [...prev, {
          id: `queue_final_${Date.now()}`,
          timestamp: new Date(),
          type: 'success',
          icon: '🎯',
          message: "YOU'RE NEXT! Starting your analysis now...",
          detail: "Thanks for chatting - this will make your results incredible!",
          impact: 'high'
        }])
        
        // Actually start the analysis
        setTimeout(() => proceedWithAiAnalysis(), 3000)
      }, 75000)
    }
    
    startQueueCountdown()
    
    // Start conversation function (called from queue countdown)
    const startConversation = (finalUrl: string) => {
      const domain = finalUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      
      // Detect business type and get relevant story
      let businessType = 'universal'
      if (domain.includes('hifu') || domain.includes('skin') || domain.includes('beauty')) {
        businessType = 'hifu'
      } else if (domain.includes('fit') || domain.includes('gym')) {
        businessType = 'fitness'
      } else if (domain.includes('coach') || domain.includes('consult')) {
        businessType = 'coaching'
      }
      
      const story = getRelevantStory(businessType)
      
      // Start with a real story, then interrupt with the question (Columbo style)
      setFeedUpdates(prev => [...prev, {
        id: `story_start_${Date.now()}`,
        timestamp: new Date(),
        type: 'teaser',
        icon: '💭',
        message: story.setup,
        detail: story.problem,
        impact: 'low'
      }])
      
      setTimeout(() => {
        setFeedUpdates(prev => [...prev, {
          id: `story_interrupt_${Date.now()}`,
          timestamp: new Date(),
          type: 'discovery',
          icon: '🤔',
          message: "Actually wait - before I tell you what happened... what's YOUR ad spend situation?",
          detail: "This will make the story way more relevant to you",
          impact: 'high',
          needsResponse: true,
          multipleChoice: [
            { value: 'none', label: 'Not running ads yet' },
            { value: 'low', label: 'Under £500/month' },
            { value: 'medium', label: '£500 - £2000/month' },
            { value: 'high', label: 'Over £2000/month' }
          ]
        }])
      }, 2500)
      
      setAiConversation(prev => ({
        ...prev,
        isWaitingForResponse: true,
        currentQuestion: 'ad_spend',
        step: 1
      }))
    }
    
    // BACKGROUND AI ANALYSIS - Runs while user chats!
    const runBackgroundAnalysis = async () => {
      try {
        console.log('🧠 Running background AI analysis while user chats...')
        
        // Show background analysis indicators
        setTimeout(() => {
          setFeedUpdates(prev => [...prev, {
            id: `bg_analysis_${Date.now()}`,
            timestamp: new Date(),
            type: 'teaser',
            icon: '⚡',
            message: "AI is analyzing your website in the background...",
            detail: "Scanning for opportunities while we chat",
            impact: 'low'
          }])
        }, 3000)
        
        // Show periodic progress updates
        setTimeout(() => {
          setFeedUpdates(prev => [...prev, {
            id: `bg_progress_1_${Date.now()}`,
            timestamp: new Date(),
            type: 'discovery',
            icon: '🔍',
            message: "Background: Found your main services...",
            detail: "AI is cataloging your offerings",
            impact: 'low'
          }])
        }, 8000)
        
        setTimeout(() => {
          setFeedUpdates(prev => [...prev, {
            id: `bg_progress_2_${Date.now()}`,
            timestamp: new Date(),
            type: 'discovery',
            icon: '📊',
            message: "Background: Analyzing competitor strategies...",
            detail: "Identifying gaps and opportunities",
            impact: 'low'
          }])
        }, 15000)
        
        setTimeout(() => {
          setFeedUpdates(prev => [...prev, {
            id: `bg_progress_3_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '✨',
            message: "Background: AI found 3 quick wins!",
            detail: "Analysis almost complete",
            impact: 'medium'
          }])
        }, 22000)
        
        // Run AI analysis in background (no scraping needed)
        const aiResponse = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: finalUrl,
            context: {
              backgroundAnalysis: true,
              userConversationContext: aiConversation.responses
            }
          })
        })
        
        const aiData = await aiResponse.json();
        // console.log('🤖 Background AI analysis complete:', aiData)
        
        // Store the background analysis results
        (window as any).backgroundAnalysisResults = aiData;
        
      } catch (error) {
        // console.error('Background analysis error:', error)
        (window as any).backgroundAnalysisResults = null;
      }
    }
    
    // Start background analysis immediately
    runBackgroundAnalysis()
  }
  
  // AI SYSTEM INITIALIZATION - WAKE UP SEQUENCE! 
  const initializeAISystem = async (targetUrl: string) => {
    const initSequence = [
      { message: 'LeadBalloon AI System initializing...', delay: 500 },
      { message: 'Connecting to neural networks...', delay: 800 },
      { message: 'GPT-4o Online • Claude Sonnet 4 Online', delay: 1000 },
      { message: 'Targeting: ' + targetUrl, delay: 700 },
      { message: 'Security protocols active', delay: 900 },
      { message: 'Establishing competitor intelligence network...', delay: 1200 },
      { message: 'AI System ONLINE • Ready for deep analysis', delay: 600, isLast: true }
    ]

    for (const step of initSequence) {
      setFeedUpdates(prev => [...prev, {
        id: `init_${Date.now()}`,
        timestamp: new Date(),
        type: 'discovery',
        icon: step.isLast ? '✅' : undefined,
        message: step.message,
        impact: step.isLast ? 'high' : 'low'
      }])
      
      // Wait for dramatic effect
      await new Promise(resolve => setTimeout(resolve, step.delay))
    }

    // Final dramatic pause before starting
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  
  // Handle ticket submission
  const handleTicketSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingTicket(true)
    
    try {
      // Submit to real ticket API
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ticketForm,
          url
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const { ticket, queuePosition, totalInQueue, estimatedWaitHours } = result
        setTicketNumber(ticket.id)
        
        // Show success in feed with real queue info
        setFeedUpdates(prev => [...prev, {
          id: `ticket_${Date.now()}`,
          timestamp: new Date(),
          type: 'success',
          icon: '🎫',
          message: `Ticket ${ticket.id} created successfully!`,
          detail: `Position #${queuePosition} of ${totalInQueue} in queue • Estimated ${estimatedWaitHours} hours`,
          value: `We'll email ${ticketForm.email} when complete`,
          impact: 'high'
        }])
      
        // Generate instant PDF report with AI analysis
        const reportData = await generateInstantReport(url, ticketForm)
        
        console.log('Real ticket submitted:', {
          ticket,
          queuePosition,
          totalInQueue,
          reportGenerated: reportData ? 'success' : 'failed'
        })

        // Track user behavior for knowledge base
        await updateKnowledgeBase(url, { submittedTicket: true })
      } else {
        throw new Error(result.error || 'Failed to create ticket')
      }
      
      // Close modal after short delay
      setTimeout(() => {
        setShowTicketModal(false)
        setTicketForm({
          name: '',
          email: '',
          phone: '',
          priority: 'standard',
          details: ''
        })
      }, 2000)
      
    } catch (error) {
      console.error('Ticket submission error:', error)
      setFeedUpdates(prev => [...prev, {
        id: `ticket_error_${Date.now()}`,
        timestamp: new Date(),
        type: 'warning',
        icon: '⚠️',
        message: 'Ticket submission failed. Please try again.',
        impact: 'high'
      }])
    } finally {
      setIsSubmittingTicket(false)
    }
  }
  
  // Handle AI conversation flow
  const handleAiConversationStep = (step: number, userAnswer?: string) => {
    if (userAnswer) {
      setAiConversation(prev => ({
        ...prev,
        responses: { ...prev.responses, [`step_${step - 1}`]: userAnswer },
        isWaitingForResponse: false
      }))
      
      // AI responds to user's answer
      setTimeout(() => {
        setFeedUpdates(prev => [...prev, {
          id: `ai_response_${Date.now()}`,
          timestamp: new Date(),
          type: 'success',
          icon: '🤖',
          message: getAiResponseToAnswer(step - 1, userAnswer),
          detail: "Got it! This helps me tailor the analysis to your specific situation.",
          impact: 'medium'
        }])
      }, 500)
    }

    // Continue to next step
    setTimeout(() => {
      switch(step) {
        case 1:
          const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
          setFeedUpdates(prev => [...prev, {
            id: `ai_question1_${Date.now()}`,
            timestamp: new Date(),
            type: 'discovery',
            icon: '💭',
            message: `I can see you are at ${domain} - what is your main business?`,
            detail: "Tell me your main product/service so I can give better insights",
            impact: 'high',
            needsResponse: true
          }])
          setAiConversation(prev => ({
            ...prev,
            isWaitingForResponse: true,
            currentQuestion: 'business_type',
            step: 1
          }))
          break
          
        case 2:
          setFeedUpdates(prev => [...prev, {
            id: `ai_question2_${Date.now()}`,
            timestamp: new Date(),
            type: 'discovery',
            icon: '🎯',
            message: "What's your biggest challenge right now?",
            detail: "Click one that best describes your situation",
            impact: 'high',
            needsResponse: true,
            multipleChoice: [
              { value: 'leads', label: 'Not enough leads', emoji: '📉' },
              { value: 'expensive', label: 'Ads are too expensive', emoji: '💸' },
              { value: 'conversion', label: 'Visitors don\'t convert', emoji: '😕' },
              { value: 'competition', label: 'Competitors beating me', emoji: '🥊' }
            ]
          }])
          setAiConversation(prev => ({
            ...prev,
            isWaitingForResponse: true,
            currentQuestion: 'main_challenge',
            step: 2
          }))
          break
          
        case 3:
          setFeedUpdates(prev => [...prev, {
            id: `ai_question3_${Date.now()}`,
            timestamp: new Date(),
            type: 'discovery',
            icon: '👋',
            message: "By the way, what's your name? I like to know who I'm talking to!",
            detail: "Just your first name is fine - makes this more personal",
            impact: 'medium',
            needsResponse: true
          }])
          setAiConversation(prev => ({
            ...prev,
            isWaitingForResponse: true,
            currentQuestion: 'name',
            step: 3
          }))
          break
          
        case 4:
          // Proceed with AI analysis using collected responses
          proceedWithAiAnalysis()
          break
      }
    }, userAnswer ? 1500 : 0)
  }

  const getAiResponseToAnswer = (step: number, answer: string) => {
    switch(step) {
      case 1:
        // Finish the story based on their answer
        if (answer.includes('Not running ads')) {
          return `Ah okay, so you're smarter than that clinic already! They were burning £3k for just 2 leads a month. Let me show you how to get leads WITHOUT ads first...`
        } else if (answer.includes('Under £500')) {
          return `Smart - staying lean! So that clinic I mentioned? They were paying £3k for what you could get with £500 if you know the tricks. Let me show you...`
        } else {
          return `Interesting... so here's the kicker - that £3k/month clinic? We got them the SAME results for £400. Want to know how?`
        }
      case 2:
        return `Oh man, "${answer}" - I hear that every day. Here's what actually works...`
      case 3:
        return `${answer}! Great name. Okay ${answer}, between you and me, here's what your competitors don't want you to know...`
      default:
        return "Got it. Oh, by the way... just one more thing..." // Classic Columbo!
    }
  }

  const handleUserResponse = async () => {
    if (!userResponse.trim()) return
    
    const currentMessage = userResponse
    setUserResponse('')
    
    // Show user's message in feed
    setFeedUpdates(prev => [...prev, {
      id: `user_msg_${Date.now()}`,
      timestamp: new Date(),
      type: 'teaser',
      icon: '👤',
      message: `You: ${currentMessage}`,
      detail: "",
      impact: 'low'
    }])
    
    // Show AI typing indicator (WhatsApp style)
    setFeedUpdates(prev => [...prev, {
      id: `ai_thinking_${Date.now()}`,
      timestamp: new Date(),
      type: 'teaser',
      icon: '💬',
      message: "Claude is typing",
      detail: "...",
      isTyping: true,
      impact: 'low'
    }])
    
    try {
      // Call real AI conversation API
      const response = await fetch('/api/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          context: {
            url: url,
            domain: url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0],
            step: aiConversation.step
          },
          conversationHistory: aiConversation.history
        })
      })
      
      const aiData = await response.json()
      
      if (aiData.success) {
        // Remove thinking message
        setFeedUpdates(prev => prev.filter(update => !update.id.includes('ai_thinking')))
        
        // Show AI's real response WITH the question included
        setTimeout(() => {
          setFeedUpdates(prev => [...prev, {
            id: `ai_real_response_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '🤖',
            message: `Claude: ${aiData.response}`,
            detail: "Real AI response tailored to your business",
            impact: 'high',
            needsResponse: true  // This should trigger the input field
          }])
        }, 500)
        
        // Extract lead data from the conversation
        const extractedData: any = {}
        
        // Check if response contains name
        if (aiData.response.toLowerCase().includes('name')) {
          extractedData.name = currentMessage
        }
        // Check if response contains email
        else if (currentMessage.includes('@')) {
          extractedData.email = currentMessage
        }
        // Check if response contains phone
        else if (currentMessage.match(/\d{10}|\(\d{3}\)|\d{3}-\d{3}-\d{4}/)) {
          extractedData.phone = currentMessage
        }
        // Check for competitor URL
        else if (currentMessage.includes('.com') || currentMessage.includes('.co.uk')) {
          extractedData.competitor = currentMessage
        }
        // Store business/challenge info
        else if (aiConversation.step === 0) {
          extractedData.business = currentMessage
        }
        else if (aiConversation.step === 1) {
          extractedData.challenge = currentMessage
        }
        
        // Update conversation state and enable response input
        setAiConversation(prev => ({
          ...prev,
          history: aiData.conversationHistory,
          responses: { ...prev.responses, [`step_${prev.step}`]: currentMessage },
          step: prev.step + 1,
          isWaitingForResponse: true,  // Enable input field immediately
          leadData: { ...prev.leadData, ...extractedData, url: url }
        }))
        
        // Continue conversation or proceed to analysis
        setTimeout(() => {
          if (aiConversation.step >= 3) {
            // Good conversation, now proceed with analysis
            proceedWithAiAnalysis()
          }
          // No need to set waiting state here - already set above
        }, 2000)
        
      }
    } catch (error) {
      console.error('Conversation API error:', error)
      // Fallback to simple response
      handleAiConversationStep(aiConversation.step + 1, currentMessage)
    }
  }

  const continueConversation = () => {
    const userName = aiConversation.responses.step_3 || 'there'
    
    // Don't add duplicate questions - the AI already asked its question
    // Just wait for the user's response
    setAiConversation(prev => ({
      ...prev,
      isWaitingForResponse: true
    }))
  }

  const proceedWithAiAnalysis = async () => {
    // Use collected lead data
    const userName = aiConversation.leadData.name || aiConversation.responses.step_3 || 'there'
    const businessInfo = aiConversation.leadData.business || aiConversation.responses.step_1 || ''
    const mainChallenge = aiConversation.leadData.challenge || aiConversation.responses.step_2 || ''
    
    // Log the complete lead profile
    console.log('🎯 LEAD CAPTURED:', {
      name: userName,
      business: businessInfo,
      challenge: mainChallenge,
      email: aiConversation.leadData.email || 'not collected yet',
      phone: aiConversation.leadData.phone || 'not collected',
      competitor: aiConversation.leadData.competitor || 'not mentioned',
      url: url,
      timestamp: new Date().toISOString()
    })
    
    setFeedUpdates(prev => [...prev, {
      id: `ai_processing_${Date.now()}`,
      timestamp: new Date(),
      type: 'teaser',
      icon: '🧠',
      message: `Awesome ${userName}! Now let me combine my background analysis with your conversation insights.`,
      detail: `Personalizing results for ${businessInfo} - especially targeting your ${mainChallenge} challenge`,
      impact: 'high'
    }])

    setTimeout(async () => {
      try {
        // Check if we have background analysis results
        const backgroundResults = (window as any).backgroundAnalysisResults
        let finalAnalysis = null
        
        if (backgroundResults && backgroundResults.success) {
          // We have background analysis - enhance it with conversation context
          setFeedUpdates(prev => [...prev, {
            id: `combining_${Date.now()}`,
            timestamp: new Date(),
            type: 'teaser',
            icon: '⚡',
            message: 'Combining background AI analysis with your conversation...',
            detail: 'This makes the insights way more targeted!',
            impact: 'medium'
          }])
          
          // Run additional analysis with conversation context to enhance background results
          const contextualResponse = await fetch('/api/ai-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: url,
              type: 'contextual-enhancement',
              context: {
                userName,
                businessDescription: businessInfo,
                mainChallenge,
                conversationHistory: aiConversation.history,
                backgroundInsights: backgroundResults.insights
              }
            })
          })
          
          const contextualData = await contextualResponse.json()
          
          // Merge background analysis with contextual insights
          finalAnalysis = {
            ...backgroundResults,
            insights: {
              ...backgroundResults.insights,
              personalizedForUser: true,
              userName: userName,
              focusArea: mainChallenge,
              contextualRecommendations: contextualData.success ? contextualData.insights : null
            }
          }
        } else {
          // No background analysis - run full analysis with conversation context
          const aiResponse = await fetch('/api/ai-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: url,
              context: {
                userName,
                businessDescription: businessInfo,
                mainChallenge,
                conversationHistory: aiConversation.history
              }
            })
          })
          
          finalAnalysis = await aiResponse.json()
        }
        
        if (finalAnalysis && finalAnalysis.success) {
          // Show results with personal touch
          setTimeout(() => {
            setFeedUpdates(prev => [...prev, {
              id: `results_${Date.now()}`,
              timestamp: new Date(),
              type: 'success',
              icon: '🎯',
              message: `${userName}, here's your personalized analysis!`,
              detail: `Custom insights for ${businessInfo} - laser-focused on ${mainChallenge}`,
              impact: 'high'
            }])
          }, 1000)
          
          // Show the enhanced insights
          setTimeout(() => {
            if (finalAnalysis.insights?.quickWins) {
              finalAnalysis.insights.quickWins.forEach((win, index) => {
                setTimeout(() => {
                  setFeedUpdates(prev => [...prev, {
                    id: `win_${index}_${Date.now()}`,
                    timestamp: new Date(),
                    type: 'success',
                    icon: '💡',
                    message: `Quick Win ${index + 1}: ${win.fix}`,
                    detail: `Expected impact: ${win.impact}`,
                    value: win.issue,
                    impact: 'high'
                  }])
                }, index * 1500)
              })
            }
            
            // Show competitor insight
            setTimeout(() => {
              setFeedUpdates(prev => [...prev, {
                id: `competitor_${Date.now()}`,
                timestamp: new Date(),
                type: 'discovery',
                icon: '🔍',
                message: 'Competitor Intelligence',
                detail: finalAnalysis.insights?.competitorInsight || 'Analyzing market patterns...',
                impact: 'medium'
              }])
            }, finalAnalysis.insights?.quickWins?.length * 1500 + 1000)
            
            // Check if manual research is recommended
            if (finalAnalysis.needsManualResearch) {
              setTimeout(() => {
                setShowManualResearchOption(true)
                setManualResearchReason(finalAnalysis.manualResearchReason)
                setFeedUpdates(prev => [...prev, {
                  id: `manual_${Date.now()}`,
                  timestamp: new Date(),
                  type: 'warning',
                  icon: '🎯',
                  message: 'Recommended: Manual Facebook Ads Research',
                  detail: finalAnalysis.manualResearchReason,
                  value: 'Take a ticket for deeper insights',
                  impact: 'high'
                }])
              }, finalAnalysis.insights?.quickWins?.length * 1500 + 3000)
            }
          }, 2000)
          
          // Update knowledge base with enhanced results
          updateKnowledgeBase(url, {
            timeOnSite: Math.floor((Date.now() - analysisStartTimeRef.current) / 1000),
            completedConversation: true,
            userName,
            businessInfo,
            mainChallenge
          }, finalAnalysis.insights, finalAnalysis)
        }
      } catch (error) {
        console.error('Analysis error:', error)
        setFeedUpdates(prev => [...prev, {
          id: `error_${Date.now()}`,
          timestamp: new Date(),
          type: 'warning',
          icon: '⚠️',
          message: 'Analysis temporarily delayed',
          detail: 'Our AI is working on it - results coming soon!',
          impact: 'low'
        }])
      }
    }, 1500)
  }

  // Update knowledge base with analysis results
  const updateKnowledgeBase = async (websiteUrl: string, userBehavior: any = {}, insights: any = null, aiRecommendations: any = null) => {
    try {
      const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      
      await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: websiteUrl,
          domain,
          businessType: 'detected', // Will be determined by API
          industry: 'detected', // Will be determined by API
          insights,
          aiRecommendations,
          userBehavior
        })
      })
    } catch (error) {
      console.error('Failed to update knowledge base:', error)
    }
  }

  // Generate instant PDF report
  const generateInstantReport = async (websiteUrl: string, userInfo: any) => {
    try {
      setFeedUpdates(prev => [...prev, {
        id: `report_${Date.now()}`,
        timestamp: new Date(),
        type: 'discovery',
        icon: '📄',
        message: 'Generating your FREE instant report...',
        detail: 'GPT-4 analysis + Claude copywriting suggestions',
        impact: 'medium'
      }])
      
      // Run both AI analyses in parallel
      const [gptAnalysis, claudeAnalysis] = await Promise.all([
        fetch('/api/ai-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: websiteUrl, type: 'quick' })
        }).then(res => res.json()),
        
        fetch('/api/ai-analysis', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: websiteUrl, type: 'copy-analysis' })
        }).then(res => res.json())
      ])
      
      // Create report content
      const reportContent = {
        title: `Website Analysis Report for ${websiteUrl}`,
        generatedFor: userInfo.name,
        email: userInfo.email,
        date: new Date().toLocaleDateString(),
        sections: {
          gptInsights: gptAnalysis.success ? gptAnalysis.insights : null,
          claudeCopy: claudeAnalysis.success ? claudeAnalysis.analysis : null,
          quickWins: gptAnalysis.insights?.quickWins || [],
          competitorInsight: gptAnalysis.insights?.competitorInsight || 'Analysis in progress...',
          pricingOpportunity: gptAnalysis.insights?.pricingOpportunity || 'Review needed'
        }
      }
      
      // Show success message
      setFeedUpdates(prev => [...prev, {
        id: `report_ready_${Date.now()}`,
        timestamp: new Date(),
        type: 'success',
        icon: '✅',
        message: 'FREE instant report ready!',
        detail: `Emailed to ${userInfo.email} • 3-page AI analysis with copywriting tips`,
        value: 'Check your inbox in 2-3 minutes',
        impact: 'high'
      }])
      
      return reportContent
      
    } catch (error) {
      console.error('Report generation error:', error)
      
      setFeedUpdates(prev => [...prev, {
        id: `report_error_${Date.now()}`,
        timestamp: new Date(),
        type: 'warning',
        icon: '⚠️',
        message: 'Report generation delayed',
        detail: 'We will email it within 15 minutes',
        impact: 'medium'
      }])
      
      return null
    }
  }
  
  // Handle user answers to interactive questions
  const handleAnswer = async (answer: any) => {
    if (!currentPause) return
    
    // Store the answer
    setUserAnswers(prev => ({ ...prev, [currentPause.id]: answer }))
    
    // Handle email capture specially
    if (currentPause.id === 'final_capture' || currentPause.id === 'want_more') {
      if (answer === 'email' || answer.includes('@')) {
        // Capture email and show success
        setFeedUpdates(prev => [...prev, {
          id: `captured_${Date.now()}`,
          timestamp: new Date(),
          type: 'success',
          icon: '🎉',
          message: "Perfect! Report will be sent within 2 hours",
          detail: `Sending to: ${answer}`,
          value: "You'll get: Full competitor analysis, winning ads, custom strategy",
          impact: 'high'
        }])
        
        // Show celebration
        setTimeout(() => {
          setFeedUpdates(prev => [...prev, {
            id: `done_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '🚀',
            message: "You're ahead of 97% of your competitors!",
            detail: "Most never analyze their market properly. You just did.",
            impact: 'high'
          }])
        }, 2000)
        
        setCurrentPause(null)
        return
      }
    }
    
    // Handle other question types
    if (currentPause.question.id === 'response' || currentPause.question.id === 'deeper_analysis') {
      // Handle different analysis options
      if (answer === 'facebook' || answer.toLowerCase().includes('facebook')) {
        setFeedUpdates(prev => [...prev, {
          id: `fb_search_${Date.now()}`,
          timestamp: new Date(),
          type: 'discovery',
          icon: '📱',
          message: "Manual research required for Facebook ads...",
          detail: "Facebook Ads Library needs manual browsing - building our own database",
          impact: 'high'
        }])
        
        // Actually call the Facebook Ads API
        const fbResponse = await fetch('/api/facebook-ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, businessType: userAnswers.business_type })
        })
        
        const fbData = await fbResponse.json()
        
        if (fbData.requiresManual) {
          // Be completely honest about manual research
          setFeedUpdates(prev => [...prev, {
            id: `fb_honest_${Date.now()}`,
            timestamp: new Date(),
            type: 'warning',
            icon: '🤷',
            message: fbData.message,
            detail: fbData.explanation,
            impact: 'high'
          }])
          
          // Show the value of manual research
          setTimeout(() => {
            setFeedUpdates(prev => [...prev, {
              id: `fb_value_${Date.now()}`,
              timestamp: new Date(),
              type: 'discovery',
              icon: '💎',
              message: fbData.offer,
              detail: fbData.value.join(' • '),
              value: fbData.timeframe,
              impact: 'high'
            }])
          }, 2000)
          
          // Ask for their details to join queue
          setTimeout(() => {
            setFeedUpdates(prev => [...prev, {
              id: `queue_prompt_${Date.now()}`,
              timestamp: new Date(),
              type: 'discovery',
              icon: '📋',
              message: "Want us to do this research for you?",
              detail: "Enter your details to join the queue (free for the first 10 people)",
              impact: 'high'
            }])
            
            // Start lead capture
            setCurrentPause({
              id: 'lead_capture_name',
              triggerTime: 0,
              reason: 'Capture for queue',
              valueOfAnswer: 'Manual research',
              question: {
                id: 'name',
                type: 'text',
                icon: '',
                headline: '',
                placeholder: "What's your name?"
              }
            })
          }, 4000)
        } else if (fbData.success && fbData.winningAds?.count > 0) {
          setFeedUpdates(prev => [...prev, {
            id: `fb_found_${Date.now()}`,
            timestamp: new Date(),
            type: 'success',
            icon: '🎯',
            message: fbData.winningAds.insight,
            detail: `Top performer: ${fbData.winningAds.ads[0]?.advertiser} - Running ${fbData.winningAds.ads[0]?.daysRunning} days`,
            value: `${fbData.winningAds.count} winning ads found`,
            impact: 'high'
          }])
        }
        
        setCurrentPause(null)
        return
      } else if (answer === 'email' || answer.includes('@')) {
        // Switch to email capture
        setCurrentPause({
          id: 'final_capture',
          triggerTime: 0,
          reason: 'Email requested',
          valueOfAnswer: 'Deliver report',
          question: {
            id: 'email_capture',
            type: 'text',
            icon: '📧',
            headline: "Where should I send your full report?",
            subtext: "Includes everything: competitor analysis, winning ads, custom strategy",
            placeholder: 'your@email.com'
          }
        })
        return
      }
    }
    
    // Process with interactive feed system
    const result = await interactiveFeed.processAnswer(currentPause.id, answer)
    
    // Add feedback to feed
    result.feedUpdates.forEach(update => {
      setFeedUpdates(prev => [...prev, update])
    })
    
    setCurrentPause(null)
    
    // Continue checking for pauses
    if (result.continueJourney) {
      // Resume pause checking
      startAnalysis()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Minimal Navigation */}
      <nav className="absolute top-0 w-full p-8 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-extralight tracking-wider">
            <span className="text-amber-400">Lead</span>
            <span className="text-amber-600">Balloon</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-amber-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Pricing</a>
            <a href="/admin/login" className="hover:text-amber-400 transition-colors">Sign In</a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark & Elegant */}
      <div className="container mx-auto px-4">
        <div className="min-h-screen flex flex-col justify-center items-center relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Main Heading */}
            <h1 className="text-7xl md:text-8xl font-extralight text-white mb-6 leading-tight tracking-tight">
              Convert visitors
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent italic font-light">
                intelligently
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-gray-400 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
              We find proven ads in your niche, analyze what's working, and craft 
              engaging assessment tools that escape Facebook's learning phase fast.
            </p>

            {/* Input Section */}
            <div className="max-w-xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  startAnalysis()
                }}
                className="relative group"
              >
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourcompetitor.com"
                  className="w-full px-8 py-6 text-lg bg-gray-900/80 backdrop-blur border border-amber-500/30 rounded-full 
                           text-white focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300
                           placeholder:text-gray-500 placeholder:text-sm pr-36"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!url}
                  className={
                    url
                      ? 'absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105 cursor-pointer'
                      : 'absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 rounded-full font-bold transition-all duration-300 bg-gray-800 text-gray-600 cursor-not-allowed'
                  }
                >
                  Analyze
                </button>
              </form>
              
              
              {/* Live Feed Display - SUPER ELEGANT */}
              {isAnalyzing && (
                <div className="mt-12 max-w-3xl mx-auto animate-fadeIn">
                  {/* Elegant Header */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent flex-1"></div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-500/60 font-light">Live Analysis</p>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent flex-1"></div>
                  </div>
                  
                  {/* Floating Question Box - Above Feed */}
                  {aiConversation.isWaitingForResponse && (() => {
                    // Find the latest message with needsResponse
                    const latestQuestion = [...feedUpdates].reverse().find(update => (update as any).needsResponse)
                    if (!latestQuestion) return null
                    
                    return (
                      <div className="mb-6 animate-slideDown">
                        <div className="relative">
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-500/10 rounded-2xl blur-xl"></div>
                          
                          {/* Question Card */}
                          <div className="relative bg-gradient-to-r from-amber-500/10 to-amber-600/10 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-6">
                            <div className="flex items-start gap-4">
                              {/* Claude Icon */}
                              <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-lg"></div>
                                <span className="relative text-2xl block animate-pulse-slow">🤖</span>
                              </div>
                              
                              {/* Question Content */}
                              <div className="flex-1">
                                <p className="text-white font-medium text-base mb-4">
                                  {latestQuestion.message.replace('Claude: ', '')}
                                </p>
                                
                                {/* Multiple Choice Buttons or Input Field */}
                                {(latestQuestion as any).multipleChoice ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    {(latestQuestion as any).multipleChoice.map((option: any) => (
                                      <button
                                        key={option.value}
                                        onClick={() => {
                                          setUserResponse(option.label)
                                          handleUserResponse()
                                        }}
                                        className="p-3 bg-black/40 border border-amber-500/30 rounded-lg text-white hover:border-amber-500/60 hover:bg-amber-500/10 transition-all duration-300 text-left"
                                      >
                                        <span className="text-sm">{option.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={userResponse}
                                        onChange={(e) => setUserResponse(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
                                        placeholder="Type your answer..."
                                        autoFocus
                                        className="flex-1 px-4 py-3 bg-black/40 border border-amber-500/40 rounded-lg text-white placeholder:text-gray-500 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                      />
                                      <button
                                        onClick={handleUserResponse}
                                        disabled={!userResponse.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                                      >
                                        Send
                                      </button>
                                    </div>
                                    <p className="text-xs text-amber-400/60 mt-2">
                                      Press Enter to send your response
                                    </p>
                                  </>
                                )}
                                
                                {latestQuestion.detail && (
                                  <p className="text-xs text-gray-400 mt-3">
                                    {latestQuestion.detail}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                  
                  {/* Feed Container - Glass Morphism */}
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-600/5 to-amber-500/5 rounded-3xl blur-2xl"></div>
                    
                    <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent" ref={feedContainerRef}>
                      {feedUpdates.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center gap-3">
                            <div className="relative">
                              <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute"></div>
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-400 font-light">Initializing intelligence engine...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {feedUpdates.map((update, idx) => (
                            <div 
                              key={update.id} 
                              className={`group relative animate-slideUp opacity-0`}
                              style={{ 
                                animationDelay: `${idx * 0.1}s`,
                                animationFillMode: 'forwards'
                              }}
                            >
                              {/* Timeline Line */}
                              {idx < feedUpdates.length - 1 && (
                                <div className="absolute left-4 top-10 bottom-[-16px] w-px bg-gradient-to-b from-amber-500/20 to-transparent"></div>
                              )}
                              
                              {/* Update Content */}
                              <div className={`flex items-start gap-4 transition-all duration-500 ${
                                update.impact === 'high' 
                                  ? 'pl-2 border-l-2 border-amber-500/50' 
                                  : ''
                              }`}>
                                {/* Icon with glow for high impact */}
                                <div className={`relative flex-shrink-0 ${
                                  update.impact === 'high' ? 'animate-pulse-slow' : ''
                                }`}>
                                  {update.impact === 'high' && (
                                    <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl"></div>
                                  )}
                                  <span className="relative text-2xl block">{update.icon}</span>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 pt-1 min-w-0">
                                  <p className={`leading-relaxed break-words ${
                                    update.impact === 'high' 
                                      ? 'text-white font-medium text-sm' 
                                      : 'text-gray-400 text-sm font-light'
                                  }`}>
                                    {update.message}
                                  </p>
                                  {update.detail && (
                                    <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed break-words">
                                      {update.detail}
                                    </p>
                                  )}
                                  {update.value && (
                                    <div className="inline-block mt-3">
                                      {(update.id.includes('manual_offer') || update.id.includes('priority_offer')) ? (
                                        <button 
                                          onClick={() => {
                                            setShowTicketModal(true)
                                            // Track manual research interest
                                            updateKnowledgeBase(url, { clickedManualResearch: true })
                                          }}
                                          className="text-xs bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 px-4 py-2 rounded-full border border-amber-500/30 hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-amber-600/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                                        >
                                          {update.value}
                                        </button>
                                      ) : (
                                        <p className="text-xs bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-400 px-3 py-1.5 rounded-full font-mono border border-amber-500/20 break-words">
                                          {update.value}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Input field removed - now in floating question box */}
                                </div>
                                
                                {/* Timestamp */}
                                <div className="text-xs text-gray-600 font-light">
                                  {new Date(update.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    second: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Simple inline input for questions */}
                  {currentPause && currentPause.question.type === 'text' && (
                    <div className="mt-6">
                      <input
                        type="text"
                        placeholder={currentPause.question.placeholder}
                        className="w-full px-4 py-3 bg-black/20 border border-amber-500/30 rounded-xl text-white placeholder:text-gray-500 focus:border-amber-500/50 focus:bg-black/30 focus:outline-none transition-all font-light text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value
                            handleAnswer(value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  )}
                  
                  {/* Progress Indicator - Elegant */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-light">
                        Intelligence Processing
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {!isAnalyzing && (
                <p className="text-xs text-gray-500 mt-4">
                  No credit card required • Setup in 60 seconds
                </p>
              )}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 animate-bounce">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Features Section - Dark Cards */}
        <div className="py-32 relative">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800
                            flex items-center justify-center group-hover:border-amber-500/50 transition-all duration-300">
                <svg className="w-10 h-10 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Find Winning Ads</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We manually research winning ads in your niche and build our own searchable database of proven performers
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800
                            flex items-center justify-center group-hover:border-amber-500/50 transition-all duration-300">
                <svg className="w-10 h-10 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Build Assessment Tools</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Create engaging quizzes and calculators that Facebook's algorithm loves - escape learning phase in days, not weeks
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800
                            flex items-center justify-center group-hover:border-amber-500/50 transition-all duration-300">
                <svg className="w-10 h-10 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Craft Your Offer</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Combine proven hooks with your unique value proposition to create an offer that converts at 3-5x industry average
              </p>
            </div>
          </div>
        </div>

        {/* Facebook Prison Widget - Escape Learning Phase */}
        <div className="py-20 text-center relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl font-extralight text-white mb-6">
              Don't Let Facebook <span className="text-red-400">Hold You Hostage</span>
            </h2>
            <p className="text-lg text-gray-400 mb-12">
              Escape the learning phase prison with assessment tools that the algorithm actually rewards
            </p>

            {/* Facebook Behind Bars Widget */}
            <div className="relative inline-block">
              {/* Facebook Prisoner - Clean with your image */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 w-64 h-48 flex items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Prisoner Image */}
                <img 
                  src="/images/prisoner.png" 
                  alt="Facebook Prisoner Behind Bars"
                  className="w-full h-full object-contain"
                />
                
                {/* Facebook 'f' logo badge */}
                <div className="absolute top-4 right-4">
                  <div className="text-white text-lg font-bold bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">f</div>
                </div>
              </div>
              
              {/* Chains */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="text-gray-500 text-2xl">⛓️</div>
              </div>
            </div>

            {/* Freedom Arrow */}
            <div className="mt-12 flex items-center justify-center gap-8">
              <div className="text-2xl animate-bounce">🔓</div>
              <div className="text-3xl text-amber-400">→</div>
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm text-green-400 font-medium">FREEDOM</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 italic">
                "I escaped Facebook's learning phase in 3 days using assessment widgets" - Sarah M.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof - Subtle */}
        <div className="py-20 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">Trusted by innovative companies</p>
            <div className="flex justify-center items-center gap-12 opacity-30">
              <div className="text-2xl font-light text-gray-500">Stripe</div>
              <div className="text-2xl font-light text-gray-500">Linear</div>
              <div className="text-2xl font-light text-gray-500">Vercel</div>
              <div className="text-2xl font-light text-gray-500">Framer</div>
            </div>
          </div>
        </div>

        {/* How It Works - Minimal Dark */}
        <div className="py-32">
          <h2 className="text-4xl font-extralight text-center text-white mb-20">
            Four steps to <span className="text-amber-400">higher conversions</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { num: '01', title: 'Enter URL', desc: 'Your site or competitor' },
              { num: '02', title: 'AI Analysis', desc: 'Extract key insights' },
              { num: '03', title: 'Generate Widget', desc: 'Customize your offer' },
              { num: '04', title: 'Copy & Deploy', desc: 'One line of code' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-extralight text-amber-500/30 mb-4">{step.num}</div>
                <h4 className="text-sm font-medium text-white mb-2">{step.title}</h4>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA - Gold Accent */}
        <div className="py-32 text-center relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-5xl font-extralight text-white mb-8">
              Ready for a <span className="text-amber-400">real analysis</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Stop guessing. Get expert manual research that actually works.
            </p>
            <button 
              onClick={() => setShowTicketModal(true)}
              className="inline-block px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full
                       font-medium hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300
                       text-sm tracking-wide cursor-pointer"
            >
              Take a Ticket - Get Manual Analysis
            </button>
            <p className="text-xs text-gray-600 mt-6">
              24-hour delivery • Real human research • Only 5 spots left this week
            </p>
          </div>
        </div>

        {/* Footer - Minimal Dark */}
        <footer className="py-12 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                © 2024 LeadBalloon AI. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-amber-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Custom scrollbar for webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(251, 191, 36, 0.2);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(251, 191, 36, 0.3);
        }
      `}</style>


      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/20 rounded-3xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button 
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎫</span>
              </div>
              <h2 className="text-2xl font-extralight text-white mb-2">
                Take Your <span className="text-amber-400">Ticket</span>
              </h2>
              <p className="text-sm text-gray-400">
                {showManualResearchOption 
                  ? "Get manual Facebook Ads research within 24 hours"
                  : "Get your manual analysis within 24 hours"
                }
              </p>
              {showManualResearchOption && manualResearchReason && (
                <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-400 font-medium">AI Recommendation:</p>
                  <p className="text-xs text-gray-300 mt-1">{manualResearchReason}</p>
                </div>
              )}
            </div>

            {/* Live Queue Display */}
            {queueInfo && (
              <div className="mb-6 p-4 bg-black/20 border border-amber-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-amber-400">Live Queue Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{queueInfo.queued}</div>
                    <div className="text-xs text-gray-400">In Queue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-400">{queueInfo.inProgress}</div>
                    <div className="text-xs text-gray-400">In Progress</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">{queueInfo.completed}</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                </div>
                {queueInfo.recentTickets.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Recent Tickets:</div>
                    <div className="space-y-1">
                      {queueInfo.recentTickets.slice(-3).map(ticket => (
                        <div key={ticket.id} className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">#{ticket.number} - {ticket.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            ticket.status === 'queued' ? 'bg-yellow-500/20 text-yellow-400' :
                            ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleTicketSubmission} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm
                           focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm
                           focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={ticketForm.phone}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm
                           focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm
                           focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="standard">Standard (24h) - Free</option>
                  <option value="rush">Rush (12h) - $97</option>
                  <option value="urgent">Urgent (6h) - $297</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Additional Details</label>
                <textarea
                  value={ticketForm.details}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, details: e.target.value }))}
                  rows={3}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm
                           focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                  placeholder="What are your biggest challenges? Specific goals?"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-4 rounded-xl
                         font-medium hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingTicket ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Creating Ticket...
                  </div>
                ) : (
                  'Get My Manual Analysis'
                )}
              </button>

              {/* Success State */}
              {ticketNumber && (
                <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-green-400 font-medium">✓ Ticket Created!</div>
                  <div className="text-xs text-green-300 mt-1">#{ticketNumber}</div>
                </div>
              )}
            </form>

            {/* Fine Print */}
            <p className="text-xs text-gray-500 text-center mt-6">
              We'll also send you a FREE instant report with GPT-4 analysis while you wait
            </p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        @keyframes typing-dots {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
        
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fbbf24;
          margin: 0 2px;
          animation: typing-dots 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: -0.16s;
        }
      `}</style>
    </div>
  )
}