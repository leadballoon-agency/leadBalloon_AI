// AI Website Analyzer for LeadBalloon
// This analyzes websites and generates optimized assessment configurations

import { assessmentConfig, valueSettings } from '../assessment-widget/config'

export interface WebsiteAnalysis {
  url: string
  businessInfo: {
    name: string
    industry: string
    subIndustry?: string
    services: string[]
    location?: string
  }
  targetAudience: {
    ageRange: string
    gender: 'male' | 'female' | 'all'
    income: 'budget' | 'mid' | 'premium'
    painPoints: string[]
  }
  contentAnalysis: {
    headlines: string[]
    valueProps: string[]
    socialProof: string[]
    urgencyTriggers: string[]
    ctaButtons: string[]
    pricing?: string[]
  }
  brandVoice: {
    tone: 'professional' | 'friendly' | 'urgent' | 'luxury' | 'casual'
    emotions: string[]
    keywords: string[]
  }
  competitors?: {
    directCompetitors: string[]
    adCopy?: string[]
    offers?: string[]
  }
}

export interface GeneratedAssessmentConfig {
  industry: string
  questions: AssessmentQuestion[]
  copy: {
    headline: string
    subheadline: string
    trustBadge: string
    urgencyMessage: string
    ctaButton: string
    valueProps: string[]
  }
  qualificationRules: QualificationRule[]
  leadRouting: LeadRoute[]
  pixelEvents: string[]
  estimatedConversionRate: number
}

export interface AssessmentQuestion {
  id: string
  type: 'single' | 'multiple' | 'text' | 'scale'
  question: string
  subtitle?: string
  options?: {
    value: string
    label: string
    emoji?: string
    weight?: number
  }[]
  required: boolean
  qualificationImpact: 'high' | 'medium' | 'low'
}

export interface QualificationRule {
  id: string
  condition: string
  score: number
  message?: string
  route?: 'qualified' | 'not-qualified' | 'partner'
}

export interface LeadRoute {
  condition: string
  destination: 'internal' | 'partner' | 'nurture'
  partnerId?: string
  message: string
}

// Industry Templates (learned from successful assessments)
const industryTemplates = {
  'medical-aesthetics': {
    keywords: ['botox', 'filler', 'skin', 'wrinkle', 'aging', 'youth'],
    questions: [
      'What concerns you most about your appearance?',
      'How long have you been considering treatment?',
      'Have you had aesthetic treatments before?',
      'What is your age range?',
      'What is your budget for treatment?'
    ],
    qualifiers: {
      highValue: ['considering multiple treatments', 'ready to book', 'previous treatments'],
      lowValue: ['just researching', 'no budget', 'under 25']
    },
    urgency: ['Limited appointments', 'Special pricing this month', 'New patient offer'],
    trust: ['CQC registered', 'Fully insured', 'Medical professionals']
  },
  'dental': {
    keywords: ['teeth', 'smile', 'implant', 'veneer', 'whitening', 'dental'],
    questions: [
      'What would you like to improve about your smile?',
      'Do you have any missing teeth?',
      'How long have you been unhappy with your smile?',
      'Have you seen a dentist in the last year?',
      'What is your timeline for treatment?'
    ],
    qualifiers: {
      highValue: ['missing teeth', 'ready for treatment', 'good dental health'],
      lowValue: ['active gum disease', 'just curious', 'no timeline']
    },
    urgency: ['Free consultation this week', '0% finance available', 'Same day appointments'],
    trust: ['GDC registered', '5000+ smiles transformed', 'Award winning practice']
  },
  'weight-loss': {
    keywords: ['weight', 'ozempic', 'wegovy', 'diet', 'BMI', 'obesity'],
    questions: [
      'How much weight would you like to lose?',
      'Have you tried medical weight loss before?',
      'What is your BMI?',
      'Do you have any medical conditions?',
      'Are you ready to start this month?'
    ],
    qualifiers: {
      highValue: ['BMI over 27', 'ready to start', 'tried other methods'],
      lowValue: ['BMI under 25', 'just researching', 'no medical need']
    },
    urgency: ['Medication in stock', 'Doctor availability this week', 'New patient special'],
    trust: ['GMC registered doctors', 'CQC regulated', 'Proven results']
  }
}

