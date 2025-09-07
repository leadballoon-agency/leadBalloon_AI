/**
 * Dynamic Knowledge Loading System
 * Automatically loads relevant industry knowledge based on business type detection
 */

interface IndustryKnowledge {
  keywords: string[]
  knowledgeFile?: string
  hooks: string[]
  painPoints: string[]
  competitorInsights: string[]
  pricingInsights: string[]
  qualifyingQuestions: string[]
}

// Industry detection patterns and knowledge mapping
export const industryKnowledge: Record<string, IndustryKnowledge> = {
  bodyContouring: {
    keywords: ['sculpt', 'contour', 'lipo', 'coolsculpting', 'fat reduction', 'body shaping', 'cryolipolysis', 'fat freeze'],
    knowledgeFile: 'body-contouring-insights.json',
    hooks: [
      "I've been looking at body contouring lead costs - typically seeing £15-50 per lead. What are you paying?",
      "Body contouring clinics often go from a few treatments per week to 20+. What's your current volume?",
      "Seen some clinics run the same Facebook ad for months because it works. What's your longest-running ad?"
    ],
    painPoints: [
      "Stubborn fat that won't shift despite diet and exercise",
      "Post-pregnancy body changes",
      "Fear of surgery but wanting results"
    ],
    competitorInsights: [
      "Transform Hospital Group spending £50k/month on Facebook ads",
      "3D Lipo raised prices 40% and still fully booked",
      "Average consultation-to-treatment rate is 35-45%"
    ],
    pricingInsights: [
      "Average treatment value £2,400 lifetime",
      "Most clinics charge £450-900 per area",
      "0% finance drives 40% more conversions"
    ],
    qualifyingQuestions: [
      "What's your consultation-to-treatment conversion rate?",
      "How many areas do clients typically treat?",
      "Do you offer finance options?"
    ]
  },
  
  hifu: {
    keywords: ['hifu', 'high intensity focused ultrasound', 'ultraformer', 'ultherapy', 'skin tightening', 'non-surgical facelift'],
    hooks: [
      "HIFU clinic in London is booking 3 months out - are you that busy?",
      "Average HIFU treatment is £1,200 but some charge £2,500. Where are you?",
      "Harley Street clinic gets 80% of clients from Instagram. What's your main channel?"
    ],
    painPoints: [
      "Sagging skin without surgery",
      "Jowls and neck concerns",
      "Want natural-looking results"
    ],
    competitorInsights: [
      "Most HIFU providers don't explain the collagen timeline properly",
      "Top clinics combine HIFU with other treatments for packages",
      "Celebrity endorsements drive 3x conversions"
    ],
    pricingInsights: [
      "Full face HIFU ranges £800-2500",
      "Package deals increase average order value by 60%",
      "Maintenance packages create recurring revenue"
    ],
    qualifyingQuestions: [
      "Do you focus on face, body, or both HIFU treatments?",
      "What's your typical client age range?",
      "How do you handle the 3-6 month result timeline?"
    ]
  },
  
  prp: {
    keywords: ['prp', 'platelet rich plasma', 'vampire facial', 'hair restoration', 'plasma therapy', 'regenerative medicine'],
    hooks: [
      "PRP clinic in Birmingham went from 5 to 47 treatments/month. What changed?",
      "Average PRP for hair loss client spends £3,600 over 6 months. What's your package?",
      "Vampire Facial searches up 400% since that Netflix documentary. Feeling it?"
    ],
    painPoints: [
      "Hair loss anxiety",
      "Aging skin concerns",
      "Want natural treatments using own blood"
    ],
    competitorInsights: [
      "Most PRP clinics undercharge because they don't package properly",
      "Hair restoration PRP has higher lifetime value than facial",
      "Before/after photos are everything in PRP marketing"
    ],
    pricingInsights: [
      "Single PRP session £350-600",
      "Hair packages £2000-4000 for 6 sessions",
      "Combination treatments command premium prices"
    ],
    qualifyingQuestions: [
      "Do you focus more on hair or facial PRP?",
      "What's your typical treatment package?",
      "How do you handle needle-phobic clients?"
    ]
  },
  
  laserHairRemoval: {
    keywords: ['laser hair removal', 'ipl', 'soprano ice', 'candela', 'permanent hair reduction', 'laser hair'],
    hooks: [
      "Laser clinic with 47 5-star reviews charges 3x more than competitors. How many reviews you got?",
      "Brazilian laser packages selling for £999 when others charge £399. It's all positioning.",
      "Peak season for laser is actually September-March. Are you ready?"
    ],
    painPoints: [
      "Embarrassment about body hair",
      "Tired of shaving/waxing routine",
      "Ingrown hairs and irritation"
    ],
    competitorInsights: [
      "Sk:n Clinics dominate with aggressive Google Ads",
      "Independent clinics win on personal service",
      "Male laser hair removal growing 200% year on year"
    ],
    pricingInsights: [
      "Full body packages £2000-5000",
      "Pay-per-session dying, packages rule",
      "Maintenance plans create recurring revenue"
    ],
    qualifyingQuestions: [
      "What laser technology are you using?",
      "What percentage of clients buy packages vs single sessions?",
      "How do you compete with national chains?"
    ]
  },
  
  solarPV: {
    keywords: ['solar', 'solar panels', 'pv', 'photovoltaic', 'renewable energy', 'solar installation', 'green energy'],
    hooks: [
      "Solar company in Essex gets leads for £12 using this one Facebook ad angle. Curious?",
      "Energy bills fear drove 300% more solar inquiries last winter. Ready for this year?",
      "Average solar customer worth £8,000 but most companies can't close. What's your close rate?"
    ],
    painPoints: [
      "Rising energy bills",
      "Energy independence concerns",
      "Environmental guilt"
    ],
    competitorInsights: [
      "National companies spending £100k+/month on Google Ads",
      "Local installers winning on trust and speed",
      "Finance options crucial - 70% take them"
    ],
    pricingInsights: [
      "Average system £6000-12000",
      "Battery storage adds £4000-8000",
      "Maintenance contracts £150-300/year"
    ],
    qualifyingQuestions: [
      "What's your average system size and price?",
      "Do you offer battery storage?",
      "How quickly can you install after survey?"
    ]
  },
  
  drivingInstructor: {
    keywords: ['driving instructor', 'driving school', 'driving lessons', 'learn to drive', 'driving test', 'adi'],
    hooks: [
      "Driving instructor with 94% first-time pass rate charges £45/hour. What's your rate?",
      "Intensive course packages selling for £1,500 a pop. Do you offer them?",
      "Theory test app affiliates making £500/month passive. Are you missing out?"
    ],
    painPoints: [
      "Test anxiety and failure fear",
      "Long wait times for tests",
      "Cost of multiple lessons"
    ],
    competitorInsights: [
      "RED Driving School dominates with franchise model",
      "Independent instructors win on flexibility",
      "Female instructors can charge 20% premium"
    ],
    pricingInsights: [
      "Lessons £25-45 per hour",
      "Block bookings save 10-15%",
      "Intensive courses £1000-2000"
    ],
    qualifyingQuestions: [
      "What's your first-time pass rate?",
      "Do you offer intensive courses?",
      "How far ahead are you booked?"
    ]
  },
  
  veinClinic: {
    keywords: ['varicose veins', 'spider veins', 'vein clinic', 'sclerotherapy', 'evla', 'vein treatment', 'leg veins'],
    hooks: [
      "Vein clinic in Manchester seeing 40 patients a week. They cracked the NHS referral code.",
      "Average vein treatment patient worth £3,200. But most clinics don't follow up properly.",
      "Summer is actually the WORST time for vein marketing. Here's when to push..."
    ],
    painPoints: [
      "Leg pain and discomfort",
      "Embarrassment about appearance",
      "Fear of complications"
    ],
    competitorInsights: [
      "Veincentre spending huge on TV ads",
      "Private clinics winning on speed vs NHS",
      "Insurance coverage drives conversions"
    ],
    pricingInsights: [
      "EVLA treatment £2000-3500 per leg",
      "Sclerotherapy £300-500 per session",
      "Consultation fees £150-300"
    ],
    qualifyingQuestions: [
      "Do you take NHS referrals?",
      "What's your main treatment method?",
      "How do you handle insurance claims?"
    ]
  },
  
  pregnancyScanning: {
    keywords: ['pregnancy scan', 'ultrasound', 'baby scan', '4d scan', 'gender scan', 'early pregnancy', 'prenatal'],
    hooks: [
      "Baby scanning clinic doing 60 scans a weekend at £89 each. What's your weekend like?",
      "Gender reveal packages selling for £149 when basic scan is £59. Upsells are everything.",
      "Window to Womb franchise making millions. How do independents compete?"
    ],
    painPoints: [
      "NHS wait times too long",
      "Anxiety about baby's health",
      "Want special bonding experience"
    ],
    competitorInsights: [
      "Window to Womb dominates with 30+ locations",
      "Independent clinics win on personal touch",
      "4D scanning becoming standard expectation"
    ],
    pricingInsights: [
      "Early scan £59-99",
      "Gender scan £59-79",
      "4D packages £99-199"
    ],
    qualifyingQuestions: [
      "What's your most popular scan package?",
      "Do you offer weekend appointments?",
      "How do you market to first-time parents?"
    ]
  },
  
  firstAid: {
    keywords: ['first aid', 'first aid training', 'emergency first aid', 'paediatric first aid', 'mental health first aid'],
    hooks: [
      "First aid training company books 3 months solid after this one LinkedIn post. Want to see it?",
      "Corporate clients paying £2,000/day for onsite training. Are you missing the B2B opportunity?",
      "Mental Health First Aid courses selling out at £300/person. Do you offer them?"
    ],
    painPoints: [
      "Legal compliance requirements",
      "Staff safety concerns",
      "Parent anxiety about child safety"
    ],
    competitorInsights: [
      "St John Ambulance has brand recognition",
      "Local providers win on flexibility",
      "Online courses disrupting traditional model"
    ],
    pricingInsights: [
      "Public courses £65-150 per person",
      "Corporate training £800-2000/day",
      "Online courses £25-50"
    ],
    qualifyingQuestions: [
      "Do you focus on public or corporate training?",
      "What's your most popular course?",
      "How do you handle certification?"
    ]
  }
}

