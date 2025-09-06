import { NextResponse } from 'next/server'

// In production, this would connect to a database
// For demo purposes, we're using in-memory storage

// This would be replaced with database operations
let widgetConfigs: Record<string, any> = {}

export async function GET(request: Request) {
  try {
    // Get client ID from query params or auth token
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId') || 'default'
    
    // In production, verify authentication here
    
    // Fetch configuration from database
    const config = widgetConfigs[clientId] || getDefaultConfig()
    
    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientId = 'default', config } = body
    
    // In production:
    // 1. Verify authentication
    // 2. Validate configuration schema
    // 3. Save to database
    
    widgetConfigs[clientId] = {
      ...config,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      config: widgetConfigs[clientId]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId') || 'default'
    
    // Reset to defaults
    delete widgetConfigs[clientId]
    
    return NextResponse.json({
      success: true,
      message: 'Settings reset to defaults'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
}

function getDefaultConfig() {
  return {
    general: {
      spotsRemaining: 7,
      timerHours: 23,
      timerMinutes: 59,
      enableConfetti: true,
      confettiThreshold: 15,
      totalSteps: 10,
      showProgressBar: true,
      showTrustBadge: true
    },
    copy: {
      headline: 'Transform Your Appearance Today',
      subheadline: 'Join thousands of happy clients',
      trustBadge: '2,847 UK Residents Have Transformed',
      urgencyMessage: 'Only {spots} spots remaining this week',
      ctaButton: 'Start Your Free Assessment',
      journeyNameIntro: 'Welcome {name}! For your journey, you\'ll be known as:',
      completionMessage: 'Welcome to Skulpt, {aliasName}!',
      emailLabel: 'Email Address'
    },
    values: {
      consultationValue: '£150',
      bodyScanValue: '£200',
      treatmentPlanValue: '£150',
      totalValue: '£500',
      todayPrice: 'FREE',
      priceRangeMin: '£1,997',
      priceRangeMax: '£3,497',
      showPricing: true,
      currency: 'GBP'
    },
    pixels: {
      facebookPixelId: '',
      googleAnalyticsId: '',
      tiktokPixelId: '',
      enableTracking: true,
      trackPageView: true,
      trackLeadStart: true,
      trackLeadComplete: true
    }
  }
}