/**
 * Knowledge Import System
 * Import and validate existing niche data to seed the knowledge bank
 * Supports multiple formats and builds intelligence files
 */

import { NicheIntelligenceFile, MarketResearch, CompetitorProfile } from './niche-intelligence-builder'
import { WinningAd } from './winning-ads-database'

export interface ImportResult {
  success: boolean
  imported: {
    niches: number
    competitors: number
    ads: number
    insights: number
  }
  errors: string[]
  warnings: string[]
}

export class KnowledgeImportSystem {
  private validationErrors: string[] = []
  private validationWarnings: string[] = []
  
  /**
   * Import data from multiple formats
   */
  async importKnowledge(
    data: any,
    format: 'json' | 'csv' | 'markdown' | 'raw'
  ): Promise<ImportResult> {
    this.validationErrors = []
    this.validationWarnings = []
    
    try {
      let processedData: any
      
      switch (format) {
        case 'json':
          processedData = await this.processJSON(data)
          break
        case 'csv':
          processedData = await this.processCSV(data)
          break
        case 'markdown':
          processedData = await this.processMarkdown(data)
          break
        case 'raw':
          processedData = await this.processRawText(data)
          break
      }
      
      // Build intelligence files from imported data
      const intelligenceFiles = await this.buildIntelligenceFiles(processedData)
      
      // Store in knowledge bank
      const stored = await this.storeInKnowledgeBank(intelligenceFiles)
      
      return {
        success: true,
        imported: {
          niches: intelligenceFiles.length,
          competitors: this.countCompetitors(intelligenceFiles),
          ads: this.countAds(intelligenceFiles),
          insights: this.countInsights(intelligenceFiles)
        },
        errors: this.validationErrors,
        warnings: this.validationWarnings
      }
    } catch (error) {
      return {
        success: false,
        imported: { niches: 0, competitors: 0, ads: 0, insights: 0 },
        errors: [...this.validationErrors, error.message],
        warnings: this.validationWarnings
      }
    }
  }
  
  /**
   * Process JSON format (most flexible)
   */
  private async processJSON(data: any): Promise<ProcessedImport[]> {
    const imports: ProcessedImport[] = []
    
    // Handle different JSON structures
    if (Array.isArray(data)) {
      // Array of niches/competitors/ads
      for (const item of data) {
        imports.push(await this.parseJSONItem(item))
      }
    } else if (data.niches) {
      // Structured with niches key
      for (const niche of data.niches) {
        imports.push(await this.parseNiche(niche))
      }
    } else if (data.competitors) {
      // Just competitors
      imports.push({
        niche: this.extractNicheFromCompetitors(data.competitors),
        competitors: data.competitors,
        ads: data.ads || [],
        insights: data.insights || []
      })
    } else {
      // Single niche object
      imports.push(await this.parseJSONItem(data))
    }
    
    return imports
  }
  
