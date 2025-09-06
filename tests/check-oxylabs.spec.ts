import { test } from '@playwright/test';

test('Check Oxylabs connection', async ({ browser }) => {
  console.log('Testing Oxylabs proxy connection...\n');
  
  // Try different credential formats
  const credentialFormats = [
    { username: 'customer-mark', password: 'password' },
    { username: 'mark', password: 'password' },
    { username: 'customer-mark@leadballoon.co.uk', password: 'password' },
  ];
  
  for (const creds of credentialFormats) {
    console.log(`Trying username: ${creds.username}`);
    
    try {
      const context = await browser.newContext({
        proxy: {
          server: 'http://pr.oxylabs.io:7777',
          username: creds.username,
          password: creds.password,
        },
        timeout: 10000
      });
      
      const page = await context.newPage();
      
      // Test the proxy by checking IP
      await page.goto('https://ip.oxylabs.io/location', { timeout: 10000 });
      const content = await page.textContent('body');
      
      console.log('✅ SUCCESS! Proxy is working!');
      console.log('Response:', content);
      console.log('\nWorking credentials:');
      console.log(`Username: ${creds.username}`);
      console.log(`Password: ${creds.password}`);
      
      await context.close();
      break;
    } catch (error) {
      console.log(`❌ Failed with ${creds.username}`);
    }
  }
  
  console.log('\n-------------------');
  console.log('If all failed, you need to:');
  console.log('1. Go to https://dashboard.oxylabs.io/');
  console.log('2. Click "Start free trial" or "Buy now"');
  console.log('3. After signup, look for:');
  console.log('   - "Users" or "Proxy Users" section');
  console.log('   - "Quick Start" guide');
  console.log('   - Your username (usually customer-XXXXX)');
  console.log('   - Your API password');
});

test('Test without proxy - should work', async ({ page }) => {
  console.log('\nTesting regular connection (no proxy)...');
  await page.goto('https://httpbin.org/ip');
  const ip = await page.textContent('body');
  console.log('Your regular IP:', ip);
});