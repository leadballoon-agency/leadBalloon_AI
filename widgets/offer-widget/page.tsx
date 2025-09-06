'use client'

import { useState, useEffect } from 'react'

export default function OfferWidget() {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })
  
  // Load configuration from localStorage (or API in production)
  const [config, setConfig] = useState<any>({
    values: {
      consultationValue: '£150',
      bodyScanValue: '£200',
      treatmentPlanValue: '£150',
      totalValue: '£500',
      todayPrice: 'FREE'
    },
    copy: {
      headline: 'What You\'ll Get',
      urgencyMessage: 'Limited Time Offer'
    },
    general: {
      spotsRemaining: 7
    }
  })

  useEffect(() => {
    // First try to load offer-specific config
    const offerConfig = localStorage.getItem('offer_widget_config')
    if (offerConfig) {
      const parsed = JSON.parse(offerConfig)
      setConfig(parsed)
      // Set timer from config
      if (parsed.general) {
        setTimeLeft({
          hours: parsed.general.timerHours || 23,
          minutes: parsed.general.timerMinutes || 59,
          seconds: 59
        })
      }
    } else {
      // Fallback to main widget config
      const savedConfig = localStorage.getItem('widget_config')
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setConfig(parsed)
        // Set timer from config
        if (parsed.general) {
          setTimeLeft({
            hours: parsed.general.timerHours || 23,
            minutes: parsed.general.timerMinutes || 59,
            seconds: 59
          })
        }
      }
    }
  }, [])
  
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        // Reset timer when it reaches 0
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-black text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/20 rounded-2xl p-8">
          {/* Urgency Badge */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
              <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium text-red-400">
                Only {config.general?.spotsRemaining || 7} Spots Remaining
              </span>
            </span>
          </div>

          {/* Main Headline */}
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">
            {config.copy?.headline || 'What You\'ll Get'} {config.values?.todayPrice || 'FREE'} Today:
          </h3>
          
          {/* Value Stack Items */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">Professional Consultation</p>
                <p className="text-sm text-gray-500">Worth {config.values?.consultationValue || '£150'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">3D Body Scan & Analysis</p>
                <p className="text-sm text-gray-500">Worth {config.values?.bodyScanValue || '£200'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">Personalized Treatment Plan</p>
                <p className="text-sm text-gray-500">Worth {config.values?.treatmentPlanValue || '£150'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">100% Satisfaction Guarantee</p>
                <p className="text-sm text-gray-500">Risk-free results</p>
              </div>
            </div>
          </div>
          
          {/* Total Value */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Total Value:</span>
              <span className="text-xl line-through text-gray-500">{config.values?.totalValue || '£500'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">Today Only:</span>
              <span className="text-3xl font-bold text-green-400 animate-pulse">
                {config.values?.todayPrice || 'FREE'}
              </span>
            </div>
          </div>
          
          {/* Live Countdown Timer */}
          <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-xs text-red-400 text-center mb-2">⏰ OFFER EXPIRES IN:</p>
            <div className="flex justify-center items-center gap-3">
              <div className="text-center">
                <div className="bg-red-500/20 rounded-lg px-3 py-2 min-w-[50px]">
                  <span className="text-2xl font-bold text-red-400">{timeLeft.hours.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Hours</span>
              </div>
              <span className="text-2xl text-red-400 font-bold">:</span>
              <div className="text-center">
                <div className="bg-red-500/20 rounded-lg px-3 py-2 min-w-[50px]">
                  <span className="text-2xl font-bold text-red-400">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
              </div>
              <span className="text-2xl text-red-400 font-bold">:</span>
              <div className="text-center">
                <div className="bg-red-500/20 rounded-lg px-3 py-2 min-w-[50px]">
                  <span className="text-2xl font-bold text-red-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Seconds</span>
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-6 flex justify-center items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL Secure
            </span>
            <span className="flex items-center gap-1">
              ⭐⭐⭐⭐⭐
              5.0 Rating
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              2,847 Happy Clients
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}