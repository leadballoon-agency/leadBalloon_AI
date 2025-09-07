# LeadBalloon AI System Configuration Agreement
**DO NOT CHANGE WITHOUT MUTUAL AGREEMENT**

## 🤝 Agreement
This document defines the core system configuration for LeadBalloon AI. Any changes to items marked with 🔒 require explicit agreement between user and assistant.

---

## 🔒 Core AI Models (LOCKED - September 2025)

### Primary Models
- **Claude**: `claude-sonnet-4-20250514` 
  - Status: May fail due to API access
  - Use for: Empathy, rapport, storytelling, greetings
  
- **GPT-4o**: `gpt-4o`
  - Status: WORKING reliably
  - Use for: Data analysis, technical questions, pricing calculations
  - Fallback: Always use when Claude fails

### Model Strategy
**HYBRID APPROACH - Use each model's strengths:**
- Claude for emotional intelligence and conversation flow
- GPT-4o for data, analysis, and technical accuracy
- ALWAYS fallback to GPT-4o if Claude fails (don't break the conversation)

---

## 🔒 System Architecture (LOCKED)

### Core Flow
1. **Scrape Website** → Get real data about business
2. **Enter Waiting Room** → Build rapport with AI chat
3. **Extract Intelligence**:
   - Is user the owner or competitor?
   - Current ad spend (Facebook/Google)
   - Pain points and challenges
   - Contact details for follow-up

### API Endpoints
- `/api/scrape-site` - Website scraping (Playwright)
- `/api/ai-conversation` - AI chat endpoint
- `/api/analyze-website` - Full analysis endpoint

---

## 🔒 Business Strategy (LOCKED)

### Value Proposition
- **Give away £1000+ of marketing consulting for FREE**
- **Goal**: Make marketing agencies "very unhappy" 
- **Method**: Provide real value, not generic responses

### Key Principles
1. **NEVER lie or make up facts** - If unsure, say "I don't have that specific data"
2. **Help EVERYONE** - Including competitors (they're potential clients)
3. **Provide REAL value** - Actionable insights, not fluff
4. **Build genuine rapport** - Be human, empathetic, understanding

---

## 🔒 Knowledge Bases (LOCKED)

### Current Industries with Real Data
- Body Contouring (with competitor intelligence)
- PRP/Hair Restoration
- Solar PV
- Aesthetics
- Dental
- Fitness

### Knowledge Types
- SLO Strategy (Self-Liquidating Offers)
- ROAS Education (Reality vs Expectations)
- Unlimited Budget Formula
- Industry-specific insights and competitor data

---

## 📝 Configurable Settings (Can be adjusted)

### Conversation Parameters
- Temperature: 0.8 (creativity level)
- Max tokens: 200-1000 (response length)
- Queue time: 45 seconds

### Development Settings
- Port: 3003 (localhost)
- Environment: Development

---

## ⚠️ Known Issues (Working to fix)

1. **Claude API Access**: May not have permission for claude-sonnet-4
   - Solution: Falls back to GPT-4o automatically
   
2. **Conversation Persistence**: Some responses revert to generic
   - Solution: Improved error handling in progress

---

## 📊 Success Metrics

### What "Working" Means
- ✅ Scraping extracts real website data
- ✅ AI provides 400+ character valuable responses
- ✅ Conversations include follow-up questions
- ✅ Industry-specific knowledge is referenced
- ✅ User type (owner/competitor) is identified

### Current Status
- Scraping: ✅ WORKING
- First Response: ✅ EXCELLENT
- Follow-up Responses: ⚠️ INCONSISTENT
- Overall Quality: 75% there

---

## 🚀 Future Roadmap (Agreed Direction)

1. **Phase 1**: Fix conversation consistency ← CURRENT
2. **Phase 2**: Add more industry knowledge bases
3. **Phase 3**: Implement learning system
4. **Phase 4**: Launch "Outreach Mode" (proactive lead gen)
5. **Phase 5**: Scale to destroy marketing agency industry

---

## 📝 Change Log

### September 7, 2025
- Initial agreement created
- Confirmed Claude model: `claude-sonnet-4-20250514`
- Confirmed GPT model: `gpt-4o`
- Established hybrid AI strategy

---

**IMPORTANT**: This document represents our shared understanding. Changes to 🔒 sections require explicit agreement. This ensures we don't accidentally break working systems or deviate from the core mission.