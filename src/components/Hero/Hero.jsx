import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, Heart } from 'lucide-react'

const dynamicPhrases = [
  'مو بس أحبك… أنا أرتاح معك',
  'وسط كل الضغوط… أنتِ الشيء الوحيد اللي يهديني',
  'كنت أبحث عن أشياء كثيرة… الى أن لقيتك',
  'معك… صرت أفهم معنى أن يكون لك مكان',
  'أنتِ مو جزء من يومي… أنتِ الشيء اللي يرجعني لنفسي',
  'كل مرة أضيع… أرجع لك',
  'أنتِ الشيء الوحيد اللي ما شكّيت فيه أبدًا',
  'مو لأنك مثالية… بل لأنك أنتِ',
  'بين كل شيء في حياتي… اخترتك أنتِ',
  'أنتِ مو بس قصة… أنتِ قراري',
  'يا بنت قلبي… أنتِ كل هذا بالنسبة لي',
  ]
  

export default function Hero({ onStartJourney }) {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % dynamicPhrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden bg-[#050508]">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Core glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[radial-gradient(circle,rgba(212,165,116,0.08)_0%,rgba(201,123,139,0.04)_30%,transparent_70%)] opacity-80 mix-blend-screen" />
        
        {/* Ethereal animated rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full border border-gold/10"
          style={{ borderStyle: 'dashed' }}
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[550px] sm:h-[850px] rounded-full border border-rose/5"
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Glowing orbs */}
        <motion.div 
          className="absolute top-[20%] left-[20%] w-32 h-32 bg-gold/10 rounded-full blur-[60px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[20%] w-40 h-40 bg-rose/10 rounded-full blur-[80px]"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Main Content */}
      {isReady && (
        <motion.div
          className="relative z-10 text-center flex flex-col items-center w-full max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Elegant Subtitle */}
          <motion.div
            className="flex items-center gap-3 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4 text-gold/60" />
            <p className="text-gold/80 text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.4em] uppercase font-medium">
              رحلتنا... كما لم تُروى من قبل
            </p>
            <Sparkles className="w-4 h-4 text-gold/60" />
          </motion.div>

          {/* Majestic Name */}
          <motion.h1
            className="text-[5rem] sm:text-7xl md:text-[9rem] lg:text-[11rem] font-black leading-none mb-4 sm:mb-8 text-shimmer drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            هاجر
          </motion.h1>

          {/* Poetic Dynamic Phrases */}
          <div className="h-12 sm:h-16 flex items-center justify-center overflow-hidden mb-10 w-full px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhrase}
                className="text-lg sm:text-xl md:text-2xl text-white/80 font-light tracking-wide text-center"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {dynamicPhrases[currentPhrase]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Minimalist Divider */}
          <motion.div
            className="flex items-center gap-4 mb-12 sm:mb-16"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
          >
            <div className="w-16 sm:w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-gold/60" />
            <Heart className="w-3 h-3 text-gold/80 fill-gold/20 animate-pulse" />
            <div className="w-16 sm:w-24 md:w-32 h-[1px] bg-gradient-to-l from-transparent via-gold/30 to-gold/60" />
          </motion.div>

          {/* Premium Glassmorphic CTA */}
          <motion.button
            className="group relative flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 
                       rounded-full text-white text-base sm:text-lg font-medium tracking-wide
                       overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-95"
            onClick={onStartJourney}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2 }}
          >
            {/* Glass Background */}
            <span className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 transition-colors duration-500" />
            
            {/* Glowing Aura on Hover */}
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500
                           shadow-[0_0_40px_rgba(212,165,116,0.3)] bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0" />
            
            {/* Animated Border */}
            <span className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '1px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />

            <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
              ابدئي الرحلة
              <ChevronDown className="w-5 h-5 text-gold group-hover:translate-y-1 transition-transform duration-300" />
            </span>
          </motion.button>
        </motion.div>
      )}
    </section>
  )
}
