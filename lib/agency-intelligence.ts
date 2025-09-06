// Extract agency-level intelligence from Facebook Ads

export interface AgencyIntelligence {
  copyFormulas: {
    hooks: string[] // First lines that grab attention
    painPoints: string[] // Problems they agitate
    solutions: string[] // How they position the solution
    ctas: string[] // Call-to-action phrases
  }
  offerStructure: {
    leadMagnets: string[] // Free offers to get leads
    tripwires: string[] // Low-ticket offers
    core: string[] // Main offers
    guarantees: string[] // Risk reversal
  }
  creativePatterns: {
    hasVideo: boolean
    hasBeforeAfter: boolean
    hasTestimonials: boolean
    hasSocialProof: boolean
    visualStyle: string // minimal, bold, clinical, etc.
  }
  adStrategy: {
    numberOfVariations: number // More = active testing
    runningDuration: string // Longer = profitable
    updateFrequency: string // How often they refresh
    seasonalPatterns: boolean
  }
  estimatedSpend: {
    level: 'low' | 'medium' | 'high'
    reasoning: string
  }
}

export function extractAgencyIntelligence(ads: any[]): AgencyIntelligence {
  // Extract hooks (first 50 characters of each ad)
  const hooks = ads.map(ad => 
    ad.text?.substring(0, 50) || ''
  ).filter(Boolean)
  
  // Find pain point language
  const painKeywords = [
    'struggling', 'tired of', 'frustrated', 'worried',
    'embarrassed', 'hate', 'can\'t', 'won\'t', 'failed'
  ]
  
  const painPoints = ads.flatMap(ad => {
    const text = ad.text?.toLowerCase() || ''
    return painKeywords.filter(keyword => text.includes(keyword))
      .map(keyword => {
        const index = text.indexOf(keyword)
        return text.substring(index, index + 100)
      })
  })
  
  // Extract CTAs
  const ctas = ads.map(ad => ad.cta).filter(Boolean)
  
  // Analyze creative patterns
  const hasVideo = ads.some(ad => ad.hasVideo)
  const hasBeforeAfter = ads.some(ad => 
    ad.text?.toLowerCase().includes('before') && 
    ad.text?.toLowerCase().includes('after')
  )
  
  // Detect offer types
  const leadMagnets = ads.filter(ad => 
    ad.text?.toLowerCase().includes('free') ||
    ad.text?.toLowerCase().includes('download') ||
    ad.text?.toLowerCase().includes('guide')
  ).map(ad => ad.text?.substring(0, 100))
  
  // Estimate spend based on signals
  let spendLevel: 'low' | 'medium' | 'high' = 'low'
  let reasoning = ''
  
  if (ads.length > 10) {
    spendLevel = 'high'
    reasoning = 'Many active ads indicates significant budget'
  } else if (ads.length > 5) {
    spendLevel = 'medium'
    reasoning = 'Multiple ads shows consistent investment'
  } else {
    spendLevel = 'low'
    reasoning = 'Few ads suggests testing or low budget'
  }
  
  // Look for agency signatures
  const hasConsistentStyle = ads.every(ad => 
    ad.text?.includes('👉') || // Emoji patterns
    ad.text?.includes('✅') ||
    ad.text?.match(/^\[.*\]/) || // Bracket formulas
    ad.text?.match(/^ATTENTION:/) // Standard hooks
  )
  
  if (hasConsistentStyle) {
    reasoning += '. Consistent formatting suggests agency management'
  }
  
  return {
    copyFormulas: {
      hooks: [...new Set(hooks)],
      painPoints: [...new Set(painPoints)],
      solutions: extractSolutions(ads),
      ctas: [...new Set(ctas)]
    },
    offerStructure: {
      leadMagnets: leadMagnets.filter(Boolean) as string[],
      tripwires: extractTripwires(ads),
      core: extractCoreOffers(ads),
      guarantees: extractGuarantees(ads)
    },
    creativePatterns: {
      hasVideo,
      hasBeforeAfter,
      hasTestimonials: ads.some(ad => 
        ad.text?.toLowerCase().includes('testimonial') ||
        ad.text?.toLowerCase().includes('"')
      ),
      hasSocialProof: ads.some(ad =>
        ad.text?.match(/\d+\s*(clients|customers|patients|people)/) ||
        ad.text?.includes('⭐')
      ),
      visualStyle: detectVisualStyle(ads)
    },
    adStrategy: {
      numberOfVariations: ads.length,
      runningDuration: estimateDuration(ads),
      updateFrequency: 'Unknown without historical data',
      seasonalPatterns: detectSeasonalPatterns(ads)
    },
    estimatedSpend: {
      level: spendLevel,
      reasoning
    }
  }
}

function extractSolutions(ads: any[]): string[] {
  const solutionKeywords = ['get', 'achieve', 'transform', 'discover', 'unlock']
  return ads.flatMap(ad => {
    const text = ad.text?.toLowerCase() || ''
    return solutionKeywords.filter(keyword => text.includes(keyword))
      .map(keyword => {
        const index = text.indexOf(keyword)
        return text.substring(index, Math.min(index + 80, text.length))
      })
  })
}

