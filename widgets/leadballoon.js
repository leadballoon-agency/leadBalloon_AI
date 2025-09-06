/**
 * LeadBalloon AI - Smart Widget Injection System
 * One line of code to add AI-powered offer & assessment widgets to any site
 * Just like ConvertBox, but smarter!
 */

(function() {
  'use strict';
  
  // Configuration from script tag attributes
  const script = document.currentScript;
  const config = {
    accountId: script.getAttribute('data-account') || 'demo',
    position: script.getAttribute('data-position') || 'bottom-right',
    trigger: script.getAttribute('data-trigger') || 'time',
    delay: parseInt(script.getAttribute('data-delay')) || 3000,
    offerStyle: script.getAttribute('data-offer-style') || 'slide',
    assessmentStyle: script.getAttribute('data-assessment-style') || 'modal',
    apiUrl: script.getAttribute('data-api') || window.location.origin + '/api'
  };

  // Create container for widgets
  const createWidgetContainer = () => {
    const container = document.createElement('div');
    container.id = 'leadballoon-widgets';
    container.style.cssText = `
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(container);
    return container;
  };

  // Inject offer widget (corner bubble or slide-in)
  const injectOfferWidget = (container) => {
    const offerWidget = document.createElement('div');
    offerWidget.id = 'lb-offer-widget';
    offerWidget.className = 'lb-widget-hidden';
    
    // Position based on config
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    
    offerWidget.innerHTML = `
      <style>
        .lb-widget-hidden {
          display: none !important;
        }
        
        .lb-offer-bubble {
          position: fixed;
          ${positions[config.position]}
          width: 400px;
          max-width: 90vw;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          transform: translateY(120%);
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          overflow: hidden;
        }
        
        .lb-offer-bubble.lb-show {
          transform: translateY(0);
        }
        
        .lb-offer-bubble::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: lb-shimmer 3s infinite;
        }
        
        @keyframes lb-shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .lb-offer-header {
          background: rgba(0,0,0,0.2);
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .lb-offer-title {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
        
        .lb-offer-close {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .lb-offer-close:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .lb-offer-content {
          padding: 20px;
          color: white;
          position: relative;
        }
        
        .lb-offer-value {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
        }
        
        .lb-offer-price {
          text-align: center;
          padding: 20px 0;
        }
        
        .lb-offer-price-original {
          text-decoration: line-through;
          opacity: 0.7;
          font-size: 18px;
        }
        
        .lb-offer-price-now {
          font-size: 36px;
          font-weight: bold;
          color: #FFD700;
          margin: 10px 0;
        }
        
        .lb-offer-cta {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #333;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          width: 100%;
          transition: transform 0.3s, box-shadow 0.3s;
          margin-top: 15px;
        }
        
        .lb-offer-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255,215,0,0.4);
        }
        
        .lb-offer-timer {
          background: rgba(255,0,0,0.2);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
          margin: 15px 0;
        }
        
        .lb-offer-timer-label {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 5px;
        }
        
        .lb-offer-timer-time {
          font-size: 24px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
        }
        
        /* Minimized bubble trigger */
        .lb-trigger-bubble {
          position: fixed;
          ${positions[config.position]}
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          box-shadow: 0 10px 30px rgba(102,126,234,0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s, box-shadow 0.3s;
          animation: lb-pulse 2s infinite;
        }
        
        @keyframes lb-pulse {
          0% { transform: scale(1); box-shadow: 0 10px 30px rgba(102,126,234,0.5); }
          50% { transform: scale(1.05); box-shadow: 0 10px 40px rgba(102,126,234,0.7); }
          100% { transform: scale(1); box-shadow: 0 10px 30px rgba(102,126,234,0.5); }
        }
        
        .lb-trigger-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 15px 40px rgba(102,126,234,0.7);
        }
        
        .lb-trigger-bubble::before {
          content: '🎁';
          font-size: 32px;
        }
        
        .lb-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #FF3B30;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          animation: lb-bounce 1s infinite;
        }
        
        @keyframes lb-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @media (max-width: 480px) {
          .lb-offer-bubble {
            width: calc(100vw - 20px);
            left: 10px !important;
            right: 10px !important;
            bottom: 10px !important;
          }
        }
      </style>
      
      <!-- Trigger Bubble -->
      <div class="lb-trigger-bubble" id="lb-trigger" style="display: none;">
        <div class="lb-badge">1</div>
      </div>
      
      <!-- Offer Widget -->
      <div class="lb-offer-bubble" id="lb-offer-panel">
        <div class="lb-offer-header">
          <h3 class="lb-offer-title">🔥 Limited Time Offer</h3>
          <button class="lb-offer-close" id="lb-close">×</button>
        </div>
        
        <div class="lb-offer-content">
          <div class="lb-offer-timer">
            <div class="lb-offer-timer-label">OFFER EXPIRES IN:</div>
            <div class="lb-offer-timer-time" id="lb-timer">23:59:47</div>
          </div>
          
          <div id="lb-value-stack">
            <!-- Value stack will be loaded here -->
          </div>
          
          <div class="lb-offer-price">
            <div class="lb-offer-price-original">Total Value: <span id="lb-total-value">£1,997</span></div>
            <div class="lb-offer-price-now">Today Only: <span id="lb-offer-price">£497</span></div>
          </div>
          
          <button class="lb-offer-cta" id="lb-cta">
            Claim Your Spot Now →
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(offerWidget);
    
    // Setup event handlers
    setupOfferHandlers();
  };

  // Setup offer widget handlers
  const setupOfferHandlers = () => {
    const trigger = document.getElementById('lb-trigger');
    const panel = document.getElementById('lb-offer-panel');
    const closeBtn = document.getElementById('lb-close');
    const ctaBtn = document.getElementById('lb-cta');
    
    // Show trigger bubble after delay
    setTimeout(() => {
      if (trigger) {
        trigger.style.display = 'flex';
      }
    }, config.delay);
    
    // Open panel when trigger clicked
    if (trigger) {
      trigger.addEventListener('click', () => {
        panel.classList.add('lb-show');
        trigger.style.display = 'none';
      });
    }
    
    // Close panel
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.remove('lb-show');
        setTimeout(() => {
          trigger.style.display = 'flex';
        }, 500);
      });
    }
    
    // CTA click - open assessment
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        panel.classList.remove('lb-show');
        showAssessmentModal();
      });
    }
    
    // Auto-show based on trigger type
    if (config.trigger === 'time') {
      setTimeout(() => {
        panel.classList.add('lb-show');
      }, config.delay + 2000);
    } else if (config.trigger === 'scroll') {
      let scrollTriggered = false;
      window.addEventListener('scroll', () => {
        if (!scrollTriggered && window.scrollY > window.innerHeight * 0.5) {
          scrollTriggered = true;
          panel.classList.add('lb-show');
        }
      });
    } else if (config.trigger === 'exit') {
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) {
          panel.classList.add('lb-show');
        }
      });
    }
    
    // Start countdown timer
    startCountdown();
  };

  // Countdown timer
  const startCountdown = () => {
    const timerEl = document.getElementById('lb-timer');
    if (!timerEl) return;
    
    let hours = 23;
    let minutes = 59;
    let seconds = 47;
    
    setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            hours = 23;
          }
        }
      }
      
      timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  };

  // Show assessment modal
  const showAssessmentModal = () => {
    const modal = document.createElement('div');
    modal.id = 'lb-assessment-modal';
    modal.innerHTML = `
      <style>
        .lb-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000000;
          animation: lb-fadeIn 0.3s;
        }
        
        @keyframes lb-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .lb-modal-content {
          background: white;
          border-radius: 20px;
          width: 500px;
          max-width: 90vw;
          max-height: 80vh;
          overflow-y: auto;
          animation: lb-slideUp 0.4s;
        }
        
        @keyframes lb-slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .lb-assessment-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 20px 20px 0 0;
        }
        
        .lb-assessment-body {
          padding: 30px;
        }
        
        .lb-question {
          margin-bottom: 25px;
        }
        
        .lb-question-text {
          font-size: 18px;
          margin-bottom: 15px;
          color: #333;
        }
        
        .lb-answer-option {
          display: block;
          width: 100%;
          padding: 15px;
          margin-bottom: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }
        
        .lb-answer-option:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }
        
        .lb-answer-option.selected {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }
        
        .lb-assessment-footer {
          padding: 20px 30px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
        }
        
        .lb-btn {
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .lb-btn-next {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .lb-btn-next:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102,126,234,0.4);
        }
        
        .lb-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.9);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          z-index: 1;
        }
      </style>
      
      <div class="lb-modal-overlay">
        <div class="lb-modal-content">
          <button class="lb-modal-close" onclick="this.closest('#lb-assessment-modal').remove()">×</button>
          
          <div class="lb-assessment-header">
            <h2>Qualify for Your Transformation</h2>
            <p>Answer 3 quick questions to see if you qualify</p>
          </div>
          
          <div class="lb-assessment-body">
            <div class="lb-question">
              <div class="lb-question-text">1. How much weight have you lost recently?</div>
              <button class="lb-answer-option">Less than 1 stone</button>
              <button class="lb-answer-option">1-2 stones</button>
              <button class="lb-answer-option">2-3 stones</button>
              <button class="lb-answer-option">3+ stones</button>
            </div>
            
            <div class="lb-question">
              <div class="lb-question-text">2. What's your main concern?</div>
              <button class="lb-answer-option">Loose skin on stomach</button>
              <button class="lb-answer-option">Saggy arms</button>
              <button class="lb-answer-option">Thigh skin</button>
              <button class="lb-answer-option">Multiple areas</button>
            </div>
            
            <div class="lb-question">
              <div class="lb-question-text">3. When do you want to see results?</div>
              <button class="lb-answer-option">ASAP</button>
              <button class="lb-answer-option">Next 30 days</button>
              <button class="lb-answer-option">Next 3 months</button>
              <button class="lb-answer-option">Just researching</button>
            </div>
          </div>
          
          <div class="lb-assessment-footer">
            <button class="lb-btn lb-btn-secondary" onclick="this.closest('#lb-assessment-modal').remove()">Back</button>
            <button class="lb-btn lb-btn-next">See If You Qualify →</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle answer selections
    modal.querySelectorAll('.lb-answer-option').forEach(btn => {
      btn.addEventListener('click', function() {
        // Clear other selections in same question
        this.closest('.lb-question').querySelectorAll('.lb-answer-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        this.classList.add('selected');
      });
    });
  };

  // Load configuration from server
  const loadConfiguration = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/widget-config/${config.accountId}`);
      if (response.ok) {
        const data = await response.json();
        updateWidgetContent(data);
      }
    } catch (error) {
      console.log('Using default configuration');
    }
  };

  // Update widget with configuration
  const updateWidgetContent = (data) => {
    if (data.values) {
      document.getElementById('lb-total-value').textContent = data.values.totalValue || '£1,997';
      document.getElementById('lb-offer-price').textContent = data.values.todayPrice || '£497';
    }
    
    if (data.valueStack) {
      const stackHtml = data.valueStack.map(item => `
        <div class="lb-offer-value">
          <strong>✓ ${item.item}</strong> - Value ${item.value}
        </div>
      `).join('');
      document.getElementById('lb-value-stack').innerHTML = stackHtml;
    }
  };

  // Initialize everything
  const init = () => {
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    const container = createWidgetContainer();
    injectOfferWidget(container);
    loadConfiguration();
    
    console.log('🎯 LeadBalloon AI widgets initialized!');
  };
  
  init();
})();