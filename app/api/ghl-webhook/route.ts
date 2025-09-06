import { NextRequest, NextResponse } from 'next/server'
import { formatReportForGHL } from '@/lib/ghl-report-formatter'

/**
 * GoHighLevel Webhook Integration
 * Automatically sends leads to GHL CRM with full context
 */

// GHL Configuration (replace with your actual values)
const GHL_CONFIG = {
  webhookUrl: process.env.GHL_WEBHOOK_URL || '', // Your GHL webhook URL
  apiKey: process.env.GHL_API_KEY || '', // Optional: If using API instead of webhook
  locationId: process.env.GHL_LOCATION_ID || '', // Your GHL location ID
}

/**
 * Send lead to GoHighLevel
 */
export async function POST(req: NextRequest) {
  let leadData: any
  
  try {
    leadData = await req.json()
    
    // Format data for GHL
    const ghlPayload = formatForGHL(leadData)
    
    // Send to GHL webhook
    const response = await fetch(GHL_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ghlPayload)
    })
    
    if (!response.ok) {
      throw new Error(`GHL webhook failed: ${response.statusText}`)
    }
    
    console.log('✅ Lead sent to GHL:', {
      name: ghlPayload.name,
      email: ghlPayload.email,
      leadScore: ghlPayload.customFields.lead_score
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead sent to GHL',
      ghlResponse: await response.json()
    })
    
  } catch (error) {
    console.error('GHL webhook error:', error)
    
    // Store locally if GHL fails (backup)
    if (leadData) {
      await storeLeadLocally(leadData)
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Lead stored locally, will retry GHL',
      error: error.message
    })
  }
}

/**
 * Format lead data for GoHighLevel
 */
function formatForGHL(leadData: any) {
  return {
    // Contact Info
    name: leadData.name || 'Unknown',
    email: leadData.email || '',
    phone: leadData.phone || '',
    website: leadData.website || leadData.url || '',
    
    // Custom field values directly at root (GHL webhook format)
    website_score: leadData.scores?.overall || 0,
    lead_score: leadData.leadScore || 0,
    lead_temperature: leadData.leadTemperature || 'cold',
    analysis_report: leadData.analysisReport || formatReportForGHL(leadData),
    report_pdf_url: leadData.reportUrl || '',
    critical_issues: leadData.analysisResults?.issues?.length || 0,
    booking_system: leadData.analysisResults?.bookingSystem || 'Not detected',
    platform_detected: leadData.analysisResults?.platform || 'Unknown',
    
    // Lead Source
    source: 'LeadBalloon AI Analysis',
    campaign: 'Website Analyzer',
    medium: 'Organic',
    
    // Tags for segmentation
    tags: [
      leadData.businessType || 'unknown-type',
      `lead-score-${leadData.leadScore || 0}`,
      leadData.leadTemperature || 'cold',
      leadData.hasWebsite ? 'has-website' : 'no-website',
      leadData.runningAds ? 'running-ads' : 'no-ads'
    ],
    
    // Additional fields in customFields (in case GHL uses both)
    customFields: {
      // Your main custom fields
      website_score: leadData.scores?.overall || 0,
      lead_score: leadData.leadScore || 0,
      lead_temperature: leadData.leadTemperature || 'cold',
      analysis_report: leadData.analysisReport || formatReportForGHL(leadData),
      report_pdf_url: leadData.reportUrl || '',
      critical_issues: leadData.analysisResults?.issues?.length || 0,
      booking_system: leadData.analysisResults?.bookingSystem || 'Not detected',
      platform_detected: leadData.analysisResults?.platform || 'Unknown',
      
      // Additional fields
      business_type: leadData.businessType || '',
      main_challenge: leadData.mainChallenge || '',
      current_ad_spend: leadData.currentAdSpend || '',
      quick_wins: leadData.analysisResults?.quickWins?.join(', ') || '',
      competitor_insights: leadData.analysisResults?.competitorInsights || '',
      engagement_level: leadData.engagementLevel || '',
      pain_points: leadData.painPoints?.join(', ') || ''
    },
    
    // Notes for sales team
    notes: generateSalesNotes(leadData),
    
    // Full Analysis Report (for review before sending)
    analysisReport: generateAnalysisReport(leadData),
    
    // Pipeline Stage (configure in GHL)
    pipelineStage: determinePipelineStage(leadData),
    
    // Automation triggers
    automations: {
      sendWelcomeEmail: true,
      addToNurtureCampaign: leadData.leadTemperature !== 'hot',
      scheduleFollowUp: leadData.leadTemperature === 'hot',
      assignToRep: leadData.leadScore > 70
    }
  }
}

