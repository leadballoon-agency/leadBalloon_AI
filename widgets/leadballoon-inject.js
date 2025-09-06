// LeadBalloon AI Widget Injector
// Add this single line to any website to inject the widgets:
// <script src="https://leadballoon.ai/widget.js?id=YOUR_CLIENT_ID"></script>

(function() {
  // Configuration (in production, this comes from the server based on client ID)
  const config = {
    clientId: 'skulpt-body-contouring',
    widgetType: 'offer', // 'offer', 'assessment', or 'both'
    trigger: 'time', // 'time', 'scroll', 'exit', 'button'
    delay: 5, // seconds
    position: 'modal' // 'modal', 'slide', 'corner', 'inline'
  };

  // Create container for React app
  const container = document.createElement('div');
  container.id = 'leadballoon-widget-container';
  container.style.cssText = 'position: fixed; z-index: 999999;';
  document.body.appendChild(container);

  // Inject styles
  const styles = `
    #leadballoon-widget-container * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    .leadballoon-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .leadballoon-modal {
      background: white;
      border-radius: 20px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.4s ease-out;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .leadballoon-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 30px;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .leadballoon-close:hover {
      transform: scale(1.1);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Function to show the widget
  function showWidget() {
    // In production, this would fetch the widget HTML from the server
    // For now, we'll create a simple version
    const widgetHTML = `
      <div class="leadballoon-modal-backdrop" id="leadballoon-backdrop">
        <div class="leadballoon-modal">
          <button class="leadballoon-close" onclick="closeLeadBalloonWidget()">✕</button>
          
          <!-- This is where the React widget would be injected -->
          <!-- In production, this would be the actual OfferWidgetEmbed component -->
          <div style="padding: 40px; text-align: center;">
            <h2 style="font-size: 28px; margin-bottom: 20px; color: #1a1a1a;">
              Transform Your Body Today
            </h2>
            <p style="color: #666; margin-bottom: 30px;">
              Limited time offer - Only 5 spots remaining!
            </p>
            <div style="background: #f7f7f7; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h3 style="margin-bottom: 20px;">Special Offer: £697</h3>
              <p style="text-decoration: line-through; color: #999;">Regular Price: £3,788</p>
            </div>
            <button style="
              background: linear-gradient(135deg, #f59e0b, #d97706);
              color: white;
              border: none;
              padding: 20px 40px;
              font-size: 20px;
              border-radius: 10px;
              cursor: pointer;
              font-weight: bold;
              width: 100%;
            " onclick="window.open('https://skulpt.co.uk/book', '_blank')">
              CLAIM YOUR SPOT NOW →
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = widgetHTML;
  }

  // Global function to close widget
  window.closeLeadBalloonWidget = function() {
    container.innerHTML = '';
  };

  // Set up trigger based on config
  if (config.trigger === 'time') {
    setTimeout(showWidget, config.delay * 1000);
  } else if (config.trigger === 'scroll') {
    let triggered = false;
    window.addEventListener('scroll', function() {
      if (!triggered) {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50) {
          triggered = true;
          showWidget();
        }
      }
    });
  } else if (config.trigger === 'exit') {
    let triggered = false;
    document.addEventListener('mouseleave', function(e) {
      if (!triggered && e.clientY <= 0) {
        triggered = true;
        showWidget();
      }
    });
  }

  // Also expose a function to manually trigger
  window.showLeadBalloonWidget = showWidget;
  
  console.log('LeadBalloon AI Widget loaded! Trigger:', config.trigger);
})();