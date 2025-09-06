# Playwright Setup Guide - Step by Step

## Step 1: Fix NPM Permissions (if needed)
Open Terminal and run:
```bash
sudo chown -R $(whoami) ~/.npm
```
Enter your Mac password when prompted.

## Step 2: Install Playwright
In the LeadBalloon-AI folder, run these commands one by one:

```bash
# Install Playwright Test framework
npm init -y
npm install -D @playwright/test

# Install Playwright browsers (Chrome, Firefox, Safari)
npx playwright install
```

## Step 3: Create Your First Test
I've already created a simple test file for you at:
`tests/simple-test.spec.ts`

## Step 4: Add Oxylabs Credentials (Optional)
Edit the `.env.local` file and add your Oxylabs credentials:
```
OXYLABS_USERNAME=your_username_here
OXYLABS_PASSWORD=your_password_here
```

## Step 5: Run Your First Test
```bash
# Run all tests
npx playwright test

# Run tests with UI (easier to see what's happening)
npx playwright test --ui

# Run a specific test file
npx playwright test tests/simple-test.spec.ts

# Run tests in headed mode (see the browser)
npx playwright test --headed
```

## Step 6: View Test Results
```bash
# Open the HTML report
npx playwright show-report
```

## Common Commands

### Run tests
- `npx playwright test` - Run all tests
- `npx playwright test --headed` - See the browser while testing
- `npx playwright test --debug` - Debug mode with step-by-step
- `npx playwright test --ui` - Interactive UI mode

### Generate code
- `npx playwright codegen` - Opens browser to record actions
- `npx playwright codegen google.com` - Record actions on specific site

### Other useful commands
- `npx playwright install` - Install/update browsers
- `npx playwright show-report` - View last test report

## Troubleshooting

### If npm install fails:
1. Run: `sudo chown -R $(whoami) ~/.npm`
2. Try again

### If browsers won't install:
1. Run: `npx playwright install-deps`
2. Then: `npx playwright install`

### If tests fail to run:
1. Check if you're in the right directory: `cd ~/Desktop/LeadBalloon-AI`
2. Make sure Playwright is installed: `npm list @playwright/test`

## What We Built For You

1. **playwright.config.ts** - Main configuration file
   - Sets up Oxylabs proxy
   - Configures browsers
   - Sets timeouts and retries

2. **tests/oxylabs-scraper.spec.ts** - Advanced scraping tests
   - Scrapes competitor websites
   - Analyzes Facebook ads
   - Extracts pricing and offers

3. **tests/simple-test.spec.ts** - Simple test to get started
   - Goes to Google
   - Searches for something
   - Takes a screenshot

4. **lib/oxylabs-analyzer.ts** - Helper library
   - Makes scraping easier
   - Analyzes competitor sites
   - Generates AI prompts

## Next Steps

Once you have Playwright working:
1. Run the simple test first to make sure everything works
2. Add your Oxylabs credentials
3. Try the competitor analysis tests
4. Integrate the scraping results with your AI offer generator

## Getting Help

- Playwright docs: https://playwright.dev
- Oxylabs docs: https://oxylabs.io/docs
- Run `npx playwright --help` for command options