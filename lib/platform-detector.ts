/**
 * Platform Detection
 * Identifies which CMS, website builder or platform a site uses
 */

export interface PlatformInfo {
  platform: string
  detected: boolean
  confidence: 'high' | 'medium' | 'low'
  insights: string[]
  indicators: string[]
}

/**
 * Detect website platform from HTML
 */
export function detectPlatform(html: string, headers?: any): PlatformInfo {
  const htmlLower = html.toLowerCase()
  
  // GoHighLevel Detection
  if (htmlLower.includes('gohighlevel') || 
      htmlLower.includes('leadconnector') ||
      htmlLower.includes('location-id') ||
      htmlLower.includes('funnel-iframe') ||
      htmlLower.includes('msgsndr.com') ||
      html.includes('window.leadConnectorSettings')) {
    return {
      platform: 'GoHighLevel',
      detected: true,
      confidence: 'high',
      indicators: [
        htmlLower.includes('leadconnector') ? 'LeadConnector scripts' : '',
        htmlLower.includes('msgsndr.com') ? 'Msgsndr domain' : '',
        htmlLower.includes('funnel-iframe') ? 'GHL funnel elements' : ''
      ].filter(Boolean),
      insights: [
        'Using GoHighLevel CRM/Funnel builder',
        'Likely already has automation in place',
        'Probably marketing-savvy',
        'May have existing agency support'
      ]
    }
  }
  
  // WordPress Detection
  if (htmlLower.includes('wp-content') || 
      htmlLower.includes('wp-json') ||
      htmlLower.includes('wordpress') ||
      html.includes('<!-- This site is powered by WordPress -->') ||
      headers?.['x-powered-by']?.includes('WordPress')) {
    
    // Check for specific WordPress builders
    const builders = {
      'elementor': 'Elementor Page Builder',
      'divi': 'Divi Builder',
      'wpbakery': 'WPBakery Page Builder',
      'beaver-builder': 'Beaver Builder',
      'oxygen': 'Oxygen Builder'
    }
    
    let builder = null
    for (const [key, name] of Object.entries(builders)) {
      if (htmlLower.includes(key)) {
        builder = name
        break
      }
    }
    
    return {
      platform: builder ? `WordPress (${builder})` : 'WordPress',
      detected: true,
      confidence: 'high',
      indicators: [
        'wp-content directory',
        'WordPress core files',
        builder || 'Standard WordPress'
      ],
      insights: [
        'Using WordPress CMS',
        builder ? `Built with ${builder}` : 'Custom WordPress theme',
        'Flexible but may need optimization',
        'Likely self-managed or small agency'
      ]
    }
  }
  
  // Shopify Detection
  if (htmlLower.includes('cdn.shopify.com') || 
      htmlLower.includes('myshopify.com') ||
      headers?.['x-shopify-stage']) {
    return {
      platform: 'Shopify',
      detected: true,
      confidence: 'high',
      indicators: ['Shopify CDN', 'Shopify scripts'],
      insights: [
        'E-commerce focused business',
        'Using Shopify platform',
        'Likely selling products online',
        'May need conversion optimization'
      ]
    }
  }
  
  // Wix Detection
  if (htmlLower.includes('wix.com') || 
      htmlLower.includes('parastorage.com') ||
      htmlLower.includes('wixstatic.com')) {
    return {
      platform: 'Wix',
      detected: true,
      confidence: 'high',
      indicators: ['Wix infrastructure', 'Wix static files'],
      insights: [
        'Using Wix website builder',
        'Limited technical customization',
        'DIY approach to web presence',
        'May benefit from professional upgrade'
      ]
    }
  }
  
  // Squarespace Detection
  if (htmlLower.includes('squarespace.com') || 
      htmlLower.includes('sqsp.net') ||
      htmlLower.includes('squarespace-cdn.com')) {
    return {
      platform: 'Squarespace',
      detected: true,
      confidence: 'high',
      indicators: ['Squarespace CDN', 'Squarespace templates'],
      insights: [
        'Using Squarespace builder',
        'Design-focused approach',
        'Good aesthetics, may lack features',
        'Probably values visual appeal'
      ]
    }
  }
  
  // Webflow Detection
  if (htmlLower.includes('webflow.com') || 
      htmlLower.includes('webflow.io') ||
      html.includes('data-wf-page')) {
    return {
      platform: 'Webflow',
      detected: true,
      confidence: 'high',
      indicators: ['Webflow scripts', 'Webflow hosting'],
      insights: [
        'Using Webflow (professional builder)',
        'Likely has designer/developer',
        'Modern, responsive design',
        'Higher-end web presence'
      ]
    }
  }
  
  // ClickFunnels Detection
  if (htmlLower.includes('clickfunnels.com') || 
      htmlLower.includes('cfcdn.com') ||
      htmlLower.includes('clickfunnels-assets')) {
    return {
      platform: 'ClickFunnels',
      detected: true,
      confidence: 'high',
      indicators: ['ClickFunnels scripts', 'CF assets'],
      insights: [
        'Using ClickFunnels for landing pages',
        'Conversion-focused mindset',
        'Probably running paid ads',
        'Marketing-savvy business'
      ]
    }
  }
  
  // Kajabi Detection
  if (htmlLower.includes('kajabi.com') || 
      htmlLower.includes('kajabi-cdn.com')) {
    return {
      platform: 'Kajabi',
      detected: true,
      confidence: 'high',
      indicators: ['Kajabi platform', 'Kajabi CDN'],
      insights: [
        'Using Kajabi for courses/coaching',
        'Information product business',
        'Likely has email automation',
        'Educational/coaching focus'
      ]
    }
  }
  
  // React/Next.js Detection
  if (html.includes('_next/static') || 
      html.includes('__NEXT_DATA__')) {
    return {
      platform: 'Next.js',
      detected: true,
      confidence: 'high',
      indicators: ['Next.js framework', 'React components'],
      insights: [
        'Modern tech stack (Next.js)',
        'Professional development',
        'Performance-optimized',
        'Likely has technical team'
      ]
    }
  }
  
  // Custom/Unknown
  return {
    platform: 'Custom/Unknown',
    detected: false,
    confidence: 'low',
    indicators: [],
    insights: [
      'Custom-built website or unknown platform',
      'May be professionally developed',
      'Could be outdated technology',
      'Needs deeper analysis'
    ]
  }
}