// AI Analysis Function (Simulated - would connect to GPT-4/Claude API)
export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  // In production, this would:
  // 1. Scrape the website
  // 2. Extract text content
  // 3. Analyze with AI (GPT-4/Claude)
  // 4. Check Facebook Ads Library
  // 5. Return structured analysis
  
  // Simulated response for demo
  return {
    url,
    businessInfo: {
      name: 'Example Med Spa',
      industry: 'medical-aesthetics',
      subIndustry: 'anti-aging',
      services: ['Botox', 'Dermal Fillers', 'Skin Treatments', 'Body Contouring'],
      location: 'London, UK'
    },
    targetAudience: {
      ageRange: '35-55',
      gender: 'female',
      income: 'premium',
      painPoints: ['Aging signs', 'Loose skin', 'Wrinkles', 'Lack of confidence']
    },
    contentAnalysis: {
      headlines: [
        'Look 10 Years Younger',
        'Transform Your Appearance',
        'Regain Your Confidence'
      ],
      valueProps: [
        'Medical professionals',
        'Latest technology',
        'Natural results',
        'No downtime'
      ],
      socialProof: [
        '5000+ happy patients',
        '5-star reviews',
        'Before/after gallery',
        'Patient testimonials'
      ],
      urgencyTriggers: [
        'Limited appointments',
        'Special offer ends soon',
        'Book today'
      ],
      ctaButtons: [
        'Book Free Consultation',
        'Get Started Today',
        'Claim Your Offer'
      ],
      pricing: ['From £150', 'Payment plans available', '0% finance']
    },
    brandVoice: {
      tone: 'professional',
      emotions: ['trust', 'confidence', 'excitement', 'transformation'],
      keywords: ['professional', 'experienced', 'results', 'natural', 'safe']
    }
  }
}

