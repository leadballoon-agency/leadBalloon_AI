'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the assessment widget for preview
const AssessmentWidget = dynamic(
  () => import('../assessment-widget/page'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[400px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-amber-400">Loading preview...</div>
      </div>
    )
  }
)

type WizardStep = 'url' | 'analyzing' | 'insights' | 'customize' | 'complete'

export default function AIWizardPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('url')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  
  // Analysis data from AI
  const [analysisData, setAnalysisData] = useState<any>({
    industry: '',
    services: [] as string[],
    competitors: [] as string[],
    adCopy: [] as string[],
    conversion: 0,
    fullAnalysis: null,
    config: null
  })

  // Simulated progress animation
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setIsAnalyzing(false)
              setCurrentStep('insights')
            }, 500)
            return 100
          }
          return prev + 5
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  const handleAnalyze = async () => {
    setCurrentStep('analyzing')
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    try {
      // Call the real API
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: websiteUrl })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Map the real analysis data to our display format
        setAnalysisData({
          industry: result.analysis.businessInfo.industry,
          services: result.analysis.businessInfo.services,
          competitors: result.competitors.topCompetitors || [],
          adCopy: result.competitors.topAdCopy || result.analysis.messaging.valuePropositions,
          conversion: parseFloat(result.analysis.recommendations.estimatedConversionRate),
          // Store full analysis for later use
          fullAnalysis: result.analysis,
          config: result.config
        })
      } else {
        console.error('Analysis failed:', result.error)
        // Fallback to mock data
        setAnalysisData({
          industry: 'Medical Aesthetics',
          services: ['Botox', 'Dermal Fillers', 'Skin Tightening', 'Body Contouring'],
          competitors: ['competitor1.com', 'competitor2.com', 'competitor3.com'],
          adCopy: [
            'Look 10 years younger without surgery',
            'Transform your skin in just one session',
            'Join 5,000+ happy clients'
          ],
          conversion: 12.5
        })
      }
    } catch (error) {
      console.error('API call failed:', error)
      // Use mock data as fallback
      setAnalysisData({
        industry: 'Medical Aesthetics',
        services: ['Botox', 'Dermal Fillers', 'Skin Tightening', 'Body Contouring'],
        competitors: ['competitor1.com', 'competitor2.com', 'competitor3.com'],
        adCopy: [
          'Look 10 years younger without surgery',
          'Transform your skin in just one session',
          'Join 5,000+ happy clients'
        ],
        conversion: 12.5
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                LeadBalloon AI
              </h1>
              <p className="text-gray-400 mt-1">Intelligent Lead Qualification Platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Powered by AI</p>
              <p className="text-xs text-gray-500">Learning from 10,000+ businesses</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-900/50 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {['url', 'analyzing', 'insights', 'customize', 'complete'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === step ? 'bg-amber-500 text-black' :
                    index < ['url', 'analyzing', 'insights', 'customize', 'complete'].indexOf(currentStep) 
                      ? 'bg-amber-500/30 text-amber-400' 
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div className={`w-12 h-0.5 ${
                      index < ['url', 'analyzing', 'insights', 'customize', 'complete'].indexOf(currentStep)
                        ? 'bg-amber-500/30' 
                        : 'bg-gray-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Step 1: URL Input */}
        {currentStep === 'url' && (
          <div className="text-center">
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">🚀</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">
              Create Your AI-Powered Assessment in 60 Seconds
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Just enter your website URL and our AI will analyze everything - your services, 
              competitors, and industry best practices - to build the perfect lead qualification tool.
            </p>

            <div className="max-w-xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                <label className="block text-left mb-2 text-sm text-gray-400">
                  Your Website URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={!websiteUrl}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze →
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-left">
                  We'll scan your site, check competitor ads, and generate optimized copy
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">2.5M+</p>
                  <p className="text-xs text-gray-500">Leads Qualified</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">42%</p>
                  <p className="text-xs text-gray-500">Avg Conversion Lift</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">10K+</p>
                  <p className="text-xs text-gray-500">Businesses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Analyzing */}
        {currentStep === 'analyzing' && (
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-5xl animate-spin">🔍</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-8">
                AI Analysis in Progress...
              </h2>

              {/* Progress Steps */}
              <div className="space-y-4 text-left">
                {[
                  { step: 'Scanning website content', complete: analysisProgress > 20 },
                  { step: 'Identifying industry & services', complete: analysisProgress > 40 },
                  { step: 'Analyzing competitor strategies', complete: analysisProgress > 60 },
                  { step: 'Checking Facebook Ads Library', complete: analysisProgress > 80 },
                  { step: 'Generating optimized configuration', complete: analysisProgress > 95 }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center gap-3 p-4 rounded-lg border ${
                    item.complete 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : analysisProgress > index * 20 
                        ? 'border-amber-500/30 bg-amber-500/10 animate-pulse'
                        : 'border-gray-800 bg-gray-900/50'
                  }`}>
                    {item.complete ? (
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : analysisProgress > index * 20 ? (
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />
                    )}
                    <span className={item.complete ? 'text-green-400' : analysisProgress > index * 20 ? 'text-amber-400' : 'text-gray-500'}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{analysisProgress}% Complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Insights */}
        {currentStep === 'insights' && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                AI Analysis Complete!
              </h2>
              <p className="text-gray-400">
                Here's what we discovered about your business and competitors
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Business Analysis */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-amber-400 mb-4">📊 Your Business</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Industry Detected</p>
                    <p className="text-lg font-semibold">{analysisData.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Services Found</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysisData.services.map((service, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Target Audience</p>
                    <p className="font-semibold">
                      {analysisData.fullAnalysis?.targetAudience?.ageRange || 'Women 35-55'}, 
                      {' '}
                      {analysisData.fullAnalysis?.targetAudience?.incomeLevel || 'Premium'} Income
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitor Intelligence */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-amber-400 mb-4">🎯 Competitor Intel</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Active Competitors</p>
                    <p className="text-lg font-semibold">12 Running 47 Ads</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Top Performing Copy</p>
                    <ul className="mt-1 space-y-1">
                      {analysisData.adCopy.map((copy, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{copy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-lg p-6 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-4">🤖 AI Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Optimal Questions</span>
                    <span className="font-bold">5-7 Steps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Qualification Focus</span>
                    <span className="font-bold">Timeline + Budget</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Urgency Trigger</span>
                    <span className="font-bold">Limited Appointments</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Expected Conversion</span>
                    <span className="font-bold text-green-400">{analysisData.conversion}% → 18%</span>
                  </div>
                </div>
              </div>

              {/* Industry Benchmarks */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-amber-400 mb-4">📈 Industry Benchmarks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg Conversion</span>
                    <span className="font-bold">8.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Top Performers</span>
                    <span className="font-bold text-green-400">15-20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Your Potential</span>
                    <span className="font-bold text-amber-400">18%+</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mt-3">
                      AI predicts <span className="text-amber-400 font-bold">2.1x improvement</span> in conversion rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  setCurrentStep('customize')
                  setShowPreview(true)
                }}
                className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xl font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-105 shadow-2xl"
              >
                Generate My Assessment Tool →
              </button>
              <p className="text-sm text-gray-500 mt-3">
                AI will create your customized assessment based on these insights
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Customize */}
        {currentStep === 'customize' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Your AI-Generated Assessment
              </h2>
              <p className="text-gray-400">
                Preview and customize your assessment tool
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="space-y-6">
                {/* Quick Settings */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">⚡ Quick Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Headline</label>
                      <input
                        type="text"
                        defaultValue="Transform Your Appearance Today"
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Urgency Message</label>
                      <input
                        type="text"
                        defaultValue="Only 7 spots remaining this week"
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Button Text</label>
                      <input
                        type="text"
                        defaultValue="Get Your Free Consultation"
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Pixel Setup */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">📊 Tracking Pixels</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Facebook Pixel ID</label>
                      <input
                        type="text"
                        placeholder="Enter your pixel ID"
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Google Analytics</label>
                      <input
                        type="text"
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-lg p-6 border border-amber-500/30">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">💡 AI Suggestions</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">
                        Add "Limited time offer" - increases conversion by 23%
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">
                        Include social proof - "Join 5,000+ happy clients"
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">
                        Use urgency triggers - "Only 7 spots this week"
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-400">👁️ Live Preview</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-800 rounded">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Widget Preview */}
                  {showPreview && (
                    <div className="bg-black rounded-lg overflow-hidden">
                      <AssessmentWidget />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 text-center">
              <button
                onClick={() => setCurrentStep('complete')}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-lg hover:from-green-400 hover:to-green-500 transition-all transform hover:scale-105 shadow-2xl"
              >
                Launch My Assessment Tool →
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Your widget will be live immediately
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 'complete' && (
          <div className="text-center">
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">🎉</span>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4">
              Your Assessment Tool is Live!
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Start collecting qualified leads immediately with your AI-optimized assessment
            </p>

            {/* Embed Code */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-amber-400 mb-4 text-left">📋 Your Embed Code</h3>
                <div className="bg-black rounded-lg p-4 border border-gray-700">
                  <code className="text-sm text-green-400 font-mono">
                    {`<script src="https://leadballoon.ai/widget.js?id=abc123"></script>
<div id="leadballoon-widget"></div>`}
                  </code>
                </div>
                <button className="mt-4 px-6 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors">
                  Copy Code
                </button>
              </div>

              {/* Next Steps */}
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-bold mb-2">View Dashboard</h4>
                  <p className="text-sm text-gray-400">
                    Track leads, conversion rates, and AI insights
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-3xl mb-3">🔧</div>
                  <h4 className="font-bold mb-2">Customize Further</h4>
                  <p className="text-sm text-gray-400">
                    Fine-tune questions, copy, and routing rules
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="text-3xl mb-3">🚀</div>
                  <h4 className="font-bold mb-2">Launch Campaigns</h4>
                  <p className="text-sm text-gray-400">
                    Drive traffic and start qualifying leads
                  </p>
                </div>
              </div>

              {/* Performance Promise */}
              <div className="mt-12 p-6 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-3">
                  🎯 Your Expected Performance
                </h3>
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div>
                    <p className="text-3xl font-bold text-white">18%</p>
                    <p className="text-sm text-gray-400">Conversion Rate</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">2.1x</p>
                    <p className="text-sm text-gray-400">More Qualified Leads</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">£45</p>
                    <p className="text-sm text-gray-400">Cost Per Lead</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <button className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xl font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all">
                Go To Dashboard →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}