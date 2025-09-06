import { test, expect } from '@playwright/test';

test.describe('Oxylabs Web Scraping', () => {
  // Example: Scrape competitor pricing
  test('scrape competitor website for offers', async ({ page }) => {
    // Navigate through Oxylabs proxy
    await page.goto('https://coolsculpting.com');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Extract pricing information
    const prices = await page.$$eval('[class*="price"], [class*="cost"], [data-price]', elements => 
      elements.map(el => ({
        text: el.textContent?.trim(),
        value: el.getAttribute('data-price') || el.textContent?.match(/\$[\d,]+/)?.[0]
      }))
    );
    
    console.log('Found prices:', prices);
    
    // Extract headlines and offers
    const headlines = await page.$$eval('h1, h2, h3', elements =>
      elements.slice(0, 10).map(el => el.textContent?.trim())
    );
    
    console.log('Headlines:', headlines);
    
    // Take screenshot for analysis
    await page.screenshot({ path: 'competitor-analysis.png', fullPage: true });
  });

  // Example: Extract Facebook ad data
  test('scrape Facebook ads library', async ({ page }) => {
    // Facebook Ads Library URL for a specific advertiser
    const advertiserID = 'coolsculpting'; // Replace with actual ID
    await page.goto(`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=${advertiserID}`);
    
    // Wait for ads to load
    await page.waitForSelector('[role="article"]', { timeout: 10000 }).catch(() => {});
    
    // Extract ad information
    const ads = await page.$$eval('[role="article"]', articles => 
      articles.slice(0, 5).map(article => ({
        text: article.querySelector('[data-testid="ad-creative-text"]')?.textContent,
        cta: article.querySelector('a[role="button"]')?.textContent,
        image: article.querySelector('img')?.src
      }))
    );
    
    console.log('Facebook Ads:', ads);
  });

  // Example: Analyze landing pages for conversion elements
  test('analyze landing page conversion elements', async ({ page }) => {
    await page.goto('https://idealimage.com');
    
    // Check for urgency elements
    const urgencyElements = await page.$$eval(
      '[class*="urgent"], [class*="limited"], [class*="countdown"], [class*="timer"]',
      els => els.map(el => el.textContent?.trim())
    );
    
    // Check for social proof
    const testimonials = await page.$$eval(
      '[class*="testimonial"], [class*="review"], [class*="rating"]',
      els => els.length
    );
    
    // Check for guarantees
    const guarantees = await page.$$eval(
      '[class*="guarantee"], [class*="refund"], [class*="risk-free"]',
      els => els.map(el => el.textContent?.trim())
    );
    
    // Check for value stacking
    const valueElements = await page.$$eval(
      '[class*="value"], [class*="save"], [class*="discount"], [class*="bonus"]',
      els => els.map(el => el.textContent?.trim())
    );
    
    const analysis = {
      urgency: urgencyElements,
      socialProofCount: testimonials,
      guarantees: guarantees,
      valueProposition: valueElements
    };
    
    console.log('Conversion Analysis:', analysis);
    expect(analysis).toBeTruthy();
  });
});

// Utility function to extract structured data
test.describe('Structured Data Extraction', () => {
  test('extract JSON-LD structured data', async ({ page }) => {
    await page.goto('https://skulpt.co.uk');
    
    // Extract JSON-LD structured data
    const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts =>
      scripts.map(script => {
        try {
          return JSON.parse(script.textContent || '{}');
        } catch {
          return null;
        }
      }).filter(Boolean)
    );
    
    console.log('Structured Data:', JSON.stringify(structuredData, null, 2));
    
    // Extract meta tags for SEO analysis
    const metaTags = await page.$$eval('meta', metas =>
      metas.reduce((acc, meta) => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name && content) {
          acc[name] = content;
        }
        return acc;
      }, {} as Record<string, string>)
    );
    
    console.log('Meta Tags:', metaTags);
  });
});

// Advanced scraping with Oxylabs residential proxies
test.describe('Advanced Oxylabs Features', () => {
  test('scrape with country-specific proxy', async ({ browser }) => {
    // Create context with UK proxy
    const context = await browser.newContext({
      proxy: {
        server: 'http://pr.oxylabs.io:7777',
        username: process.env.OXYLABS_USERNAME + '-country-gb',
        password: process.env.OXYLABS_PASSWORD,
      },
      locale: 'en-GB',
      timezoneId: 'Europe/London',
    });
    
    const page = await context.newPage();
    await page.goto('https://www.google.co.uk/search?q=body+contouring+london');
    
    // Extract search results
    const results = await page.$$eval('.g', elements =>
      elements.slice(0, 10).map(el => ({
        title: el.querySelector('h3')?.textContent,
        url: el.querySelector('a')?.href,
        snippet: el.querySelector('.VwiC3b')?.textContent
      }))
    );
    
    console.log('UK Search Results:', results);
    await context.close();
  });

  test('handle JavaScript-heavy sites', async ({ page }) => {
    // Enable JavaScript rendering through Oxylabs
    await page.route('**/*', route => {
      route.continue({
        headers: {
          ...route.request().headers(),
          'X-Oxylabs-Render': 'html',
        }
      });
    });
    
    await page.goto('https://example-spa.com');
    
    // Wait for dynamic content
    await page.waitForSelector('[data-loaded="true"]', { timeout: 30000 });
    
    const dynamicContent = await page.textContent('body');
    console.log('Dynamic content loaded:', dynamicContent?.length, 'characters');
  });
});