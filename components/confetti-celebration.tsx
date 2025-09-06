'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  delay: number
  duration: number
}

export function ConfettiCelebration({ 
  trigger, 
  message = "BOOM! AI crushed it! 🎉" 
}: { 
  trigger: boolean
  message?: string 
}) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (!trigger) return

    // Generate confetti pieces - MORE pieces for full viewport coverage
    const pieces: ConfettiPiece[] = []
    const colors = ['#FFC107', '#FFB300', '#FFA000', '#FF8F00', '#FF6F00', '#FFD54F']
    
    // Create 150 pieces for better coverage
    for (let i = 0; i < 150; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // Spread across full width
        y: -20 - Math.random() * 20, // Start above viewport
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1, // Vary sizes more
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1, // Stagger more
        duration: 3 + Math.random() * 2 // Longer fall time
      })
    }
    
    setConfettiPieces(pieces)
    setShowMessage(true)

    // Clear after animation
    const timeout = setTimeout(() => {
      setConfettiPieces([])
      setShowMessage(false)
    }, 4000)

    return () => clearTimeout(timeout)
  }, [trigger])

  if (!trigger) return null

  return (
    <>
      {/* Confetti Container */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {confettiPieces.map(piece => (
          <div
            key={piece.id}
            className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`
            }}
          />
        ))}
      </div>

      {/* Success Message */}
      {showMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 px-8 py-4 rounded-full font-bold shadow-2xl">
            {message}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: translate(-50%, -100px) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, 0) scale(1.1);
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
        }

        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </>
  )
}

/**
 * Mini celebration for smaller wins
 */
export function MiniCelebration({ text }: { text: string }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timeout)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
        <span className="text-2xl animate-pulse">✨</span>
        <span className="font-semibold">{text}</span>
      </div>
      
      <style jsx>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

/**
 * Progress celebration messages
 */
export const CelebrationMessages = {
  dataFound: [
    "Found the goldmine! 💰",
    "This is JUICY! 🔥",
    "Your competitors are shaking! 😱",
    "AI is on fire today! 🚀",
    "BOOM! Got the intel! 🎯"
  ],
  
  analysisComplete: [
    "Crushed it! Analysis complete! 🏆",
    "AI just went beast mode! 💪",
    "Results are IN and they are GOOD! ✨",
    "Nailed it! Your strategy is ready! 🎉",
    "Done! This is going to be good! 🔥"
  ],
  
  competitorFound: [
    "Found your competition! Time to dominate! 👀",
    "Competitor spotted! They won't know what hit them! 🎯",
    "Got 'em! Let's steal their best tricks! 🕵️",
    "Competition identified! Advantage: YOU! 💪"
  ],
  
  pricingOpportunity: [
    "You're undercharging! Ka-ching! 💰",
    "Found money on the table! 📈",
    "Price increase opportunity detected! 🚀",
    "You could charge WAY more! 💎"
  ]
}

/**
 * Get random celebration message
 */
export function getRandomCelebration(type: keyof typeof CelebrationMessages): string {
  const messages = CelebrationMessages[type]
  return messages[Math.floor(Math.random() * messages.length)]
}