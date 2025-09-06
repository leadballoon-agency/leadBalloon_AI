/**
 * Queue Messages with Personality
 * Making waiting fun while showing we're current and have a sense of humor
 */

export const queueMessages = {
  welcome: [
    "🎫 Here's your ticket! You're number {position} in the queue. Grab some popcorn, this is better than Netflix!",
    "📺 Queue position #{position}. Perfect time to watch that Baby Reindeer episode everyone's talking about (yes, it gets even weirder)",
    "🎬 You're #{position}. Enough time to finally understand what happened in the Oppenheimer ending",
    "🍿 Position #{position}. Just enough time to debate if The Bear is actually a comedy (spoiler: it's not)",
    "📱 You're #{position} in line. Time to doom-scroll through those Apple Vision Pro reviews you can't afford",
    "🎮 Queue position #{position}. Finally, an excuse to check if GTA 6 has a release date yet (spoiler: still 2025)",
    "☕ You're #{position}. Perfect amount of time to grab an overpriced Stanley cup... I mean coffee",
  ],
  
  waiting: {
    high: [ // Position 20+
      "🎪 Still #{position} in queue. Taylor Swift's Eras Tour might finish before you, but we're moving fast!",
      "🏈 Position #{position}. The Chiefs won another Super Bowl while you waited (probably)",
      "🚀 #{position} ahead. SpaceX will probably launch and land 3 rockets by then",
      "📺 Still #{position}. Succession ended, but somehow there's another Roy sibling we missed",
      "🎬 Queue: #{position}. Marvel just announced 17 more phases. We'll be done before Phase 5, promise",
    ],
    
    medium: [ // Position 10-20
      "⚡ Down to #{position}! Moving faster than Twitter becoming X becoming... whatever it is now",
      "🔥 Only #{position} ahead! We're processing faster than ChatGPT writing your homework",
      "💨 Position #{position}. Almost as quick as people leaving Threads for Bluesky... then coming back",
      "📉 #{position} now! Dropping faster than crypto when Elon tweets",
      "🎯 Just #{position} more! Closer than the Barbie movie to that Oscar",
    ],
    
    low: [ // Position 1-10
      "🏃 Only #{position} ahead! So close you can taste it (tastes like success and RGB lighting)",
      "⚡ Just #{position} to go! Faster than Apple adding another camera to the iPhone",
      "🔥 #{position} left! Almost there! Like waiting for GTA 6 but actually happening",
      "🎊 Only #{position} more! Your Spotify Wrapped could never",
      "🚀 #{position} ahead! Landing sequence initiated. This is not a drill!",
    ],
    
    almostThere: [ // Position 1-3
      "👀 You're NEXT! *Air horn noises* 📢",
      "🎉 ON DECK! Warming up the AI engines just for you!",
      "⚡ NEXT UP! The algorithms are literally vibrating with anticipation",
      "🔥 INCOMING! Our servers just put on their fancy pants",
      "🏆 NEXT! This is your Roman Empire moment",
    ]
  },
  
  processing: [
    "🤖 Analyzing your site harder than Reddit analyzing The Last of Us plot holes...",
    "🔍 Scanning competitors like everyone scanning for Taylor Swift tickets...",
    "📊 Crunching numbers faster than people calculating if they can afford eggs this week...",
    "🎯 Finding winning ads like finding a PS5 in 2021 (but actually possible)...",
    "⚡ Processing faster than Netflix canceling your favorite show after one season...",
    "🧠 Our AI is thinking harder than Christopher Nolan writing Tenet backwards...",
    "💫 Discovering insights deeper than the Barbenheimer lore...",
    "🔮 Reading the market like everyone reading Prince Harry's spare details...",
  ],
  
  complete: [
    "🎊 DONE! Your analysis is ready! Better than the Succession finale (and that's saying something)",
    "✨ COMPLETE! We found more gold than One Piece (and it only took us 10 minutes, not 25 years)",
    "🏆 FINISHED! Your report is hotter than Austin Butler's Elvis voice (which he's apparently stuck with)",
    "🚀 READY! More insights than a Joe Rogan podcast, but in 1/300th the time",
    "💎 COMPLETE! We delivered faster than Amazon Prime (and found better stuff)",
    "🎯 DONE! Your competitive intelligence is ready. It's giving main character energy",
    "⚡ READY! Processed faster than the Speed sequel nobody asked for",
  ],
  
  skipQueue: [
    "🎫 Skip the queue like it's a YouTube ad - drop your phone number for VIP treatment",
    "⚡ Want the Disney+ Premier Access experience? Phone number unlocks priority",
    "🚀 Skip ahead faster than Netflix skip intro button - just need those digits",
    "💎 Get the Twitter Blue checkmark treatment (but actually valuable) - phone for priority",
    "🏃 Jump the queue like TSA PreCheck - phone number gets you there",
  ],
  
  currentEvents: {
    december2024: [
      "⏰ While you wait: Beyoncé just announced another surprise album. Our analysis will be ready before you finish listening",
      "📱 Queue update: Still faster than getting Taylor Swift Eras Tour tickets (IYKYK)",
      "🎮 Fun fact: GTA 6 might actually release before you retire. Your analysis? 5 more minutes",
      "☕ Position update: Faster than explaining to your parents what AI actually does",
      "🎬 Almost ready! Unlike Avatar 3, 4, and 5, we actually deliver on time",
    ]
  },
  
  techHumor: [
    "🤖 Our AI is trained on successful ads, not just Reddit arguments and Wikipedia",
    "💻 Processing with the power of AGI (Actually Getting Intelligence)™",
    "🔋 Running on sustainable energy (developer tears and coffee)",
    "📡 Powered by Web 3.0... just kidding, we use stuff that actually works",
    "🧮 Calculating with quantum computing (it's just really fast regular computing but sounds cooler)",
  ],
  
  loadingJokes: [
    "Teaching our AI the difference between 'your' and 'you're'...",
    "Convincing the algorithm that crypto ads aren't 'winning' anymore...",
    "Explaining to our servers what a 'demure' marketing strategy is...",
    "Training AI to understand Ohio memes (still confused)...",
    "Loading... faster than your ex moving on...",
    "Buffering... but in a sophisticated way...",
  ]
}

