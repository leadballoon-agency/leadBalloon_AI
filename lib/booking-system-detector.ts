/**
 * Booking System Detection
 * Identifies which booking platform a business uses
 */

export interface BookingSystemInfo {
  platform: string
  detected: boolean
  url?: string
  insights: string[]
  recommendations: string[]
  competitiveAdvantage?: string
}

/**
 * Detect booking system from website HTML/links
 */
export function detectBookingSystem(html: string, url: string): BookingSystemInfo {
  const htmlLower = html.toLowerCase()
  
  // Treatwell Detection
  if (htmlLower.includes('treatwell.co.uk') || 
      htmlLower.includes('widget.treatwell') ||
      htmlLower.includes('connect.treatwell')) {
    return {
      platform: 'Treatwell',
      detected: true,
      url: extractBookingUrl(html, 'treatwell'),
      insights: [
        'Using Treatwell (15-20% commission per booking)',
        'Customers leave your site to book',
        'Treatwell controls customer data',
        'Competing with other salons on Treatwell'
      ],
      recommendations: [
        'Add direct booking to save 15-20% commission',
        'Offer exclusive deals for direct bookings',
        'Build your own customer database',
        'Use Treatwell for new customers only'
      ],
      competitiveAdvantage: 'You could save £500-2000/month in Treatwell fees with direct booking'
    }
  }
  
  // Phorest Detection
  if (htmlLower.includes('phorest') || 
      htmlLower.includes('book.salonhq') ||
      htmlLower.includes('bookings.phorest')) {
    return {
      platform: 'Phorest',
      detected: true,
      insights: [
        'Using Phorest (professional salon software)',
        'Good choice for salon management',
        'Integrated booking and POS system',
        'Owns customer data'
      ],
      recommendations: [
        'Ensure online booking is prominently displayed',
        'Use Phorest marketing features fully',
        'Set up automated review requests',
        'Enable deposit taking for high-value treatments'
      ]
    }
  }
  
  // Fresha (formerly Shedul) Detection
  if (htmlLower.includes('fresha.com') || 
      htmlLower.includes('shedul.com')) {
    return {
      platform: 'Fresha',
      detected: true,
      insights: [
        'Using Fresha (commission-free booking)',
        'Good for avoiding fees',
        'Limited marketing features',
        'Basic reporting only'
      ],
      recommendations: [
        'Consider upgrading to paid plan for marketing tools',
        'Add email marketing integration',
        'Use external review management',
        'Build customer database separately'
      ]
    }
  }
  
  // SalonIQ Detection
  if (htmlLower.includes('saloniq') || 
      htmlLower.includes('book.saloniq')) {
    return {
      platform: 'SalonIQ',
      detected: true,
      insights: [
        'Using SalonIQ by Salon Iris',
        'Professional booking system',
        'Good for multi-location businesses'
      ],
      recommendations: [
        'Optimize booking widget placement',
        'Use automated marketing features',
        'Enable online payments'
      ]
    }
  }
  
  // Timely Detection
  if (htmlLower.includes('gettimely.com') || 
      htmlLower.includes('book.gettimely')) {
    return {
      platform: 'Timely',
      detected: true,
      insights: [
        'Using Timely booking system',
        'Good all-round platform',
        'Integrated marketing tools'
      ],
      recommendations: [
        'Enable SMS reminders',
        'Use loyalty program features',
        'Set up package deals'
      ]
    }
  }
  
  // Booksy Detection
  if (htmlLower.includes('booksy.com') || 
      htmlLower.includes('booksy.net')) {
    return {
      platform: 'Booksy',
      detected: true,
      insights: [
        'Using Booksy marketplace',
        'Good for discovery',
        'Commission on marketplace bookings',
        'Mobile-first platform'
      ],
      recommendations: [
        'Encourage direct bookings to avoid fees',
        'Use Booksy for new customer acquisition only',
        'Build Instagram presence for direct traffic'
      ]
    }
  }
  
  // Calendly Detection (Generic)
  if (htmlLower.includes('calendly.com')) {
    return {
      platform: 'Calendly',
      detected: true,
      insights: [
        'Using generic Calendly (not industry-specific)',
        'Missing salon-specific features',
        'No integrated POS or inventory',
        'Basic scheduling only'
      ],
      recommendations: [
        'Upgrade to beauty-specific booking system',
        'Add deposit taking capability',
        'Implement proper CRM for customer history',
        'Consider Phorest or Fresha for industry features'
      ],
      competitiveAdvantage: 'Industry-specific booking increases conversions by 40%'
    }
  }
  
  // Square Appointments
  if (htmlLower.includes('square.site') || 
      htmlLower.includes('squareup.com')) {
    return {
      platform: 'Square Appointments',
      detected: true,
      insights: [
        'Using Square for bookings',
        'Integrated payments',
        'Good for simple setups',
        'Limited beauty features'
      ],
      recommendations: [
        'Add beauty-specific features',
        'Use Square marketing tools',
        'Enable prepayments'
      ]
    }
  }
  
  // SimplyBook.me
  if (htmlLower.includes('simplybook.me') || 
      htmlLower.includes('simplybook.it')) {
    return {
      platform: 'SimplyBook.me',
      detected: true,
      insights: [
        'Using SimplyBook.me',
        'Customizable booking system',
        'Good feature set',
        'White-label option available'
      ],
      recommendations: [
        'Customize booking flow for conversions',
        'Enable upselling features',
        'Add intake forms for new clients'
      ]
    }
  }
  
  // No booking system detected
  const bookingKeywords = ['book now', 'book online', 'book appointment', 'make a booking']
  const hasBookingIntent = bookingKeywords.some(keyword => htmlLower.includes(keyword))
  
  if (!hasBookingIntent) {
    return {
      platform: 'None Detected',
      detected: false,
      insights: [
        'No online booking system found',
        'Possibly using phone/email only',
        'Missing 24/7 booking capability',
        'Losing after-hours bookings'
      ],
      recommendations: [
        'Add online booking IMMEDIATELY',
        'You are losing 30-40% of potential bookings',
        'Customers expect instant booking',
        'Start with Fresha (free) or Phorest (professional)'
      ],
      competitiveAdvantage: 'Online booking can increase bookings by 40% immediately'
    }
  }
  
  // Generic booking form detected
  return {
    platform: 'Generic/Custom Form',
    detected: true,
    insights: [
      'Using basic contact form for bookings',
      'Manual processing required',
      'No automated confirmations',
      'High friction booking process'
    ],
    recommendations: [
      'Implement proper booking system',
      'Automate confirmations and reminders',
      'Enable online payments/deposits',
      'Reduce steps in booking process'
    ]
  }
}

