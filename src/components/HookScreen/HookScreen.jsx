import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTypewriter } from '../../hooks/useTypewriter'

const hookSequence = [
  { text: 'في قاعة تدريب… يوم عادي جدًا', pause: 2000 },
  { text: 'كنت مشغول… كعادتي', pause: 1800 },
  { text: 'ما كنت أبحث عن أحد', pause: 1600 },
  { text: 'لكن… دخلتِ أنتِ', pause: 2000 },
  { text: 'ومن تلك اللحظة… انتبهت لشيء ما', pause: 2000 },
  { text: 'شيء ما فهمته وقتها', pause: 1600 },
  { text: 'لكنني شعرت به', pause: 1800 },
  { text: 'وكأن كل شيء بدأ… بدون استئذان', pause: 2200 },
  ]
  
const finalText = 'وهنا… لم أعد كما كنت'
export default function HookScreen({ onComplete }) {
  const [phase, setPhase] = useState('sequence') // sequence, final, exit
  const [lineIndex, setLineIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  const currentText = phase === 'sequence'
    ? (hookSequence[lineIndex]?.text || '')
    : phase === 'final' ? finalText : ''

  const { displayedText, isComplete } = useTypewriter(currentText, 50, 300)

  // Derive visible lines from lineIndex (no setState in effect needed)
  const visibleLines = useMemo(() =>
    hookSequence.slice(0, lineIndex).map((l) => l.text),
    [lineIndex]
  )

  // Advance through sequence
  useEffect(() => {
    if (!isComplete) return

    if (phase === 'sequence') {
      if (lineIndex < hookSequence.length - 1) {
        const timer = setTimeout(() => {
          setLineIndex((prev) => prev + 1)
        }, hookSequence[lineIndex].pause)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setPhase('final')
        }, 2000)
        return () => clearTimeout(timer)
      }
    }

    if (phase === 'final') {
      const timer = setTimeout(() => {
        setIsFading(true)
        setTimeout(() => onComplete(), 1200)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isComplete, phase, lineIndex, onComplete])

  const handleSkip = () => {
    setIsFading(true)
    setTimeout(() => onComplete(), 600)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-[#020204] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleSkip}
        animate={{ opacity: isFading ? 0 : 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Ambient light */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212, 165, 116, 0.04) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Previous lines (faded) */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center max-w-2xl">
          {phase === 'sequence' && visibleLines.slice(0, lineIndex).map((line, i) => (
            <motion.p
              key={`done-${i}`}
              className="text-lg md:text-2xl font-light text-text-muted/40 leading-relaxed"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
            >
              {line}
            </motion.p>
          ))}

          {/* Current typing line */}
          {phase === 'sequence' && (
            <motion.p
              key={`typing-${lineIndex}`}
              className="text-xl md:text-3xl font-light text-text-secondary leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {displayedText}
              {!isComplete && displayedText.length > 0 && (
                <span className="cursor-blink text-gold/60 mr-1">|</span>
              )}
            </motion.p>
          )}

          {/* Final reveal */}
          {phase === 'final' && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              <motion.p
                className="text-3xl md:text-6xl font-bold text-shimmer leading-relaxed"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {displayedText}
                {!isComplete && (
                  <span className="cursor-blink text-gold/60 mr-1">|</span>
                )}
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* Skip hint */}
        <motion.p
          className="absolute bottom-8 text-text-muted/40 text-xs tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1.5 }}
        >
          اضغط في أي مكان للتخطي
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
