// Partner Configuration
// This file contains partner-specific settings including tracking pixels, branding, and customizations

export interface PartnerConfig {
  id: string
  name: string
  domain: string
  branding?: {
    primaryColor?: string
    logo?: string
    companyName?: string
  }
  tracking: {
    // Meta/Facebook Pixel
    metaPixel?: {
      enabled: boolean
      pixelId: string
      events: {
        pageView: boolean
        leadStart: boolean
        leadComplete: boolean
        viewContent: boolean
        initiateCheckout: boolean
        completeRegistration: boolean
      }
    }
    // Google Analytics
    googleAnalytics?: {
      enabled: boolean
      measurementId: string
      events: {
        assessmentStart: boolean
        assessmentComplete: boolean
        emailSubmitted: boolean
      }
    }
    // Google Ads
    googleAds?: {
      enabled: boolean
      conversionId: string
      conversionLabel: string
    }
    // TikTok Pixel
    tiktokPixel?: {
      enabled: boolean
      pixelId: string
      events: {
        pageView: boolean
        submitForm: boolean
        completeRegistration: boolean
      }
    }
    // Custom tracking code
    customCode?: {
      head?: string // Injected in <head>
      bodyStart?: string // Injected at start of <body>
      bodyEnd?: string // Injected at end of <body>
      onAssessmentStart?: string // Executed when assessment starts
      onAssessmentComplete?: string // Executed when assessment completes
    }
  }
  // Custom copy overrides
  copyOverrides?: {
    spotsRemaining?: number
    offerValue?: string
    urgencyMessage?: string
  }
  // Feature toggles
  features?: {
    showPricing?: boolean
    showTestimonials?: boolean
    requirePhone?: boolean
    autoRedirect?: boolean
    redirectUrl?: string
  }
}

// Partner configurations database
export const partners: Record<string, PartnerConfig> = {
  // Default Skulpt configuration
  skulpt: {
    id: 'skulpt',
    name: 'Skulpt Body Contouring',
    domain: 'skulpt.co.uk',
    tracking: {
      metaPixel: {
        enabled: true,
        pixelId: 'YOUR_DEFAULT_PIXEL_ID', // Replace with actual Skulpt pixel ID
        events: {
          pageView: true,
          leadStart: true,
          leadComplete: true,
          viewContent: true,
          initiateCheckout: true,
          completeRegistration: true
        }
      },
      googleAnalytics: {
        enabled: true,
        measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
        events: {
          assessmentStart: true,
          assessmentComplete: true,
          emailSubmitted: true
        }
      }
    }
  },

  // SkinTite partner configuration
  skintite: {
    id: 'skintite',
    name: 'SkinTite UK',
    domain: 'skintite.uk',
    branding: {
      primaryColor: 'amber',
      companyName: 'SkinTite UK'
    },
    tracking: {
      metaPixel: {
        enabled: true,
        pixelId: 'SKINTITE_PIXEL_ID', // Replace with SkinTite's pixel ID
        events: {
          pageView: true,
          leadStart: true,
          leadComplete: true,
          viewContent: true,
          initiateCheckout: false,
          completeRegistration: true
        }
      },
      customCode: {
        head: `<!-- SkinTite Custom Tracking -->`,
        onAssessmentComplete: `
          // Custom conversion tracking for SkinTite
          console.log('SkinTite lead completed');
        `
      }
    },
    copyOverrides: {
      spotsRemaining: 5,
      urgencyMessage: 'Limited availability in your area'
    },
    features: {
      showPricing: false,
      requirePhone: true
    }
  },

  // Example partner template
  example: {
    id: 'example',
    name: 'Example Clinic',
    domain: 'example.com',
    branding: {
      primaryColor: 'blue',
      companyName: 'Example Clinic',
      logo: '/partners/example/logo.png'
    },
    tracking: {
      metaPixel: {
        enabled: true,
        pixelId: 'PARTNER_PIXEL_ID',
        events: {
          pageView: true,
          leadStart: true,
          leadComplete: true,
          viewContent: true,
          initiateCheckout: true,
          completeRegistration: true
        }
      },
      googleAds: {
        enabled: true,
        conversionId: 'AW-XXXXXXXXX',
        conversionLabel: 'XXXXXXXXX'
      },
      tiktokPixel: {
        enabled: true,
        pixelId: 'XXXXXXXXX',
        events: {
          pageView: true,
          submitForm: true,
          completeRegistration: true
        }
      }
    },
    copyOverrides: {
      spotsRemaining: 10,
      offerValue: '£750',
      urgencyMessage: 'Special offer ends soon!'
    },
    features: {
      showPricing: true,
      showTestimonials: true,
      requirePhone: false,
      autoRedirect: true,
      redirectUrl: 'https://example.com/thank-you'
    }
  }
}

// Helper function to get partner config
export function getPartnerConfig(partnerId: string): PartnerConfig {
  // Return partner config if exists, otherwise return default (skulpt)
  return partners[partnerId] || partners.skulpt
}

// Helper function to merge partner config with defaults
export function mergeWithDefaults(partnerId: string, defaults: any): any {
  const partnerConfig = getPartnerConfig(partnerId)
  
  return {
    ...defaults,
    ...partnerConfig.copyOverrides,
    branding: {
      ...defaults.branding,
      ...partnerConfig.branding
    },
    features: {
      ...defaults.features,
      ...partnerConfig.features
    }
  }
}