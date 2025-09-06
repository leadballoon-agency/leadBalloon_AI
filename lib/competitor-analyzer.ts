/**
 * Competitor Analysis Engine
 * Automatically researches successful competitors to extract winning strategies
 */

export interface CompetitorAd {
  id: string
  pageId: string
  pageName: string
  adCreativeBody: string
  adCreativeTitle: string
  adCreativeLinkCaption: string
  startDate: Date
  endDate?: Date
  daysRunning: number
  impressions?: string
  spend?: string
  platforms: string[]
  demographics?: {
    ageRange?: string
    gender?: string
    location?: string
  }
}

export interface CompetitorInsights {
  topPerformers: CompetitorAd[]
  hooks: string[]
  offers: string[]
  guarantees: string[]
  pricePoints: number[]
  urgencyTactics: string[]
  socialProof: string[]
  valueProps: string[]
}

export class CompetitorAnalyzer {
  private fbAccessToken: string = process.env.FB_ACCESS_TOKEN || ''
  private fbAdLibraryUrl = 'https://graph.facebook.com/v18.0/ads_archive'
  
  /**
   * Find successful competitor ads (running 30+ days = winners)
   */
  async findWinningAds(industry: string, location: string = 'US'): Promise<CompetitorAd[]> {
    const searchTerms = this.getIndustrySearchTerms(industry)
    const allAds: CompetitorAd[] = []
    
    for (const term of searchTerms) {
      const ads = await this.searchFacebookAds(term, location)
      allAds.push(...ads)
    }
    
    // Filter for ads running 30+ days (proven winners)
    const winningAds = allAds.filter(ad => ad.daysRunning >= 30)
    
    // Sort by days running (longest first = most successful)
    return winningAds.sort((a, b) => b.daysRunning - a.daysRunning)
  }
  
  /**
   * Extract insights from winning ads
   */
  extractInsights(ads: CompetitorAd[]): CompetitorInsights {
    return {
      topPerformers: ads.slice(0, 10),
      hooks: this.extractHooks(ads),
      offers: this.extractOffers(ads),
      guarantees: this.extractGuarantees(ads),
      pricePoints: this.extractPrices(ads),
      urgencyTactics: this.extractUrgency(ads),
      socialProof: this.extractSocialProof(ads),
      valueProps: this.extractValueProps(ads)
    }
  }
  
  /**
   * Extract opening hooks (first line/sentence)
   */
  private extractHooks(ads: CompetitorAd[]): string[] {
    const hooks = new Set<string>()
    
    ads.forEach(ad => {
      const firstLine = ad.adCreativeBody.split('\n')[0]
      if (firstLine.length > 10) {
        hooks.add(firstLine)
      }
      
      // Look for question hooks
      const questions = ad.adCreativeBody.match(/^.*\?/gm)
      questions?.forEach(q => hooks.add(q))
      
      // Look for "How to" hooks
      const howTo = ad.adCreativeBody.match(/How to .+/gi)
      howTo?.forEach(h => hooks.add(h))
    })
    
    return Array.from(hooks).slice(0, 20)
  }
  
  /**
   * Extract offer statements
   */
  private extractOffers(ads: CompetitorAd[]): string[] {
    const offers = new Set<string>()
    const offerPatterns = [
      /get .+ for (free|only)/gi,
      /save \$?\d+/gi,
      /\d+% off/gi,
      /free .+ when/gi,
      /limited time/gi,
      /special offer/gi,
      /today only/gi
    ]
    
    ads.forEach(ad => {
      offerPatterns.forEach(pattern => {
        const matches = ad.adCreativeBody.match(pattern)
        matches?.forEach(m => offers.add(m))
      })
    })
    
    return Array.from(offers)
  }
  
  /**
   * Extract guarantee statements
   */
  private extractGuarantees(ads: CompetitorAd[]): string[] {
    const guarantees = new Set<string>()
    const guaranteePatterns = [
      /guarantee/gi,
      /money back/gi,
      /risk.?free/gi,
      /no obligation/gi,
      /cancel anytime/gi,
      /or your money back/gi,
      /100% satisfaction/gi
    ]
    
    ads.forEach(ad => {
      guaranteePatterns.forEach(pattern => {
        const sentences = ad.adCreativeBody.split(/[.!?]/)
        sentences.forEach(sentence => {
          if (pattern.test(sentence)) {
            guarantees.add(sentence.trim())
          }
        })
      })
    })
    
    return Array.from(guarantees)
  }
  
  /**
   * Extract price points mentioned
   */
  private extractPrices(ads: CompetitorAd[]): number[] {
    const prices = new Set<number>()
    const pricePattern = /\$\d+(?:,\d{3})*(?:\.\d{2})?/g
    
    ads.forEach(ad => {
      const matches = ad.adCreativeBody.match(pricePattern)
      matches?.forEach(match => {
        const price = parseFloat(match.replace(/[$,]/g, ''))
        if (price > 0 && price < 100000) {
          prices.add(price)
        }
      })
    })
    
    return Array.from(prices).sort((a, b) => a - b)
  }
  
  /**
   * Extract urgency tactics
   */
  private extractUrgency(ads: CompetitorAd[]): string[] {
    const urgency = new Set<string>()
    const urgencyPatterns = [
      /only \d+ (spots|seats|left)/gi,
      /expires? .+/gi,
      /ends .+/gi,
      /last chance/gi,
      /final (hours|days)/gi,
      /closes? .+/gi,
      /limited time/gi,
      /act now/gi,
      /don't miss/gi
    ]
    
    ads.forEach(ad => {
      urgencyPatterns.forEach(pattern => {
        const matches = ad.adCreativeBody.match(pattern)
        matches?.forEach(m => urgency.add(m))
      })
    })
    
    return Array.from(urgency)
  }
  