/**
 * Detect industry type from domain, URL, or business description
 */
export function detectIndustry(input: {
  domain?: string
  url?: string
  businessType?: string
  description?: string
}): string | null {
  const searchText = [
    input.domain,
    input.url,
    input.businessType,
    input.description
  ].filter(Boolean).join(' ').toLowerCase()
  
  for (const [industry, data] of Object.entries(industryKnowledge)) {
    for (const keyword of data.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return industry
      }
    }
  }
  
  return null
}

/**
 * Get industry-specific knowledge for AI conversations
 */
export function getIndustryKnowledge(industry: string): IndustryKnowledge | null {
  return industryKnowledge[industry] || null
}

/**
 * Load full knowledge base JSON if available
 */
export async function loadKnowledgeBase(industry: string): Promise<any> {
  const knowledge = industryKnowledge[industry]
  if (!knowledge?.knowledgeFile) {
    return null
  }
  
  try {
    const module = await import(`@/knowledge-base/${knowledge.knowledgeFile}`)
    return module.default
  } catch (error) {
    console.log(`Knowledge file not yet created for ${industry}`)
    return null
  }
}

/**
 * Load SLO strategy knowledge for competitive markets
 */
export function getSLOStrategy(): any {
  try {
    const fs = require('fs')
    const path = require('path')
    const sloData = fs.readFileSync(
      path.join(process.cwd(), 'knowledge-base', 'slo-strategy.json'),
      'utf-8'
    )
    return JSON.parse(sloData)
  } catch (error) {
    console.log('SLO strategy knowledge not found, using defaults')
    return {
      simpleExplanation: "It's a way to get leads for FREE by offering something small that covers your ad costs",
      examples: {
        general: {
          mainService: "Your main high-ticket service",
          slo: "A smaller, quick-win offer at £27-47",
          math: "Just a few sales cover all your ad costs"
        }
      }
    }
  }
}

