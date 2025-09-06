# Important Notes for Claude

## AI Model Versions
- **Claude**: Use `claude-4-sonnet` (NOT claude-3-5-sonnet)
- **OpenAI**: Use `gpt-4o` for analysis

## Key Project Details
- This is LeadBalloon AI - a lead generation and conversion optimization platform
- The system analyzes websites, finds winning Facebook ads, and creates assessment tools
- Facebook Ads Library cannot be scraped automatically - requires manual research
- The system is transparent about failures and converts them to lead capture opportunities

## API Keys Location
- All API keys are in `.env.local`
- OpenAI and Anthropic keys are configured and paid for

## Core Functionality
1. Website scraping with Playwright (may timeout on protected sites)
2. AI analysis using GPT-4o and Claude Sonnet 4
3. Manual Facebook ads research with queue system
4. Lead capture during the analysis journey

## Remember
- Always use Claude Sonnet 4 model (`claude-4-sonnet`)
- Be transparent when automation fails
- Convert failures to lead capture opportunities
- The "journey" takes time intentionally (builds value)