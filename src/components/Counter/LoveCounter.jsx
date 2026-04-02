import { motion } from 'framer-motion'
import { useLoveCounter } from '../../hooks/useLoveCounter'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function CounterUnit({ value, label, delay = 0 }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative group">
        {/* Glow behind */}
        <div className="absolute inset-0 rounded-2xl bg-gold/[0.04] blur-xl group-hover:bg-gold/[0.08] transition-all duration-700" />
        {/* Card */}
        <div className="relative w-[72px] h-[80px] md:w-[100px] md:h-[110px] rounded-2xl bg-gradient-card
                       flex items-center justify-center overflow-hidden">
          {/* Top shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
          <motion.span
            key={value}
            className="text-3xl md:text-5xl font-bold text-gold tabular-nums"
            initial={{ y: -15, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </div>
      </div>
      <span className="text-text-muted text-xs md:text-sm font-light tracking-wider">{label}</span>
    </motion.div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col items-center gap-2 mb-6 mx-1 hidden md:flex">
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-gold/40"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-gold/30"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  )
}

export default function LoveCounter() {
  const { days, hours, minutes, seconds } = useLoveCounter()
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden" id="counter">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#120a10] to-[#0a0a0f]" />

      {/* Ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,123,139,0.05)_0%,rgba(212,165,116,0.03)_40%,transparent_70%)] pointer-events-none" />

      <motion.div
        ref={titleRef}
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Section title */}
        <span className="text-text-muted text-xs tracking-[0.3em] uppercase block mb-4">
          كل ثانية تُحسب
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-3">
          <span className="text-rose glow-rose">عداد الحب</span>
        </h2>
        <p className="text-text-secondary/70 text-base font-light mb-1">منذ أن أصبحنا "نحن"</p>
        <p className="text-text-muted text-xs tracking-wider mb-14">1 أكتوبر 2024</p>

        {/* Counter display */}
        <div className="flex items-start justify-center gap-2 md:gap-4 flex-wrap">
          <CounterUnit value={days} label="يوم" delay={0} />
          <Separator />
          <CounterUnit value={hours} label="ساعة" delay={0.1} />
          <Separator />
          <CounterUnit value={minutes} label="دقيقة" delay={0.2} />
          <Separator />
          <CounterUnit value={seconds} label="ثانية" delay={0.3} />
        </div>

        {/* Heartbeat animation */}
        <motion.div
          className="mt-14 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={titleVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-rose/20" />
          <motion.span
            className="text-rose/60 text-lg heartbeat"
          >
            &#x2764;
          </motion.span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-rose/20" />
        </motion.div>

        {/* Emotional note */}
        <motion.p
          className="mt-8 text-text-secondary/70 text-sm md:text-base leading-relaxed font-light max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={titleVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 1 }}
        >
          كل ثانية من هذه الثواني كانت تستحق...
          <br />
          لأنها كانت <span className="text-gold font-medium">معك</span>
        </motion.p>
      </motion.div>
    </section>
  )
}
