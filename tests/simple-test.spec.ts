import { test, expect } from '@playwright/test';

// Simple test to make sure Playwright is working
test('My first test - Google search', async ({ page }) => {
  // Go to Google
  await page.goto('https://google.com');
  
  // Accept cookies if the banner appears
  await page.click('text=Accept all').catch(() => {
    console.log('No cookie banner found');
  });
  
  // Type in the search box
  await page.fill('[name="q"]', 'body contouring London');
  
  // Press Enter to search
  await page.press('[name="q"]', 'Enter');
  
  // Wait for results
  await page.waitForSelector('#search');
  
  // Take a screenshot
  await page.screenshot({ path: 'google-search-results.png' });
  
  // Check that we have results
  const results = await page.$$('.g');
  expect(results.length).toBeGreaterThan(0);
  
  console.log(`Found ${results.length} search results`);
});

// Test without proxy (local website)
test('Test local website', async ({ page }) => {
  // If you have a local server running
  await page.goto('http://localhost:3000');
  
  // Take a screenshot
  await page.screenshot({ path: 'localhost.png' });
  
  // Check the page title
  const title = await page.title();
  console.log('Page title:', title);
});

// Simple test with Oxylabs proxy (once you add credentials)
test.skip('Test with Oxylabs proxy', async ({ browser }) => {
  // This test will only run after you add Oxylabs credentials
  // Remove .skip when you have credentials
  
  const context = await browser.newContext({
    proxy: {
      server: 'http://pr.oxylabs.io:7777',
      username: process.env.OXYLABS_USERNAME || 'your_username',
      password: process.env.OXYLABS_PASSWORD || 'your_password',
    }
  });
  
  const page = await context.newPage();
  
  // Go to a website through the proxy
  await page.goto('https://httpbin.org/ip');
  
  // Get the IP address (should be Oxylabs proxy IP)
  const content = await page.textContent('body');
  console.log('Proxy IP:', content);
  
  await context.close();
});

// Test to scrape a real website
test('Scrape Skulpt website', async ({ page }) => {
  await page.goto('https://skulpt.co.uk');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Get the main headline
  const headline = await page.textContent('h1');
  console.log('Main headline:', headline);
  
  // Find all buttons
  const buttons = await page.$$eval('button, a.button, a.btn', elements =>
    elements.map(el => el.textContent?.trim())
  );
  console.log('Buttons found:', buttons);
  
  // Look for pricing
  const priceElements = await page.$$eval('*', elements =>
    elements
      .map(el => el.textContent)
      .filter(text => text?.includes('£') || text?.includes('$'))
      .slice(0, 5)
  );
  console.log('Price mentions:', priceElements);
  
  // Take a full page screenshot
  await page.screenshot({ path: 'skulpt-homepage.png', fullPage: true });
});