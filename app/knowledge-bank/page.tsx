'use client'

import { useState, useEffect } from 'react'
import { KnowledgeImportSystem } from '@/lib/knowledge-import-system'
import { DataSeedingWorkflow, SeedDataTemplates } from '@/lib/data-seeding-workflow'
import { NicheIntelligenceFile } from '@/lib/niche-intelligence-builder'

export default function KnowledgeBankPage() {
  const [niches, setNiches] = useState<NicheIntelligenceFile[]>([])
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'import' | 'seed'>('overview')

  useEffect(() => {
    loadNiches()
  }, [])

  const loadNiches = async () => {
    // Load from localStorage for now
    const stored = localStorage.getItem('knowledge_bank_niches')
    if (stored) {
      setNiches(JSON.parse(stored))
    }
  }

  const handleImport = async (data: string, format: string) => {
    setImporting(true)
    try {
      const importer = new KnowledgeImportSystem()
      const result = await importer.importKnowledge(
        format === 'json' ? JSON.parse(data) : data,
        format as any
      )
      setImportResult(result)
      
      // Refresh niches
      loadNiches()
    } catch (error) {
      setImportResult({
        success: false,
        errors: [error.message]
      })
    }
    setImporting(false)
  }

  const handleQuickSeed = async (template: string) => {
    setImporting(true)
    try {
      const workflow = new DataSeedingWorkflow()
      const source = SeedDataTemplates[template]
      const result = await workflow.seedFromSources([source])
      
      setImportResult({
        success: true,
        message: `Seeded ${template} data: ${result.stats.nichesCreated} niches, ${result.stats.competitorsImported} competitors, ${result.stats.adsImported} ads`
      })
      
      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem('knowledge_bank_niches') || '[]')
      localStorage.setItem('knowledge_bank_niches', JSON.stringify([...existing, source.data]))
      
      loadNiches()
    } catch (error) {
      setImportResult({
        success: false,
        errors: [error.message]
      })
    }
    setImporting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
            Knowledge Bank
          </h1>
          <p className="text-xl text-gold-200 mt-4">
            Your competitive intelligence database
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 flex gap-2">
            {['overview', 'import', 'seed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 font-semibold'
                    : 'text-gray-400 hover:text-gold-400'
                }`}
              >
                {tab === 'seed' ? 'Quick Seed' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-gold-400">
                {niches.length}
              </div>
              <div className="text-gray-400">Niches Analyzed</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-gold-400">
                {niches.reduce((sum, n) => sum + (n.competitorAnalysis?.length || 0), 0)}
              </div>
              <div className="text-gray-400">Competitors Tracked</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-2xl font-bold text-gold-400">
                {niches.reduce((sum, n) => sum + (n.winningAds?.ads?.length || 0), 0)}
              </div>
              <div className="text-gray-400">Winning Ads</div>
            </div>

            {/* Niche List */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-gold-400 mb-4">Available Niches</h2>
              {niches.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-gray-400">No niches yet. Import data or use Quick Seed to get started!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {niches.map((niche, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gold-500/20 hover:border-gold-500/40 transition-all cursor-pointer"
                      onClick={() => setSelectedNiche(niche.niche)}
                    >
                      <h3 className="font-bold text-gold-400 capitalize">{niche.niche}</h3>
                      <div className="mt-2 text-sm text-gray-400">
                        <div>📊 {niche.competitorAnalysis?.length || 0} competitors</div>
                        <div>📱 {niche.winningAds?.ads?.length || 0} ads</div>
                        <div>💡 {niche.insights?.length || 0} insights</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-6">Import Your Data</h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Format</label>
                <select 
                  id="format-select"
                  className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-gold-500/20"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="markdown">Markdown</option>
                  <option value="raw">Raw Text</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Paste Your Data</label>
                <textarea
                  id="import-data"
                  rows={10}
                  className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gold-500/20 font-mono text-sm"
                  placeholder="Paste your data here..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const format = (document.getElementById('format-select') as HTMLSelectElement).value
                    const data = (document.getElementById('import-data') as HTMLTextAreaElement).value
                    handleImport(data, format)
                  }}
                  disabled={importing}
                  className="flex-1 bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 font-bold py-3 px-6 rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {importing ? 'Importing...' : 'Import Data'}
                </button>
              </div>

              {/* Import Result */}
              {importResult && (
                <div className={`mt-6 p-4 rounded-lg ${
                  importResult.success ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'
                }`}>
                  {importResult.success ? (
                    <div>
                      <div className="text-green-400 font-semibold mb-2">✅ Import Successful!</div>
                      {importResult.message && <div className="text-gray-300">{importResult.message}</div>}
                      {importResult.imported && (
                        <div className="text-gray-400 text-sm mt-2">
                          <div>Niches: {importResult.imported.niches}</div>
                          <div>Competitors: {importResult.imported.competitors}</div>
                          <div>Ads: {importResult.imported.ads}</div>
                          <div>Insights: {importResult.imported.insights}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-red-400 font-semibold mb-2">❌ Import Failed</div>
                      {importResult.errors?.map((error: string, idx: number) => (
                        <div key={idx} className="text-gray-300">{error}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Example Templates */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gold-400 mb-4">Example Formats</h3>
                <div className="space-y-4">
                  <details className="bg-gray-700/30 rounded-lg p-4">
                    <summary className="cursor-pointer text-gray-300 font-semibold">JSON Example</summary>
                    <pre className="mt-4 text-xs text-gray-400 overflow-x-auto">
{`{
  "niches": [{
    "name": "fitness",
    "competitors": [{
      "name": "F45 Training",
      "url": "https://f45training.com",
      "pricing": "$150-200/month",
      "strengths": ["Community", "HIIT focus"],
      "weaknesses": ["High price", "Limited flexibility"]
    }],
    "ads": [{
      "headline": "Transform in 6 Weeks",
      "copy": "Join the F45 Challenge",
      "cta": "Start Free Week",
      "platform": "Facebook"
    }]
  }]
}`}
                    </pre>
                  </details>
                  
                  <details className="bg-gray-700/30 rounded-lg p-4">
                    <summary className="cursor-pointer text-gray-300 font-semibold">CSV Example</summary>
                    <pre className="mt-4 text-xs text-gray-400 overflow-x-auto">
{`niche,competitor,website,pricing,strengths,weaknesses
fitness,F45 Training,https://f45training.com,$150-200/mo,"Community,HIIT","Price,Limited flexibility"
fitness,OrangeTheory,https://orangetheory.com,$159/mo,"Heart rate training,Coaching","Expensive,Crowded"`}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seed Tab */}
        {activeTab === 'seed' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gold-500/20">
              <h2 className="text-2xl font-bold text-gold-400 mb-6">Quick Seed Templates</h2>
              <p className="text-gray-400 mb-8">
                Instantly populate your knowledge bank with industry-specific data
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(SeedDataTemplates).map(([key, template]) => (
                  <div
                    key={key}
                    className="bg-gray-700/30 rounded-lg p-6 border border-gold-500/10 hover:border-gold-500/30 transition-all"
                  >
                    <h3 className="text-xl font-bold text-gold-400 capitalize mb-2">{key}</h3>
                    <p className="text-gray-400 text-sm mb-4">{template.name}</p>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <div>📊 {template.data.competitors?.length || 0} competitors</div>
                      <div>📱 {template.data.winning_ads?.length || 0} winning ads</div>
                      <div>💡 {template.data.insights?.length || 0} insights</div>
                    </div>
                    
                    <button
                      onClick={() => handleQuickSeed(key)}
                      disabled={importing}
                      className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 font-bold py-2 px-4 rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {importing ? 'Seeding...' : 'Use This Template'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Niche Modal */}
        {selectedNiche && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gold-400 capitalize">{selectedNiche}</h2>
                  <button
                    onClick={() => setSelectedNiche(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="font-bold text-gold-400 mb-2">Data Quality</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full" style={{width: '75%'}} />
                      </div>
                      <span className="text-gold-400">75%</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-300">
                    <p>Full niche intelligence available. Ready for analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}