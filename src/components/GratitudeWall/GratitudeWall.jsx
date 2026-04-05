import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Smile, Star, Sparkles, Anchor, Shield, Eye, MessageCircle, Moon, Sun } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import gratitudesData from '../../data/gratitudes.json'

const iconMap = {
  heart: Heart,
  smile: Smile,
  star: Star,
  sparkles: Sparkles,
  anchor: Anchor,
  shield: Shield,
  eye: Eye,
  message: MessageCircle,
  moon: Moon,
  sun: Sun,
  infinity: Sparkles,
}

const colorMap = {
  gold: {
    bg: 'bg-gold/[0.06]',
    border: 'border-gold/15',
    hoverBorder: 'hover:border-gold/35',
    text: 'text-gold/80',
    icon: 'text-gold/50',
    shadow: 'rgba(212, 165, 116, 0.06)',
    glow: 'rgba(212, 165, 116, 0.1)',
  },
  rose: {
    bg: 'bg-rose/[0.06]',
    border: 'border-rose/15',
    hoverBorder: 'hover:border-rose/35',
    text: 'text-rose-light/80',
    icon: 'text-rose/50',
    shadow: 'rgba(201, 123, 139, 0.06)',
    glow: 'rgba(201, 123, 139, 0.1)',
  },
  purple: {
    bg: 'bg-purple-soft/[0.06]',
    border: 'border-purple-soft/15',
    hoverBorder: 'hover:border-purple-soft/35',
    text: 'text-purple-soft/80',
    icon: 'text-purple-soft/50',
    shadow: 'rgba(139, 122, 173, 0.06)',
    glow: 'rgba(139, 122, 173, 0.1)',
  },
}

// Generate stable random-ish rotations for each card
const rotations = [
  -2.5, 1.8, -1.2, 2.8, -0.8, 1.5, -2, 0.6, 2.2, -1.8, 1, -0.5,
]

function GratitudeNote({ note, index }) {
  const { ref, isVisible } = useScrollAnimation(0.05)
  const colors = colorMap[note.color] || colorMap.gold
  const Icon = iconMap[note.icon] || Heart
  const rotation = rotations[index % rotations.length]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: rotation * 2, scale: 0.85 }}
      animate={isVisible ? { opacity: 1, y: 0, rotate: rotation, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className={`relative rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm
                   p-5 md:p-6 transition-all duration-500 group ${colors.hoverBorder} overflow-hidden`}
        style={{ transform: `rotate(${rotation}deg)` }}
        whileHover={{
          rotate: 0,
          y: -8,
          scale: 1.03,
          transition: { duration: 0.3 },
        }}
      >
        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, transparent 60%)`,
          }}
        />

        {/* Pin decoration */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold/30 border border-gold/20 shadow-[0_2px_8px_rgba(212,165,116,0.15)]" />

        {/* Icon */}
        <div className={`relative z-10 mb-3 ${colors.icon}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>

        {/* Text */}
        <p className={`relative z-10 ${colors.text} text-sm md:text-base font-medium leading-[1.8]`}>
          {note.text}
        </p>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        bg-gradient-to-r from-transparent via-current to-transparent ${colors.icon}`} />
      </motion.div>
    </motion.div>
  )
}

export default function GratitudeWall() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden" id="gratitude">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a0d] to-[#0a0a0f]" />

      {/* Section title */}
      <motion.div
        ref={titleRef}
        className="relative z-10 text-center mb-16 md:mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="text-text-muted text-xs tracking-[0.3em] uppercase block mb-4">
          من أعماق القلب
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-rose glow-rose">جدار الشكر</span>
        </h2>
        <p className="text-text-secondary/70 text-base md:text-lg font-light">
          أسباب صغيرة... تصنع حباً كبيراً
        </p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose/30" />
          <div className="w-1 h-1 rounded-full bg-rose/40" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose/30" />
        </div>
      </motion.div>

      {/* Notes grid */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {gratitudesData.map((note, index) => (
            <GratitudeNote key={note.id} note={note} index={index} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-text-muted/50 text-sm font-light italic">
            "وشكراً... لأنك أنتِ"
          </p>
        </motion.div>
      </div>
    </section>
  )
}
