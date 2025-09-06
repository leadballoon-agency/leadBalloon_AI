import { NextRequest, NextResponse } from 'next/server'

/**
 * Website Screenshot Service
 * Captures website thumbnails for reports
 */

// Option 1: Using Puppeteer (if installed)
// npm install puppeteer

// Option 2: Using external screenshot API
const SCREENSHOT_API_OPTIONS = {
  // Free tier: https://screenshotapi.net
  screenshotapi: {
    url: 'https://shot.screenshotapi.net/screenshot',
    token: process.env.SCREENSHOT_API_TOKEN || 'free-tier-token'
  },
  
  // Alternative: https://www.screenshotmachine.com
  screenshotmachine: {
    url: 'https://api.screenshotmachine.com',
    key: process.env.SCREENSHOT_MACHINE_KEY || ''
  },
  
  // Using Oxylabs (since you have it)
  oxylabs: {
    endpoint: 'https://realtime.oxylabs.io/v1/queries',
    auth: {
      username: process.env.OXYLABS_USERNAME,
      password: process.env.OXYLABS_PASSWORD
    }
  }
}

export async function POST(req: NextRequest) {
  let url = 'unknown'
  
  try {
    const body = await req.json()
    url = body.url
    const options = body.options || {}
    
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }
    
    // Method 1: Using free Screenshot API
    // const screenshot = await captureWithScreenshotAPI(url, options)
    
    // Method 2: Using Oxylabs (better quality, costs credits)
    const screenshot = await captureWithOxylabs(url, options)
    
    return NextResponse.json({
      success: true,
      screenshot,
      url
    })
    
  } catch (error) {
    console.error('Screenshot error:', error)
    
    // Return placeholder if screenshot fails
    return NextResponse.json({
      success: false,
      screenshot: generatePlaceholder(url),
      error: 'Screenshot failed, using placeholder'
    })
  }
}

/**
 * Capture using free Screenshot API
 */
async function captureWithScreenshotAPI(url: string, options: any) {
  const params = new URLSearchParams({
    token: SCREENSHOT_API_OPTIONS.screenshotapi.token,
    url: url,
    width: options.width || '1280',
    height: options.height || '800',
    output: 'json',
    thumbnail_width: '400', // Thumbnail for report
    file_type: 'png',
    wait_for_event: 'load',
    delay: '2000' // Wait 2s for dynamic content
  })
  
  const response = await fetch(
    `${SCREENSHOT_API_OPTIONS.screenshotapi.url}?${params}`,
    { method: 'GET' }
  )
  
  if (!response.ok) {
    throw new Error('Screenshot API failed')
  }
  
  const data = await response.json()
  return {
    fullSize: data.screenshot,
    thumbnail: data.thumbnail || data.screenshot,
    capturedAt: new Date().toISOString()
  }
}

/**
 * Capture using Oxylabs Web Scraper API
 */
async function captureWithOxylabs(url: string, options: any) {
  const payload = {
    source: 'universal',
    url: url,
    render: 'html',
    javascript: true,
    screenshot: true,
    screenshot_options: {
      full_page: false,
      width: 1280,
      height: 800
    }
  }
  
  const auth = Buffer.from(
    `${process.env.OXYLABS_USERNAME}:${process.env.OXYLABS_PASSWORD}`
  ).toString('base64')
  
  const response = await fetch('https://realtime.oxylabs.io/v1/queries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify(payload)
  })
  
  if (!response.ok) {
    throw new Error('Oxylabs screenshot failed')
  }
  
  const data = await response.json()
  
  // Oxylabs returns base64 screenshot
  return {
    fullSize: data.results[0].screenshot,
    thumbnail: data.results[0].screenshot, // Would need to resize
    capturedAt: new Date().toISOString()
  }
}

/**
 * Generate placeholder if screenshot fails
 */
function generatePlaceholder(url: string): any {
  // Create a simple SVG placeholder
  const domain = new URL(url).hostname
  const svg = `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="#f3f4f6"/>
      <text x="200" y="125" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle">
        ${domain}
      </text>
      <text x="200" y="145" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle">
        Screenshot unavailable
      </text>
    </svg>
  `
  
  return {
    fullSize: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    thumbnail: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    isPlaceholder: true
  }
}

/**
 * Get cached screenshot if available
 */
async function getCachedScreenshot(url: string): Promise<any | null> {
  // Simple in-memory cache (in production, use Redis)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`screenshot_${url}`)
    if (cached) {
      const data = JSON.parse(cached)
      const age = Date.now() - new Date(data.capturedAt).getTime()
      
      // Cache for 24 hours
      if (age < 24 * 60 * 60 * 1000) {
        return data
      }
    }
  }
  return null
}

/**
 * Save screenshot to cache
 */
async function cacheScreenshot(url: string, screenshot: any): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`screenshot_${url}`, JSON.stringify(screenshot))
  }
}