/**
 * Load ROAS expectations and education
 */
export function getROASEducation(): any {
  try {
    const fs = require('fs')
    const path = require('path')
    const roasData = fs.readFileSync(
      path.join(process.cwd(), 'knowledge-base', 'roas-expectations.json'),
      'utf-8'
    )
    return JSON.parse(roasData)
  } catch (error) {
    console.log('ROAS education knowledge not found, using defaults')
    return {
      reality: {
        goodROAS: "2-3x",
        truth: "Most quit at 2x thinking they're failing when they're actually winning"
      },
      theNumbersThatMatter: {
        LTV: "Lifetime Value - What's a customer worth over 2 years?",
        CAC: "Customer Acquisition Cost"
      }
    }
  }
}

/**
 * Get conversation context for detected industry
 */
export function getIndustryContext(industry: string | null): {
  stories: string[]
  questions: string[]
  insights: string[]
} {
  if (!industry) {
    return {
      stories: [
        "Just analyzed a similar business yesterday - they were paying £120 per lead. What are you paying?",
        "Had a client last week who went from 2 leads a month to 47. What would 47 leads do for you?",
        "90% of businesses I analyze are leaving money on the table. What's your average customer worth?"
      ],
      questions: [
        "What's your biggest challenge right now?",
        "How many leads do you get per month?",
        "What's your average customer value?"
      ],
      insights: [
        "Most businesses don't know their numbers",
        "Competitors are likely outspending you",
        "Small tweaks can double conversions"
      ]
    }
  }
  
  const knowledge = industryKnowledge[industry]
  return {
    stories: knowledge.hooks,
    questions: knowledge.qualifyingQuestions,
    insights: [
      ...knowledge.competitorInsights,
      ...knowledge.pricingInsights
    ]
  }
}