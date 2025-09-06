'use client'

import { useEffect, useState } from 'react'

const analyzingSteps = [
  { id: 1, label: 'Scanning website content', icon: '🔍' },
  { id: 2, label: 'Analyzing conversion elements', icon: '📊' },
  { id: 3, label: 'Researching competitors', icon: '🎯' },
  { id: 4, label: 'Applying AI optimization', icon: '🤖' },
  { id: 5, label: 'Generating your widget', icon: '✨' }
]

export default function AnalyzingPage({ url }: { url: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    // Simulate progress through steps
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analyzingSteps.length - 1) {
          // Add mock insights as we progress
          const mockInsights = [
            'Found pricing structure: Premium service model',
            'Identified target audience: Health-conscious professionals',
            'Detected urgency triggers in current copy',
            'Competitor analysis: 3 similar services found',
            'Optimal offer structure identified'
          ]
          if (mockInsights[prev]) {
            setInsights(current => [...current, mockInsights[prev]])
          }
          return prev + 1
        }
        return prev
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-3xl font-extralight tracking-wider mb-4">
            <span className="text-amber-400">Lead</span>
            <span className="text-amber-600">Balloon</span>
          </div>
          <p className="text-gray-400 text-sm">AI is analyzing your website</p>
        </div>

        {/* URL Being Analyzed */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 mb-8 border border-gray-700">
          <p className="text-xs text-gray-500 mb-1">Analyzing</p>
          <p className="text-white font-mono text-sm truncate">{url}</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {analyzingSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-4 transition-all duration-500 ${
                index <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`text-2xl transition-all duration-500 ${
                index <= currentStep ? 'scale-110' : 'scale-100'
              }`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className={`text-sm transition-colors duration-500 ${
                    index <= currentStep ? 'text-white' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </p>
                  {index < currentStep && (
                    <span className="text-green-400 text-xs">✓</span>
                  )}
                  {index === currentStep && (
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  )}
                </div>
                {index <= currentStep && (
                  <div className="mt-1 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000"
                       style={{ width: index < currentStep ? '100%' : '60%' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live Insights */}
        {insights.length > 0 && (
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Insights discovered</p>
            <div className="space-y-1">
              {insights.map((insight, i) => (
                <p key={i} className="text-xs text-gray-400 animate-fadeIn">
                  • {insight}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Time Estimate */}
        <p className="text-center text-xs text-gray-600 mt-8">
          This usually takes 10-15 seconds
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  )
}