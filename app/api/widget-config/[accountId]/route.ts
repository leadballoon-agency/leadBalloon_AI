import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  // In production, this would fetch from database based on accountId
  // For now, return demo configuration
  
  const config = {
    accountId: params.accountId,
    values: {
      totalValue: '£2,997',
      todayPrice: '£497',
      consultationValue: '£300',
      treatmentPlanValue: '£500',
      followUpValue: '£200'
    },
    valueStack: [
      {
        item: 'ProMax Lipo Full Treatment',
        value: '£1,500',
        description: 'Revolutionary non-surgical fat reduction'
      },
      {
        item: 'Body Analysis & Consultation',
        value: '£300',
        description: 'Complete assessment with our experts'
      },
      {
        item: '6-Week Follow-Up Program',
        value: '£497',
        description: 'Ensure lasting results'
      },
      {
        item: 'Nutrition & Exercise Guide',
        value: '£197',
        description: 'Custom plan for your body type'
      },
      {
        item: 'Lifetime Support Access',
        value: '£497',
        description: 'Ongoing guidance and support'
      }
    ],
    offer: {
      headline: 'Transform Your Body in 6 Weeks',
      subheadline: 'Without Surgery, Downtime, or Extreme Diets',
      urgencyMessage: 'Only 5 spots left this month',
      guarantee: '100% money-back if you don\'t see results'
    },
    assessment: {
      questions: [
        {
          question: 'How much weight have you lost recently?',
          options: ['Less than 1 stone', '1-2 stones', '2-3 stones', '3+ stones']
        },
        {
          question: 'What\'s your main concern?',
          options: ['Loose skin on stomach', 'Saggy arms', 'Thigh skin', 'Multiple areas']
        },
        {
          question: 'When do you want to see results?',
          options: ['ASAP', 'Next 30 days', 'Next 3 months', 'Just researching']
        }
      ]
    },
    styling: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      ctaColor: '#FFD700'
    }
  }
  
  // Add CORS headers for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }
  
  return NextResponse.json(config, { headers })
}

export async function OPTIONS() {
  // Handle preflight requests
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}