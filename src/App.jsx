import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, MessageCircle, Sparkles, Clock, Heart } from 'lucide-react'
import { JourneyProvider } from './context/JourneyContext'
import { useJourney } from './hooks/useJourney'
import { useSectionTracker } from './hooks/useSectionTracker'
import HookScreen from './components/HookScreen/HookScreen'
import Hero from './components/Hero/Hero'
import Timeline from './components/Timeline/Timeline'
import Messages from './components/Messages/Messages'
import Scenarios from './components/Scenarios/Scenarios'
import LoveCounter from './components/Counter/LoveCounter'
import Climax from './components/Climax/Climax'
import FloatingParticles from './components/Particles/FloatingParticles'
import StarField from './components/Particles/StarField'

const NAV_ITEMS = [
  { id: 'timeline', label: 'القصة', icon: BookOpen },
  { id: 'messages', label: 'الرسائل', icon: MessageCircle },
  { id: 'scenarios', label: 'تخيلي', icon: Sparkles },
  { id: 'counter', label: 'العداد', icon: Clock },
  { id: 'climax', label: 'النهاية', icon: Heart },
]

function Navigation() {
  const activeSection = useSectionTracker()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] md:w-max max-w-4xl
                 p-1.5 md:p-2 rounded-2xl md:rounded-full bg-black/50 backdrop-blur-2xl
                 border border-white/10 flex items-center justify-between md:justify-center gap-1 md:gap-2
                 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2
                       px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-full
                       text-[10px] md:text-sm font-medium md:font-semibold tracking-wide
                       whitespace-nowrap transition-all duration-300 cursor-pointer
                       ${isActive
                          ? 'text-gold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
          >
            {isActive && (
              <motion.span
                className="absolute inset-0 rounded-xl md:rounded-full bg-gold/15 border border-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                layoutId="navIndicator"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              <Icon size={18} className={`md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'scale-100'}`} />
            </span>
            <span className="relative z-10 hidden md:block">{item.label}</span>
            <span className="relative z-10 md:hidden mt-0.5">{item.label}</span>
          </button>
        )
      })}
    </motion.nav>
  )
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-6 md:py-10">
      <div className="flex items-center gap-4">
        <div className="w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent to-gold/15" />
        <div className="w-1 h-1 rounded-full bg-gold/25" />
        <div className="w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent to-gold/15" />
      </div>
    </div>
  )
}

function JourneyContent() {
  const { state, dispatch } = useJourney()
  const [showHook, setShowHook] = useState(!state.hookCompleted)
  const [showJourney, setShowJourney] = useState(state.hasStartedJourney)

  const handleHookComplete = useCallback(() => {
    setShowHook(false)
    dispatch({ type: 'COMPLETE_HOOK' })
  }, [dispatch])

  const handleStartJourney = useCallback(() => {
    setShowJourney(true)
    dispatch({ type: 'START_JOURNEY' })
    setTimeout(() => {
      document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }, [dispatch])

  return (
    <div className="relative min-h-screen bg-bg-primary noise-overlay">
      {/* Background layers */}
      {!showHook && (
        <>
          <StarField count={50} />
          <FloatingParticles count={20} />
        </>
      )}

      {/* Hook screen */}
      <AnimatePresence>
        {showHook && <HookScreen onComplete={handleHookComplete} />}
      </AnimatePresence>

      {/* Main content */}
      {!showHook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Hero onStartJourney={handleStartJourney} />

          <AnimatePresence>
            {showJourney && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Navigation />

                <SectionDivider />
                <Timeline />
                <SectionDivider />
                <Messages />
                <SectionDivider />
                <Scenarios />
                <SectionDivider />
                <LoveCounter />
                <SectionDivider />
                <Climax />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

function App() {
  return (
    <JourneyProvider>
      <JourneyContent />
    </JourneyProvider>
  )
}

export default App