/**
 * Get contextual message based on queue position
 */
export function getQueueMessage(position: number, stage: 'welcome' | 'waiting' | 'processing' | 'complete'): string {
  switch (stage) {
    case 'welcome':
      const welcomeMsg = queueMessages.welcome[Math.floor(Math.random() * queueMessages.welcome.length)]
      return welcomeMsg.replace('{position}', position.toString())
    
    case 'waiting':
      let waitingArray
      if (position > 20) waitingArray = queueMessages.waiting.high
      else if (position > 10) waitingArray = queueMessages.waiting.medium
      else if (position > 3) waitingArray = queueMessages.waiting.low
      else waitingArray = queueMessages.waiting.almostThere
      
      const waitingMsg = waitingArray[Math.floor(Math.random() * waitingArray.length)]
      return waitingMsg.replace('{position}', position.toString())
    
    case 'processing':
      return queueMessages.processing[Math.floor(Math.random() * queueMessages.processing.length)]
    
    case 'complete':
      return queueMessages.complete[Math.floor(Math.random() * queueMessages.complete.length)]
    
    default:
      return `Position ${position} in queue`
  }
}

/**
 * Get skip queue message
 */
export function getSkipQueueMessage(): string {
  return queueMessages.skipQueue[Math.floor(Math.random() * queueMessages.skipQueue.length)]
}

/**
 * Get current date-aware message
 */
export function getCurrentEventMessage(): string {
  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toLowerCase().replace(' ', '')
  const events = queueMessages.currentEvents[month] || queueMessages.currentEvents.december2024
  return events[Math.floor(Math.random() * events.length)]
}