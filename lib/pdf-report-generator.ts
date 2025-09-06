/**
 * PDF Report Generator with Website Screenshots
 * Creates professional analysis reports
 */

// Using HTML to PDF approach (easier than building from scratch)
// npm install @react-pdf/renderer or puppeteer

export interface ReportData {
  website: string
  businessName: string
  businessType: string
  screenshot?: {
    thumbnail: string
    fullSize: string
  }
  analysisDate: Date
  leadInfo: {
    name?: string
    email?: string
    company?: string
  }
  scores: {
    overall: number
    mobile: number
    speed: number
    conversion: number
  }
  issues: AnalysisIssue[]
  quickWins: QuickWin[]
  competitorInsights: string
  bookingSystem?: {
    platform: string
    insights: string[]
  }
  recommendations: string[]
  roi: {
    currentConversion?: string
    potentialConversion?: string
    additionalRevenue?: string
  }
}

interface AnalysisIssue {
  title: string
  description: string
  impact: 'Critical' | 'High' | 'Medium' | 'Low'
  effort: 'Easy' | 'Medium' | 'Hard'
  timeToFix: string
}

interface QuickWin {
  title: string
  currentState: string
  recommendedState: string
  expectedImpact: string
}

/**
 * Generate HTML report (can be converted to PDF)
 */