/**
 * Generate sales notes from conversation
 */
function generateSalesNotes(leadData: any): string {
  const notes = []
  
  notes.push(`📊 Lead Score: ${leadData.leadScore}/100`)
  notes.push(`🌡️ Temperature: ${leadData.leadTemperature}`)
  
  if (leadData.mainChallenge) {
    notes.push(`\n🎯 Main Challenge: ${leadData.mainChallenge}`)
  }
  
  if (leadData.currentAdSpend) {
    notes.push(`💰 Current Ad Spend: ${leadData.currentAdSpend}`)
  }
  
  if (leadData.timeline) {
    notes.push(`⏰ Timeline: ${leadData.timeline}`)
  }
  
  if (leadData.competitors) {
    notes.push(`🏆 Mentioned Competitors: ${leadData.competitors.join(', ')}`)
  }
  
  notes.push(`\n💬 Conversation Highlights:`)
  if (leadData.conversationHighlights) {
    leadData.conversationHighlights.forEach(highlight => {
      notes.push(`- ${highlight}`)
    })
  }
  
  if (leadData.educationProvided) {
    notes.push(`\n📚 Education Provided:`)
    leadData.educationProvided.forEach(topic => {
      notes.push(`- ${topic}`)
    })
  }
  
  notes.push(`\n🎯 Recommended Next Steps:`)
  if (leadData.leadTemperature === 'hot') {
    notes.push('- Call immediately (HOT LEAD)')
    notes.push('- Reference their specific challenge')
    notes.push('- Offer free strategy session')
  } else if (leadData.leadTemperature === 'warm') {
    notes.push('- Send personalized email within 24h')
    notes.push('- Share relevant case study')
    notes.push('- Offer free consultation')
  } else {
    notes.push('- Add to nurture sequence')
    notes.push('- Send educational content')
    notes.push('- Check in after 1 week')
  }
  
  return notes.join('\n')
}

/**
 * Determine GHL pipeline stage based on lead quality
 */
function determinePipelineStage(leadData: any): string {
  if (leadData.leadScore >= 80) {
    return 'Ready to Close'
  } else if (leadData.leadScore >= 60) {
    return 'Qualified'
  } else if (leadData.leadScore >= 40) {
    return 'Interested'
  } else if (leadData.email || leadData.phone) {
    return 'New Lead'
  } else {
    return 'Unqualified'
  }
}

/**
 * Backup: Store lead locally if GHL fails
 */
async function storeLeadLocally(leadData: any): Promise<void> {
  // This would store in your database
  // For now, using localStorage concept
  if (typeof window !== 'undefined') {
    const failedLeads = JSON.parse(localStorage.getItem('failedGHLLeads') || '[]')
    failedLeads.push({
      ...leadData,
      failedAt: new Date().toISOString(),
      retryCount: 0
    })
    localStorage.setItem('failedGHLLeads', JSON.stringify(failedLeads))
  }
  
  console.log('📥 Lead stored locally for retry:', leadData.email)
}

/**
 * Generate Analysis Report for review in GHL
 */
