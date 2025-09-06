import { chromium, Browser, Page } from 'playwright';

interface OxylabsConfig {
  username: string;
  password: string;
  country?: string;
  render?: boolean;
}

interface CompetitorAnalysis {
  url: string;
  pricing: Array<{ text: string; value: string | null }>;
  valueProposition: string[];
  urgencyTriggers: string[];
  guarantees: string[];
  socialProof: number;
  ctaButtons: string[];
  headlines: string[];
  offers: any[];
}

export class OxylabsAnalyzer {
  private config: OxylabsConfig;
  private browser: Browser | null = null;

  constructor(config: OxylabsConfig) {
    this.config = config;
  }

  private getProxyUrl(): string {
    let username = this.config.username;
    if (this.config.country) {
      username += `-country-${this.config.country}`;
    }
    if (this.config.render) {
      username += '-render-html';
    }
    
    return `http://${username}:${this.config.password}@pr.oxylabs.io:7777`;
  }

  async initialize() {
    this.browser = await chromium.launch({
      proxy: {
        server: 'http://pr.oxylabs.io:7777',
        username: this.config.username,
        password: this.config.password,
      },
      headless: true,
    });
  }

  async analyzeCompetitor(url: string): Promise<CompetitorAnalysis> {
    if (!this.browser) await this.initialize();
    
    const page = await this.browser!.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Extract pricing
      const pricing = await page.$$eval(
        '[class*="price"], [class*="cost"], [data-price], :has-text("$"), :has-text("£"), :has-text("€")',
        elements => elements.map(el => ({
          text: el.textContent?.trim() || '',
          value: el.getAttribute('data-price') || el.textContent?.match(/[$£€][\d,]+\.?\d*/)?.[0] || null
        }))
      );

      // Extract value propositions
      const valueProposition = await page.$$eval(
        '[class*="value"], [class*="benefit"], [class*="feature"], li',
        els => els.slice(0, 20).map(el => el.textContent?.trim() || '').filter(Boolean)
      );

      // Extract urgency triggers
      const urgencyTriggers = await page.$$eval(
        '[class*="urgent"], [class*="limited"], [class*="countdown"], [class*="timer"], [class*="hurry"], :has-text("limited"), :has-text("only"), :has-text("left")',
        els => els.map(el => el.textContent?.trim() || '').filter(Boolean)
      );

      // Extract guarantees
      const guarantees = await page.$$eval(
        '[class*="guarantee"], [class*="refund"], [class*="risk"], :has-text("guarantee"), :has-text("money back")',
        els => els.map(el => el.textContent?.trim() || '').filter(Boolean)
      );

      // Count social proof elements
      const socialProof = await page.$$eval(
        '[class*="testimonial"], [class*="review"], [class*="rating"], [class*="stars"], .trustpilot',
        els => els.length
      );

      // Extract CTA buttons
      const ctaButtons = await page.$$eval(
        'button, a[class*="btn"], a[class*="button"], [role="button"]',
        els => els.map(el => el.textContent?.trim() || '').filter(text => text.length > 0 && text.length < 50)
      );

      // Extract headlines
      const headlines = await page.$$eval(
        'h1, h2, h3',
        els => els.slice(0, 10).map(el => el.textContent?.trim() || '').filter(Boolean)
      );

      // Extract special offers
      const offers = await page.$$eval(
        '[class*="offer"], [class*="deal"], [class*="special"], [class*="promo"], [class*="discount"]',
        els => els.slice(0, 5).map(el => ({
          text: el.textContent?.trim(),
          html: el.innerHTML
        }))
      );

      await page.close();

      return {
        url,
        pricing,
        valueProposition,
        urgencyTriggers,
        guarantees,
        socialProof,
        ctaButtons: [...new Set(ctaButtons)], // Remove duplicates
        headlines,
        offers
      };
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async analyzeFacebookAds(businessName: string) {
    if (!this.browser) await this.initialize();
    
    const page = await this.browser!.newPage();
    
    try {
      const searchUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(businessName)}`;
      await page.goto(searchUrl);
      
      // Wait for ads to load (Facebook is dynamic)
      await page.waitForTimeout(5000);
      
      // Try to close any popups
      await page.click('[aria-label="Close"]').catch(() => {});
      
      const ads = await page.$$eval('[role="article"]', articles => 
        articles.slice(0, 10).map(article => {
          const getText = (selector: string) => 
            article.querySelector(selector)?.textContent?.trim() || '';
          
          return {
            text: getText('[data-testid="ad-creative-text"], .x1lliihq'),
            headline: getText('h3, strong'),
            cta: getText('a[role="button"], [aria-label*="Call to action"]'),
            startDate: getText('[class*="started"], [class*="date"]'),
            platforms: Array.from(article.querySelectorAll('[aria-label*="Platform"]'))
              .map(el => el.textContent?.trim())
          };
        })
      );
      
      await page.close();
      return ads;
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async extractEmailSequence(url: string) {
    if (!this.browser) await this.initialize();
    
    const page = await this.browser!.newPage();
    const emails: string[] = [];
    
    // Set up request interception to capture form submissions
    await page.route('**/*', async route => {
      const request = route.request();
      
      if (request.method() === 'POST') {
        const postData = request.postData();
        console.log('Form submission captured:', postData);
      }
      
      await route.continue();
    });
    
    try {
      await page.goto(url);
      
      // Find and fill email opt-in forms
      const emailInputs = await page.$$('input[type="email"], input[name*="email"], input[placeholder*="email"]');
      
      if (emailInputs.length > 0) {
        // Use a tracking email
        const testEmail = `test+${Date.now()}@leadballoon.ai`;
        await emailInputs[0].fill(testEmail);
        
        // Find and click submit button
        const submitButton = await page.$('button[type="submit"], input[type="submit"], button:has-text("submit"), button:has-text("subscribe"), button:has-text("get")');
        
        if (submitButton) {
          await submitButton.click();
          
          // Wait for response
          await page.waitForTimeout(3000);
          
          // Check for thank you page or confirmation message
          const confirmation = await page.textContent('body');
          
          console.log('Email opt-in successful:', {
            email: testEmail,
            confirmationFound: confirmation?.includes('thank') || confirmation?.includes('confirm')
          });
        }
      }
      
      await page.close();
      return emails;
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async analyzeMultipleCompetitors(urls: string[]) {
    const results = [];
    
    for (const url of urls) {
      try {
        console.log(`Analyzing ${url}...`);
        const analysis = await this.analyzeCompetitor(url);
        results.push(analysis);
      } catch (error) {
        console.error(`Failed to analyze ${url}:`, error);
        results.push({ url, error: true });
      }
    }
    
    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Helper function to generate AI prompt from analysis
export function generateAIPromptFromAnalysis(analysis: CompetitorAnalysis): string {
  return `Based on this competitor analysis, create an irresistible offer:

Website: ${analysis.url}

Current Pricing Found: 
${analysis.pricing.map(p => `- ${p.text}`).join('\n')}

Their Value Props:
${analysis.valueProposition.slice(0, 5).join('\n')}

Their Urgency Tactics:
${analysis.urgencyTriggers.slice(0, 3).join('\n')}

Their Guarantees:
${analysis.guarantees.slice(0, 2).join('\n')}

Social Proof Elements: ${analysis.socialProof} found

Their CTAs:
${analysis.ctaButtons.slice(0, 5).join(', ')}

Create a BETTER offer that:
1. Addresses deeper pain points
2. Stacks more value
3. Has stronger guarantees
4. Creates authentic urgency
5. Positions against their weaknesses`;
}