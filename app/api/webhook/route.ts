import { NextRequest, NextResponse } from 'next/server'

// WhatsApp Business API configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || ''
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`

// GoHighLevel webhook URL
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/dVD6QbgqAF7fiHM3MCrz/webhook-trigger/355171e7-7010-42a9-b0b8-3dee211db694'

interface AssessmentData {
  name: string
  email: string
  phone?: string
  postcode?: string
  method: string
  amount: string
  area: string
  timeline: string
}

interface WhatsAppMessage {
  messaging_product: string
  to: string
  type: string
  text: {
    body: string
  }
}

// Send WhatsApp message
async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log('WhatsApp credentials not configured')
    return false
  }

  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '')
    
    const whatsappMessage: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: cleanNumber,
      type: 'text',
      text: {
        body: message
      }
    }

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(whatsappMessage)
    })

    if (response.ok) {
      console.log('WhatsApp message sent successfully')
      return true
    } else {
      console.error('Failed to send WhatsApp message:', await response.text())
      return false
    }
  } catch (error) {
    console.error('WhatsApp API error:', error)
    return false
  }
}

// Send data to GoHighLevel
async function sendToGHL(data: AssessmentData): Promise<boolean> {
  try {
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        source: 'skulpt-assessment',
        timestamp: new Date().toISOString(),
        score: calculateScore(data)
      })
    })

    if (response.ok) {
      console.log('Data sent to GHL successfully')
      return true
    } else {
      console.error('Failed to send to GHL:', await response.text())
      return false
    }
  } catch (error) {
    console.error('GHL webhook error:', error)
    return false
  }
}

// Calculate assessment score
function calculateScore(data: AssessmentData): number {
  let score = 70

  // Higher score for skinny jab users (they're ideal candidates)
  if (data.method === 'ozempic' || data.method === 'mounjaro') {
    score += 15
  } else if (data.method === 'diet') {
    score += 10
  } else if (data.method === 'surgery') {
    score += 12
  }

  // Score based on weight loss amount
  if (data.amount === '2-4stone') {
    score += 8
  } else if (data.amount === '4-6stone') {
    score += 10
  } else if (data.amount === '6plus') {
    score += 12
  } else {
    score += 5
  }

  // Timeline urgency
  if (data.timeline === 'asap') {
    score += 5
  } else if (data.timeline === '1month') {
    score += 3
  }

  // Cap at 95%
  return Math.min(score, 95)
}

// Generate personalized WhatsApp message
function generateWhatsAppMessage(data: AssessmentData): string {
  const score = calculateScore(data)
  const area = data.area === 'multiple' ? 'problem areas' : data.area
  
  return `Hi ${data.name}! 🎉

Congratulations on completing your ProMax Lipo assessment! 

Your Results:
✅ ${score}% Match Score - You're PERFECT for ProMax Lipo!
🎯 Focus Area: ${area}
📈 Weight Loss Method: ${data.method}

Based on your ${data.method} weight loss journey and loose skin concerns, ProMax Lipo is ideal for you. We can tighten and contour your ${area} without surgery.

Next Steps:
1️⃣ Book your FREE consultation
2️⃣ Get personalized treatment plan
3️⃣ Start your transformation!

Book now: https://link.skintight.uk/widget/booking/85AnUNYWb63J1DyMo1g9

Questions? Just reply to this message!

Best regards,
The Skulpt Team 💙`
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    const data: AssessmentData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.method || !data.amount || !data.area || !data.timeline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Processing webhook for:', data.email)

    // Send to GoHighLevel
    const ghlSuccess = await sendToGHL(data)

    // Send WhatsApp message if phone number is provided
    let whatsappSuccess = true
    if (data.phone) {
      const message = generateWhatsAppMessage(data)
      whatsappSuccess = await sendWhatsAppMessage(data.phone, message)
    }

    // Store in database if you have one
    // await storeAssessment(data)

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      score: calculateScore(data),
      ghlSent: ghlSuccess,
      whatsappSent: whatsappSuccess && !!data.phone
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// WhatsApp webhook verification (for Meta verification)
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  // Verify the webhook
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    return new NextResponse(challenge, { status: 200 })
  } else {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }
}

// Handle incoming WhatsApp messages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process incoming WhatsApp messages here
    console.log('Incoming WhatsApp webhook:', body)
    
    // You can add logic here to handle incoming messages
    // For example, responding to customer queries automatically
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}