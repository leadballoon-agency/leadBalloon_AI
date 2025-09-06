import marketingKnowledge from '../knowledge-base/marketing-legends.json'

interface BusinessAnalysis {
  website: string
  industry: string
  targetMarket: string
  currentOffers: string[]
  competitors: string[]
  pricePoints: number[]
}

interface GeneratedOffer {
  headline: string
  subheadline: string
  valueStack: {
    item: string
    value: string
    description: string
  }[]
  pricing: {
    originalPrice: string
    offerPrice: string
    paymentPlan?: string
  }
  guarantee: string
  urgency: string
  scarcity: string
  bonuses: {
    name: string
    value: string
    description: string
  }[]
}

export class OfferGenerator {
  private knowledge = marketingKnowledge
  
  async analyzeWebsite(url: string): Promise<BusinessAnalysis> {
    // This would scrape the website and extract key information
    // Using AI to understand:
    // - What they sell
    // - Who they sell to
    // - Current pricing
    // - Value props
    // - Testimonials
    
    const response = await fetch('/api/analyze-website', {
      method: 'POST',
      body: JSON.stringify({ url })
    })
    
    return response.json()
  }
  
  async analyzeCompetitors(industry: string, location?: string) {
    // Query Facebook Ads Library API
    // Look for ads running 30+ days (proven winners)
    // Extract:
    // - Hooks that work
    // - Offers being made
    // - Price points
    // - Guarantees
    
    const fbAdsData = await this.queryFacebookAds(industry, location)
    const successfulAds = fbAdsData.filter(ad => ad.daysRunning > 30)
    
    return {
      topHooks: this.extractHooks(successfulAds),
      commonOffers: this.extractOffers(successfulAds),
      priceRanges: this.extractPrices(successfulAds),
      guarantees: this.extractGuarantees(successfulAds)
    }
  }
  
  generateOffer(analysis: BusinessAnalysis, style: 'hormozi' | 'brunson' | 'kennedy' = 'hormozi'): GeneratedOffer {
    const formula = this.knowledge.offer_formulas.hormozi_grand_slam
    const industry = this.knowledge.industry_templates[analysis.industry] || this.knowledge.industry_templates.business_coaching
    
    // Apply Hormozi's Value Equation
    const dreamOutcome = this.generateDreamOutcome(analysis)
    const valueStack = this.generateValueStack(analysis, dreamOutcome)
    
    // Calculate pricing using Dan Kennedy's LTV principle
    const pricing = this.calculatePricing(valueStack, analysis.pricePoints)
    
    // Add urgency/scarcity using Cialdini's principles
    const urgency = this.generateUrgency(analysis)
    const scarcity = this.generateScarcity(analysis)
    
    // Create guarantee using Hormozi's risk reversal
    const guarantee = this.generateGuarantee(dreamOutcome, analysis.industry)
    
    // Generate bonuses using Brunson's stack
    const bonuses = this.generateBonuses(analysis, dreamOutcome)
    
    return {
      headline: this.generateHeadline(dreamOutcome, analysis.targetMarket),
      subheadline: this.generateSubheadline(analysis),
      valueStack,
      pricing,
      guarantee,
      urgency,
      scarcity,
      bonuses
    }
  }
  
  private generateDreamOutcome(analysis: BusinessAnalysis): string {
    // Use AI to understand their deepest desire
    // Not just "lose weight" but "Feel confident at the beach"
    // Not just "make money" but "Quit your soul-sucking job"
    
    const templates = {
      weight_loss: [
        "Look stunning in any outfit",
        "Feel confident and sexy again",
        "Turn heads wherever you go"
      ],
      business: [
        "Fire your boss forever",
        "Work from anywhere in the world",
        "Build generational wealth"
      ],
      relationships: [
        "Find your perfect soulmate",
        "Reignite the passion",
        "Become absolutely irresistible"
      ]
    }
    
    return templates[analysis.industry]?.[0] || "Achieve your dream transformation"
  }
  
  private generateValueStack(analysis: BusinessAnalysis, dreamOutcome: string) {
    // Create 5-7 components that deliver the dream outcome
    // Each solving a specific problem
    
    return [
      {
        item: "Personalized Transformation Blueprint",
        value: "$2,997",
        description: "Custom roadmap designed specifically for your situation"
      },
      {
        item: "Weekly 1-on-1 Coaching Calls",
        value: "$3,997",
        description: "Direct access to expert guidance every single week"
      },
      {
        item: "24/7 Community Support",
        value: "$997",
        description: "Never feel alone on your journey"
      },
      {
        item: "Done-For-You Templates & Tools",
        value: "$1,997",
        description: "Everything you need, ready to use instantly"
      },
      {
        item: "Lifetime Updates & New Strategies",
        value: "$497/year",
        description: "Stay ahead with cutting-edge techniques"
      }
    ]
  }
  
