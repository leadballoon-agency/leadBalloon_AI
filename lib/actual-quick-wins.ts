/**
 * ACTUAL Quick Wins We Can Identify From Scraping
 * Not vague marketing BS - real specific issues
 */

export const actualQuickWins = {
  
  // Things we can ACTUALLY detect from scraping
  missingElements: {
    noPhoneNumber: {
      issue: "No phone number visible above the fold",
      fix: "Add phone number in header - increases trust by 30%",
      detectable: true
    },
    noPricing: {
      issue: "No pricing information anywhere on page",
      fix: "Add 'From £X' pricing - qualifies leads before they call",
      detectable: true
    },
    noTestimonials: {
      issue: "Zero social proof on landing page",
      fix: "Add 3 testimonials with names and locations",
      detectable: true
    },
    noUrgency: {
      issue: "No urgency or scarcity messaging",
      fix: "Add 'Limited appointments' or 'Book this week for...'",
      detectable: true
    },
    noClearCTA: {
      issue: "Weak or missing call-to-action buttons",
      fix: "Change 'Submit' to 'Get Your Free Consultation'",
      detectable: true
    }
  },

  // Copy issues we can detect
  weakHeadlines: {
    genericHeadline: {
      issue: "Headline talks about YOU not customer's problem",
      example: "'Welcome to Smith Dental' vs 'Stop Living With Tooth Pain'",
      detectable: true
    },
    noValueProp: {
      issue: "No clear value proposition in first 3 seconds",
      fix: "Add benefit-focused subheadline immediately",
      detectable: true
    },
    featuresNotBenefits: {
      issue: "Listing features ('We use X technology') not benefits",
      fix: "Change to outcomes ('Get results in 2 weeks')",
      detectable: true
    }
  },

  // Form issues we can spot
  formProblems: {
    tooManyFields: {
      issue: "Form has more than 4 fields",
      fix: "Just ask for Name, Phone, Email - get rest on call",
      detectable: true
    },
    wrongFields: {
      issue: "Asking for address/DOB before qualifying them",
      fix: "Remove unnecessary fields that kill conversions",
      detectable: true
    },
    noPrivacy: {
      issue: "No privacy assurance near form",
      fix: "Add 'We never share your details' near submit button",
      detectable: true
    }
  },

  // Mobile issues (when we check mobile view)
  mobileProblems: {
    textTooSmall: {
      issue: "Body text smaller than 16px on mobile",
      fix: "Increase to minimum 16px for readability",
      detectable: true
    },
    buttonsTooSmall: {
      issue: "CTA buttons less than 44px tall on mobile",
      fix: "Make buttons thumb-friendly - minimum 44px height",
      detectable: true
    },
    formNotVisible: {
      issue: "Form below fold on mobile",
      fix: "Move form up or add sticky 'Get Quote' button",
      detectable: true
    }
  },

  // Trust issues we can detect
  trustProblems: {
    noCredentials: {
      issue: "No certifications, awards, or credentials shown",
      fix: "Add 'Registered with...', 'Member of...' badges",
      detectable: true
    },
    noGuarantee: {
      issue: "No risk reversal or guarantee mentioned",
      fix: "Add 'Satisfaction guaranteed' or 'Free consultation'",
      detectable: true
    },
    stockPhotos: {
      issue: "Using obvious stock photos of models",
      fix: "Use real photos of your actual clinic/team",
      detectable: false // Hard to detect automatically
    }
  },

  // What competitors do better (from comparison)
  competitorAdvantages: {
    betterOffer: {
      issue: "Competitor has stronger offer",
      example: "They offer 'Free consultation + treatment plan' vs your 'Contact us'",
      detectable: true
    },
    clearerPricing: {
      issue: "Competitor shows price ranges, you don't",
      example: "They show '£49-99/month' you say 'Contact for pricing'",
      detectable: true
    },
    strongerProof: {
      issue: "Competitor has video testimonials, you have none",
      fix: "Add video testimonials or before/after photos",
      detectable: true
    }
  }
}

/**
 * Generate SPECIFIC feedback based on what we actually found
 */
export function generateSpecificFeedback(scrapedData: any): string[] {
  const issues: string[] = []
  
  // Check for missing phone number
  if (!scrapedData.bodyText?.includes('07') && !scrapedData.bodyText?.includes('01') && !scrapedData.bodyText?.includes('02')) {
    issues.push("No phone number visible - you're losing trust immediately")
  }
  
  // Check for pricing
  if (!scrapedData.prices || scrapedData.prices.length === 0) {
    issues.push("No pricing shown - people assume you're expensive and leave")
  }
  
  // Check for weak CTAs
  const weakCTAs = ['submit', 'send', 'contact', 'learn more', 'click here']
  const haswWeakCTA = scrapedData.ctas?.some((cta: string) => 
    weakCTAs.includes(cta.toLowerCase())
  )
  if (haswWeakCTA) {
    issues.push("Your buttons say 'Submit' - change to 'Get Your Free Quote'")
  }
  
  // Check for testimonials
  if (!scrapedData.testimonials || scrapedData.testimonials.length === 0) {
    issues.push("Zero testimonials found - you need at least 3 with names")
  }
  
  // Check headline quality
  if (scrapedData.headline?.toLowerCase().includes('welcome')) {
    issues.push("Your headline says 'Welcome' - nobody cares, talk about THEIR problem")
  }
  
  return issues
}

/**
 * Compare with competitor and find gaps
 */
export function compareWithCompetitor(yourSite: any, competitorSite: any): string[] {
  const gaps: string[] = []
  
  // They have pricing, you don't
  if (competitorSite.prices?.length > 0 && (!yourSite.prices || yourSite.prices.length === 0)) {
    gaps.push("Competitor shows prices, you don't - you're losing trust")
  }
  
  // They have more testimonials
  if ((competitorSite.testimonials?.length || 0) > (yourSite.testimonials?.length || 0)) {
    gaps.push(`Competitor has ${competitorSite.testimonials.length} testimonials, you have ${yourSite.testimonials?.length || 0}`)
  }
  
  // They have stronger CTAs
  const strongCTAs = ['free', 'instant', 'get your', 'claim', 'book now', 'start']
  const competitorHasStrong = competitorSite.ctas?.some((cta: string) => 
    strongCTAs.some(strong => cta.toLowerCase().includes(strong))
  )
  const youHaveStrong = yourSite.ctas?.some((cta: string) => 
    strongCTAs.some(strong => cta.toLowerCase().includes(strong))
  )
  
  if (competitorHasStrong && !youHaveStrong) {
    gaps.push("Competitor uses action words like 'Get Your Free...' - you use weak 'Contact Us'")
  }
  
  return gaps
}