export function generateHTMLReport(data: ReportData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Website Analysis Report - ${data.website}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .header .subtitle {
      font-size: 18px;
      opacity: 0.9;
    }
    
    .website-preview {
      margin: 30px auto;
      max-width: 800px;
      text-align: center;
    }
    
    .website-preview img {
      width: 100%;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .website-url {
      margin-top: 10px;
      color: #6b7280;
      font-size: 14px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .score-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .score-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .score-card .score {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
    }
    
    .score-card .label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    
    .section {
      margin: 40px 0;
    }
    
    .section h2 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .issue {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    
    .issue.critical {
      border-left-color: #dc2626;
      background: #fee2e2;
    }
    
    .issue.high {
      border-left-color: #f97316;
      background: #fff7ed;
    }
    
    .issue.medium {
      border-left-color: #fbbf24;
      background: #fefce8;
    }
    
    .issue-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .issue-title {
      font-weight: bold;
      font-size: 16px;
    }
    
    .issue-badges {
      display: flex;
      gap: 10px;
    }
    
    .badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .badge.critical { background: #dc2626; color: white; }
    .badge.high { background: #f97316; color: white; }
    .badge.medium { background: #fbbf24; color: #1a1a1a; }
    .badge.easy { background: #10b981; color: white; }
    .badge.hard { background: #6b7280; color: white; }
    
    .quick-win {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    
    .comparison {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 20px;
      align-items: center;
      margin: 15px 0;
    }
    
    .comparison .current {
      padding: 10px;
      background: #fee2e2;
      border-radius: 4px;
      text-align: center;
    }
    
    .comparison .arrow {
      font-size: 24px;
      color: #10b981;
    }
    
    .comparison .recommended {
      padding: 10px;
      background: #dcfce7;
      border-radius: 4px;
      text-align: center;
    }
    
    .roi-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    
    .roi-box h3 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .roi-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .roi-metric {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 4px;
    }
    
    .roi-metric .value {
      font-size: 28px;
      font-weight: bold;
    }
    
    .roi-metric .label {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    
    .cta-section {
      background: #f9fafb;
      padding: 40px;
      border-radius: 8px;
      text-align: center;
      margin: 40px 0;
    }
    
    .cta-section h3 {
      font-size: 24px;
      margin-bottom: 15px;
    }
    
    .cta-section p {
      color: #6b7280;
      margin-bottom: 20px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
    }
    
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
      margin-top: 40px;
    }
    
    @media print {
      .cta-button { 
        background: #667eea !important; 
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Website Analysis Report</h1>
    <div class="subtitle">Professional Conversion Optimization Analysis</div>
  </div>
  
  ${data.screenshot ? `
  <div class="website-preview">
    <img src="${data.screenshot.thumbnail}" alt="${data.website} screenshot">
    <div class="website-url">${data.website}</div>
  </div>
  ` : ''}
  
  <div class="container">
    <div class="score-cards">
      <div class="score-card">
        <div class="score">${data.scores.overall}/100</div>
        <div class="label">Overall Score</div>
      </div>
      <div class="score-card">
        <div class="score">${data.scores.mobile}/100</div>
        <div class="label">Mobile Ready</div>
      </div>
      <div class="score-card">
        <div class="score">${data.scores.speed}/100</div>
        <div class="label">Page Speed</div>
      </div>
      <div class="score-card">
        <div class="score">${data.scores.conversion}/100</div>
        <div class="label">Conversion</div>
      </div>
    </div>
    
    <div class="section">
      <h2>🚨 Critical Issues Found</h2>
      ${data.issues.map(issue => `
        <div class="issue ${issue.impact.toLowerCase()}">
          <div class="issue-header">
            <div class="issue-title">${issue.title}</div>
            <div class="issue-badges">
              <span class="badge ${issue.impact.toLowerCase()}">${issue.impact}</span>
              <span class="badge ${issue.effort.toLowerCase()}">${issue.effort} Fix</span>
            </div>
          </div>
          <div>${issue.description}</div>
          <div style="margin-top: 10px; font-size: 14px; color: #6b7280;">
            ⏱ Time to fix: ${issue.timeToFix}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>✅ Quick Wins (Implement Today)</h2>
      ${data.quickWins.map(win => `
        <div class="quick-win">
          <div style="font-weight: bold; margin-bottom: 10px;">${win.title}</div>
          <div class="comparison">
            <div class="current">
              <div style="font-size: 12px; color: #dc2626; margin-bottom: 5px;">Current</div>
              <div>${win.currentState}</div>
            </div>
            <div class="arrow">→</div>
            <div class="recommended">
              <div style="font-size: 12px; color: #10b981; margin-bottom: 5px;">Recommended</div>
              <div>${win.recommendedState}</div>
            </div>
          </div>
          <div style="margin-top: 10px; color: #10b981; font-weight: 500;">
            Expected Impact: ${win.expectedImpact}
          </div>
        </div>
      `).join('')}
    </div>
    
    ${data.bookingSystem ? `
    <div class="section">
      <h2>📅 Booking System Analysis</h2>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
        <div style="font-weight: bold; margin-bottom: 10px;">
          Detected: ${data.bookingSystem.platform}
        </div>
        <ul style="margin-left: 20px;">
          ${data.bookingSystem.insights.map(insight => `
            <li style="margin: 5px 0;">${insight}</li>
          `).join('')}
        </ul>
      </div>
    </div>
    ` : ''}
    
    <div class="roi-box">
      <h3>💰 Financial Impact</h3>
      <div class="roi-metrics">
        <div class="roi-metric">
          <div class="value">${data.roi.currentConversion || '0.8%'}</div>
          <div class="label">Current Conversion</div>
        </div>
        <div class="roi-metric">
          <div class="value">${data.roi.potentialConversion || '2.5%'}</div>
          <div class="label">Potential Conversion</div>
        </div>
        <div class="roi-metric">
          <div class="value">${data.roi.additionalRevenue || '£3,400'}</div>
          <div class="label">Additional Monthly Revenue</div>
        </div>
      </div>
    </div>
    
    <div class="cta-section">
      <h3>Need Help Implementing These Changes?</h3>
      <p>Get expert help to fix these issues and triple your conversions</p>
      <a href="https://calendly.com/your-link" class="cta-button">
        Book Free 15-Minute Strategy Call
      </a>
    </div>
  </div>
  
  <div class="footer">
    <p>Report generated on ${data.analysisDate.toLocaleDateString()} by LeadBalloon AI</p>
    <p>© 2024 LeadBalloon. All rights reserved.</p>
  </div>
</body>
</html>
  `
}

/**
 * Convert HTML to PDF (using Puppeteer on server)
 */
export async function htmlToPDF(html: string): Promise<Buffer> {
  // This would use Puppeteer or similar to convert HTML to PDF
  // For now, returning the HTML which can be converted client-side
  
  // const browser = await puppeteer.launch()
  // const page = await browser.newPage()
  // await page.setContent(html)
  // const pdf = await page.pdf({ format: 'A4' })
  // await browser.close()
  // return pdf
  
  return Buffer.from(html)
}

/**
 * Generate and send report
 */
export async function generateAndSendReport(data: ReportData): Promise<void> {
  // 1. Capture screenshot if not provided
  if (!data.screenshot) {
    try {
      const screenshotResponse = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.website })
      })
      
      if (screenshotResponse.ok) {
        const screenshotData = await screenshotResponse.json()
        data.screenshot = screenshotData.screenshot
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error)
    }
  }
  
  // 2. Generate HTML report
  const html = generateHTMLReport(data)
  
  // 3. Send to GHL for review
  await fetch('/api/ghl-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data.leadInfo,
      analysisReport: html,
      reportGenerated: true,
      reportGeneratedAt: new Date().toISOString()
    })
  })
}