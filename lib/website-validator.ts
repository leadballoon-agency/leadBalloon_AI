/**
 * Website Validation & Error Handling
 * Elegant error messages for invalid URLs
 */

export interface ValidationResult {
  valid: boolean
  url?: string
  error?: string
  suggestion?: string
}

/**
 * Validate and normalize website URL
 */
export function validateWebsite(input: string): ValidationResult {
  if (!input || input.trim() === '') {
    return {
      valid: false,
      error: "Hmm, I didn't catch your website URL",
      suggestion: "Could you share your website address? (e.g., example.com)"
    }
  }

  let url = input.trim().toLowerCase()
  
  // Remove common typos and spaces
  url = url.replace(/\s+/g, '')
  
  // Check for obvious non-URLs
  if (url.includes('@')) {
    return {
      valid: false,
      error: "That looks like an email address",
      suggestion: "I need your website URL instead (e.g., yourbusiness.com)"
    }
  }
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  
  try {
    const urlObj = new URL(url)
    
    // Check for localhost/internal URLs
    if (urlObj.hostname === 'localhost' || urlObj.hostname.startsWith('192.168') || urlObj.hostname.startsWith('10.')) {
      return {
        valid: false,
        error: "I can't analyze local or internal websites",
        suggestion: "Please provide a public website URL"
      }
    }
    
    // Check for valid TLD
    const parts = urlObj.hostname.split('.')
    if (parts.length < 2 || parts[parts.length - 1].length < 2) {
      return {
        valid: false,
        error: "That doesn't look like a valid website",
        suggestion: "Make sure it includes the domain extension (e.g., .com, .co.uk)"
      }
    }
    
    // Check for common social media URLs (we can't analyze these)
    const socialPlatforms = ['facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'youtube.com', 'tiktok.com']
    if (socialPlatforms.some(platform => urlObj.hostname.includes(platform))) {
      return {
        valid: false,
        error: "I need your actual website, not your social media page",
        suggestion: "Do you have a business website I can analyze?"
      }
    }
    
    return {
      valid: true,
      url: urlObj.toString()
    }
    
  } catch (error) {
    // Try to be helpful with common mistakes
    if (url.includes('www.www.')) {
      return {
        valid: false,
        error: "Looks like there's a typo (double www)",
        suggestion: "Try: " + url.replace('www.www.', 'www.')
      }
    }
    
    if (url.includes('..')) {
      return {
        valid: false,
        error: "There might be a typo in your URL (double dots)",
        suggestion: "Please check and try again"
      }
    }
    
    return {
      valid: false,
      error: "That doesn't look quite right",
      suggestion: "Please enter your website like: example.com or www.example.com"
    }
  }
}

/**
 * Check if website is reachable
 */
export async function checkWebsiteReachability(url: string): Promise<ValidationResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow'
    })
    
    clearTimeout(timeout)
    
    if (response.ok || response.status === 403 || response.status === 401) {
      // Site exists even if access is restricted
      return { valid: true, url }
    }
    
    if (response.status === 404) {
      return {
        valid: false,
        error: "I couldn't find that website",
        suggestion: "Please double-check the URL and try again"
      }
    }
    
    if (response.status >= 500) {
      return {
        valid: false,
        error: "That website seems to be having technical issues",
        suggestion: "The site might be down. Want to try a different URL?"
      }
    }
    
    return { valid: true, url }
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        valid: false,
        error: "The website is taking too long to respond",
        suggestion: "It might be down or very slow. Want to try another?"
      }
    }
    
    if (error.message?.includes('ENOTFOUND')) {
      return {
        valid: false,
        error: "I can't find that website",
        suggestion: "Please check the spelling and try again"
      }
    }
    
    // Might still be valid, just can't check from server
    return { valid: true, url }
  }
}

/**
 * Format error message for conversation
 */
export function formatErrorForUser(validation: ValidationResult): string {
  if (validation.valid) return ''
  
  const messages = []
  
  if (validation.error) {
    messages.push(validation.error)
  }
  
  if (validation.suggestion) {
    messages.push(validation.suggestion)
  }
  
  return messages.join('. ')
}

/**
 * Common website issues and fixes
 */
export const commonWebsiteIssues = {
  'shopify': {
    pattern: /myshopify\.com/,
    message: "That's your Shopify admin URL. I need your public website instead",
    suggestion: "What's your customer-facing domain?"
  },
  'wordpress': {
    pattern: /wp-admin|wp-login/,
    message: "That's your WordPress admin area",
    suggestion: "I need your public website URL (without /wp-admin)"
  },
  'staging': {
    pattern: /staging\.|test\.|dev\.|localhost/,
    message: "That looks like a development site",
    suggestion: "Do you have your live website URL?"
  },
  'email': {
    pattern: /@/,
    message: "That's an email address",
    suggestion: "I need your website URL (like example.com)"
  }
}

/**
 * Smart URL correction
 */
export function attemptUrlCorrection(input: string): string | null {
  // Remove common prefixes people add by mistake
  input = input.replace(/^(my website is|check|analyze|www\.|https?:\/\/)+/gi, '')
  
  // Fix common typos
  const corrections: Record<string, string> = {
    'htttp': 'http',
    'htttps': 'https',
    'wwww': 'www',
    '.con': '.com',
    '.comm': '.com',
    '.co,': '.com',
    '.co.u': '.co.uk',
    '.co.ukk': '.co.uk'
  }
  
  let corrected = input
  for (const [wrong, right] of Object.entries(corrections)) {
    corrected = corrected.replace(wrong, right)
  }
  
  if (corrected !== input) {
    return corrected
  }
  
  return null
}