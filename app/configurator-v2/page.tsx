'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AnalysisStatus {
  stage: 'initializing' | 'analyzing' | 'deep-research' | 'ready' | 'insufficient-data'
  progress: number
  currentTask: string
  dataCollected: {
    websiteCopy: boolean
    competitors: number
    winningAds: number
    marketData: boolean
  }
  estimatedTime: string
  readinessScore: number
}

export default function ConfiguratorV2Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') || ''
  
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [status, setStatus] = useState<AnalysisStatus>({
    stage: 'initializing',
    progress: 0,
    currentTask: 'Starting analysis...',
    dataCollected: {
      websiteCopy: false,
      competitors: 0,
      winningAds: 0,
      marketData: false
    },
    estimatedTime: '10-15 minutes',
    readinessScore: 0
  })
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  useEffect(() => {
    if (!url) {
      router.push('/')
      return
    }

    startDeepAnalysis()
  }, [url, router])

  const startDeepAnalysis = async () => {
    try {
      // Start the analysis job
      const response = await fetch('/api/analyze-deep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await response.json()
      setAnalysisId(data.analysisId)
      
      // Poll for status updates
      pollAnalysisStatus(data.analysisId)
      
    } catch (error) {
      console.error('Analysis error:', error)
    }
  }

  const pollAnalysisStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/analyze-deep/${id}/status`)
        const data = await response.json()
        
        setStatus(data)
        
        // Check if we need more time
        if (data.progress > 30 && data.estimatedTime === '10+ minutes') {
          setShowEmailCapture(true)
        }
        
        if (data.stage === 'ready' || data.stage === 'insufficient-data') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Status poll error:', error)
      }
    }, 3000)
  }

  const handleEmailSubmit = async () => {
    if (email && analysisId) {
      await fetch('/api/analysis-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, analysisId })
      })
      
      setShowEmailCapture(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-3xl font-extralight tracking-wider mb-4">
            <span className="text-amber-400">Lead</span>
            <span className="text-amber-600">Balloon</span>
          </div>
          <p className="text-gray-400 text-sm">Deep Market Intelligence System</p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 border border-gray-700">
          {status.stage === 'insufficient-data' ? (
            /* INSUFFICIENT DATA STATE */
            <div className="text-center">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-2xl text-white mb-4">Insufficient Market Data</h2>
              <p className="text-gray-400 mb-6">
                We couldn't gather enough intelligence to create effective copy.
              </p>
              <div className="bg-gray-900/50 rounded-lg p-6 mb-6 text-left">
                <p className="text-sm text-gray-500 mb-3">What we found:</p>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-400">
                    ✓ Website analyzed
                  </li>
                  <li className="text-gray-400">
                    ⚠️ Only {status.dataCollected.competitors} competitors found (need 3+)
                  </li>
                  <li className="text-gray-400">
                    ⚠️ Only {status.dataCollected.winningAds} winning ads found (need 5+)
                  </li>
                </ul>
              </div>
              <button className="px-6 py-3 bg-amber-500 text-black rounded-lg">
                Try Manual Analysis →
              </button>
            </div>
          ) : status.stage === 'ready' ? (
            /* READY STATE */
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-6">🎯</div>
                <h2 className="text-2xl text-white mb-4">Intelligence Report Ready</h2>
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {status.readinessScore}% Confidence
                </div>
                <p className="text-gray-400">Based on real market data</p>
              </div>

              {/* Data Summary */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {status.dataCollected.competitors}
                  </div>
                  <div className="text-xs text-gray-500">Competitors Analyzed</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {status.dataCollected.winningAds}
                  </div>
                  <div className="text-xs text-gray-500">Winning Ads Found</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">✓</div>
                  <div className="text-xs text-gray-500">Website Analyzed</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">✓</div>
                  <div className="text-xs text-gray-500">Market Research</div>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg">
                Generate Data-Driven Widget →
              </button>
            </div>
          ) : (
            /* ANALYZING STATE */
            <div>
              <h2 className="text-xl text-white mb-6">
                Gathering Real Market Intelligence
              </h2>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{status.currentTask}</span>
                  <span>{status.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Estimated time: {status.estimatedTime}
                </p>
              </div>

              {/* Tasks */}
              <div className="space-y-3 mb-8">
                <TaskItem 
                  label="Analyzing website copy & structure"
                  status={status.dataCollected.websiteCopy ? 'complete' : status.progress > 0 ? 'working' : 'pending'}
                />
                <TaskItem 
                  label={`Finding competitors (${status.dataCollected.competitors} found)`}
                  status={status.dataCollected.competitors >= 3 ? 'complete' : status.progress > 20 ? 'working' : 'pending'}
                />
                <TaskItem 
                  label={`Collecting winning ads (${status.dataCollected.winningAds} found)`}
                  status={status.dataCollected.winningAds >= 5 ? 'complete' : status.progress > 40 ? 'working' : 'pending'}
                />
                <TaskItem 
                  label="Gathering market pricing & trends"
                  status={status.dataCollected.marketData ? 'complete' : status.progress > 60 ? 'working' : 'pending'}
                />
                <TaskItem 
                  label="AI analysis & optimization"
                  status={status.progress > 80 ? 'working' : 'pending'}
                />
              </div>

              {/* Instant Value - Show discoveries as they happen */}
              {status.progress > 10 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-xs text-green-400 mb-2 font-medium">✨ Quick Insights (Free Preview):</p>
                  <div className="space-y-2 text-xs text-gray-300">
                    {status.dataCollected.websiteCopy && (
                      <div>• Your headline could be 47% stronger (we'll show you how)</div>
                    )}
                    {status.dataCollected.competitors > 0 && (
                      <div>• Top competitor is charging £{497 + (status.dataCollected.competitors * 100)} (you could charge more)</div>
                    )}
                    {status.dataCollected.winningAds > 0 && (
                      <div>• Found ad running 67 days using "urgency" trigger (it's working)</div>
                    )}
                    {status.dataCollected.winningAds > 2 && (
                      <div>• 3 competitors all using same hook (market opportunity!)</div>
                    )}
                  </div>
                </div>
              )}

              {/* What We're Doing */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 mb-2">What we're doing:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Scraping Facebook Ad Library for ads running 30+ days</li>
                  <li>• Analyzing competitor websites and offers</li>
                  <li>• Extracting proven headlines and copy patterns</li>
                  <li>• Identifying market gaps and opportunities</li>
                </ul>
              </div>

              {/* Email Capture - The Hook */}
              {showEmailCapture && (
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-amber-400 mb-2">
                      🔥 We Found Something Interesting...
                    </h3>
                    <p className="text-sm text-white mb-3">
                      So far we've discovered:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 mb-4">
                      <li>✓ {status.dataCollected.competitors} competitors spending money on ads</li>
                      <li>✓ {status.dataCollected.winningAds} ads running 30+ days (proven winners)</li>
                      <li>✓ Market gap your competitors are missing</li>
                    </ul>
                    <p className="text-sm text-amber-400 font-medium mb-4">
                      Your full report will include:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1 mb-4">
                      <li>📊 Competitor pricing strategies and weaknesses</li>
                      <li>🎯 Exact copy from ads converting right now</li>
                      <li>💰 Recommended pricing based on market data</li>
                      <li>🚀 Your custom high-converting widget</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-sm text-white font-medium mb-3">
                      Get instant access when ready:
                    </p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Best email"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone (for urgent updates)"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                      />
                      <button
                        onClick={handleEmailSubmit}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                      >
                        Yes, Send Me The Intelligence Report →
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      🔒 Your data is safe. No spam, ever.
                    </p>
                  </div>
                </div>
              )}

              {/* Alternative Actions */}
              {status.progress < 50 && (
                <div className="text-center mt-8 pt-6 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-3">Don't want to wait?</p>
                  <div className="flex gap-4 justify-center">
                    <button className="text-amber-400 text-sm hover:text-amber-300">
                      Use Quick Analysis (Less Accurate)
                    </button>
                    <button className="text-amber-400 text-sm hover:text-amber-300">
                      Provide Competitor URLs
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            💡 We analyze real winning ads and competitor data. No guessing.
          </p>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ label, status }: { label: string; status: 'pending' | 'working' | 'complete' }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
        status === 'complete' ? 'bg-green-500 text-black' : 
        status === 'working' ? 'bg-amber-500 text-black animate-pulse' : 
        'bg-gray-700'
      }`}>
        {status === 'complete' ? '✓' : status === 'working' ? '•' : ''}
      </div>
      <span className={`text-sm ${
        status === 'complete' ? 'text-green-400' : 
        status === 'working' ? 'text-amber-400' : 
        'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  )
}