function extractTripwires(ads: any[]): string[] {
  return ads.filter(ad => {
    const text = ad.text?.toLowerCase() || ''
    return text.match(/[£$]\d{1,2}/) || // Under £/$ 100
           text.includes('trial') ||
           text.includes('sample')
  }).map(ad => ad.text?.substring(0, 100) || '').filter(Boolean)
}

function extractCoreOffers(ads: any[]): string[] {
  return ads.filter(ad => {
    const text = ad.text?.toLowerCase() || ''
    return text.match(/[£$]\d{3,}/) || // £/$100+
           text.includes('package') ||
           text.includes('program')
  }).map(ad => ad.text?.substring(0, 100) || '').filter(Boolean)
}

function extractGuarantees(ads: any[]): string[] {
  const guarantees = ads.filter(ad => {
    const text = ad.text?.toLowerCase() || ''
    return text.includes('guarantee') ||
           text.includes('refund') ||
           text.includes('risk-free')
  }).map(ad => {
    const text = ad.text || ''
    const index = text.toLowerCase().indexOf('guarante')
    if (index > -1) {
      return text.substring(index, Math.min(index + 100, text.length))
    }
    return ''
  }).filter(Boolean)
  
  return [...new Set(guarantees)]
}

function detectVisualStyle(ads: any[]): string {
  if (ads.every(ad => ad.hasVideo)) return 'video-heavy'
  if (ads.some(ad => ad.text?.includes('⚡') || ad.text?.includes('🔥'))) return 'bold-energetic'
  if (ads.some(ad => ad.text?.includes('Dr.') || ad.text?.includes('MD'))) return 'clinical-medical'
  if (ads.some(ad => ad.text?.length || 0 > 500)) return 'long-form-educational'
  return 'standard-mixed'
}

function estimateDuration(ads: any[]): string {
  // Look for date patterns in ad start dates
  const dates = ads.map(ad => ad.startDate).filter(Boolean)
  if (dates.some(date => date?.includes('2023'))) return '1+ years (long-term winner)'
  if (dates.some(date => date?.includes('months'))) return '3-6 months (proven performer)'
  return 'Recent launch or testing'
}

function detectSeasonalPatterns(ads: any[]): boolean {
  const seasonalKeywords = [
    'summer', 'winter', 'spring', 'christmas', 'new year',
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
    'holiday', 'black friday', 'cyber monday'
  ]
  
  return ads.some(ad => {
    const text = ad.text?.toLowerCase() || ''
    return seasonalKeywords.some(keyword => text.includes(keyword))
  })
}

// Generate insights from agency intelligence
export function generateAgencyInsights(intel: AgencyIntelligence): string {
  const insights = []
  
  // Spend level insight
  if (intel.estimatedSpend.level === 'high') {
    insights.push(`💰 Heavy spender: ${intel.estimatedSpend.reasoning}. They're investing serious money - their offers must convert!`)
  }
  
  // Creative insights
  if (intel.creativePatterns.hasVideo) {
    insights.push('🎥 Video-first strategy: Higher production costs = likely agency-managed')
  }
  
  // Copy insights
  if (intel.copyFormulas.hooks.length > 5) {
    insights.push(`📝 Testing ${intel.copyFormulas.hooks.length} different hooks - they're optimizing hard`)
  }
  
  // Offer insights
  if (intel.offerStructure.leadMagnets.length > 0) {
    insights.push('🎁 Lead magnet funnel detected - they\'re building an email list first')
  }
  
  if (intel.offerStructure.guarantees.length > 0) {
    insights.push('✅ Strong guarantees used - they\'re confident in their service')
  }
  
  // Strategy insights
  if (intel.adStrategy.numberOfVariations > 10) {
    insights.push('🧪 Heavy A/B testing - likely agency with data-driven approach')
  }
  
  return insights.join('\n\n')
}

// Reverse-engineer their funnel
export function reverseEngineerFunnel(intel: AgencyIntelligence) {
  return {
    stage1_awareness: intel.copyFormulas.hooks,
    stage2_interest: intel.copyFormulas.painPoints,
    stage3_consideration: intel.offerStructure.core,
    stage4_conversion: {
      guarantees: intel.offerStructure.guarantees,
      urgency: intel.copyFormulas.ctas
    },
    estimatedConversionRate: intel.estimatedSpend.level === 'high' ? 'High (they keep spending)' : 'Testing phase',
    recommendedStrategy: `Beat them by: ${
      intel.offerStructure.guarantees.length === 0 ? 'Adding stronger guarantees' :
      intel.offerStructure.leadMagnets.length === 0 ? 'Offering a valuable lead magnet' :
      intel.creativePatterns.hasVideo ? 'Creating better video content' :
      'Stacking more value at a lower price point'
    }`
  }
}