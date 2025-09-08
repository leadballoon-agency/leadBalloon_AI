/**
 * LeadBalloon AI Configuration
 */

export const config = {
  // Calendar booking link - Replace with your actual Calendly/Cal.com link
  CALENDAR_LINK: process.env.NEXT_PUBLIC_CALENDAR_LINK || 'https://calendly.com/leadballoon/strategy-call',
  
  // When to push for booking - ONLY after qualification
  BOOKING_TRIGGERS: {
    MIN_MESSAGES: 4, // Need proper qualification first
    MAX_MESSAGES: 8, // Definitely book by this point
    MUST_HAVE_BUDGET: true, // MUST know their budget first
    MUST_BE_OWNER: true, // MUST confirm they're the owner
    FRUSTRATION_EXPRESSED: true, // Book when they express pain
    SPECIFIC_QUESTIONS: true, // Book when they ask for specifics
  },
  
  // Booking messages based on trigger - FREE 30 minute call
  BOOKING_MESSAGES: {
    qualified_with_budget: "With your £[X] monthly budget, I can show you exactly how to double your conversions. I'll give you 30 minutes of my time for FREE to walk through your specific fixes: ",
    qualified_with_pain: "I hear you - you're spending £[X]/month and not seeing results. Let me show you exactly what's broken. FREE 30-minute strategy call? ",
    qualified_specific: "Based on your £[X] budget and [specific issue], I have a detailed breakdown for you. Let's jump on a FREE 30-minute screen share - I'll show you exactly what to fix: ",
    not_qualified: "Before I can help, I need to understand your situation better. What's your current monthly ad spend?",
    competitor_research: "Interesting you're researching [competitor]. Are you looking to compete with them? What's your budget for marketing?"
  }
}