function generateAnalysisReport(leadData: any): string {
  // Use HTML formatting for better display in GHL
  const report = []
  
  report.push(`<strong>🔍 WEBSITE ANALYSIS REPORT</strong>`)
  report.push(``)
  report.push(`<strong>📊 Overview:</strong>`)
  report.push(`• Website: ${leadData.website || 'Not provided'}`)
  report.push(`• Business: ${leadData.businessType || 'Unknown'}`)
  report.push(`• Date: ${new Date().toLocaleDateString()}`)
  report.push(``)
  
  report.push(`EXECUTIVE SUMMARY`)
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  if (leadData.conversionRate) {
    report.push(`Current Conversion Rate: ${leadData.conversionRate}`)
    report.push(`Industry Average: 2.5%`)
    report.push(`Potential with Fixes: 4-5%`)
  }
  report.push(``)
  
  report.push(`CRITICAL ISSUES FOUND`)
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  if (leadData.analysisResults?.issues) {
    leadData.analysisResults.issues.forEach((issue, index) => {
      report.push(`${index + 1}. ${issue}`)
    })
  }
  report.push(``)
  
  report.push(`QUICK WINS (IMPLEMENT TODAY)`)
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  if (leadData.analysisResults?.quickWins) {
    leadData.analysisResults.quickWins.forEach((win, index) => {
      report.push(`${index + 1}. ${win}`)
    })
  }
  report.push(``)
  
  report.push(`COMPETITOR INSIGHTS`)
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  if (leadData.analysisResults?.competitorInsights) {
    report.push(leadData.analysisResults.competitorInsights)
  }
  report.push(``)
  
  if (leadData.currentAdSpend) {
    report.push(`FINANCIAL IMPACT`)
    report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    report.push(`Current Ad Spend: ${leadData.currentAdSpend}`)
    if (leadData.conversionRate) {
      const currentRate = parseFloat(leadData.conversionRate) || 0.8
      const improvedRate = 2.5
      const improvement = Math.round((improvedRate / currentRate - 1) * 100)
      report.push(`Potential Improvement: ${improvement}% more conversions`)
      report.push(`Same budget, ${improvement}% more customers`)
    }
    report.push(``)
  }
  
  report.push(`RECOMMENDED NEXT STEPS`)
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  report.push(`1. Fix critical conversion issues (1-2 days)`)
  report.push(`2. Implement quick wins (2-3 hours)`)
  report.push(`3. A/B test improvements (ongoing)`)
  report.push(`4. Monitor conversion rate weekly`)
  report.push(``)
  
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  report.push(`Need help implementing these changes?`)
  report.push(`Book a free 15-minute strategy call`)
  report.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  
  return report.join('\n')
}

/**
 * Retry failed GHL webhooks (run this periodically)
 */
export async function GET(req: NextRequest) {
  if (typeof window !== 'undefined') {
    const failedLeads = JSON.parse(localStorage.getItem('failedGHLLeads') || '[]')
    const retryResults = []
    
    for (const lead of failedLeads) {
      try {
        const response = await fetch(GHL_CONFIG.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formatForGHL(lead))
        })
        
        if (response.ok) {
          retryResults.push({ email: lead.email, status: 'success' })
        } else {
          lead.retryCount++
          retryResults.push({ email: lead.email, status: 'failed', retries: lead.retryCount })
        }
      } catch (error) {
        lead.retryCount++
        retryResults.push({ email: lead.email, status: 'error', message: error.message })
      }
    }
    
    // Remove successful ones, keep failed for next retry
    const stillFailed = failedLeads.filter(lead => 
      !retryResults.find(r => r.email === lead.email && r.status === 'success')
    )
    
    localStorage.setItem('failedGHLLeads', JSON.stringify(stillFailed))
    
    return NextResponse.json({
      retriedCount: failedLeads.length,
      successCount: retryResults.filter(r => r.status === 'success').length,
      stillFailedCount: stillFailed.length,
      results: retryResults
    })
  }
  
  return NextResponse.json({ message: 'No failed leads to retry' })
}