/**
 * Extract booking URL if available
 */
function extractBookingUrl(html: string, platform: string): string | undefined {
  const patterns: Record<string, RegExp> = {
    treatwell: /https?:\/\/[^\s"']+treatwell[^\s"']*/i,
    phorest: /https?:\/\/[^\s"']+phorest[^\s"']*/i,
    fresha: /https?:\/\/[^\s"']+fresha[^\s"']*/i,
  }
  
  const pattern = patterns[platform]
  if (pattern) {
    const match = html.match(pattern)
    return match ? match[0] : undefined
  }
  
  return undefined
}

/**
 * Get insights for specific platform
 */
export function getBookingSystemInsights(platform: string): any {
  const insights: Record<string, any> = {
    'Treatwell': {
      pros: [
        'Wide marketplace reach',
        'Trusted brand',
        'Handles payments'
      ],
      cons: [
        '15-20% commission per booking',
        'Customers leave your site',
        'Limited customization',
        'Competing with other salons'
      ],
      monthlyLoss: '£500-2000 in commissions',
      alternative: 'Keep Treatwell for new customers, direct booking for regulars'
    },
    'Phorest': {
      pros: [
        'Industry-specific features',
        'Great reporting',
        'Marketing automation',
        'Own your data'
      ],
      cons: [
        'Monthly subscription cost',
        'Learning curve',
        'Can be complex'
      ],
      bestFor: 'Established salons wanting to scale'
    },
    'None': {
      impact: 'Losing 30-40% of potential bookings',
      urgency: 'Critical - implement immediately',
      quickFix: 'Start with Fresha (free) today',
      revenue: 'Could add £2000-5000/month in bookings'
    }
  }
  
  return insights[platform] || insights['None']
}

/**
 * Compare to competitors
 */
export function compareBookingSystems(yourSystem: string, competitorSystems: string[]): string {
  const systemRanking = {
    'Phorest': 10,
    'Timely': 9,
    'Fresha': 8,
    'SalonIQ': 8,
    'SimplyBook.me': 7,
    'Square': 6,
    'Booksy': 6,
    'Treatwell': 5, // Due to commission
    'Calendly': 4,
    'Generic/Custom Form': 3,
    'None Detected': 0
  }
  
  const yourScore = systemRanking[yourSystem] || 0
  const competitorScores = competitorSystems.map(s => systemRanking[s] || 0)
  const avgCompetitorScore = competitorScores.reduce((a, b) => a + b, 0) / competitorScores.length
  
  if (yourScore < avgCompetitorScore) {
    return `Your competitors have better booking systems. This affects conversion rates.`
  } else if (yourScore > avgCompetitorScore) {
    return `You have a competitive advantage with your booking system.`
  } else {
    return `You're on par with competitors for booking technology.`
  }
}