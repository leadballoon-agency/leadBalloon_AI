import { test, expect, chromium } from '@playwright/test';

test('Scrape CoolSculpting with Oxylabs', async () => {
  // Use Oxylabs proxy
  const browser = await chromium.launch();
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: 'leadballon1_S2OfM',
      password: 'p86m4Dx7DSExUBuG8+',
    }
  });
  
  const page = await context.newPage();
  
  console.log('🔍 Scraping CoolSculpting website...\n');
  
  await page.goto('https://coolsculpting.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Extract pricing
  const pricing = await page.$$eval('*', elements => 
    elements
      .map(el => el.textContent)
      .filter(text => text && (text.includes('$') || text.includes('price') || text.includes('cost')))
      .slice(0, 5)
  );
  
  console.log('💰 Pricing mentions found:');
  pricing.forEach(p => console.log(`  - ${p?.substring(0, 100)}`));
  
  // Extract headlines
  const headlines = await page.$$eval('h1, h2', els => 
    els.slice(0, 5).map(el => el.textContent?.trim())
  );
  
  console.log('\n📝 Main headlines:');
  headlines.forEach(h => console.log(`  - ${h}`));
  
  // Extract CTAs
  const ctas = await page.$$eval('button, a.button, a.btn', els =>
    [...new Set(els.map(el => el.textContent?.trim()).filter(Boolean))].slice(0, 5)
  );
  
  console.log('\n🎯 Call-to-action buttons:');
  ctas.forEach(cta => console.log(`  - ${cta}`));
  
  // Take screenshot
  await page.screenshot({ path: 'coolsculpting-homepage.png' });
  console.log('\n📸 Screenshot saved: coolsculpting-homepage.png');
  
  await context.close();
  await browser.close();
});

test('Scrape Ideal Image with Oxylabs', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: 'leadballon1_S2OfM',
      password: 'p86m4Dx7DSExUBuG8+',
    }
  });
  
  const page = await context.newPage();
  
  console.log('🔍 Scraping Ideal Image website...\n');
  
  await page.goto('https://idealimage.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Look for offers and promotions
  const offers = await page.$$eval('[class*="offer"], [class*="promo"], [class*="special"], [class*="deal"]', els =>
    els.slice(0, 5).map(el => el.textContent?.trim())
  );
  
  console.log('🎁 Special offers found:');
  offers.forEach(offer => console.log(`  - ${offer?.substring(0, 100)}`));
  
  // Extract guarantees
  const guarantees = await page.$$eval('*', elements =>
    elements
      .map(el => el.textContent)
      .filter(text => text && (text.includes('guarantee') || text.includes('refund') || text.includes('risk-free')))
      .slice(0, 3)
  );
  
  console.log('\n✅ Guarantees:');
  guarantees.forEach(g => console.log(`  - ${g?.substring(0, 100)}`));
  
  // Extract urgency elements
  const urgency = await page.$$eval('*', elements =>
    elements
      .map(el => el.textContent)
      .filter(text => text && (text.includes('limited') || text.includes('today') || text.includes('now') || text.includes('hurry')))
      .slice(0, 3)
  );
  
  console.log('\n⏰ Urgency triggers:');
  urgency.forEach(u => console.log(`  - ${u?.substring(0, 100)}`));
  
  await page.screenshot({ path: 'idealimage-homepage.png' });
  console.log('\n📸 Screenshot saved: idealimage-homepage.png');
  
  await context.close();
  await browser.close();
});

test('Compare competitor offers', async () => {
  console.log('\n🎯 COMPETITOR ANALYSIS SUMMARY\n');
  console.log('=' .repeat(50));
  
  const competitors = [
    {
      name: 'CoolSculpting',
      url: 'https://coolsculpting.com',
      selectors: {
        price: '[class*="price"], [class*="cost"], :has-text("$")',
        value: '[class*="benefit"], [class*="result"], li'
      }
    },
    {
      name: 'Ideal Image', 
      url: 'https://idealimage.com',
      selectors: {
        price: '[class*="price"], [class*="pricing"], :has-text("$")',
        value: '[class*="why"], [class*="benefit"], [class*="advantage"]'
      }
    }
  ];
  
  const browser = await chromium.launch();
  
  for (const competitor of competitors) {
    const context = await browser.newContext({
      proxy: {
        server: 'http://pr.oxylabs.io:7777',
        username: 'leadballon1_S2OfM',
        password: 'p86m4Dx7DSExUBuG8+',
      }
    });
    
    const page = await context.newPage();
    
    console.log(`\n📊 ${competitor.name}`);
    console.log('-'.repeat(30));
    
    try {
      await page.goto(competitor.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Extract key value propositions
      const values = await page.$$eval(competitor.selectors.value, els =>
        els.slice(0, 3).map(el => el.textContent?.trim()).filter(Boolean)
      );
      
      console.log('Value Props:');
      values.forEach(v => console.log(`  • ${v?.substring(0, 60)}`));
      
      // Check for social proof
      const socialProof = await page.$$eval('[class*="review"], [class*="testimonial"], [class*="rating"]', els => els.length);
      console.log(`\nSocial Proof Elements: ${socialProof}`);
      
    } catch (error) {
      console.log(`Failed to analyze: ${error}`);
    }
    
    await context.close();
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 INSIGHTS FOR YOUR OFFER:');
  console.log('  1. Focus on results they don\'t promise');
  console.log('  2. Add stronger guarantees'); 
  console.log('  3. Create genuine urgency');
  console.log('  4. Stack more value than competitors');
});