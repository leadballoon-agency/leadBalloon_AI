/**
 * Manual Research System
 * The "Wizard of Oz" approach - appear automated while doing manual research
 * This lets us deliver REAL value while building the automated system
 */

export interface ManualResearchTask {
  id: string
  websiteUrl: string
  customerInfo: {
    name: string
    email: string
    phone: string
    submittedAt: Date
  }
  status: 'pending' | 'researching' | 'ready' | 'delivered'
  assignedTo?: string
  research: {
    started?: Date
    notes?: string
    competitorsFound?: string[]
    winningAdsFound?: string[]
    pricePoints?: string[]
    insights?: string[]
    recommendations?: string[]
  }
  deliverables?: {
    reportUrl?: string
    widgetCode?: string
    emailSent?: boolean
    smsSent?: boolean
  }
}

/**
 * Admin Dashboard View
 * Shows all pending research tasks for manual completion
 */
export interface AdminDashboard {
  pendingTasks: ManualResearchTask[]
  inProgress: ManualResearchTask[]
  completed: ManualResearchTask[]
  stats: {
    totalLeads: number
    conversionRate: number
    avgCompletionTime: string
    hotLeads: number // with phone numbers
  }
}

/**
 * Research Checklist for Manual Process
 * Ensures consistent quality
 */
export const ResearchChecklist = {
  website: [
    'Screenshot homepage',
    'Copy main headline',
    'Note current offers/pricing',
    'Identify tone/style',
    'Find pain points mentioned',
    'Check for urgency/scarcity',
    'Look for testimonials',
    'Note any guarantees'
  ],
  
  competitors: [
    'Google "[business type] + [location]"',
    'Check Google Ads at top',
    'Search Facebook Ad Library',
    'Note top 3-5 competitors',
    'Screenshot their offers',
    'Document their pricing',
    'Find their unique angles',
    'Identify their weaknesses'
  ],
  
  facebookAds: [
    'Go to Facebook Ad Library',
    'Search business name',
    'Search industry terms',
    'Filter by active ads',
    'Look for 30+ day runners',
    'Screenshot best ads',
    'Copy exact headlines',
    'Note emotional triggers',
    'Document offers/CTAs'
  ],
  
  analysis: [
    'Identify market gaps',
    'Find positioning opportunity',
    'Determine optimal price',
    'Create value stack',
    'Write 3 headline options',
    'Design urgency element',
    'Add risk reversal',
    'Create irresistible offer'
  ]
}

/**
 * Time Management for Manual Research
 */
export const ResearchTimeTargets = {
  quick: {
    websiteAnalysis: 5,      // 5 minutes
    competitorSearch: 10,    // 10 minutes  
    facebookAds: 10,         // 10 minutes
    offerCreation: 5,        // 5 minutes
    total: 30                // 30 minutes per lead
  },
  thorough: {
    websiteAnalysis: 10,
    competitorSearch: 20,
    facebookAds: 20,
    offerCreation: 10,
    total: 60                // 1 hour per lead
  }
}

/**
 * Templates for Quick Insights (shown during "analysis")
 */
export const QuickInsightTemplates = [
  'Your headline could be {X}% stronger',
  'Top competitor charging {price} (you could charge more)',
  'Found ad running {days} days using "{trigger}" trigger',
  '{X} competitors using same hook (opportunity!)',
  'Missing {element} that converts {X}% better',
  'Your offer stacks to {value} in real value',
  'Competitor weakness: {weakness}',
  'Untapped angle: {angle}'
]

/**
 * Notification System
 * Alerts you when new leads come in
 */
export const NotificationChannels = {
  email: {
    to: 'admin@leadballoon.ai',
    subject: '🔥 New Hot Lead: {businessName}',
    template: `
      New lead requires research:
      
      Name: {name}
      Email: {email}
      Phone: {phone} [HOT LEAD!]
      Website: {website}
      Submitted: {time}
      
      Dashboard: {dashboardUrl}
    `
  },
  
  sms: {
    to: '+447890123456',
    message: '🔥 Hot lead: {name} from {website}. Has phone: {phone}'
  },
  
  slack: {
    channel: '#hot-leads',
    message: 'New research task: {website}'
  }
}

