// Assessment Widget Configuration
// Edit this file to customize the assessment widget copy, values, and behavior

export const assessmentConfig = {
  // General Settings
  settings: {
    totalSteps: 10,
    showProgressBar: true,
    showTrustBadge: true,
    enableConfetti: true,
    confettiThreshold: 15, // Percentage weight loss to trigger confetti
  },

  // Trust Badge
  trustBadge: {
    text: "Private & Secure Assessment",
    icon: "shield", // Options: shield, lock, checkmark
  },

  // Journey Names Configuration
  journeyNames: {
    adjectives: ['Brave', 'Radiant', 'Phoenix', 'Stellar', 'Golden', 'Diamond', 'Fierce', 'Brilliant', 'Mighty', 'Fearless'],
    nouns: ['Butterfly', 'Star', 'Warrior', 'Champion', 'Tiger', 'Eagle', 'Phoenix', 'Lion', 'Dragon', 'Hero'],
  },

  // Step 1: Name Collection
  step1: {
    icon: "✨",
    title: "Let's Start Your Journey",
    subtitle: "First, what should we call you?",
    inputLabel: "Your first name",
    inputPlaceholder: "Enter your first name...",
    continueButton: "Continue to Journey Name",
    journeyNameIntro: "Welcome {name}! For your journey, you'll be known as:",
    journeyNameWhy: {
      title: "Why a journey name?",
      description: "Just like Disney characters transform through their adventures, this name represents your transformation story. It protects your privacy while making you the hero of your own journey. Every superhero needs a name that inspires them! 🦸‍♀️"
    },
    tryDifferentName: "✨ Try a different journey name",
  },

  // Step 2: Weight Loss Timeline
  step2: {
    title: "Hello, {aliasName}! 👋",
    subtitle: "How long ago did you start losing weight?",
    options: [
      { value: '3months', label: 'Less than 3 months ago', emoji: '🌱' },
      { value: '6months', label: '3-6 months ago', emoji: '📈' },
      { value: '1year', label: '6-12 months ago', emoji: '💪' },
      { value: 'over1year', label: 'Over a year ago', emoji: '🏆' }
    ]
  },

  // Step 3: Weight Loss Method
  step3: {
    title: "What method helped you lose weight?",
    subtitle: "This helps us customize your skin tightening approach",
    options: [
      { value: 'ozempic', label: 'GLP-1 Medications (Ozempic, Wegovy, etc.)', hot: true, hotLabel: 'POPULAR' },
      { value: 'diet', label: 'Diet & Exercise', hot: false },
      { value: 'surgery', label: 'Bariatric Surgery', hot: false },
      { value: 'other', label: 'Other Methods', hot: false }
    ],
    didYouKnow: {
      show: true,
      text: "68% of our clients used GLP-1 medications"
    }
  },

  // Step 4: Weight Loss Percentage
  step4: {
    title: "What percentage of your body weight did you lose?",
    subtitle: "Most people lose between 10-30% with GLP-1 medications",
    options: [
      { value: 5, label: 'Less than 10%', emoji: '📉' },
      { value: 12, label: '10-15%', emoji: '💪' },
      { value: 18, label: '15-20%', emoji: '🔥', highlight: 'Significant transformation!' },
      { value: 25, label: '20-30%', emoji: '🚀', highlight: 'Significant transformation!' },
      { value: 35, label: 'Over 30%', emoji: '🏆', highlight: 'Significant transformation!' }
    ],
    helper: "💡 Not sure? If you went from 200lbs to 160lbs, that's 20%",
    responses: {
      amazing: {
        threshold: 20,
        title: "INCREDIBLE TRANSFORMATION! 🎉",
        message: "Losing {percentage}% of your body weight is absolutely phenomenal! You're a true champion!"
      },
      great: {
        threshold: 15,
        title: "Amazing Achievement! 🌟",
        message: "A {percentage}% weight loss is extraordinary! You've shown incredible dedication!"
      },
      good: {
        threshold: 10,
        title: "Excellent Progress!",
        message: "A {percentage}% weight loss is significant. Well done!"
      },
      starter: {
        threshold: 0,
        title: "Good Start!",
        message: "Every journey begins with a single step. Let us help you reach your goals."
      }
    }
  },

  // Step 5: Current Feelings
  step5: {
    title: "How are you feeling about your body now?",
    options: [
      { value: 'frustrated', label: 'Proud but frustrated with loose skin', emoji: '😔' },
      { value: 'excited', label: 'Excited but need help with the final step', emoji: '🎯' },
      { value: 'confident', label: 'More confident but want to look my best', emoji: '💪' },
      { value: 'happy', label: 'Happy but self-conscious about saggy areas', emoji: '🤔' }
    ]
  },

  // Step 6: Problem Areas
  step6: {
    title: "Which areas concern you most? 🎯",
    subtitle: "Select all that apply - we'll focus on these in your treatment",
    areas: [
      { value: 'tummy', label: 'Tummy / Abdomen', emoji: '🎯', description: 'Loose skin, "apron belly", or saggy stomach' },
      { value: 'arms', label: 'Arms', emoji: '💪', description: 'Bat wings or loose underarm skin' },
      { value: 'thighs', label: 'Thighs', emoji: '🦵', description: 'Inner thigh sagging or excess skin' },
      { value: 'chest', label: 'Chest / Breasts', emoji: '💎', description: 'Deflated or sagging after weight loss' },
      { value: 'back', label: 'Back', emoji: '🎯', description: 'Back rolls or bra bulge area' },
      { value: 'face', label: 'Face / Neck', emoji: '✨', description: 'Jowls, turkey neck, or facial sagging' },
      { value: 'buttocks', label: 'Buttocks', emoji: '🍑', description: 'Lost volume or sagging' }
    ],
    feedback: {
      single: "✨ We can definitely help with this area!",
      multiple: "✨ {count} areas selected - we'll create a comprehensive treatment plan!"
    },
    continueButton: {
      disabled: "Select at least one area to continue",
      enabled: "Continue to Your Treatment Plan →"
    }
  },

  // Step 7: Treatment Plan
  step7: {
    title: "{aliasName}, Your Personalized Treatment Plan 🌟",
    subtitle: "Based on your {percentage}% weight loss journey",
    qualificationBadge: {
      title: "✨ VIP Qualified!",
      badge: "TOP 5%",
      message: "You're among the elite who've achieved {level} weight loss"
    },
    treatmentDetails: {
      title: "Your Recommended Treatment",
      treatment: "ProMax Lipo Skin Tightening",
      sessionRanges: {
        high: { threshold: 15, sessions: "6-8" },
        medium: { threshold: 10, sessions: "4-6" },
        low: { threshold: 0, sessions: "3-4" }
      },
      timeline: "Results in 4-6 weeks"
    },
    pricing: {
      title: "Investment Range",
      subtitle: "Personalized for your transformation",
      badge: "Limited Time",
      ranges: {
        high: { threshold: 20, min: "£2,997", max: "£4,997" },
        medium: { threshold: 15, min: "£1,997", max: "£3,497" },
        low: { threshold: 0, min: "£997", max: "£2,497" }
      },
      financing: "💳 Flexible payment plans available • 0% finance options"
    },
    continueButton: "See Your Transformation Timeline →"
  },

  // Step 8: Timeline
  step8: {
    title: "Your 90-Day Transformation Timeline 📅",
    subtitle: "Here's exactly what to expect, {aliasName}",
    timeline: [
      { week: "1-2", title: "Initial Consultation", description: "3D body scan, personalized plan, first treatment" },
      { week: "3-6", title: "Active Treatment", description: "Weekly sessions, visible tightening begins" },
      { week: "7-12", title: "Transformation", description: "Dramatic results, final sculpting sessions" },
      { week: "Day 90", title: "Your New Body", description: "Final reveal, maintenance plan, lifetime support" }
    ],
    results: {
      title: "Expected Results",
      stats: [
        { value: "89%", label: "Report firmer skin" },
        { value: "3-5\"", label: "Average reduction" },
        { value: "94%", label: "Would recommend" },
        { value: "4 wks", label: "To visible results" }
      ]
    },
    continueButton: "Unlock Your Transformation Dashboard →",
    helper: "No payment required • Instant access to your plan"
  },

  // Step 9: Email Collection
  step9: {
    badge: "FINAL STEP - SECURE ACCESS",
    title: "{aliasName}, Your Dashboard is Ready!",
    subtitle: "Enter your email to create your secure account and access everything",
    benefits: {
      title: "🎆 What's waiting for you inside:",
      items: [
        "Your treatment plan",
        "Pricing calculator",
        "Before/after gallery",
        "Book consultation",
        "Progress tracker",
        "VIP support chat"
      ]
    },
    emailField: {
      label: "Email Address",
      placeholder: "your@email.com",
      helper: "🔒 Your email creates your secure account and is never shared"
    },
    phoneField: {
      label: "Phone Number",
      labelHelper: "(Optional - for VIP perks)",
      placeholder: "(555) 123-4567",
      helper: "📱 Get text updates, priority booking, and exclusive offers"
    },
    submitButton: "Create My Account & Access Dashboard →",
    terms: "By continuing, you agree to our Terms of Service and Privacy Policy"
  },

  // Step 10: Success
  step10: {
    icon: "✓",
    title: "Welcome to Skulpt, {aliasName}!",
    subtitle: "Your transformation journey begins now",
    accountCreated: "✅ Account Created Successfully",
    nextSteps: {
      title: "🎉 What happens next:",
      items: [
        { icon: "🚀", text: "Personal dashboard as {aliasName}" },
        { icon: "📊", text: "Your {percentage}% weight loss treatment plan" },
        { icon: "📅", text: "Priority consultation booking" },
        { icon: "🎆", text: "VIP member benefits" }
      ]
    },
    dashboardButton: "Enter Your Dashboard →",
    emailSent: "📧 We've sent your login details to {email}"
  }
}

// Value Settings - Easy to update pricing and offers
export const valueSettings = {
  consultation: {
    name: "FREE Consultation",
    value: "£150",
    included: true
  },
  bodyScan: {
    name: "3D Body Scan & Analysis",
    value: "£200",
    included: true
  },
  treatmentPlan: {
    name: "Personalized Treatment Plan",
    value: "£150",
    included: true
  },
  guarantee: {
    name: "100% Money-Back Guarantee",
    value: null,
    included: true
  },
  totalValue: "£500",
  todayPrice: "FREE",
  spotsRemaining: 7,
  offerDuration: {
    hours: 23,
    minutes: 59,
    seconds: 59
  }
}

// Color Theme Configuration
export const themeConfig = {
  primary: "amber",
  primaryShades: {
    light: "400",
    default: "500",
    dark: "600"
  },
  success: "green",
  danger: "red",
  background: {
    dark: "black",
    medium: "gray-900",
    light: "gray-800"
  }
}