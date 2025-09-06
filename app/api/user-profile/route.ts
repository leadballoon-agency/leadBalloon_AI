import { NextRequest, NextResponse } from 'next/server'
import { 
  UserProfile, 
  calculateLeadScore, 
  getLeadTemperature, 
  generateFollowUpStrategy,
  extractDataFromConversation
} from '@/lib/user-knowledge-base'

/**
 * User Profile API - Track everything about our leads
 */

// In production, this would be a database
const userProfiles: Map<string, UserProfile> = new Map()

export async function POST(req: NextRequest) {
  try {
    const { action, profileData, sessionId } = await req.json()
    
    switch (action) {
      case 'create':
        return createProfile(profileData, sessionId)
      case 'update':
        return updateProfile(profileData, sessionId)
      case 'track':
        return trackInteraction(profileData, sessionId)
      case 'getFollowUp':
        return getFollowUpStrategy(sessionId)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('User profile error:', error)
    return NextResponse.json({ error: 'Failed to process profile' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
  }
  
  const profile = userProfiles.get(sessionId)
  
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
  
  return NextResponse.json({ profile })
}

/**
 * Create new user profile
 */
function createProfile(data: Partial<UserProfile>, sessionId: string) {
  const profile: UserProfile = {
    id: sessionId,
    email: data.email || '',
    name: data.name || '',
    website: data.website || '',
    domain: data.domain || '',
    businessType: data.businessType || '',
    businessDescription: data.businessDescription || '',
    mainChallenge: data.mainChallenge || '',
    painPoints: [],
    goals: [],
    marketingChannels: [],
    hasWebsite: true,
    hasFacebookAds: false,
    hasGoogleAds: false,
    hasEmailMarketing: false,
    conversations: [],
    questionsAnswered: [],
    questionsSkipped: [],
    firstSeen: new Date(),
    lastSeen: new Date(),
    totalTimeSpent: 0,
    pagesViewed: [],
    returningVisitor: false,
    leadScore: 0,
    leadTemperature: 'cold',
    readyToBuy: false,
    personalNotes: [],
    triggers: [],
    objections: [],
    tags: [],
    ...data
  }
  
  // Calculate initial lead score
  profile.leadScore = calculateLeadScore(profile)
  profile.leadTemperature = getLeadTemperature(profile.leadScore)
  
  userProfiles.set(sessionId, profile)
  
  console.log('🎯 New Lead Profile Created:', {
    id: sessionId,
    name: profile.name,
    businessType: profile.businessType,
    leadScore: profile.leadScore,
    temperature: profile.leadTemperature
  })
  
  return NextResponse.json({ 
    success: true, 
    profile,
    message: 'Profile created successfully'
  })
}

/**
 * Update existing profile
 */
function updateProfile(updates: Partial<UserProfile>, sessionId: string) {
  const profile = userProfiles.get(sessionId)
  
  if (!profile) {
    return createProfile(updates, sessionId)
  }
  
  // Merge updates
  Object.assign(profile, updates)
  
  // Update timestamps
  profile.lastSeen = new Date()
  
  // Recalculate lead score
  profile.leadScore = calculateLeadScore(profile)
  profile.leadTemperature = getLeadTemperature(profile.leadScore)
  
  // Check if they're ready to buy
  if (profile.leadScore > 70 && profile.email && profile.mainChallenge) {
    profile.readyToBuy = true
  }
  
  userProfiles.set(sessionId, profile)
  
  console.log('📈 Lead Profile Updated:', {
    id: sessionId,
    name: profile.name,
    leadScore: profile.leadScore,
    temperature: profile.leadTemperature,
    readyToBuy: profile.readyToBuy
  })
  
  // If lead is hot, trigger follow-up notification
  if (profile.leadTemperature === 'hot' || profile.leadTemperature === 'on-fire') {
    console.log('🔥 HOT LEAD ALERT!', {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      challenge: profile.mainChallenge,
      budget: profile.currentAdSpend
    })
  }
  
  return NextResponse.json({ 
    success: true, 
    profile,
    message: 'Profile updated successfully'
  })
}

/**
 * Track user interaction
 */
function trackInteraction(data: any, sessionId: string) {
  const profile = userProfiles.get(sessionId)
  
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
  
  // Add conversation entry
  if (data.question && data.answer) {
    const extracted = extractDataFromConversation(data.answer)
    
    profile.conversations.push({
      timestamp: new Date(),
      question: data.question,
      answer: data.answer,
      extractedData: extracted
    })
    
    // Update profile with extracted data
    if (extracted.email) profile.email = extracted.email
    if (extracted.phone) profile.phone = extracted.phone
    if (extracted.budget) profile.currentAdSpend = extracted.budget
    if (extracted.urgency) profile.urgencyLevel = 'high'
    
    profile.questionsAnswered.push(data.question)
  }
  
  // Track page view
  if (data.pageView) {
    profile.pagesViewed.push(data.pageView)
  }
  
  // Update time spent
  if (data.timeSpent) {
    profile.totalTimeSpent += data.timeSpent
  }
  
  // Recalculate lead score
  profile.leadScore = calculateLeadScore(profile)
  profile.leadTemperature = getLeadTemperature(profile.leadScore)
  
  userProfiles.set(sessionId, profile)
  
  return NextResponse.json({ 
    success: true,
    leadScore: profile.leadScore,
    temperature: profile.leadTemperature
  })
}

/**
 * Get follow-up strategy for a lead
 */
function getFollowUpStrategy(sessionId: string) {
  const profile = userProfiles.get(sessionId)
  
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
  
  const strategy = generateFollowUpStrategy(profile as UserProfile)
  
  return NextResponse.json({ 
    success: true,
    profile: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      leadScore: profile.leadScore,
      temperature: profile.leadTemperature
    },
    strategy
  })
}

/**
 * Export all leads (for CRM integration)
 */
export async function PUT(req: NextRequest) {
  const leads = Array.from(userProfiles.values()).map(profile => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    businessType: profile.businessType,
    mainChallenge: profile.mainChallenge,
    leadScore: profile.leadScore,
    temperature: profile.leadTemperature,
    readyToBuy: profile.readyToBuy,
    lastSeen: profile.lastSeen,
    conversations: profile.conversations.length,
    currentAdSpend: profile.currentAdSpend
  }))
  
  // Sort by lead score
  leads.sort((a, b) => b.leadScore - a.leadScore)
  
  return NextResponse.json({ 
    success: true,
    totalLeads: leads.length,
    hotLeads: leads.filter(l => l.temperature === 'hot' || l.temperature === 'on-fire').length,
    leads
  })
}