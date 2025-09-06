// Community Offer Library - Collective Intelligence Database
// Every user's successful offer becomes a template for others

export interface CommunityOffer {
  id: string
  industry: string
  subNiche?: string // e.g., "post-ozempic skin tightening"
  
  // Performance metrics (tracked via pixels)
  stats: {
    conversionRate: number // e.g., 3.4%
    avgOrderValue: number
    totalRevenue: number
    impressions: number
    leadsGenerated: number
    rating: number // 1-5 stars from users
  }
  
  // The proven offer structure
  offer: {
    dreamOutcome: string
    valueStack: Array<{
      item: string
      value: string
      description: string
    }>
    pricing: {
      originalPrice: number
      offerPrice: number
      paymentPlan?: string
    }
    guarantee: string
    urgency: string
    bonuses: string[]
  }
  
  // What made it work
  insights: {
    targetAudience: string
    mainPainPoints: string[]
    competitorWeaknesses: string[]
    winningHooks: string[]
    facebookAdsUsed?: string[] // Actual ad copy that worked
  }
  
  // Meta info
  createdBy: string // anonymized user ID
  createdAt: Date
  lastUpdated: Date
  timesUsed: number // How many others have forked this
  
  // Permissions
  isPublic: boolean // User can choose to share
  requiresAttribution: boolean
}

// Get top performing offers by industry
export async function getTopOffers(
  industry: string,
  metric: 'conversion' | 'revenue' | 'rating' = 'conversion'
): Promise<CommunityOffer[]> {
  // In production, this queries a real database
  // For now, return example high-performers
  
  if (industry.includes('Body Contouring')) {
    return [
      {
        id: 'offer-001',
        industry: 'Body Contouring & Fat Reduction',
        subNiche: 'Post-Ozempic Loose Skin',
        stats: {
          conversionRate: 4.2,
          avgOrderValue: 697,
          totalRevenue: 142000,
          impressions: 48000,
          leadsGenerated: 2040,
          rating: 4.8
        },
        offer: {
          dreamOutcome: 'Finally love your body after weight loss - tight, toned skin that matches your hard work',
          valueStack: [
            {
              item: 'ProMax Lipo Skin Tightening (6 sessions)',
              value: '£2400',
              description: 'Medical-grade technology that actually works'
            },
            {
              item: 'Custom Body Transformation Plan',
              value: '£497',
              description: 'Targets YOUR specific problem areas'
            },
            {
              item: '3D Body Scanning & Progress Tracking',
              value: '£297',
              description: 'SEE your transformation happening'
            }
          ],
          pricing: {
            originalPrice: 3194,
            offerPrice: 697,
            paymentPlan: '3 payments of £265'
          },
          guarantee: 'See visible skin tightening in 30 days or 100% money back',
          urgency: 'Only 5 spots this month (machine fully booked)',
          bonuses: [
            'FREE consultation & body scan (£200 value)',
            'Bring a friend - both save 20%',
            'FREE maintenance session after 6 months'
          ]
        },
        insights: {
          targetAudience: 'People who lost 30+ lbs with Ozempic/Wegovy',
          mainPainPoints: [
            'Loose skin making them look bigger than before',
            'Feel betrayed after working so hard to lose weight',
            'Avoiding intimacy due to saggy skin'
          ],
          competitorWeaknesses: [
            'CoolSculpting doesn\'t tighten skin',
            'Surgery is too invasive and risky'
          ],
          winningHooks: [
            'Lost weight but hate your loose skin?',
            'Ozempic worked but now you need skin tightening?'
          ]
        },
        createdBy: 'user_xyz123',
        createdAt: new Date('2024-09-15'),
        lastUpdated: new Date('2024-11-01'),
        timesUsed: 47,
        isPublic: true,
        requiresAttribution: false
      },
      {
        id: 'offer-002',
        industry: 'Body Contouring & Fat Reduction',
        subNiche: 'Mommy Makeover Alternative',
        stats: {
          conversionRate: 3.8,
          avgOrderValue: 997,
          totalRevenue: 89000,
          impressions: 32000,
          leadsGenerated: 1216,
          rating: 4.6
        },
        offer: {
          dreamOutcome: 'Get your pre-baby body back without surgery - look amazing in that bikini again',
          valueStack: [
            {
              item: 'Complete Mommy Makeover Package',
              value: '£4500',
              description: 'Tummy, thighs, and arms transformation'
            },
            {
              item: 'Pelvic Floor Restoration',
              value: '£800',
              description: 'Fix what pregnancy really damaged'
            }
          ],
          pricing: {
            originalPrice: 5300,
            offerPrice: 997,
            paymentPlan: '6 payments of £197'
          },
          guarantee: 'Drop 2 dress sizes or full refund',
          urgency: 'Summer special ends Friday',
          bonuses: [
            'FREE childcare during appointments',
            'At-home recovery kit included'
          ]
        },
        insights: {
          targetAudience: 'Moms 6+ months postpartum',
          mainPainPoints: [
            'Nothing fits like before baby',
            'Partner doesn\'t look at them the same',
            'No time for gym with kids'
          ],
          competitorWeaknesses: [
            'Mommy makeover surgery costs £15k+',
            'Can\'t care for kids during recovery'
          ],
          winningHooks: [
            'Moms: Get your body back in 6 weeks',
            'No surgery, no downtime, kids welcome'
          ]
        },
        createdBy: 'user_abc789',
        createdAt: new Date('2024-08-20'),
        lastUpdated: new Date('2024-10-15'),
        timesUsed: 31,
        isPublic: true,
        requiresAttribution: false
      }
    ]
  }
  
  // Default return for other industries
  return []
}

// Clone and customize a community offer
export async function forkOffer(
  offerId: string,
  customizations: Partial<CommunityOffer['offer']>
): Promise<CommunityOffer> {
  // Get original offer
  const original = await getOfferById(offerId)
  
  // Create new version with customizations
  const forked = {
    ...original,
    id: generateId(),
    offer: {
      ...original.offer,
      ...customizations
    },
    createdAt: new Date(),
    timesUsed: 0,
    stats: {
      ...original.stats,
      conversionRate: 0,
      totalRevenue: 0,
      leadsGenerated: 0
    }
  }
  
  // Track that original was forked
  await incrementForkedCount(offerId)
  
  return forked
}

// Helper functions
async function getOfferById(id: string): Promise<CommunityOffer> {
  // In production, fetch from database
  const allOffers = await getTopOffers('Body Contouring & Fat Reduction')
  return allOffers.find(o => o.id === id) || allOffers[0]
}

async function incrementForkedCount(offerId: string): Promise<void> {
  // In production, update database
  console.log(`Offer ${offerId} forked!`)
}

function generateId(): string {
  return `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get offers similar to a URL
export async function getSimilarOffers(
  websiteUrl: string,
  industry: string
): Promise<{
  exactMatches: CommunityOffer[] // Same exact business
  industryMatches: CommunityOffer[] // Same industry
  similarAudience: CommunityOffer[] // Similar pain points
}> {
  // This would use AI to match based on:
  // - Industry alignment
  // - Target audience overlap
  // - Price point similarity
  // - Geographic relevance
  
  const industryOffers = await getTopOffers(industry)
  
  return {
    exactMatches: [],
    industryMatches: industryOffers.slice(0, 3),
    similarAudience: industryOffers.slice(0, 2)
  }
}