/**
 * Delivery Templates
 */
export const DeliveryTemplates = {
  email: {
    subject: '🎯 Your Market Intelligence Report is Ready',
    body: `
      Hi {name},
      
      Great news! I've completed the deep market analysis for {website}.
      
      Here's what I discovered:
      
      ✅ Analyzed {competitorCount} competitors
      ✅ Found {adCount} winning ads (some running 90+ days!)
      ✅ Identified {gapCount} market gaps you can exploit
      
      Your custom report reveals:
      
      1. The EXACT copy your competitors are using to convert
      2. Why you can charge {recommendedPrice} (more than you think!)
      3. The "magic words" that trigger buying decisions in your market
      4. Your custom widget code (just copy & paste)
      
      [ACCESS YOUR REPORT]
      {reportUrl}
      
      Quick Win: {quickWin}
      
      Questions? Reply to this email or call me at {yourPhone}.
      
      To your success,
      {yourName}
      LeadBalloon AI
      
      P.S. {ps}
    `
  },
  
  sms: {
    initial: 'Hi {name}! Your market report for {website} is ready: {link}',
    followup: 'Did you see the competitor weakness I found? Check section 3 of your report.',
    closer: 'Ready to implement? I can help you set up the widget in 5 minutes. Reply YES.'
  }
}

/**
 * CRM Integration
 * Track lead quality and conversion
 */
export interface LeadTracking {
  source: 'organic' | 'paid' | 'referral'
  quality: 'cold' | 'warm' | 'hot'  // hot = gave phone
  researchTime: number // minutes spent
  deliveryTime: number // hours from submit to delivery
  opened: boolean
  clicked: boolean
  implemented: boolean
  converted: boolean
  ltv?: number
}

/**
 * The Genius Part: Gradual Automation
 * As you do manual research, you build templates and patterns
 */
export const AutomationPipeline = {
  phase1: 'Manual everything (learn what works)',
  phase2: 'Template common insights',
  phase3: 'Automate competitor finding',
  phase4: 'Automate ad scraping',
  phase5: 'AI generates initial draft, human refines',
  phase6: 'Fully automated with human QA',
  phase7: 'Self-improving system'
}

/**
 * Sales Process After Delivery
 */
export const SalesFollowup = {
  day0: 'Deliver report',
  day1: 'Email: "Did you see the competitor weakness?"',
  day2: 'SMS: "Quick question about your widget"',
  day3: 'Email: "3 more insights I found"',
  day5: 'Call: "Help implementing?"',
  day7: 'Email: "Limited time: Done-for-you service"',
  day14: 'Final offer with urgency'
}

/**
 * Upsell Opportunities
 */
export const Upsells = {
  immediate: {
    name: 'Fast Track Implementation',
    price: 497,
    value: 'We implement everything today'
  },
  
  recurring: {
    name: 'Competitor Monitoring',
    price: 197,
    period: 'monthly',
    value: 'Weekly reports on competitor changes'
  },
  
  premium: {
    name: 'Full Funnel Optimization',
    price: 2497,
    value: 'Complete marketing system'
  }
}

/**
 * Scripts for Manual Research Calls
 */
export const ResearchScripts = {
  competitorCall: `
    "Hi, I'm researching [industry] in [location].
    What makes you different from [competitor]?
    What's your most popular package?
    Do you have any special offers running?"
  `,
  
  customerCall: `
    "Hi [name], I'm personally reviewing your analysis.
    Quick question - who do you see as your biggest competitor?
    What's the main problem your customers come to you for?
    This helps me nail your positioning..."
  `
}

/**
 * Quality Checklist Before Delivery
 */
export const QualityChecklist = [
  'Found at least 3 real competitors',
  'Have 5+ actual ad examples',
  'Pricing makes sense for market',
  'Offer is specific to their business',
  'Headlines use their language',
  'Urgency is believable',
  'Widget matches their brand'
]