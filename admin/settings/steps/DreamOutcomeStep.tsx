import React from 'react'

interface Props {
  config: any
  updateConfig: (updates: any) => void
}

export default function DreamOutcomeStep({ config, updateConfig }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          What's the dream outcome?
        </h3>
        <p className="text-gray-600">
          What transformation do you promise your customers? Focus on the end result, not the process.
        </p>
      </div>

      <div>
        <textarea
          value={config.dreamOutcome || ''}
          onChange={(e) => updateConfig({ dreamOutcome: e.target.value })}
          placeholder="Example: Lose 20 pounds and feel confident at the beach this summer"
          className="w-full px-4 py-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
          rows={3}
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-2">
          {config.dreamOutcome?.length || 0} characters (minimum 10)
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          🤖 AI Suggestions Based on Industry
        </p>
        <div className="grid gap-2">
          {[
            "Look stunning in any outfit and turn heads wherever you go",
            "Build a 6-figure business working just 4 hours a day",
            "Find your soulmate and build the relationship of your dreams",
            "Achieve financial freedom and never worry about money again",
            "Get your dream body without giving up the foods you love"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => updateConfig({ dreamOutcome: suggestion })}
              className="text-left px-3 py-2 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg text-sm text-gray-700 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Examples of Good vs Bad */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-green-900 mb-2">✅ Good Examples</p>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>• "Feel confident in a bikini by summer"</li>
            <li>• "Quit your job and travel the world"</li>
            <li>• "Look 10 years younger naturally"</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-900 mb-2">❌ Avoid These</p>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>• "Lose weight" (too vague)</li>
            <li>• "Get coaching" (that's the process)</li>
            <li>• "Join our program" (feature, not benefit)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}