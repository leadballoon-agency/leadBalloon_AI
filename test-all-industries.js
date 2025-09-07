/**
 * Test knowledge accessibility for ALL industries
 */

async function testAllIndustries() {
  console.log('🏭 TESTING ALL INDUSTRY KNOWLEDGE\n')
  console.log('=' .repeat(70))
  
  const industries = [
    { name: 'Body Contouring', url: 'https://bodysculpting.co.uk', type: 'bodyContouring' },
    { name: 'Solar PV', url: 'https://solarpanels.co.uk', type: 'solarPV' },
    { name: 'PRP/Hair', url: 'https://hairrestoration.co.uk', type: 'prp' },
    { name: 'HIFU', url: 'https://hifuclinic.co.uk', type: 'hifu' },
    { name: 'Laser Hair', url: 'https://laserhair.co.uk', type: 'laserHairRemoval' },
    { name: 'Vein Clinic', url: 'https://veinclinic.co.uk', type: 'veinClinic' },
    { name: 'Pregnancy Scan', url: 'https://babyscan.co.uk', type: 'pregnancyScanning' },
    { name: 'Driving School', url: 'https://drivingschool.co.uk', type: 'drivingInstructor' },
    { name: 'First Aid', url: 'https://firstaidtraining.co.uk', type: 'firstAid' }
  ]
  
  for (const industry of industries) {
    console.log(`\n📌 Testing: ${industry.name}`)
    console.log('-'.repeat(50))
    
    const context = {
      url: industry.url,
      domain: industry.url.replace('https://', ''),
      businessType: industry.type
    }
    
    // Test with industry-specific question
    const response = await fetch('http://localhost:3003/api/ai-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "What's the typical lead cost in my industry?",
        context,
        conversationHistory: []
      })
    })
    
    const data = await response.json()
    const responseText = data.response?.toLowerCase() || ''
    
    // Check for industry-specific knowledge
    const hasKnowledge = {
      bodyContouring: responseText.includes('£15') || responseText.includes('£50'),
      solarPV: responseText.includes('£20') || responseText.includes('£60') || responseText.includes('solar'),
      prp: responseText.includes('£40') || responseText.includes('£80') || responseText.includes('hair'),
      hifu: responseText.includes('£25') || responseText.includes('£70') || responseText.includes('tightening'),
      laserHairRemoval: responseText.includes('£10') || responseText.includes('£35') || responseText.includes('laser'),
      veinClinic: responseText.includes('£45') || responseText.includes('£90') || responseText.includes('vein'),
      pregnancyScanning: responseText.includes('£15') || responseText.includes('£40') || responseText.includes('scan'),
      drivingInstructor: responseText.includes('£5') || responseText.includes('£20') || responseText.includes('driving'),
      firstAid: responseText.includes('£10') || responseText.includes('£30') || responseText.includes('training')
    }
    
    const usesKnowledge = hasKnowledge[industry.type] || false
    
    console.log(`Response: ${data.response?.substring(0, 150)}...`)
    console.log(`✅ Uses Industry Knowledge: ${usesKnowledge ? 'YES' : 'NO'}`)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '=' .repeat(70))
  console.log('📊 SUMMARY: Check if all industries have proper knowledge loaded!')
}

testAllIndustries().catch(console.error)