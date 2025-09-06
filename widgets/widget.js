/**
 * Skulpt Assessment Widget v1.0
 * The most powerful assessment tool for body contouring
 * One script, three modes: Popup, Embed, Button
 */

(function() {
  'use strict';

  // Widget configuration
  const WIDGET_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3004' 
    : 'https://skulpt.ai';

  // Default configuration
  const defaultConfig = {
    mode: 'popup',           // 'popup', 'embed', or 'button'
    trigger: 'exit',         // 'exit', 'scroll', 'time', 'immediate'
    delay: 30000,            // delay in ms for time trigger
    scrollPercent: 50,       // scroll percentage for scroll trigger
    position: 'center',      // popup position
    theme: 'luxury',         // 'luxury', 'medical', 'minimal'
    partnerId: null,
    showOnMobile: true,
    zIndex: 999999,
    
    // Customizable text
    headline: "Transform Your Body After Weight Loss",
    subheadline: "Check if you qualify for skin tightening treatment",
    buttonText: "Start Free Assessment",
    
    // Styling
    primaryColor: '#D97706',  // Amber
    backgroundColor: '#000000',
    textColor: '#FFFFFF'
  };

  // Merge user config with defaults
  const config = Object.assign({}, defaultConfig, window.SkulptConfig || {});

  // Get partner ID from script tag
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  if (scriptTag) {
    config.partnerId = scriptTag.getAttribute('data-partner') || config.partnerId;
  }

  // Create iframe for assessment
  function createIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = `${WIDGET_URL}/assessment-widget?partner=${config.partnerId || 'direct'}&mode=${config.mode}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = config.mode === 'embed' ? '12px' : '16px';
    iframe.id = 'skulpt-assessment-iframe';
    return iframe;
  }

  // Create popup container
  function createPopup() {
    // Check if popup already exists
    if (document.getElementById('skulpt-popup-container')) return;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'skulpt-popup-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: ${config.zIndex};
      display: none;
      animation: skulptFadeIn 0.3s ease-out;
    `;

    // Create popup container
    const container = document.createElement('div');
    container.id = 'skulpt-popup-container';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 900px;
      height: 85vh;
      max-height: 700px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      z-index: ${config.zIndex + 1};
      display: none;
      animation: skulptSlideUp 0.4s ease-out;
      overflow: hidden;
    `;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.1);
      border: none;
      font-size: 28px;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s;
      color: #666;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(0, 0, 0, 0.2)';
    closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(0, 0, 0, 0.1)';
    closeBtn.onclick = closePopup;

    // Add iframe
    const iframe = createIframe();
    container.appendChild(closeBtn);
    container.appendChild(iframe);

    // Add to DOM
    document.body.appendChild(backdrop);
    document.body.appendChild(container);

    // Close on backdrop click
    backdrop.onclick = closePopup;

    // Add CSS animations
    if (!document.getElementById('skulpt-animations')) {
      const style = document.createElement('style');
      style.id = 'skulpt-animations';
      style.textContent = `
        @keyframes skulptFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes skulptSlideUp {
          from { 
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Show popup
  function showPopup() {
    const backdrop = document.getElementById('skulpt-popup-backdrop');
    const container = document.getElementById('skulpt-popup-container');
    
    if (backdrop && container) {
      backdrop.style.display = 'block';
      container.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Track event
      trackEvent('popup_shown');
      
      // Set cookie to prevent showing again too soon
      setCookie('skulpt_popup_shown', 'true', 1); // 1 day
    }
  }

  // Close popup
  function closePopup() {
    const backdrop = document.getElementById('skulpt-popup-backdrop');
    const container = document.getElementById('skulpt-popup-container');
    
    if (backdrop && container) {
      backdrop.style.display = 'none';
      container.style.display = 'none';
      document.body.style.overflow = '';
      
      trackEvent('popup_closed');
    }
  }

  // Create embed container
  function createEmbed() {
    const containers = document.querySelectorAll('#skulpt-assessment, .skulpt-assessment');
    
    containers.forEach(container => {
      // Skip if already initialized
      if (container.querySelector('iframe')) return;
      
      container.style.cssText = `
        width: 100%;
        min-height: 600px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      `;
      
      const iframe = createIframe();
      container.appendChild(iframe);
      
      trackEvent('embed_loaded');
    });
  }

  // Setup button triggers
  function setupButtons() {
    // Find all buttons with data-skulpt attribute
    const buttons = document.querySelectorAll('[data-skulpt="trigger"], [onclick*="SkulptAssessment"]');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        if (!document.getElementById('skulpt-popup-container')) {
          createPopup();
        }
        showPopup();
        trackEvent('button_triggered');
      });
    });
  }

  // Exit intent detection
  function setupExitIntent() {
    let exitIntentTriggered = false;
    
    document.addEventListener('mouseout', function(e) {
      if (e.clientY <= 0 && !exitIntentTriggered && !getCookie('skulpt_popup_shown')) {
        exitIntentTriggered = true;
        showPopup();
        trackEvent('exit_intent_triggered');
      }
    });
  }

  // Scroll trigger
  function setupScrollTrigger() {
    let scrollTriggered = false;
    
    window.addEventListener('scroll', function() {
      if (scrollTriggered || getCookie('skulpt_popup_shown')) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= config.scrollPercent) {
        scrollTriggered = true;
        showPopup();
        trackEvent('scroll_triggered');
      }
    });
  }

  // Time trigger
  function setupTimeTrigger() {
    setTimeout(function() {
      if (!getCookie('skulpt_popup_shown')) {
        showPopup();
        trackEvent('time_triggered');
      }
    }, config.delay);
  }

  // Cookie helpers
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Track events (send to your analytics)
  function trackEvent(eventName) {
    // Send to your analytics
    console.log('Skulpt Event:', eventName, {
      partnerId: config.partnerId,
      mode: config.mode,
      url: window.location.href
    });
    
    // You could send this to your backend
    // fetch(`${WIDGET_URL}/api/track`, {
    //   method: 'POST',
    //   body: JSON.stringify({ event: eventName, partner: config.partnerId })
    // });
  }

  // Initialize based on mode
  function init() {
    // Make functions globally available
    window.SkulptAssessment = {
      open: function() {
        if (!document.getElementById('skulpt-popup-container')) {
          createPopup();
        }
        showPopup();
      },
      close: closePopup,
      config: config
    };

    // Initialize based on mode
    switch(config.mode) {
      case 'embed':
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', createEmbed);
        } else {
          createEmbed();
        }
        break;
        
      case 'button':
        // Setup button triggers only
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            createPopup();
            setupButtons();
          });
        } else {
          createPopup();
          setupButtons();
        }
        break;
        
      case 'popup':
      default:
        // Setup popup with triggers
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            createPopup();
            setupButtons();
            
            // Setup trigger based on config
            switch(config.trigger) {
              case 'exit':
                setupExitIntent();
                break;
              case 'scroll':
                setupScrollTrigger();
                break;
              case 'time':
                setupTimeTrigger();
                break;
              case 'immediate':
                showPopup();
                break;
            }
          });
        } else {
          createPopup();
          setupButtons();
          
          switch(config.trigger) {
            case 'exit':
              setupExitIntent();
              break;
            case 'scroll':
              setupScrollTrigger();
              break;
            case 'time':
              setupTimeTrigger();
              break;
            case 'immediate':
              showPopup();
              break;
          }
        }
        break;
    }
  }

  // Start initialization
  init();
})();