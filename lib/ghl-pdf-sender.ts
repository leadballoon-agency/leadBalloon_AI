/**
 * GHL PDF Report Integration
 * Methods to send PDF reports to GoHighLevel
 */

/**
 * METHOD 1: Upload PDF to GHL via API
 * Requires GHL API access (not just webhook)
 */
export async function uploadPdfToGHL(contactId: string, pdfBuffer: Buffer) {
  const GHL_API_KEY = process.env.GHL_API_KEY
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID
  
  if (!GHL_API_KEY) {
    console.log('GHL API key not configured - using webhook method instead')
    return null
  }
  
  // Upload file to GHL
  const formData = new FormData()
  formData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'website-analysis.pdf')
  formData.append('contactId', contactId)
  
  const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
    },
    body: formData
  })
  
  return response.json()
}

/**
 * METHOD 2: Host PDF temporarily and send URL
 * More reliable - doesn't require GHL API
 */
export async function hostPdfTemporarily(html: string): Promise<string> {
  // Option A: Upload to temporary file hosting
  // Services like file.io, transfer.sh, or tmpfiles.org
  
  // Option B: Use your own S3/Cloudinary
  const CLOUDINARY_URL = process.env.CLOUDINARY_URL
  if (CLOUDINARY_URL) {
    // Upload to Cloudinary as PDF
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: JSON.stringify({
        file: `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
        upload_preset: 'pdf_reports',
        resource_type: 'raw'
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await response.json()
    return data.secure_url
  }
  
  // Option C: Use temporary storage service
  const response = await fetch('https://file.io', {
    method: 'POST',
    body: new FormData().append('file', new Blob([html], { type: 'text/html' })),
  })
  
  const data = await response.json()
  return data.link // Temporary link (expires in 14 days)
}

/**
 * METHOD 3: Send HTML report directly in webhook
 * Simplest approach - GHL can display HTML
 */
export function formatForGHLWebhook(data: any, html: string) {
  return {
    // Standard lead data
    ...data,
    
    // Add report as custom fields
    customFields: {
      ...data.customFields,
      
      // Full HTML report (GHL can display this)
      analysisReportHTML: html,
      
      // Key metrics for quick view
      websiteScore: data.scores?.overall || 0,
      criticalIssues: data.issues?.length || 0,
      quickWins: data.quickWins?.length || 0,
      
      // Screenshot as base64 (if GHL supports image fields)
      websiteScreenshot: data.screenshot?.thumbnail || '',
      
      // Report sections as separate fields
      mainIssues: data.issues?.map(i => i.title).join('\n'),
      recommendations: data.recommendations?.join('\n'),
      competitorInsights: data.competitorInsights || '',
      bookingSystem: data.bookingSystem?.platform || 'None',
      
      // Financial impact
      potentialRevenue: data.roi?.additionalRevenue || 'Not calculated',
      currentConversion: data.roi?.currentConversion || 'Unknown',
      potentialConversion: data.roi?.potentialConversion || 'Unknown'
    },
    
    // Add report URL if hosted
    reportUrl: null, // Will be populated if using Method 2
    
    // Notes with summary
    notes: `
WEBSITE ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━
Website: ${data.website}
Overall Score: ${data.scores?.overall || 0}/100
Critical Issues: ${data.issues?.length || 0}
Quick Wins: ${data.quickWins?.length || 0}

TOP ISSUES:
${data.issues?.slice(0, 3).map(i => `• ${i.title}`).join('\n') || 'None identified'}

BOOKING SYSTEM: ${data.bookingSystem?.platform || 'None detected'}

FINANCIAL IMPACT:
Current Conversion: ${data.roi?.currentConversion || 'Unknown'}
Potential: ${data.roi?.potentialConversion || 'Unknown'}
Additional Revenue: ${data.roi?.additionalRevenue || 'Not calculated'}

━━━━━━━━━━━━━━━━━━━━━━━
Full HTML report attached in custom fields
    `,
    
    // Tags for segmentation
    tags: [
      ...data.tags,
      `score-${Math.floor((data.scores?.overall || 0) / 10) * 10}`, // score-70, score-80, etc
      data.bookingSystem?.platform ? `booking-${data.bookingSystem.platform.toLowerCase()}` : 'no-booking',
      data.issues?.length > 5 ? 'many-issues' : 'few-issues'
    ]
  }
}

/**
 * METHOD 4: Send via email with PDF attachment
 * Use SendGrid/Mailgun to email the report
 */
export async function emailPdfReport(to: string, pdfBuffer: Buffer, data: any) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured')
    return null
  }
  
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(SENDGRID_API_KEY)
  
  const msg = {
    to: to,
    from: 'reports@leadballoon.ai',
    subject: `Website Analysis Report - ${data.website}`,
    text: `Your website analysis is complete. See attached PDF for full report.`,
    html: `
      <h2>Website Analysis Complete</h2>
      <p>We've completed the analysis of ${data.website}</p>
      <p><strong>Overall Score:</strong> ${data.scores?.overall}/100</p>
      <p>See attached PDF for your complete report.</p>
    `,
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: 'website-analysis-report.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  }
  
  return sgMail.send(msg)
}

/**
 * RECOMMENDED APPROACH for GHL
 */
export async function sendReportToGHL(data: any, html: string) {
  // 1. Format data for GHL
  const ghlData = formatForGHLWebhook(data, html)
  
  // 2. Try to host PDF if possible
  try {
    const pdfUrl = await hostPdfTemporarily(html)
    ghlData.reportUrl = pdfUrl
    ghlData.customFields.reportPdfUrl = pdfUrl
  } catch (error) {
    console.log('Could not host PDF, sending HTML only')
  }
  
  // 3. Send to GHL webhook
  const response = await fetch(process.env.GHL_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ghlData)
  })
  
  return response.json()
}

/**
 * SETUP INSTRUCTIONS FOR GHL
 * 
 * 1. In GHL, create custom fields:
 *    - analysisReportHTML (Long Text)
 *    - websiteScore (Number)
 *    - criticalIssues (Number)
 *    - mainIssues (Long Text)
 *    - bookingSystem (Text)
 *    - reportPdfUrl (URL)
 * 
 * 2. In your GHL workflow:
 *    - Trigger: Webhook received
 *    - Action: Create/Update Contact
 *    - Map custom fields from webhook data
 *    - Optional: Send email with reportPdfUrl
 * 
 * 3. For PDF viewing in GHL:
 *    - Use the reportPdfUrl in emails
 *    - Or display analysisReportHTML in contact view
 *    - Or trigger automation to download and attach
 */