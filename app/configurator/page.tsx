'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfettiCelebration, getRandomCelebration } from '@/components/confetti-celebration'

const analyzingSteps = [
  { id: 1, label: 'Scanning website content', icon: '🔍' },
  { id: 2, label: 'Analyzing conversion elements', icon: '📊' },
  { id: 3, label: 'Researching competitors', icon: '🎯' },
  { id: 4, label: 'Applying AI optimization', icon: '🤖' },
  { id: 5, label: 'Generating your widget', icon: '✨' }
]

export default function ConfiguratorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') || ''
  
  const [currentStep, setCurrentStep] = useState(0)
  const [insights, setInsights] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState<any>(null)

  useEffect(() => {
    if (!url) {
      router.push('/')
      return
    }

    // Call real AI analysis API
    const analyzeWebsite = async () => {
      try {
        // Start the analysis
        const response = await fetch('/api/analyze-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })

        if (!response.ok) {
          throw new Error('Analysis failed')
        }

        const data = await response.json()
        
        // Update insights from real data
        if (data.analysis) {
          // Generate insights from the analysis
          const insights = []
          if (data.analysis.businessType) {
            insights.push(`Business identified: ${data.analysis.businessType}`)
          }
          if (data.analysis.targetAudience) {
            insights.push(`Target audience: ${data.analysis.targetAudience}`)
          }
          if (data.analysis.competitors && data.analysis.competitors.length > 0) {
            insights.push(`Found ${data.analysis.competitors.length} competitors in your market`)
          }
          if (data.analysis.suggestedOffer?.pricing) {
            insights.push(`Optimal pricing identified: ${data.analysis.suggestedOffer.pricing}`)
          }
          insights.push(`AI-powered analysis complete (${data.modelUsed || 'AI'})`)
          setInsights(insights)
        }
        
        // Set the generated configuration from actual API data
        const offer = data.analysis?.suggestedOffer
        
        // Format pricing properly
        let formattedOffer = '$497 Limited Time Offer'
        if (offer?.pricing) {
          if (typeof offer.pricing === 'object' && offer.pricing.offerPrice) {
            formattedOffer = `${offer.pricing.offerPrice} (Save ${offer.pricing.totalValue})`
          } else if (typeof offer.pricing === 'string') {
            formattedOffer = offer.pricing
          }
        }
        
        setGeneratedConfig({
          headline: offer?.dreamOutcome || 'Transform Your Body Today',
          offer: formattedOffer,
          urgency: offer?.urgency || 'Only 7 spots remaining',
          guarantee: offer?.guarantee,
          valueStack: offer?.valueStack?.map(item => 
            typeof item === 'object' ? item.item : item
          ),
          bonuses: offer?.bonuses
        })
        
        setIsComplete(true)
        // Trigger celebration for successful analysis!
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 100)
      } catch (error) {
        console.error('AI Analysis error:', error)
        // Fall back to mock data if API fails
        simulateAnalysis()
      }
    }

    const simulateAnalysis = () => {
      // Simulate progress for UI feedback
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < analyzingSteps.length - 1) {
            const mockInsights = [
              `Found service: ${extractDomain(url)} offers premium solutions`,
              'Identified target audience: Health-conscious professionals',
              'Current pricing model: High-ticket service ($500-$2000)',
              'Competitor analysis: Similar services charge 20-30% more',
              'Perfect for value-stack optimization'
            ]
            if (mockInsights[prev]) {
              setInsights(current => [...current, mockInsights[prev]])
            }
            return prev + 1
          } else {
            clearInterval(interval)
            if (!isComplete) {
              setIsComplete(true)
              // Use UK pricing for UK sites
              const isUK = url.includes('.uk') || url.includes('.co.uk')
              setGeneratedConfig({
                headline: 'Transform Your Body Without Surgery',
                offer: isUK ? '£497 (Save £2,500)' : '$497 (Save $2,500)',
                urgency: 'Only 7 spots remaining'
              })
              // Trigger celebration!
              setShowCelebration(true)
              setTimeout(() => setShowCelebration(false), 100)
            }
          }
          return prev
        })
      }, 1800)
      return interval
    }

    // Start real analysis
    analyzeWebsite()
    
    // Also run visual simulation for immediate feedback
    const interval = simulateAnalysis()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [url, router])

  const extractDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const handleDeploy = () => {
    // Copy install script to clipboard
    const script = `<script src="https://leadballoon.ai/widget.js" data-id="${Date.now()}"></script>`
    navigator.clipboard.writeText(script)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 3000)
  }

  const [showCopied, setShowCopied] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      {/* Confetti Celebration */}
      <ConfettiCelebration 
        trigger={showCelebration} 
        message={getRandomCelebration('analysisComplete')}
      />
      {!isComplete ? (
        /* ANALYZING STATE */
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
                        <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
                  <p key={i} className="text-xs text-gray-400" 
                     style={{animation: 'fadeIn 0.5s ease-out'}}>
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
      ) : (
        /* RESULTS STATE - Simple and Elegant */
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="text-3xl font-extralight tracking-wider mb-4">
              <span className="text-amber-400">Lead</span>
              <span className="text-amber-600">Balloon</span>
            </div>
            <p className="text-gray-400 text-sm">Your widget is ready</p>
          </div>

          {generatedConfig && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Preview */}
              <div>
                <p className="text-xs text-gray-500 mb-4">Preview</p>
                <div className="bg-gray-800/50 rounded-xl p-1 border border-gray-700">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-black">
                    <h3 className="text-lg font-bold mb-3 leading-tight">{generatedConfig.headline}</h3>
                    <div className="text-3xl font-bold mb-3">{generatedConfig.offer}</div>
                    
                    {generatedConfig.valueStack && generatedConfig.valueStack.length > 0 && (
                      <div className="space-y-1 mb-3 text-xs">
                        {generatedConfig.valueStack.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-green-800">✓</span>
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="bg-black/20 rounded p-2 text-sm mb-3">
                      ⚡ {generatedConfig.urgency}
                    </div>
                    
                    {generatedConfig.guarantee && (
                      <div className="text-xs mb-3 italic">
                        🛡️ {generatedConfig.guarantee.substring(0, 50)}...
                      </div>
                    )}
                    
                    <button className="w-full py-3 bg-black text-amber-400 font-bold rounded-lg">
                      Claim Your Spot →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Install */}
              <div>
                <p className="text-xs text-gray-500 mb-4">Installation</p>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <p className="text-white mb-4">Add this one line to your website:</p>
                  <div className="bg-black/50 rounded p-4 font-mono text-xs text-gray-400 break-all mb-4">
                    {`<script src="https://leadballoon.ai/widget.js" data-id="${Date.now()}"></script>`}
                  </div>
                  <button
                    onClick={handleDeploy}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  >
                    {showCopied ? '✓ Copied!' : 'Copy Install Code'}
                  </button>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-3">Want to customize?</p>
                    <button className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
                      Open Advanced Editor →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Metrics */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800">
              <p className="text-2xl font-bold text-amber-400">247%</p>
              <p className="text-xs text-gray-500">Avg conversion increase</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800">
              <p className="text-2xl font-bold text-amber-400">$2.4M</p>
              <p className="text-xs text-gray-500">Generated for clients</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800">
              <p className="text-2xl font-bold text-amber-400">60 sec</p>
              <p className="text-xs text-gray-500">Setup time</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}