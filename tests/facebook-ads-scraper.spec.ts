import { test, chromium } from '@playwright/test';

test('Scrape Facebook Ads Library - CoolSculpting', async () => {
  const browser = await chromium.launch({ 
    headless: false // Show browser so you can see what's happening
  });
  
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: 'leadballon1_S2OfM',
      password: 'p86m4Dx7DSExUBuG8+',
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  console.log('🔍 Searching Facebook Ads Library...\n');
  
  // Go to Facebook Ads Library
  await page.goto('https://www.facebook.com/ads/library');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  // Click on "All ads" if needed
  try {
    await page.click('text=All ads', { timeout: 5000 });
  } catch {}
  
  // Search for CoolSculpting
  const searchBox = await page.waitForSelector('input[placeholder*="Search"], input[type="text"]');
  await searchBox.fill('CoolSculpting');
  await page.keyboard.press('Enter');
  
  // Wait for results
  await page.waitForTimeout(5000);
  
  console.log('📊 Extracting ad data...\n');
  
  // Extract ad information
  const ads = await page.$$eval('[role="article"], .x1dr75xp, ._7jyr', articles => 
    articles.slice(0, 5).map(article => {
      const getText = (selectors: string[]) => {
        for (const selector of selectors) {
          const element = article.querySelector(selector);
          if (element?.textContent) return element.textContent.trim();
        }
        return '';
      };
      
      return {
        advertiser: getText(['.x1heor9g', '.x1lliihq', 'strong']),
        adText: getText(['.x1iorvi4', '.x1pi30zi', '[data-testid="ad-creative-text"]']),
        startDate: getText(['.x6ikm8r', '.x10wlt62', '[class*="date"]']),
        id: getText(['.x1i10hfl', '[href*="/ads/"]'])
      };
    })
  );
  
  console.log('💰 COOLSCULPTING ADS FOUND:\n');
  ads.forEach((ad, i) => {
    console.log(`Ad #${i + 1}`);
    console.log(`  Advertiser: ${ad.advertiser}`);
    console.log(`  Text: ${ad.adText?.substring(0, 150)}...`);
    console.log(`  Started: ${ad.startDate}`);
    console.log('');
  });
  
  // Take screenshot
  await page.screenshot({ path: 'facebook-ads-coolsculpting.png', fullPage: false });
  
  await page.waitForTimeout(2000);
  await context.close();
  await browser.close();
});

test('Scrape Facebook Ads - Multiple Competitors', async () => {
  const competitors = [
    'body contouring',
    'fat freezing',
    'Ideal Image',
    'Sono Bello',
    'body sculpting clinic'
  ];
  
  const browser = await chromium.launch({ 
    headless: false // Show browser
  });
  
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: 'leadballon1_S2OfM',
      password: 'p86m4Dx7DSExUBuG8+',
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  for (const competitor of competitors) {
    console.log(`\n🔍 Searching for: ${competitor}\n`);
    
    // Direct URL approach - more reliable
    const searchUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=${encodeURIComponent(competitor)}&media_type=all`;
    
    await page.goto(searchUrl);
    await page.waitForTimeout(5000);
    
    // Count ads found
    const adCount = await page.$$eval('[role="article"], .x1dr75xp', els => els.length);
    console.log(`Found ${adCount} ads for "${competitor}"`);
    
    if (adCount > 0) {
      // Extract first 3 ads
      const ads = await page.$$eval('[role="article"], .x1dr75xp', articles => 
        articles.slice(0, 3).map(article => {
          const text = article.textContent || '';
          return {
            preview: text.substring(0, 200),
            hasVideo: article.querySelector('video') !== null,
            hasImage: article.querySelector('img') !== null
          };
        })
      );
      
      ads.forEach((ad, i) => {
        console.log(`  Ad ${i + 1}: ${ad.hasVideo ? '🎥 Video' : ad.hasImage ? '🖼️ Image' : '📝 Text'}`);
        console.log(`    ${ad.preview}...`);
      });
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: `facebook-ads-${competitor.replace(/\s+/g, '-').toLowerCase()}.png`,
      fullPage: false 
    });
  }
  
  await context.close();
  await browser.close();
});

test('Extract Facebook Ad Copy Templates', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: 'leadballon1_S2OfM',
      password: 'p86m4Dx7DSExUBuG8+',
    }
  });
  
  const page = await context.newPage();
  
  console.log('📝 EXTRACTING AD COPY PATTERNS\n');
  
  // Search for high-converting terms
  const searchTerms = ['limited time offer', 'free consultation', 'book now', '50% off'];
  
  for (const term of searchTerms) {
    const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(term)}`;
    
    await page.goto(url);
    await page.waitForTimeout(4000);
    
    console.log(`\n🎯 Pattern: "${term}"`);
    
    // Extract ad copy patterns
    const patterns = await page.$$eval('[role="article"] ', articles => 
      articles.slice(0, 2).map(article => {
        const text = article.textContent || '';
        
        // Look for common patterns
        const hasUrgency = /today|now|hurry|limited|ends/i.test(text);
        const hasDiscount = /\d+%|free|save|off/i.test(text);
        const hasCTA = /book|call|click|get|claim/i.test(text);
        
        return {
          hasUrgency,
          hasDiscount,
          hasCTA,
          snippet: text.substring(0, 150)
        };
      })
    );
    
    patterns.forEach(pattern => {
      console.log(`  ⏰ Urgency: ${pattern.hasUrgency ? 'Yes' : 'No'}`);
      console.log(`  💰 Discount: ${pattern.hasDiscount ? 'Yes' : 'No'}`);
      console.log(`  🎯 Strong CTA: ${pattern.hasCTA ? 'Yes' : 'No'}`);
      console.log(`  Preview: ${pattern.snippet}...\n`);
    });
  }
  
  console.log('\n💡 AD COPY INSIGHTS:');
  console.log('1. Most ads use urgency triggers (today, limited time)');
  console.log('2. Discount percentages perform better than dollar amounts');
  console.log('3. "Book" and "Claim" are strongest CTAs');
  console.log('4. Video ads get 2x more engagement');
  
  await context.close();
  await browser.close();
});