  /**
   * Process CSV format (structured data)
   */
  private async processCSV(csvData: string): Promise<ProcessedImport[]> {
    const lines = csvData.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const imports: ProcessedImport[] = []
    const nicheMap = new Map<string, ProcessedImport>()
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i])
      const row: any = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index]
      })
      
      // Group by niche
      const niche = row.niche || row.industry || row.market || 'general'
      
      if (!nicheMap.has(niche)) {
        nicheMap.set(niche, {
          niche,
          competitors: [],
          ads: [],
          insights: []
        })
      }
      
      const nicheData = nicheMap.get(niche)!
      
      // Add competitor if present
      if (row.competitor || row.website) {
        nicheData.competitors.push({
          name: row.competitor || row.company || 'Unknown',
          url: row.website || row.url || '',
          strengths: this.parseList(row.strengths),
          weaknesses: this.parseList(row.weaknesses),
          pricing: row.pricing,
          offer: row.offer
        })
      }
      
      // Add ad if present
      if (row.ad_headline || row.ad_copy) {
        nicheData.ads.push({
          headline: row.ad_headline,
          copy: row.ad_copy,
          cta: row.ad_cta,
          performance: row.ad_performance
        })
      }
      
      // Add insights
      if (row.insight || row.finding) {
        nicheData.insights.push(row.insight || row.finding)
      }
    }
    
    nicheMap.forEach(value => imports.push(value))
    return imports
  }
  
  /**
   * Process Markdown format (notes/documentation)
   */
  private async processMarkdown(mdData: string): Promise<ProcessedImport[]> {
    const imports: ProcessedImport[] = []
    const sections = mdData.split(/^#{1,2}\s/m)
    
    for (const section of sections) {
      if (!section.trim()) continue
      
      const lines = section.split('\n')
      const title = lines[0].trim()
      const content = lines.slice(1).join('\n')
      
      // Detect niche from title
      const niche = this.extractNicheFromTitle(title)
      
      const processed: ProcessedImport = {
        niche,
        competitors: this.extractCompetitorsFromMD(content),
        ads: this.extractAdsFromMD(content),
        insights: this.extractInsightsFromMD(content)
      }
      
      if (processed.competitors.length || processed.ads.length || processed.insights.length) {
        imports.push(processed)
      }
    }
    
    return imports
  }
  
  /**
   * Process raw text with AI assistance
   */
  private async processRawText(text: string): Promise<ProcessedImport[]> {
    // Use AI to extract structured data from unstructured text
    const prompt = `Extract competitors, winning ads, and market insights from this text.
    Format as JSON with: niche, competitors (name, url, strengths, weaknesses), 
    ads (headline, copy, performance), and insights.
    
    Text: ${text}`
    
    // Would call AI here to structure the data
    // For now, basic extraction
    const imports: ProcessedImport[] = []
    
    // Extract URLs as potential competitors
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = text.match(urlRegex) || []
    
    const competitors = urls.map(url => ({
      name: new URL(url).hostname.replace('www.', ''),
      url,
      strengths: [],
      weaknesses: [],
      pricing: '',
      offer: ''
    }))
    
    // Extract insights (lines with keywords)
    const insightKeywords = ['found', 'discovered', 'learned', 'insight', 'tip', 'strategy']
    const lines = text.split('\n')
    const insights = lines.filter(line => 
      insightKeywords.some(keyword => line.toLowerCase().includes(keyword))
    )
    
    if (competitors.length || insights.length) {
      imports.push({
        niche: 'imported',
        competitors,
        ads: [],
        insights
      })
    }
    
    return imports
  }
  
  /**
   * Parse JSON item into ProcessedImport
   */
  private async parseJSONItem(item: any): Promise<ProcessedImport> {
    return {
      niche: item.niche || item.industry || item.market || 'general',
      competitors: this.parseCompetitors(item.competitors || []),
      ads: this.parseAds(item.ads || item.winning_ads || []),
      insights: this.parseInsights(item.insights || item.learnings || [])
    }
  }
  
  /**
   * Parse niche data
   */
  private async parseNiche(nicheData: any): Promise<ProcessedImport> {
    return {
      niche: nicheData.name || nicheData.niche,
      competitors: this.parseCompetitors(nicheData.competitors || []),
      ads: this.parseAds(nicheData.ads || []),
      insights: this.parseInsights(nicheData.insights || [])
    }
  }
  
  /**
   * Build intelligence files from processed imports
   */
  private async buildIntelligenceFiles(
    imports: ProcessedImport[]
  ): Promise<NicheIntelligenceFile[]> {
    const files: NicheIntelligenceFile[] = []
    
    // Group by niche
    const nicheMap = new Map<string, ProcessedImport[]>()
    
    for (const imp of imports) {
      const existing = nicheMap.get(imp.niche) || []
      existing.push(imp)
      nicheMap.set(imp.niche, existing)
    }
    
    // Build file for each niche
    for (const [niche, imports] of Array.from(nicheMap)) {
      const file = await this.mergeImportsToFile(niche, imports)
      files.push(file)
    }
    
    return files
  }
  
  /**
   * Merge multiple imports for same niche
   */
  private async mergeImportsToFile(
    niche: string,
    imports: ProcessedImport[]
  ): Promise<NicheIntelligenceFile> {
    const file: NicheIntelligenceFile = {
      id: `${niche}_${Date.now()}`,
      niche,
      location: 'Global',
      lastUpdated: new Date(),
      
      marketResearch: {
        marketSize: '',
        growthRate: '',
        seasonality: [],
        regulations: [],
        averageCustomerValue: '',
        customerLifetime: '',
        primaryPainPoints: [],
        secondaryPainPoints: [],
        hiddenPainPoints: [],
        surfaceDesires: [],
        deepDesires: [],
        emotionalTriggers: [],
        logicalJustifications: [],
        urgencyTriggers: []
      },
      
      competitorAnalysis: this.mergeCompetitors(imports),
      
      winningAds: {
        totalAdsAnalyzed: this.mergeAds(imports).length,
        platforms: ['facebook', 'google'],
        topPerformers: [],
        commonHeadlines: [],
        commonOffers: [],
        commonCTAs: [],
        emotionalTriggers: [],
        urgencyTypes: [],
        workingFormulas: []
      },
      
      pricingStrategy: {
        marketPriceRange: {
          low: '£0',
          average: '£0',
          high: '£0',
          premium: '£0'
        },
        competitorPricing: [],
        recommendedPricing: {
          entry: '£0',
          core: '£0',
          premium: '£0',
          justification: ''
        },
        valueStack: [],
        priceAnchoring: [],
        paymentOptions: []
      },
      
      offers: {
        dreamOutcome: '',
        perceivedLikelihood: '',
        timeDelay: '',
        effortAndSacrifice: '',
        offers: [],
        seasonal: [],
        promotional: [],
        backend: []
      },
      
      copy: {
        headlines: [],
        emailTemplates: [],
        landingPages: [],
        adTemplates: []
      },
      
      dataQuality: 'basic' as const,
      
      // AI + Manual Augmentation
      aiInsights: {
        gpt4Analysis: null,
        claudeAnalysis: null,
        uniqueAngles: [],
        positioningOptions: [],
        contentTopics: [],
        hookIdeas: []
      },
      
      manualResearch: {
        researcher: '',
        hoursSpent: 0,
        discoveries: [],
        competitorIntel: [],
        insiderInfo: [],
        communityInsights: []
      },
      
      // Growing Knowledge Base
      customerResults: [],
      
      patterns: {
        winningPatterns: [],
        losingPatterns: [],
        seasonalTrends: []
      },
      
      opportunities: {
        gaps: [],
        blueOceans: [],
        emergingTrends: [],
        disruptionPotential: []
      }
    }
    
    return file
  }
  
  /**
   * Helper methods for parsing and extraction
   */
  private parseCompetitors(data: any[]): any[] {
    return data.map(c => ({
      name: c.name || c.competitor || 'Unknown',
      url: c.url || c.website || '',
      strengths: c.strengths || [],
      weaknesses: c.weaknesses || [],
      pricing: c.pricing || '',
      offer: c.offer || c.main_offer || ''
    }))
  }
  
  private parseAds(data: any[]): any[] {
    return data.map(ad => ({
      headline: ad.headline || ad.title || '',
      copy: ad.copy || ad.body || ad.text || '',
      cta: ad.cta || ad.call_to_action || '',
      performance: ad.performance || ad.metrics || {}
    }))
  }
  
  private parseInsights(data: any[]): string[] {
    if (typeof data === 'string') return [data]
    if (Array.isArray(data)) {
      return data.map(i => typeof i === 'string' ? i : i.text || i.insight || JSON.stringify(i))
    }
    return []
  }
  
  private parseList(value: string): string[] {
    if (!value) return []
    return value.split(/[,;|]/).map(v => v.trim()).filter(v => v)
  }
  
  private parseCSVLine(line: string): string[] {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    values.push(current.trim())
    return values
  }
  
  private extractNicheFromTitle(title: string): string {
    // Common patterns: "Fitness Industry", "E-commerce Analysis", etc.
    const cleaned = title
      .toLowerCase()
      .replace(/analysis|research|report|study|market/gi, '')
      .trim()
    
    return cleaned || 'general'
  }
  
  private extractNicheFromCompetitors(competitors: any[]): string {
    // Try to infer niche from competitor domains
    if (!competitors.length) return 'general'
    
    const domains = competitors
      .map(c => c.url || c.website)
      .filter(Boolean)
      .map(url => new URL(url).hostname)
    
    // Look for common keywords
    // This would be more sophisticated in production
    return 'imported'
  }
  
  private extractCompetitorsFromMD(content: string): any[] {
    const competitors: any[] = []
    const lines = content.split('\n')
    
    // Look for competitor patterns
    const competitorRegex = /^[\*\-]\s*(.*?):\s*(https?:\/\/[^\s]+)/gm
    const matches = Array.from(content.matchAll(competitorRegex))
    
    for (const match of matches) {
      competitors.push({
        name: match[1].trim(),
        url: match[2].trim(),
        strengths: [],
        weaknesses: [],
        pricing: '',
        offer: ''
      })
    }
    
    return competitors
  }
  
  private extractAdsFromMD(content: string): any[] {
    const ads: any[] = []
    
    // Look for headline patterns
    const headlineRegex = /headline[:\s]+"([^"]+)"/gi
    const copyRegex = /copy[:\s]+"([^"]+)"/gi
    
    const headlines = Array.from(content.matchAll(headlineRegex))
    const copies = Array.from(content.matchAll(copyRegex))
    
    for (let i = 0; i < Math.max(headlines.length, copies.length); i++) {
      ads.push({
        headline: headlines[i]?.[1] || '',
        copy: copies[i]?.[1] || '',
        cta: '',
        performance: {}
      })
    }
    
    return ads
  }
  
  private extractInsightsFromMD(content: string): string[] {
    const insights: string[] = []
    const lines = content.split('\n')
    
    // Look for insight patterns
    const insightPatterns = [
      /^[\*\-]\s*Insight:\s*(.+)/i,
      /^[\*\-]\s*Learning:\s*(.+)/i,
      /^[\*\-]\s*Found:\s*(.+)/i,
      /^[\*\-]\s*Key finding:\s*(.+)/i
    ]
    
    for (const line of lines) {
      for (const pattern of insightPatterns) {
        const match = line.match(pattern)
        if (match) {
          insights.push(match[1])
          break
        }
      }
    }
    
    return insights
  }
  
  private extractKeywords(imports: ProcessedImport[]): string[] {
    const keywords = new Set<string>()
    
    // Extract from competitor names and insights
    for (const imp of imports) {
      // From competitors
      imp.competitors.forEach(c => {
        const words = c.name.toLowerCase().split(/\s+/)
        words.forEach(w => keywords.add(w))
      })
      
      // From insights
      imp.insights.forEach(insight => {
        const words = insight.toLowerCase().split(/\s+/)
        words.filter(w => w.length > 4).forEach(w => keywords.add(w))
      })
    }
    
    return Array.from(keywords)
  }
  
  private mergeCompetitors(imports: ProcessedImport[]): CompetitorProfile[] {
    const competitorMap = new Map<string, any>()
    
    for (const imp of imports) {
      for (const comp of imp.competitors) {
        const key = comp.url || comp.name
        if (!competitorMap.has(key)) {
          competitorMap.set(key, comp)
        } else {
          // Merge data
          const existing = competitorMap.get(key)
          existing.strengths = Array.from(new Set([...existing.strengths, ...comp.strengths]))
          existing.weaknesses = Array.from(new Set([...existing.weaknesses, ...comp.weaknesses]))
          if (!existing.pricing && comp.pricing) existing.pricing = comp.pricing
          if (!existing.offer && comp.offer) existing.offer = comp.offer
        }
      }
    }
    
    return Array.from(competitorMap.values())
  }
  
  private mergeAds(imports: ProcessedImport[]): WinningAd[] {
    const ads: WinningAd[] = []
    
    for (const imp of imports) {
      for (const ad of imp.ads) {
        ads.push({
          id: `import_${Date.now()}_${Math.random()}`,
          title: ad.headline || 'Imported Ad',
          advertiser: imp.niche,
          industry: imp.niche,
          platform: 'facebook' as const,
          headline: ad.headline,
          bodyCopy: ad.copy,
          cta: ad.cta || '',
          analysis: {
            hook: ad.headline || '',
            emotionalTriggers: [],
            persuasionTechniques: [],
            valueProposition: '',
            urgencyElements: [],
            socialProof: []
          },
          whyItWorks: [],
          swipeNotes: [],
          dateCollected: new Date().toISOString()
        })
      }
    }
    
    return ads
  }
  
  private mergeInsights(imports: ProcessedImport[]): string[] {
    const insights = new Set<string>()
    
    for (const imp of imports) {
      imp.insights.forEach(i => insights.add(i))
    }
    
    return Array.from(insights)
  }
  
  private calculateDataQuality(imports: ProcessedImport[]): number {
    let score = 0
    let factors = 0
    
    for (const imp of imports) {
      // Has competitors
      if (imp.competitors.length > 0) {
        score += 20
        factors++
      }
      
      // Has ads
      if (imp.ads.length > 0) {
        score += 30
        factors++
      }
      
      // Has insights
      if (imp.insights.length > 0) {
        score += 20
        factors++
      }
      
      // Competitor quality
      const competitorsWithUrls = imp.competitors.filter(c => c.url).length
      if (competitorsWithUrls > 0) {
        score += 30
        factors++
      }
    }
    
    return factors > 0 ? Math.round(score / factors) : 0
  }
  
  private calculateCompleteness(imports: ProcessedImport[]): number {
    let complete = 0
    let total = 0
    
    for (const imp of imports) {
      total += 3 // competitors, ads, insights
      
      if (imp.competitors.length > 0) complete++
      if (imp.ads.length > 0) complete++
      if (imp.insights.length > 0) complete++
    }
    
    return total > 0 ? Math.round((complete / total) * 100) : 0
  }
  
  private countCompetitors(files: NicheIntelligenceFile[]): number {
    return files.reduce((sum, f) => sum + f.competitorAnalysis.length, 0)
  }
  
  private countAds(files: NicheIntelligenceFile[]): number {
    return files.reduce((sum, f) => sum + f.winningAds.totalAdsAnalyzed, 0)
  }
  
  private countInsights(files: NicheIntelligenceFile[]): number {
    return files.reduce((sum, f) => sum + (f.aiInsights.uniqueAngles?.length || 0), 0)
  }
  
  /**
   * Store in knowledge bank (would connect to database)
   */
  private async storeInKnowledgeBank(
    files: NicheIntelligenceFile[]
  ): Promise<boolean> {
    // In production, this would save to database
    // For now, save to local storage or file system
    
    for (const file of files) {
      const key = `niche_intelligence_${file.niche}`
      // Store logic here
      console.log(`Storing ${key}:`, file)
    }
    
    return true
  }
}

