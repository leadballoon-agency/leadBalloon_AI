/**
 * Get industry-specific knowledge for the system prompt
 */

export function getIndustryKnowledge(industry: string | null): string {
  if (!industry) return ''
  
  const knowledgeMap: Record<string, string> = {
    bodyContouring: `
Key insights for body contouring:
- Average lead costs: £15-50 depending on targeting
- Conversion rates: 35-45% for qualified leads
- Successful strategy: Target gym members who stopped going
- Competition: Transform, 3D Lipo spending £30-50k+/month
- SLO Strategy: Offer £97 skin analysis that covers ad costs, making leads "free"
- Finance psychology: Say "73% choose our payment plan" not "finance available"
- Consultation hack: Charge £50 refundable deposit - increases show rate to 85%`,

    solarPV: `
Key insights for solar PV:
- Average lead costs: £20-60 for qualified homeowners
- Sweet spot: Target homes worth £350k+ with south-facing roofs
- Energy bill pain: Anyone paying £200+/month is prime target
- Competition: National installers spending £100k+/month on Google Ads
- Trust builders: MCS certification, workmanship warranties essential
- Finance angle: "Save more than the monthly payment" messaging works
- Objection handler: "Waiting for prices to drop" = show them they're losing £200/month waiting`,

    prp: `
Key insights for PRP/hair restoration:
- Average lead costs: £40-80 for hair loss sufferers
- High ticket: Average treatment value £2,500-4,500
- Target demographics: Men 35-55 experiencing early hair loss
- Competition: Harley Street clinics dominating but vulnerable to local providers
- Psychology: Focus on "regain confidence" not "stop hair loss"
- Consultation conversion: 60%+ when showing real patient results
- Package deals: 3-session packages convert 2x better than single treatments`,

    hifu: `
Key insights for HIFU/skin tightening:
- Average lead costs: £25-70 for age 40-60 demographic
- Sweet spot: Target "pre-surgical" market - those considering but afraid of facelifts
- Competition: Medical spas charging £800-2000 per session
- Trust factor: Before/after photos crucial - must show realistic results
- Positioning: "Lunch hour facelift" messaging resonates
- Upsell opportunity: Combine with other treatments for "total rejuvenation"
- Social proof: Video testimonials convert 3x better than text`,

    laserHairRemoval: `
Key insights for laser hair removal:
- Average lead costs: £10-35 (lowest in aesthetics)
- Volume play: Need 50+ treatments/week for profitability
- Seasonal: 40% of annual revenue in March-June
- Competition: National chains doing package deals
- Winning strategy: Target specific ethnicities with appropriate laser types
- Package psychology: "Unlimited sessions for 2 years" beats per-session pricing
- Male market: Underserved, 30% higher average spend`,

    veinClinic: `
Key insights for vein treatment:
- Average lead costs: £45-90 for medical procedures
- Insurance angle: Many treatments covered but patients don't know
- Target demographic: Women 45-65, teachers/nurses/retail workers
- Competition: NHS wait times are your friend - 18+ months
- Trust builders: Medical credentials essential, doctor-led messaging
- Consultation strategy: Free vein screening events drive mass bookings
- Referral goldmine: GPs relationship crucial for steady flow`,

    pregnancyScanning: `
Key insights for pregnancy scanning:
- Average lead costs: £15-40 for expectant parents
- Emotional purchase: Gender reveal scans are pure profit
- Peak times: Saturday appointments book 3 weeks out
- Competition: NHS provides basic, you provide experience
- Package deals: "Journey packages" from 6 weeks to birth
- Partner inclusion: "Daddy's first look" messaging powerful
- Referral engine: Midwife relationships worth gold`,

    drivingInstructor: `
Key insights for driving instructors:
- Average lead costs: £5-20 for learner drivers
- Block booking: 10-hour packages increase LTV by 300%
- Competition: Independent instructors underpricing
- Pass rates: Advertise yours if above 60%
- Intensive courses: £1000+ packages for quick passes
- Parent targeting: "Gift lessons" for 17th birthdays
- Referral strategy: £50 off for successful referrals`,

    firstAid: `
Key insights for first aid training:
- Average lead costs: £10-30 for workplace training
- B2B goldmine: Companies need annual refreshers by law
- Competition: Red Cross/St Johns have brand but not flexibility
- Winning angle: On-site training saves them time
- Compliance fear: "HSE compliant" messaging crucial
- Bulk deals: 10+ person discounts drive bigger contracts
- Recurring revenue: Annual contracts worth 5x one-off training`
  }
  
  return knowledgeMap[industry] || ''
}