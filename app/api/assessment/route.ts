import { NextRequest, NextResponse } from 'next/server'
import { createUser, createAssessment } from '@/lib/db'

export interface AssessmentData {
  id?: string
  userId?: string
  name: string
  email: string
  phone?: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  weight: number
  targetAreas: string[]
  goals: string[]
  medicalHistory: string[]
  lifestyle: {
    exercise: 'none' | 'light' | 'moderate' | 'heavy'
    diet: 'poor' | 'fair' | 'good' | 'excellent'
    smoking: boolean
    alcohol: 'none' | 'occasional' | 'moderate' | 'heavy'
  }
  photos?: {
    front?: string
    side?: string
    back?: string
  }
  preferences: {
    treatmentType: 'non-invasive' | 'minimally-invasive' | 'surgical' | 'any'
    budget: 'under-5k' | '5k-10k' | '10k-20k' | 'over-20k'
    timeline: 'immediate' | '1-3months' | '3-6months' | 'flexible'
  }
  createdAt?: string
  updatedAt?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: AssessmentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'age', 'gender', 'height', 'weight', 'targetAreas', 'goals']
    const missingFields = requiredFields.filter(field => !data[field as keyof AssessmentData])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Generate assessment ID
    const assessmentId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create assessment record with timestamp
    const assessment: AssessmentData = {
      ...data,
      id: assessmentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Save user to database
    const user = await createUser({
      email: data.email,
      phone: data.phone,
      first_name: data.name.split(' ')[0],
      last_name: data.name.split(' ')[1] || '',
    })
    
    // Calculate ProMax Lipo suitability
    const bmi = data.weight / ((data.height / 100) ** 2)
    const qualification = bmi > 18.5 && bmi < 35 ? 'qualified' : 'review_needed'
    const matchScore = calculateMatchScore(data)
    
    // Save assessment to database
    const assessmentRecord = await createAssessment({
      user_id: user.id,
      weight_loss_method: data.medicalHistory.includes('ozempic') ? 'ozempic' : 'other',
      weight_lost_kg: 0, // This would come from assessment questions
      skin_laxity_score: estimateSkinLaxity(data),
      recommended_treatment: 'ProMax Lipo',
      match_score: matchScore,
      qualification_status: qualification,
    })
    
    // Generate recommendations
    const recommendations = generateRecommendations(assessment)
    
    return NextResponse.json({
      success: true,
      assessmentId,
      data: assessment,
      recommendations,
    })
    
  } catch (error) {
    console.error('Assessment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('id')
    
    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }
    
    // TODO: Fetch from database
    // For now, return placeholder data
    return NextResponse.json({
      success: true,
      message: 'Assessment retrieval not implemented yet',
      assessmentId,
    })
    
  } catch (error) {
    console.error('Assessment GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateRecommendations(assessment: AssessmentData) {
  const recommendations = []
  
  // Basic BMI calculation
  const bmi = assessment.weight / ((assessment.height / 100) ** 2)
  
  if (bmi > 25) {
    recommendations.push({
      type: 'lifestyle',
      title: 'Weight Management',
      description: 'Consider combining treatments with a structured weight management program',
      priority: 'high'
    })
  }
  
  // Treatment recommendations based on target areas
  if (assessment.targetAreas.includes('abdomen')) {
    recommendations.push({
      type: 'treatment',
      title: 'CoolSculpting for Abdomen',
      description: 'Non-invasive fat reduction ideal for stubborn abdominal fat',
      priority: 'medium'
    })
  }
  
  if (assessment.targetAreas.includes('thighs')) {
    recommendations.push({
      type: 'treatment',
      title: 'Thigh Contouring',
      description: 'Targeted treatments for inner and outer thigh areas',
      priority: 'medium'
    })
  }
  
  // Lifestyle recommendations
  if (assessment.lifestyle.exercise === 'none' || assessment.lifestyle.exercise === 'light') {
    recommendations.push({
      type: 'lifestyle',
      title: 'Exercise Program',
      description: 'Incorporating regular exercise will enhance treatment results',
      priority: 'high'
    })
  }
  
  return recommendations
}

function calculateMatchScore(data: AssessmentData): number {
  let score = 50 // Base score
  
  // BMI factor
  const bmi = data.weight / ((data.height / 100) ** 2)
  if (bmi >= 20 && bmi <= 30) score += 20
  else if (bmi > 18.5 && bmi < 35) score += 10
  
  // Target areas factor
  if (data.targetAreas.includes('abdomen')) score += 10
  if (data.targetAreas.includes('flanks')) score += 10
  
  // Timeline factor
  if (data.preferences.timeline === 'immediate' || data.preferences.timeline === '1-3months') score += 10
  
  return Math.min(score, 100)
}

function estimateSkinLaxity(data: AssessmentData): number {
  // Estimate based on age and weight changes
  let laxityScore = 50
  
  if (data.age > 40) laxityScore += 15
  else if (data.age > 30) laxityScore += 10
  
  // Would need actual weight loss data from assessment
  // Higher scores indicate more laxity
  return Math.min(laxityScore, 100)
}