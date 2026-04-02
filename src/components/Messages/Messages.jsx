import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useJourney } from '../../hooks/useJourney'
import messagesData from '../../data/messages.json'

const colorMap = {
  gold: {
    border: 'border-gold/20',
    hoverBorder: 'hover:border-gold/40',
    bg: 'bg-gold/[0.03]',
    text: 'text-gold',
    icon: 'text-gold/70',
    glow: 'rgba(212, 165, 116, 0.12)',
    accent: 'from-gold/15 to-transparent',
    dot: 'bg-gold/40',
  },
  rose: {
    border: 'border-rose/20',
    hoverBorder: 'hover:border-rose/40',
    bg: 'bg-rose/[0.03]',
    text: 'text-rose',
    icon: 'text-rose/70',
    glow: 'rgba(201, 123, 139, 0.12)',
    accent: 'from-rose/15 to-transparent',
    dot: 'bg-rose/40',
  },
  purple: {
    border: 'border-purple-soft/20',
    hoverBorder: 'hover:border-purple-soft/40',
    bg: 'bg-purple-soft/[0.03]',
    text: 'text-purple-soft',
    icon: 'text-purple-soft/70',
    glow: 'rgba(139, 122, 173, 0.12)',
    accent: 'from-purple-soft/15 to-transparent',
    dot: 'bg-purple-soft/40',
  },
}

function Envelope({ message, isOpened, onOpen, index }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const colors = colorMap[message.color] || colorMap.gold

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={`relative cursor-pointer rounded-2xl ${colors.border} border ${colors.bg} backdrop-blur-sm
                   p-6 md:p-8 overflow-hidden transition-all duration-700 group ${colors.hoverBorder}`}
        onClick={() => onOpen(message.id)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Top glow on hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                       bg-[radial-gradient(ellipse_at_50%_0%,${colors.glow}_0%,transparent_60%)]`} />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <h3 className={`text-lg md:text-xl font-bold ${colors.text}`}>{message.title}</h3>
          <motion.div
            className={`w-9 h-9 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.icon}`}
            animate={isOpened ? {} : { rotate: [0, -4, 4, 0] }}
            transition={{ duration: 3, repeat: isOpened ? 0 : Infinity, repeatDelay: 4 }}
          >
            {isOpened ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M3 19V5a2 2 0 012-2h14a2 2 0 012 2v14M3 19l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isOpened ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`relative z-10 w-full h-[1px] bg-gradient-to-r ${colors.accent} mb-5`} />
              <p className="relative z-10 text-text-secondary/90 leading-[2] text-[15px] md:text-base font-light">
                {message.message}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="relative z-10 text-text-muted/50 text-xs tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              اضغط لفتح الرسالة...
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Messages() {
  const { state, dispatch } = useJourney()
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()

  const handleOpen = (id) => {
    dispatch({ type: 'OPEN_MESSAGE', payload: id })
  }

  const openedCount = state.messagesOpened.length
  const totalCount = messagesData.length

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden" id="messages">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#100a16] to-[#0a0a0f]" />

      {/* Section title */}
      <motion.div
        ref={titleRef}
        className="relative z-10 text-center mb-16 md:mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="text-text-muted text-xs tracking-[0.3em] uppercase block mb-4">
          من القلب إلى القلب
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-rose glow-rose">رسائل لم تُقرأ بعد</span>
        </h2>
        <p className="text-text-secondary/70 text-base md:text-lg font-light">كل ظرف يحمل شيئًا من القلب</p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose/30" />
          <div className="w-1 h-1 rounded-full bg-rose/40" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose/30" />
        </div>
      </motion.div>

      {/* Messages grid */}
      <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {messagesData.map((message, index) => (
          <Envelope
            key={message.id}
            message={message}
            isOpened={state.messagesOpened.includes(message.id)}
            onOpen={handleOpen}
            index={index}
          />
        ))}
      </div>

      {/* Progress bar */}
      <motion.div
        className="relative z-10 max-w-xs mx-auto mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex justify-between text-text-muted text-xs mb-2">
          <span>{openedCount} من {totalCount}</span>
          <span>{Math.round((openedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold/60 to-rose/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(openedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