  private calculatePricing(valueStack: any[], marketPrices: number[]) {
    const totalValue = valueStack.reduce((sum, item) => {
      const value = parseInt(item.value.replace(/\D/g, ''))
      return sum + value
    }, 0)
    
    // Hormozi: Price at 10-20% of total value
    const offerPrice = Math.round(totalValue * 0.15)
    
    // Russell Brunson: Offer payment plan at 20% premium
    const paymentPlan = Math.round(offerPrice * 1.2 / 3)
    
    return {
      originalPrice: `$${totalValue.toLocaleString()}`,
      offerPrice: `$${offerPrice.toLocaleString()}`,
      paymentPlan: `3 payments of $${paymentPlan}`
    }
  }
  
  private generateGuarantee(dreamOutcome: string, industry: string): string {
    const templates = {
      bold: `Get ${dreamOutcome} or pay nothing - plus we'll pay you $500 for wasting your time`,
      results: `See measurable results in 30 days or get every penny back`,
      double: `200% money-back guarantee - if you don't love it, get double your money back`
    }
    
    return templates.bold
  }
  
  private generateUrgency(analysis: BusinessAnalysis): string {
    const options = [
      "Enrollment closes in 72 hours",
      "Price increases to $X on Friday",
      "Bonuses expire at midnight",
      "Next group doesn't start for 3 months"
    ]
    
    return options[0]
  }
  
  private generateScarcity(analysis: BusinessAnalysis): string {
    const options = [
      "Only 12 spots available (7 already taken)",
      "Limited to 20 founding members",
      "Can only handle 10 clients with this level of attention",
      "First 50 people only at this price"
    ]
    
    return options[0]
  }
  
  private generateBonuses(analysis: BusinessAnalysis, dreamOutcome: string) {
    // Use Brunson's bonus stack formula
    return [
      {
        name: "Quick Start Accelerator",
        value: "$497",
        description: "Get your first win in 48 hours"
      },
      {
        name: "Mistake-Proof Checklist",
        value: "$297", 
        description: "Avoid the 27 most common failures"
      },
      {
        name: "Emergency Hotline Access",
        value: "$997",
        description: "Get unstuck instantly when you need it most"
      }
    ]
  }
  
  private generateHeadline(dreamOutcome: string, targetMarket: string): string {
    // John Carlton style: Call out market + Big promise + Timeframe
    return `Attention ${targetMarket}: ${dreamOutcome} In The Next 90 Days (Guaranteed)`
  }
  
  private generateSubheadline(analysis: BusinessAnalysis): string {
    return "Join 2,847+ people who've already transformed their lives with this proven system"
  }
  
  private async queryFacebookAds(industry: string, location?: string) {
    // This would integrate with Facebook Ads Library API
    // For now, return mock data
    return []
  }
  
  private extractHooks(ads: any[]) {
    // Extract opening hooks from ad copy
    return []
  }
  
  private extractOffers(ads: any[]) {
    // Extract what competitors are offering
    return []
  }
  
  private extractPrices(ads: any[]) {
    // Extract price points mentioned
    return []
  }
  
  private extractGuarantees(ads: any[]) {
    // Extract guarantee types
    return []
  }
}

// Usage example:
export async function generateOfferForBusiness(websiteUrl: string) {
  const generator = new OfferGenerator()
  
  // Step 1: Analyze their website
  const analysis = await generator.analyzeWebsite(websiteUrl)
  
  // Step 2: Research successful competitors
  const competitorData = await generator.analyzeCompetitors(analysis.industry)
  
  // Step 3: Generate offer using proven formulas
  const offer = generator.generateOffer(analysis, 'hormozi')
  
  // Step 4: Generate assessment questions to qualify leads
  const assessmentQuestions = generateAssessmentQuestions(analysis, offer)
  
  return {
    offer,
    assessmentQuestions,
    competitorInsights: competitorData
  }
}

function generateAssessmentQuestions(analysis: BusinessAnalysis, offer: GeneratedOffer) {
  // Generate qualification questions based on the offer
  return {
    step1: {
      question: "What's your biggest challenge right now?",
      options: analysis.industry === 'weight_loss' ? [
        "Can't lose the last 10-20 pounds",
        "No energy or motivation",
        "Tried everything, nothing works",
        "Don't know where to start"
      ] : []
    },
    step2: {
      question: marketingKnowledge.assessment_questions.qualification.budget.hormozi_style,
      options: marketingKnowledge.assessment_questions.qualification.budget.options
    },
    step3: {
      question: marketingKnowledge.assessment_questions.qualification.urgency.question,
      options: marketingKnowledge.assessment_questions.qualification.urgency.options
    },
    step4: {
      question: marketingKnowledge.assessment_questions.qualification.commitment.question,
      options: marketingKnowledge.assessment_questions.qualification.commitment.options
    }
  }
}