/**
 * Get competitive insights based on platform
 */
export function getPlatformInsights(platform: string): any {
  const insights: Record<string, any> = {
    'GoHighLevel': {
      strengths: [
        'Integrated CRM and marketing',
        'Automation capabilities',
        'Funnel building features'
      ],
      weaknesses: [
        'Can look templated',
        'Limited design flexibility',
        'Learning curve for features'
      ],
      opportunity: 'They understand marketing but may need better conversion optimization'
    },
    'WordPress': {
      strengths: [
        'Flexible and customizable',
        'SEO-friendly',
        'Large ecosystem'
      ],
      weaknesses: [
        'Needs maintenance',
        'Can be slow without optimization',
        'Security vulnerabilities'
      ],
      opportunity: 'May need speed optimization and conversion improvements'
    },
    'Wix': {
      strengths: [
        'Easy to use',
        'Quick setup',
        'All-in-one solution'
      ],
      weaknesses: [
        'Limited customization',
        'Poor SEO capabilities',
        'Can\'t migrate easily'
      ],
      opportunity: 'Ready for professional upgrade to better platform'
    },
    'Shopify': {
      strengths: [
        'E-commerce focused',
        'Payment processing',
        'App ecosystem'
      ],
      weaknesses: [
        'Transaction fees',
        'Limited blog features',
        'Theme limitations'
      ],
      opportunity: 'Focus on conversion rate optimization for better ROI'
    }
  }
  
  return insights[platform] || insights['Custom/Unknown']
}