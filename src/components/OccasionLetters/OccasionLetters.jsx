import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Clock, Gift, CalendarHeart } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useJourney } from '../../hooks/useJourney'
import occasionsData from '../../data/occasions.json'

const colorMap = {
  gold: {
    border: 'border-gold/20',
    activeBorder: 'border-gold/50',
    bg: 'bg-gold/[0.03]',
    activeBg: 'bg-gold/[0.08]',
    text: 'text-gold',
    glow: 'rgba(212, 165, 116, 0.12)',
    lock: 'text-gold/40',
    accent: 'from-gold/20 to-transparent',
  },
  rose: {
    border: 'border-rose/20',
    activeBorder: 'border-rose/50',
    bg: 'bg-rose/[0.03]',
    activeBg: 'bg-rose/[0.08]',
    text: 'text-rose',
    glow: 'rgba(201, 123, 139, 0.12)',
    lock: 'text-rose/40',
    accent: 'from-rose/20 to-transparent',
  },
  purple: {
    border: 'border-purple-soft/20',
    activeBorder: 'border-purple-soft/50',
    bg: 'bg-purple-soft/[0.03]',
    activeBg: 'bg-purple-soft/[0.08]',
    text: 'text-purple-soft',
    glow: 'rgba(139, 122, 173, 0.12)',
    lock: 'text-purple-soft/40',
    accent: 'from-purple-soft/20 to-transparent',
  },
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calculate() {
      const now = new Date()
      const target = new Date(targetDate)
      // If the date has passed this year, set to next year
      if (target < now) {
        target.setFullYear(now.getFullYear() + 1)
        // If still past (edge case), add another year
        if (target < now) target.setFullYear(target.getFullYear() + 1)
      }
      const diff = target - now
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTimeLeft(calculate())
    const timer = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function isDateUnlocked(dateStr) {
  const now = new Date()
  const target = new Date(dateStr)
  return now >= target
}

function getNextOccasion(occasions) {
  const now = new Date()
  let nearest = null
  let nearestDiff = Infinity

  occasions.forEach((occ) => {
    const target = new Date(occ.date)
    // Check this year and next year
    for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      const check = new Date(target)
      check.setFullYear(now.getFullYear() + yearOffset)
      const diff = check - now
      if (diff > 0 && diff < nearestDiff) {
        nearestDiff = diff
        nearest = occ
      }
    }
  })
  return nearest
}

function CountdownBanner({ occasion }) {
  const countdown = useCountdown(occasion.date)
  const colors = colorMap[occasion.color] || colorMap.gold

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border ${colors.activeBorder} ${colors.activeBg} p-6 md:p-8 mb-10 backdrop-blur-sm`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,${colors.glow}_0%,transparent_60%)]`} />

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <CalendarHeart size={18} className={colors.text} />
          <span className="text-text-muted text-xs tracking-wider">أقرب مناسبة قادمة</span>
        </div>

        <h3 className={`text-xl md:text-2xl font-bold ${colors.text} mb-1`}>
          <span className="text-2xl md:text-3xl ml-2">{occasion.emoji}</span>
          {occasion.title}
        </h3>

        <div className="flex items-center justify-center gap-4 md:gap-6 mt-5">
          {[
            { value: countdown.days, label: 'يوم' },
            { value: countdown.hours, label: 'ساعة' },
            { value: countdown.minutes, label: 'دقيقة' },
            { value: countdown.seconds, label: 'ثانية' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <motion.div
                className={`text-2xl md:text-4xl font-bold tabular-nums ${colors.text}`}
                key={item.value}
                initial={{ y: -5, opacity: 0.7 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {String(item.value).padStart(2, '0')}
              </motion.div>
              <span className="text-text-muted text-[10px] md:text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function OccasionCard({ occasion, index }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const { state, dispatch } = useJourney()
  const colors = colorMap[occasion.color] || colorMap.gold
  const unlocked = isDateUnlocked(occasion.date)
  const isOpened = state.occasionsOpened?.includes(occasion.id)
  const [showMessage, setShowMessage] = useState(isOpened)

  const handleOpen = () => {
    if (!unlocked) return
    setShowMessage(!showMessage)
    if (!isOpened) {
      dispatch({ type: 'OPEN_OCCASION', payload: occasion.id })
    }
  }

  const formattedDate = useMemo(() => {
    return new Date(occasion.date).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'long',
    })
  }, [occasion.date])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={`relative rounded-2xl border overflow-hidden transition-all duration-700 group
                   ${unlocked
                     ? `${colors.border} ${colors.bg} cursor-pointer hover:${colors.activeBorder}`
                     : 'border-white/[0.04] bg-white/[0.01] cursor-not-allowed'
                   }`}
        onClick={handleOpen}
        whileHover={unlocked ? { y: -4 } : {}}
        whileTap={unlocked ? { scale: 0.98 } : {}}
        layout
      >
        {/* Top glow */}
        {unlocked && (
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                          bg-[radial-gradient(ellipse_at_50%_0%,${colors.glow}_0%,transparent_60%)]`} />
        )}

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{occasion.emoji}</span>
              <div>
                <h3 className={`text-lg md:text-xl font-bold ${unlocked ? colors.text : 'text-text-muted/50'}`}>
                  {occasion.title}
                </h3>
                <span className={`text-xs ${unlocked ? 'text-text-secondary/60' : 'text-text-muted/30'}`}>
                  {formattedDate}
                </span>
              </div>
            </div>

            <motion.div
              className={`w-9 h-9 rounded-full flex items-center justify-center border
                         ${unlocked
                           ? `${colors.bg} ${colors.border} ${colors.text}`
                           : 'bg-white/[0.02] border-white/[0.06] text-text-muted/30'
                         }`}
              animate={unlocked && !isOpened ? { rotate: [0, -5, 5, 0] } : {}}
              transition={{ duration: 2, repeat: unlocked && !isOpened ? Infinity : 0, repeatDelay: 3 }}
            >
              {unlocked ? (
                isOpened ? <Unlock size={16} /> : <Gift size={16} />
              ) : (
                <Lock size={16} />
              )}
            </motion.div>
          </div>

          {/* Locked state */}
          {!unlocked && (
            <div className="flex items-center gap-2 mt-3">
              <Clock size={12} className="text-text-muted/30" />
              <span className="text-text-muted/30 text-xs">تُفتح في {formattedDate}</span>
            </div>
          )}

          {/* Unlocked but not opened */}
          {unlocked && !showMessage && (
            <motion.p
              className={`text-xs mt-2 ${colors.lock} tracking-wider`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              اضغطي لقراءة الرسالة...
            </motion.p>
          )}

          {/* Message content */}
          <AnimatePresence mode="wait">
            {showMessage && unlocked && (
              <motion.div
                key="content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`w-full h-[1px] bg-gradient-to-r ${colors.accent} my-4`} />
                <p className="text-text-secondary/90 leading-[2] text-[15px] md:text-base font-light">
                  {occasion.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function OccasionLetters() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()
  const { state } = useJourney()
  const nextOccasion = useMemo(() => getNextOccasion(occasionsData), [])

  const openedCount = state.occasionsOpened?.length || 0
  const unlockedCount = occasionsData.filter((o) => isDateUnlocked(o.date)).length

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden" id="occasions">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0a12] to-[#0a0a0f]" />

      {/* Section title */}
      <motion.div
        ref={titleRef}
        className="relative z-10 text-center mb-16 md:mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="text-text-muted text-xs tracking-[0.3em] uppercase block mb-4">
          لكل مناسبة حكاية
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gold glow-gold">رسالة لكل مناسبة</span>
        </h2>
        <p className="text-text-secondary/70 text-base md:text-lg font-light">
          رسائل مقفلة تنتظر وقتها... وبعضها جاهز لكِ الآن
        </p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
          <div className="w-1 h-1 rounded-full bg-gold/40" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Countdown to next occasion */}
        {nextOccasion && <CountdownBanner occasion={nextOccasion} />}

        {/* Occasion cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {occasionsData.map((occasion, index) => (
            <OccasionCard key={occasion.id} occasion={occasion} index={index} />
          ))}
        </div>

        {/* Progress */}
        <motion.div
          className="max-w-xs mx-auto mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex justify-between text-text-muted text-xs mb-2">
            <span>{openedCount} من {unlockedCount} متاحة</span>
            <span>{unlockedCount > 0 ? Math.round((openedCount / unlockedCount) * 100) : 0}%</span>
          </div>
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold/60 to-rose/60 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${unlockedCount > 0 ? (openedCount / unlockedCount) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
