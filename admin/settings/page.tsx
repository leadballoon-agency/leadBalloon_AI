'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Preview widgets
const OfferWidget = dynamic(() => import('../../widgets/offer-widget/page'), { ssr: false })
const AssessmentWidget = dynamic(() => import('../../widgets/assessment-widget/page'), { ssr: false })

// Step components
import DreamOutcomeStep from './steps/DreamOutcomeStep'
// TODO: Create missing step components
// import ValueStackStep from './steps/ValueStackStep'
// import PricingStep from './steps/PricingStep'
// import GuaranteeStep from './steps/GuaranteeStep'
// import UrgencyStep from './steps/UrgencyStep'
// import PreviewOfferStep from './steps/PreviewOfferStep'
// import QualificationStep from './steps/QualificationStep'
// import ThresholdsStep from './steps/ThresholdsStep'
// import LaunchStyleStep from './steps/LaunchStyleStep'
// import TrackingStep from './steps/TrackingStep'

interface ConfigData {
  dreamOutcome: string
  valueStack: Array<{
    item: string
    value: string
    description: string
  }>
  pricing: {
    totalValue: number
    offerPrice: number
    hasPaymentPlan: boolean
    paymentPlanPrice?: number
  }
  guarantee: {
    type: 'refund' | 'double' | 'pay-after'
    text: string
  }
  urgency: {
    spots: number
    timerHours: number
    timerMinutes: number
    expiryAction: 'price-increase' | 'bonuses-expire' | 'enrollment-closes'
  }
  qualification: {
    questions: Array<{
      question: string
      options: string[]
      scores: number[]
    }>
  }
  thresholds: {
    minimumScore: number
    autoDisqualify: {
      lowBudget: boolean
      notUrgent: boolean
      cantCommit: boolean
    }
  }
  launchStyle: {
    trigger: 'time' | 'scroll' | 'exit' | 'button'
    display: 'fullscreen' | 'slide' | 'bar' | 'embedded'
  }
  tracking: {
    facebookPixel?: string
    googleAnalytics?: string
    tiktokPixel?: string
  }
}

const STEPS = [
  { id: 'dream-outcome', name: 'Dream Outcome', component: DreamOutcomeStep },
  // TODO: Add these components when they're created
  // { id: 'value-stack', name: 'Value Stack', component: ValueStackStep },
  // { id: 'pricing', name: 'Set Price', component: PricingStep },
  // { id: 'guarantee', name: 'Guarantee', component: GuaranteeStep },
  // { id: 'urgency', name: 'Urgency', component: UrgencyStep },
  // { id: 'preview-offer', name: 'Preview Offer', component: PreviewOfferStep },
  // { id: 'qualification', name: 'Qualification', component: QualificationStep },
  // { id: 'thresholds', name: 'Thresholds', component: ThresholdsStep },
  // { id: 'launch-style', name: 'Launch Style', component: LaunchStyleStep },
  // { id: 'tracking', name: 'Tracking', component: TrackingStep }
]

export default function ElegantConfigurator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<ConfigData>({
    dreamOutcome: '',
    valueStack: [],
    pricing: {
      totalValue: 0,
      offerPrice: 0,
      hasPaymentPlan: false
    },
    guarantee: {
      type: 'refund',
      text: ''
    },
    urgency: {
      spots: 7,
      timerHours: 23,
      timerMinutes: 59,
      expiryAction: 'enrollment-closes'
    },
    qualification: {
      questions: []
    },
    thresholds: {
      minimumScore: 7,
      autoDisqualify: {
        lowBudget: true,
        notUrgent: false,
        cantCommit: false
      }
    },
    launchStyle: {
      trigger: 'time',
      display: 'fullscreen'
    },
    tracking: {}
  })

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('leadballoon_config', JSON.stringify(config))
    }, 1000)
    return () => clearTimeout(timer)
  }, [config])

  // Load saved config on mount
  useEffect(() => {
    const saved = localStorage.getItem('leadballoon_config')
    if (saved) {
      setConfig(JSON.parse(saved))
    }
  }, [])

  const CurrentStepComponent = STEPS[currentStep].component

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.dreamOutcome.length > 10
      case 1: return config.valueStack.length >= 3
      case 2: return config.pricing.offerPrice > 0
      case 3: return config.guarantee.text.length > 10
      case 4: return true // Urgency has defaults
      case 5: return true // Preview, just continue
      case 6: return config.qualification.questions.length >= 2
      case 7: return true // Thresholds have defaults
      case 8: return true // Launch style has defaults
      case 9: return true // Tracking is optional
      default: return false
    }
  }

  const updateConfig = (updates: Partial<ConfigData>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Clean Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">LeadBalloon AI</h1>
                <p className="text-sm text-gray-500">Build Your Perfect Offer</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.length}</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Step Content */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Step Header */}
              <div className="bg-gradient-to-r from-primary-50 to-white p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">{currentStep + 1}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {STEPS[currentStep].name}
                  </h2>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                <CurrentStepComponent 
                  config={config}
                  updateConfig={updateConfig}
                />
              </div>

              {/* Navigation */}
              <div className="px-8 pb-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  ← Back
                </button>

                <button
                  onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all ${
                    canProceed()
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep === STEPS.length - 1 ? 'Launch 🚀' : 'Next →'}
                </button>
              </div>
            </div>

            {/* Step Hints */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 font-medium mb-1">💡 Pro Tip</p>
              <p className="text-xs text-gray-700">
                {currentStep === 0 && "Focus on the transformation, not the features. What will their life look like after?"}
                {currentStep === 1 && "Stack value until the price becomes irrelevant. Each component should solve a specific problem."}
                {currentStep === 2 && "Price at 10-20% of total value for maximum perceived value."}
                {currentStep === 3 && "Make your guarantee so strong that NOT buying feels risky."}
                {currentStep === 4 && "Urgency without a reason is manipulation. Always explain WHY it's limited."}
                {currentStep === 5 && "This is exactly what your visitors will see. Make sure it's irresistible!"}
                {currentStep === 6 && "Qualify for commitment and budget. You want buyers, not browsers."}
                {currentStep === 7 && "Set thresholds high enough to filter tire-kickers but not so high you lose good leads."}
                {currentStep === 8 && "Exit intent is highest converting. Time-based is least intrusive."}
                {currentStep === 9 && "Tracking is optional but recommended. You can't improve what you don't measure."}
              </p>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-white p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  Live Preview
                </h3>
                <p className="text-sm text-gray-500 mt-1">See your changes in real-time</p>
              </div>

              <div className="bg-gray-900 max-h-[600px] overflow-y-auto">
                {currentStep <= 5 ? (
                  <OfferWidget />
                ) : (
                  <AssessmentWidget />
                )}
              </div>

              {/* Preview Info */}
              <div className="p-4 bg-gray-50 border-t text-center">
                <p className="text-sm text-gray-600">
                  {currentStep <= 5 ? 'Offer Widget Preview' : 'Assessment Widget Preview'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Timeline (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    idx < currentStep
                      ? 'bg-green-500 text-white'
                      : idx === currentStep
                      ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <span className={`ml-2 text-xs hidden md:block ${
                    idx === currentStep ? 'text-gray-900 font-semibold' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}