// Generate Assessment Configuration from Analysis
export async function generateAssessmentConfig(
  analysis: WebsiteAnalysis
): Promise<GeneratedAssessmentConfig> {
  const industry = analysis.businessInfo.industry
  const template = industryTemplates[industry] || industryTemplates['medical-aesthetics']
  
  // Generate optimized questions based on analysis
  const questions: AssessmentQuestion[] = [
    {
      id: 'concern',
      type: 'single',
      question: `What brings you to ${analysis.businessInfo.name} today?`,
      subtitle: 'Select your primary concern',
      options: analysis.targetAudience.painPoints.map((pain, index) => ({
        value: pain.toLowerCase().replace(/\s+/g, '_'),
        label: pain,
        emoji: ['😟', '🎯', '💪', '✨'][index] || '🎯',
        weight: 10
      })),
      required: true,
      qualificationImpact: 'high'
    },
    {
      id: 'timeline',
      type: 'single',
      question: 'When are you looking to start treatment?',
      subtitle: 'This helps us check availability',
      options: [
        { value: 'immediately', label: 'As soon as possible', emoji: '🚀', weight: 20 },
        { value: 'month', label: 'Within a month', emoji: '📅', weight: 15 },
        { value: '3months', label: 'In the next 3 months', emoji: '📆', weight: 10 },
        { value: 'research', label: 'Just researching', emoji: '🔍', weight: 5 }
      ],
      required: true,
      qualificationImpact: 'high'
    },
    {
      id: 'budget',
      type: 'single',
      question: 'Have you set aside a budget for your transformation?',
      subtitle: 'We offer various payment options',
      options: [
        { value: 'ready', label: 'Yes, I\'m ready to invest', emoji: '✅', weight: 20 },
        { value: 'finance', label: 'I\'d need financing', emoji: '💳', weight: 15 },
        { value: 'unsure', label: 'Depends on the cost', emoji: '🤔', weight: 10 },
        { value: 'checking', label: 'Just checking prices', emoji: '💭', weight: 5 }
      ],
      required: true,
      qualificationImpact: 'medium'
    }
  ]

  // Generate copy based on analysis
  const copy = {
    headline: analysis.contentAnalysis.headlines[0] || 'Transform Your Life Today',
    subheadline: `Join ${analysis.contentAnalysis.socialProof[0] || 'thousands of happy clients'}`,
    trustBadge: analysis.contentAnalysis.socialProof[1] || 'Trusted by thousands',
    urgencyMessage: analysis.contentAnalysis.urgencyTriggers[0] || 'Limited spots available',
    ctaButton: analysis.contentAnalysis.ctaButtons[0] || 'Get Started',
    valueProps: analysis.contentAnalysis.valueProps
  }

  // Generate qualification rules
  const qualificationRules: QualificationRule[] = [
    {
      id: 'high-intent',
      condition: 'timeline === "immediately" && budget === "ready"',
      score: 100,
      message: 'Perfect! You qualify for priority booking',
      route: 'qualified'
    },
    {
      id: 'medium-intent',
      condition: 'timeline === "month" || budget === "finance"',
      score: 70,
      message: 'Great! Let\'s discuss your options',
      route: 'qualified'
    },
    {
      id: 'low-intent',
      condition: 'timeline === "research" && budget === "checking"',
      score: 30,
      message: 'We\'ll send you helpful information',
      route: 'nurture'
    }
  ]

  // Generate lead routing rules
  const leadRouting: LeadRoute[] = [
    {
      condition: 'score >= 70',
      destination: 'internal',
      message: 'Book your consultation'
    },
    {
      condition: 'score >= 30 && score < 70',
      destination: 'nurture',
      message: 'Get our treatment guide'
    },
    {
      condition: 'score < 30',
      destination: 'partner',
      partnerId: 'alternative-clinic',
      message: 'We recommend this alternative'
    }
  ]

  return {
    industry,
    questions,
    copy,
    qualificationRules,
    leadRouting,
    pixelEvents: ['PageView', 'Lead', 'CompleteRegistration'],
    estimatedConversionRate: 12.5 // Based on industry benchmarks
  }
}

// Learn from performance data
export interface PerformanceData {
  assessmentId: string
  industry: string
  questionPerformance: {
    questionId: string
    answerRate: number
    dropOffRate: number
    avgTimeToAnswer: number
  }[]
  conversionRate: number
  leadQuality: number // 1-10
}

export async function optimizeFromPerformance(
  currentConfig: GeneratedAssessmentConfig,
  performanceData: PerformanceData[]
): Promise<GeneratedAssessmentConfig> {
  // Analyze performance patterns
  const avgConversion = performanceData.reduce((acc, p) => acc + p.conversionRate, 0) / performanceData.length
  
  // Identify high-performing questions
  const questionPerformance = new Map<string, number>()
  performanceData.forEach(p => {
    p.questionPerformance.forEach(q => {
      const score = q.answerRate * (1 - q.dropOffRate)
      const current = questionPerformance.get(q.questionId) || 0
      questionPerformance.set(q.questionId, current + score)
    })
  })
  
  // Reorder questions based on performance
  const optimizedQuestions = [...currentConfig.questions].sort((a, b) => {
    const scoreA = questionPerformance.get(a.id) || 0
    const scoreB = questionPerformance.get(b.id) || 0
    return scoreB - scoreA
  })
  
  // Update copy if conversion is low
  if (avgConversion < 10) {
    currentConfig.copy.urgencyMessage = '⚠️ Only 3 spots left today!'
    currentConfig.copy.ctaButton = 'Claim Your Spot Now →'
  }
  
  return {
    ...currentConfig,
    questions: optimizedQuestions,
    estimatedConversionRate: avgConversion * 1.2 // Expected 20% improvement
  }
}

// Export configuration for use in assessment widget
export function exportToWidgetConfig(
  generatedConfig: GeneratedAssessmentConfig
): typeof assessmentConfig {
  // Map generated config to widget config format
  // This would be a full implementation in production
  return assessmentConfig
}