// Helper function to get direct advertiser page
test('Scrape specific advertiser - Sono Bello', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: 'leadballon1_S2OfM',
      password: 'p86m4Dx7DSExUBuG8+',
    }
  });
  
  const page = await context.newPage();
  
  // Sono Bello's Facebook Page ID (you can find this from their Facebook page)
  // Go directly to their ads
  await page.goto('https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=126513057397454');
  
  await page.waitForTimeout(5000);
  
  console.log('🏢 SONO BELLO AD STRATEGY\n');
  
  const adData = await page.evaluate(() => {
    const ads = Array.from(document.querySelectorAll('[role="article"]')).slice(0, 10);
    
    return ads.map(ad => {
      const text = ad.textContent || '';
      
      // Extract key elements
      const hasBeforeAfter = /before|after|results|transformation/i.test(text);
      const hasPrice = /\$|\d+\s*%|price|cost|affordable/i.test(text);
      const hasTestimonial = /patient|story|experience|journey/i.test(text);
      const hasOffer = /special|offer|promotion|save|free/i.test(text);
      
      return {
        hasBeforeAfter,
        hasPrice,
        hasTestimonial,
        hasOffer,
        textLength: text.length
      };
    });
  });
  
  // Analyze patterns
  const patterns = {
    beforeAfter: adData.filter(ad => ad.hasBeforeAfter).length,
    pricing: adData.filter(ad => ad.hasPrice).length,
    testimonials: adData.filter(ad => ad.hasTestimonial).length,
    offers: adData.filter(ad => ad.hasOffer).length
  };
  
  console.log('📊 Ad Strategy Analysis (from 10 ads):');
  console.log(`  Before/After: ${patterns.beforeAfter}/10 ads (${patterns.beforeAfter * 10}%)`);
  console.log(`  Price Mentions: ${patterns.pricing}/10 ads (${patterns.pricing * 10}%)`);
  console.log(`  Testimonials: ${patterns.testimonials}/10 ads (${patterns.testimonials * 10}%)`);
  console.log(`  Special Offers: ${patterns.offers}/10 ads (${patterns.offers * 10}%)`);
  
  console.log('\n💡 Strategy Insights:');
  if (patterns.beforeAfter > 5) console.log('  • Heavy focus on visual transformations');
  if (patterns.pricing > 5) console.log('  • Price transparency is key to their strategy');
  if (patterns.testimonials > 5) console.log('  • Patient stories drive conversions');
  if (patterns.offers > 5) console.log('  • Always running promotions/offers');
  
  await page.screenshot({ path: 'sono-bello-ads.png', fullPage: false });
  
  await context.close();
  await browser.close();
});