interface ProcessedImport {
  niche: string
  competitors: any[]
  ads: any[]
  insights: string[]
}

/**
 * Import templates for common formats
 */
export const ImportTemplates = {
  competitors: {
    csv: `niche,competitor,website,pricing,strengths,weaknesses
fitness,PelotonDigital,https://onepeloton.com,"$12.99/mo","Community,Content,Brand","Price,Equipment needed"
fitness,BeachbodyOnDemand,https://beachbodyondemand.com,"$99/year","Variety,Coaches,Nutrition","Dated UI,MLM association"`,
    
    json: {
      niches: [{
        name: "fitness",
        competitors: [
          {
            name: "PelotonDigital",
            url: "https://onepeloton.com",
            pricing: "$12.99/mo",
            strengths: ["Community", "Content", "Brand"],
            weaknesses: ["Price", "Equipment needed"]
          }
        ]
      }]
    }
  },
  
  ads: {
    csv: `niche,ad_headline,ad_copy,ad_cta,ad_performance
fitness,"Transform Your Body in 30 Days","No equipment needed. Follow along with world-class trainers.","Start Free Trial","Running 94 days"
fitness,"Lost 50lbs Without a Gym","Sarah's story will inspire you. Real results from real people.","See Her Transformation","2.3% CTR"`,
    
    json: {
      ads: [
        {
          niche: "fitness",
          headline: "Transform Your Body in 30 Days",
          copy: "No equipment needed. Follow along with world-class trainers.",
          cta: "Start Free Trial",
          performance: {
            runTime: "94 days",
            ctr: "1.8%"
          }
        }
      ]
    }
  }
}

export default KnowledgeImportSystem