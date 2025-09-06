'use client'

import { useEffect } from 'react'
import { PartnerConfig } from './partner-config'

// Declare global types for pixels
declare global {
  interface Window {
    fbq: any
    gtag: any
    ttq: any
    dataLayer: any
  }
}

interface PixelTrackerProps {
  partner: PartnerConfig
  event?: string
  data?: any
}

export default function PixelTracker({ partner, event, data }: PixelTrackerProps) {
  
  useEffect(() => {
    // Initialize pixels on mount
    if (partner.tracking.metaPixel?.enabled && partner.tracking.metaPixel.pixelId) {
      initMetaPixel(partner.tracking.metaPixel.pixelId)
    }
    
    if (partner.tracking.googleAnalytics?.enabled && partner.tracking.googleAnalytics.measurementId) {
      initGoogleAnalytics(partner.tracking.googleAnalytics.measurementId)
    }
    
    if (partner.tracking.tiktokPixel?.enabled && partner.tracking.tiktokPixel.pixelId) {
      initTikTokPixel(partner.tracking.tiktokPixel.pixelId)
    }
    
    // Execute custom head code
    if (partner.tracking.customCode?.head) {
      executeCustomCode(partner.tracking.customCode.head)
    }
  }, [partner])

  // Track events when they occur
  useEffect(() => {
    if (event) {
      trackEvent(partner, event, data)
    }
  }, [event, data, partner])

  return null // This component doesn't render anything
}

// Initialize Meta/Facebook Pixel
function initMetaPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.fbq) return

  const script = document.createElement('script')
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `
  document.head.appendChild(script)
}

// Initialize Google Analytics
function initGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || window.gtag) return

  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `
  document.head.appendChild(script2)
}

// Initialize TikTok Pixel
function initTikTokPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.ttq) return

  const script = document.createElement('script')
  script.innerHTML = `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${pixelId}');
      ttq.page();
    }(window, document, 'ttq');
  `
  document.head.appendChild(script)
}

// Execute custom tracking code
function executeCustomCode(code: string) {
  if (typeof window === 'undefined') return
  
  try {
    const script = document.createElement('script')
    script.innerHTML = code
    document.head.appendChild(script)
  } catch (error) {
    console.error('Error executing custom tracking code:', error)
  }
}

// Track events across different platforms
export function trackEvent(partner: PartnerConfig, eventName: string, data?: any) {
  if (typeof window === 'undefined') return

  // Meta/Facebook Pixel events
  if (partner.tracking.metaPixel?.enabled && window.fbq) {
    switch (eventName) {
      case 'assessmentStart':
        if (partner.tracking.metaPixel.events.leadStart) {
          window.fbq('track', 'Lead')
        }
        break
      case 'assessmentComplete':
        if (partner.tracking.metaPixel.events.leadComplete) {
          window.fbq('track', 'CompleteRegistration', data)
        }
        break
      case 'viewContent':
        if (partner.tracking.metaPixel.events.viewContent) {
          window.fbq('track', 'ViewContent', data)
        }
        break
      case 'initiateCheckout':
        if (partner.tracking.metaPixel.events.initiateCheckout) {
          window.fbq('track', 'InitiateCheckout', data)
        }
        break
    }
  }

  // Google Analytics events
  if (partner.tracking.googleAnalytics?.enabled && window.gtag) {
    switch (eventName) {
      case 'assessmentStart':
        if (partner.tracking.googleAnalytics.events.assessmentStart) {
          window.gtag('event', 'assessment_start', data)
        }
        break
      case 'assessmentComplete':
        if (partner.tracking.googleAnalytics.events.assessmentComplete) {
          window.gtag('event', 'assessment_complete', data)
        }
        break
      case 'emailSubmitted':
        if (partner.tracking.googleAnalytics.events.emailSubmitted) {
          window.gtag('event', 'email_submitted', data)
        }
        break
    }
  }

  // Google Ads conversion tracking
  if (partner.tracking.googleAds?.enabled && window.gtag && eventName === 'assessmentComplete') {
    window.gtag('event', 'conversion', {
      'send_to': `${partner.tracking.googleAds.conversionId}/${partner.tracking.googleAds.conversionLabel}`,
      'value': data?.value || 0,
      'currency': 'GBP'
    })
  }

  // TikTok Pixel events
  if (partner.tracking.tiktokPixel?.enabled && window.ttq) {
    switch (eventName) {
      case 'assessmentStart':
        if (partner.tracking.tiktokPixel.events.submitForm) {
          window.ttq.track('SubmitForm', data)
        }
        break
      case 'assessmentComplete':
        if (partner.tracking.tiktokPixel.events.completeRegistration) {
          window.ttq.track('CompleteRegistration', data)
        }
        break
    }
  }

  // Custom event tracking
  if (partner.tracking.customCode) {
    let customCode = ''
    switch (eventName) {
      case 'assessmentStart':
        customCode = partner.tracking.customCode.onAssessmentStart || ''
        break
      case 'assessmentComplete':
        customCode = partner.tracking.customCode.onAssessmentComplete || ''
        break
    }
    
    if (customCode) {
      try {
        // Create a function with the data in scope
        const fn = new Function('data', customCode)
        fn(data)
      } catch (error) {
        console.error('Error executing custom event code:', error)
      }
    }
  }
}