  /**
   * Extract social proof elements
   */
  private extractSocialProof(ads: CompetitorAd[]): string[] {
    const socialProof = new Set<string>()
    const proofPatterns = [
      /\d+[,\d]* (customers|clients|students|members)/gi,
      /\d+[,\d]* people/gi,
      /\d+ (star|⭐)/gi,
      /testimonial/gi,
      /featured in/gi,
      /as seen on/gi,
      /trusted by/gi,
      /\d+[,\d]* reviews/gi
    ]
    
    ads.forEach(ad => {
      proofPatterns.forEach(pattern => {
        const matches = ad.adCreativeBody.match(pattern)
        matches?.forEach(m => socialProof.add(m))
      })
    })
    
    return Array.from(socialProof)
  }
  
  /**
   * Extract value propositions
   */
  private extractValueProps(ads: CompetitorAd[]): string[] {
    const valueProps = new Set<string>()
    const valuePropPatterns = [
      /without .+/gi,
      /even if .+/gi,
      /no .+ required/gi,
      /in just \d+/gi,
      /proven .+/gi,
      /secret .+/gi,
      /discover .+/gi,
      /transform .+/gi
    ]
    
    ads.forEach(ad => {
      valuePropPatterns.forEach(pattern => {
        const matches = ad.adCreativeBody.match(pattern)
        matches?.forEach(m => valueProps.add(m))
      })
    })
    
    return Array.from(valueProps)
  }
  
  /**
   * Get industry-specific search terms
   */
  private getIndustrySearchTerms(industry: string): string[] {
    const terms: Record<string, string[]> = {
      weight_loss: [
        'weight loss',
        'lose weight',
        'fat loss',
        'diet plan',
        'fitness program',
        'body transformation'
      ],
      business: [
        'make money online',
        'business coaching',
        'entrepreneur',
        'passive income',
        'side hustle',
        'financial freedom'
      ],
      relationships: [
        'dating advice',
        'relationship coaching',
        'find love',
        'marriage help',
        'dating tips'
      ],
      health: [
        'health coaching',
        'wellness program',
        'nutrition plan',
        'fitness coaching',
        'health transformation'
      ],
      real_estate: [
        'real estate investing',
        'property investment',
        'wholesale real estate',
        'house flipping',
        'rental property'
      ]
    }
    
    return terms[industry] || terms.business
  }
  
  /**
   * Query Facebook Ads Library
   */
  private async searchFacebookAds(searchTerm: string, location: string): Promise<CompetitorAd[]> {
    // This would make actual API calls to Facebook Ads Library
    // For now, returning mock structure
    
    const params = new URLSearchParams({
      access_token: this.fbAccessToken,
      ad_reached_countries: location,
      search_terms: searchTerm,
      ad_active_status: 'ACTIVE',
      fields: 'id,ad_creative_body,ad_creative_link_caption,ad_creative_link_title,page_name,page_id,start_date,end_date,impressions,spend,demographics,platforms',
      limit: '100'
    })
    
    try {
      const response = await fetch(`${this.fbAdLibraryUrl}?${params}`)
      const data = await response.json()
      
      return data.data?.map((ad: any) => ({
        id: ad.id,
        pageId: ad.page_id,
        pageName: ad.page_name,
        adCreativeBody: ad.ad_creative_body || '',
        adCreativeTitle: ad.ad_creative_link_title || '',
        adCreativeLinkCaption: ad.ad_creative_link_caption || '',
        startDate: new Date(ad.start_date),
        endDate: ad.end_date ? new Date(ad.end_date) : undefined,
        daysRunning: this.calculateDaysRunning(ad.start_date, ad.end_date),
        impressions: ad.impressions,
        spend: ad.spend,
        platforms: ad.platforms || [],
        demographics: ad.demographics
      })) || []
    } catch (error) {
      console.error('Facebook Ads Library API error:', error)
      return []
    }
  }
  
  /**
   * Calculate how many days an ad has been running
   */
  private calculateDaysRunning(startDate: string, endDate?: string): number {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
}

// Usage example
export async function analyzeCompetition(industry: string) {
  const analyzer = new CompetitorAnalyzer()
  
  // Find winning ads
  const winningAds = await analyzer.findWinningAds(industry)
  
  // Extract insights
  const insights = analyzer.extractInsights(winningAds)
  
  // Generate report
  return {
    summary: {
      adsAnalyzed: winningAds.length,
      averageDaysRunning: Math.round(
        winningAds.reduce((sum, ad) => sum + ad.daysRunning, 0) / winningAds.length
      ),
      topCompetitors: Array.from(new Set(winningAds.map(ad => ad.pageName))).slice(0, 10)
    },
    insights,
    recommendations: generateRecommendations(insights)
  }
}

function generateRecommendations(insights: CompetitorInsights) {
  return {
    hooks: `Use these proven hooks: ${insights.hooks.slice(0, 3).join(', ')}`,
    pricing: `Market is accepting prices between $${Math.min(...insights.pricePoints)} - $${Math.max(...insights.pricePoints)}`,
    urgency: `Effective urgency tactics: ${insights.urgencyTactics.slice(0, 3).join(', ')}`,
    socialProof: `Include social proof like: ${insights.socialProof.slice(0, 3).join(', ')}`
  }
}